import { Config } from '#/Config';
import { DynamicZoneAttribute, StrapiSchema } from '#/types';
import { isOptional } from '#/utils/schemaUtils';
import { pascalCase } from 'change-case';
import { Project } from 'ts-morph';

interface ImportInfo {
  type: string;
  path: string;
}

export class StrapiSchemaV5Converter {
  constructor(private config: Config) {}

  public generateInterfaceFromSchema(
    schema: StrapiSchema,
    interfaceName: string
  ): string {
    const project = new Project();
    const sourceFile = project.createSourceFile('temp.ts');

    const interfaceDeclaration = sourceFile.addInterface({
      name: interfaceName,
      isExported: true,
    });

    interfaceDeclaration.addProperty({
      name: 'id',
      type: 'number',
    });

    const attributesProperty = interfaceDeclaration.addProperty({
      name: 'attributes',
      type: '{}', // Placeholder, will be refined
    });

    const attributesInterface = sourceFile.addInterface({
      name: `${interfaceName}Attributes`,
      isExported: false, // Not exported directly
    });

    attributesProperty.setType(attributesInterface.getName()); // Link attributes property to the new interface

    const imports: ImportInfo[] = [];

    for (const [attributeName, attributeValue] of Object.entries(
      schema.attributes
    )) {
      const propertyName = isOptional(attributeValue)
        ? `${attributeName}?`
        : attributeName;
      let propertyType: string = 'any';

      switch (attributeValue.type) {
        case 'relation':
          propertyType = this.handleRelation(attributeValue, imports);
          break;
        case 'component':
          propertyType = this.handleComponent(attributeValue, imports);
          break;
        case 'dynamiczone':
          propertyType = this.handleDynamicZone(attributeValue, imports);
          break;
        case 'media':
          propertyType = this.handleMedia(attributeValue);
          break;
        case 'enumeration':
          propertyType = this.handleEnumeration(attributeValue);
          break;
        case 'string':
        case 'text':
        case 'richtext':
        case 'email':
        case 'uid':
          propertyType = 'string';
          break;
        case 'integer':
        case 'biginteger':
        case 'decimal':
        case 'float':
          propertyType = 'number';
          break;
        case 'date':
        case 'datetime':
        case 'time':
          propertyType = 'Date';
          break;
        case 'boolean':
          propertyType = 'boolean';
          break;
        default:
          break;
      }

      attributesInterface.addProperty({
        name: propertyName,
        type: propertyType,
      });
    }

    if (schema.pluginOptions?.i18n?.localized) {
      attributesInterface.addProperty({ name: 'locale', type: 'string' });
      attributesInterface.addProperty({
        name: 'localizations?',
        type: `${interfaceName}[]`,
      });
    }

    // Add imports
    imports.forEach((importInfo) => {
      sourceFile.addImportDeclaration({
        moduleSpecifier: importInfo.path,
        namedImports: [importInfo.type],
      });
    });

    return sourceFile.getText();
  }

  // Helper functions for attribute type handling (example)
  private handleRelation(attributeValue: any, imports: ImportInfo[]): string {
    const targetType = attributeValue.target.includes('::user')
      ? 'User'
      : pascalCase(attributeValue.target.split('.')[1]);
    this.addImport(imports, targetType, `./${targetType}`);
    const isArray = attributeValue.relation.endsWith('ToMany');
    return `{ data: ${targetType}${isArray ? '[]' : ''} }`;
  }

  private handleComponent(attributeValue: any, imports: ImportInfo[]): string {
    const componentType =
      attributeValue.target === 'plugin::users-permissions.user'
        ? 'User'
        : pascalCase(attributeValue.component.split('.')[1]);
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
    return `${componentTypes.join(' | ')}[]`;
  }

  private handleMedia(attributeValue: any): string {
    return `{ data: Media${attributeValue.multiple ? '[]' : ''} }`;
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
