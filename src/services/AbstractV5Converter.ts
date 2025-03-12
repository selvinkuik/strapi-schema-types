import { Config } from '#/Config';
import {
  Attribute,
  ComponentAttribute,
  DynamicZoneAttribute,
  EnumerationAttribute,
  MediaAttribute,
  RelationAttribute,
  StrapiSchema,
} from '#/types';
import { isOptional } from '#/utils/schemaUtils';
import { pascalCase } from 'change-case';
import {
  InterfaceDeclaration,
  PropertySignatureStructure,
  SourceFile,
  StructureKind,
} from 'ts-morph';

interface ImportInfo {
  type: string;
  path: string;
}

export class AbstractV5Converter {
  componentsFolder: string = '.';
  interfaceFolder: string = '.';
  constructor(private config: Config) {}

  protected createPropertySignature(
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
  protected extractPropertiesAndImports(schema: StrapiSchema): {
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

  protected resolvePropertyType(
    attributeValue: Attribute,
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

  protected addI18nProperties(
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
  protected addBaseProperties(interfaceDeclaration: InterfaceDeclaration) {
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

  protected addTimestampProperties(interfaceDeclaration: InterfaceDeclaration) {
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

  protected addImportDeclarations(
    sourceFile: SourceFile,
    imports: ImportInfo[]
  ) {
    sourceFile.addImportDeclarations(
      imports.map(({ path, type }) => ({
        moduleSpecifier: path,
        namedImports: [type],
      }))
    );
  }

  protected handleRelation(
    attributeValue: RelationAttribute,
    imports: ImportInfo[]
  ): string {
    const targetType = attributeValue.target.includes('::user')
      ? 'User'
      : this.extractRelationName(attributeValue.target);
    this.addImport(
      imports,
      targetType,
      `${this.interfaceFolder}/${targetType}`
    );
    const isArray = attributeValue.relation.endsWith('ToMany');
    return `${targetType}${isArray ? '[]' : ''}`;
  }

  protected extractRelationName(originalName: string) {
    return pascalCase(originalName.split('.').pop() ?? '');
  }

  protected handleComponent(
    attributeValue: ComponentAttribute,
    imports: ImportInfo[]
  ): string {
    const componentType = pascalCase(
      this.extractRelationName(attributeValue.component)
    );
    this.addImport(
      imports,
      componentType,
      `${this.componentsFolder}/${componentType}`
    );
    const isArray = attributeValue.repeatable;
    return `${componentType}${isArray ? '[]' : ''}`;
  }

  protected handleDynamicZone(
    attributeValue: DynamicZoneAttribute,
    imports: ImportInfo[]
  ): string {
    const componentTypes =
      attributeValue.components?.map((componentName: string) =>
        pascalCase(this.extractRelationName(componentName))
      ) ?? [];
    componentTypes.forEach((componentType) =>
      this.addImport(
        imports,
        componentType,
        `${this.componentsFolder}/${componentType}`
      )
    );
    // this is not correct for now , they are  i preleave wrapped in {id:string, __component: 'componentName'}
    return `${componentTypes.join(' | ')}[]`;
  }

  protected handleMedia(
    attributeValue: MediaAttribute,
    imports: ImportInfo[]
  ): string {
    this.addImport(imports, 'Media', `${this.interfaceFolder}/Media`);
    return `Media${attributeValue.multiple ? '[]' : ''}`;
  }

  protected handleEnumeration(attributeValue: EnumerationAttribute): string {
    return attributeValue.enum.map((value: string) => `'${value}'`).join(' | ');
  }

  protected addImport(imports: ImportInfo[], type: string, path: string) {
    if (imports.every((x) => x.path !== path || x.type !== type)) {
      imports.push({ type, path });
    }
  }
}
