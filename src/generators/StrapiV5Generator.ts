import { Config } from '#/Config';
import { AbstractV5Converter } from '#/services/AbstractV5Converter';
import {
  getApiFolders,
  readAllJSONFilesRecursively,
  readDirectory,
  readFile,
  writeFile,
} from '#/utils/fs';
import { componentName, interfaceName } from '#/utils/naming';
import { v5SrcFolder } from '#/utils/paths';
import {
  getApiSchemaFilePath,
  getComponentSchemaFilePath,
  readSchema,
} from '#/utils/schemaUtils';
import { join, parse } from 'path';
import { StrapiGenerator } from './StrapiGenerator';
import { CollectionV5Converter } from '#/services/CollectionV5Converter';
import { ComponentV5Converter } from '#/services/ComponentV5Converter';

export class StrapiV5Generator extends StrapiGenerator {
  collectionConverter: CollectionV5Converter;
  componentConverter: ComponentV5Converter;
  constructor(private config: Config) {
    super(config);
    this.collectionConverter = new CollectionV5Converter(this.config);
    this.componentConverter = new ComponentV5Converter(this.config);
  }

  generateDefaultInterfaces(): void {
    try {
      const v5Files = readDirectory(this.config.templatesFolderPath);
      v5Files.forEach((file) => {
        const fileName = parse(file).name;
        const fileContent = readFile(
          join(this.config.templatesFolderPath, file)
        );
        // replace the prefix in the template with the actual prefix in $fileContent  fileName by '${prefix}${fileName}'
        writeFile(join(this.config.outputDir, `${fileName}.ts`), fileContent);
      });
    } catch (error) {
      console.error('Error generating types from v5 folder:', error);
    }
  }

  generateCollections(): void {
    let apiFolders: string[] = [];

    apiFolders = getApiFolders(readDirectory(v5SrcFolder.api));

    for (const apiFolder of apiFolders) {
      const iname = interfaceName(this.config, apiFolder);
      const schema = readSchema(getApiSchemaFilePath(apiFolder));
      const interfaceContent = this.collectionConverter.generateTSFromSchema(
        schema,
        iname
      );
      writeFile(`${this.config.outputDir}/${iname}.ts`, interfaceContent);
    }
  }

  generateComponents(): void {
    let componentFolders: string[] = [];

    componentFolders = getApiFolders(
      readAllJSONFilesRecursively(v5SrcFolder.components)
    );
 
    for (const componentFolder of componentFolders) {
      const iname = componentName(this.config, componentFolder);
      console.log('componentFolder', iname);
      const schema = readSchema(getComponentSchemaFilePath(componentFolder));

      const interfaceContent = this.componentConverter.generateTSFromSchema(
        schema,
        iname
      );
      writeFile(
        `${this.config.outputDir}/components/${iname}.ts`,
        interfaceContent
      );
    }
  }
  generateSingleTypes(): void {
    throw new Error('Method not implemented.');
  }
}
