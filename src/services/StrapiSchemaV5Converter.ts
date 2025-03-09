import { Config } from '#/Config';
import {
  ComponentAttribute,
  DynamicZoneAttribute,
  RelationAttribute,
  StrapiSchema,
} from '#/types';
import { isOptional } from '#/utils/schemaUtils';
import { pascalCase } from 'change-case';
import {
  InterfaceDeclaration,
  Project,
  PropertySignatureStructure,
  SourceFile,
  StructureKind,
} from 'ts-morph';

interface ImportInfo {
  type: string;
  path: string;
}

export class StrapiSchemaV5Converter {
  constructor(private config: Config) {}

  private createPropertySignature(
    properties: PropertySignatureStructure[],
    attributeName: string,
    propertyType: string,
    hasQuestionToken: boolean = false
  ) {
    properties.push({
      name: attributeName,
      type: propertyType,
      kind: StructureKind.PropertySignature,
      hasQuestionToken: hasQuestionToken,
    });
  }
  private extractPropertiesAndImports(schema: StrapiSchema): {
    properties: PropertySignatureStructure[];
    imports: ImportInfo[];
  } {
    const properties: PropertySignatureStructure[] = [];
    const imports: ImportInfo[] = [];
    const attributesEntries = Object.entries(schema.attributes);

    for (const [attributeName, attributeValue] of attributesEntries) {
      const propertyType = this.resolvePropertyType(attributeValue, imports);
      this.createPropertySignature(
        properties,
        attributeName,
        propertyType,
        isOptional(attributeValue)
      );
    }

    return { properties, imports };
  }

  private resolvePropertyType(
    attributeValue: any,
    imports: ImportInfo[]
  ): string {
    switch (attributeValue.type) {
      case 'relation':
        return this.handleRelation(attributeValue, imports);
      case 'component':
        return this.handleComponent(attributeValue, imports);
      case 'dynamiczone':
        return this.handleDynamicZone(attributeValue, imports);
      case 'media':
        return this.handleMedia(attributeValue, imports);
      case 'enumeration':
        return this.handleEnumeration(attributeValue);
      case 'string':
      case 'text':
      case 'richtext':
      case 'email':
      case 'uid':
        return 'string';
      case 'integer':
      case 'biginteger':
      case 'decimal':
      case 'float':
        return 'number';
      case 'date':
      case 'datetime':
      case 'time':
        return 'Date';
      case 'boolean':
        return 'boolean';
      default:
        return 'any';
    }
  }

  public generateInterfaceFromSchema(
    schema: StrapiSchema,
    interfaceName: string
  ): string {
    const project = new Project();
    const sourceFile = project.createSourceFile('__tmp__.ts');

    const interfaceDeclaration = sourceFile.addInterface({
      name: interfaceName,
      isExported: true,
    });

    this.addBaseProperties(interfaceDeclaration);
    const { properties, imports } = this.extractPropertiesAndImports(schema);

    this.addI18nProperties(schema, properties, interfaceName);
    interfaceDeclaration.addProperties(properties);
    this.addImportDeclarations(sourceFile, imports);
    this.addTimestampProperties(interfaceDeclaration);

    return sourceFile.getText();
  }

  private addI18nProperties(
    schema: StrapiSchema,
    properties: PropertySignatureStructure[],
    interfaceName: string
  ) {
    if (schema.pluginOptions?.i18n?.localized) {
      this.createPropertySignature(properties, 'locale', 'string');
      this.createPropertySignature(
        properties,
        'localizations',
        `${interfaceName}[]`,
        true
      );
    }
  }
  private addBaseProperties(interfaceDeclaration: InterfaceDeclaration) {
    interfaceDeclaration.addProperties([
      {
        name: 'id',
        type: 'number',
      },
      {
        name: 'documentId',
        type: 'string',
      },
    ]);
  }

  private addTimestampProperties(interfaceDeclaration: InterfaceDeclaration) {
    interfaceDeclaration.addProperties([
      {
        name: 'createdAt',
        type: 'Date',
      },
      {
        name: 'updatedAt',
        type: 'Date',
      },
      {
        name: 'publishedAt',
        type: 'Date',
      },
    ]);
  }

  private addImportDeclarations(sourceFile: SourceFile, imports: ImportInfo[]) {
    sourceFile.addImportDeclarations(
      imports.map(({ path, type }) => ({
        moduleSpecifier: path,
        namedImports: [type],
      }))
    );
  }

  private handleRelation(
    attributeValue: RelationAttribute,
    imports: ImportInfo[]
  ): string {
    const targetType = attributeValue.target.includes('::user')
      ? 'User'
      : pascalCase(attributeValue.target.split('.')[1]);
    this.addImport(imports, targetType, `./${targetType}`);
    const isArray = attributeValue.relation.endsWith('ToMany');
    return `${targetType}${isArray ? '[]' : ''}`;
  }

  private handleComponent(
    attributeValue: ComponentAttribute,
    imports: ImportInfo[]
  ): string {
    const componentType = pascalCase(attributeValue.component.split('.')[1]);
    this.addImport(imports, componentType, `./components/${componentType}`);
    const isArray = attributeValue.repeatable;
    return `${componentType}${isArray ? '[]' : ''}`;
  }

  private handleDynamicZone(
    attributeValue: DynamicZoneAttribute,
    imports: ImportInfo[]
  ): string {
    const componentTypes =
      attributeValue.components?.map((componentName: string) =>
        pascalCase(componentName.split('.')[1])
      ) ?? [];
    componentTypes.forEach((componentType) =>
      this.addImport(imports, componentType, `./components/${componentType}`)
    );
    // this is not correct for now , they are  i preleave wrapped in {id:string, __component: 'componentName'}
    return `${componentTypes.join(' | ')}[]`;
  }

  private handleMedia(attributeValue: any, imports: ImportInfo[]): string {
    this.addImport(imports, 'Media', `./Media`);
    return `Media${attributeValue.multiple ? '[]' : ''}`;
  }

  private handleEnumeration(attributeValue: any): string {
    return attributeValue.enum.map((v: string) => `'${v}'`).join(' | ');
  }

  private addImport(imports: ImportInfo[], type: string, path: string) {
    if (imports.every((x) => x.path !== path || x.type !== type)) {
      imports.push({ type, path });
    }
  }
}
