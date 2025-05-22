import { Config } from '#/Config';
import { StrapiSchema } from '#/types';
import { Project } from 'ts-morph';
import { AbstractV5Converter } from './AbstractV5Converter';

export class CollectionV5Converter extends AbstractV5Converter {
  constructor(config: Config) {
    super(config);
    this.componentsFolder = './components';
    this.interfaceFolder = '.';
  }

  public generateTSFromSchema(
    schema: StrapiSchema,
    interfaceName: string
  ): string {
    const project = new Project();
    const sourceFile = project.createSourceFile(`__tmp__.ts`);

    const interfaceDeclaration = sourceFile.addInterface({
      name: interfaceName,
      isExported: true,
    });

    this.addBaseProperties(interfaceDeclaration);
    const { properties, imports } = this.extractPropertiesAndImports(schema, interfaceName);

    this.addI18nProperties(schema, properties, interfaceName);
    interfaceDeclaration.addProperties(properties);
    this.addImportDeclarations(sourceFile, imports);
    this.addTimestampProperties(interfaceDeclaration);

    const result = sourceFile.getText();
    project.removeSourceFile(sourceFile);
    return result;
  }
}
