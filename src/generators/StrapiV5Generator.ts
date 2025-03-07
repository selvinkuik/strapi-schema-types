import { Config } from '#/Config';
import { readDirectory, readFile, writeFile } from '#/utils/fs';
import { interfaceName } from '#/utils/naming';
import { v5Api } from '#/utils/paths';
import { join, parse } from 'path';
import { StrapiGenerator } from './StrapiGenerator';
import { getSchemaFilePath, readSchema } from '#/utils/schemaUtils';
import { StrapiSchemaV5Converter } from '#/services/StrapiSchemaV5Converter';

export class StrapiV5Generator extends StrapiGenerator {
  converter: StrapiSchemaV5Converter;
  constructor(private config: Config) {
    super(config);
    this.converter = new StrapiSchemaV5Converter(this.config);
  }

  generateDefaultInterfaces(): void {
    try {
      const v5Files = readDirectory(this.config.templatesFolderPath);
      v5Files.forEach((file) => {
        const fileName = parse(file).name;
        const fileContent = readFile(
          join(this.config.templatesFolderPath, file)
        );
        writeFile(join(this.config.outputDir, `${fileName}.ts`), fileContent);
      });
    } catch (error) {
      console.error('Error generating types from v5 folder:', error);
    }
  }

  generateCollections(): void {
    let apiFolders: string[] = [];

    apiFolders = readDirectory(v5Api).filter(
      (directory) => !directory.startsWith('.')
    );

    for (const apiFolder of apiFolders) {
      const iname = interfaceName(this.config, apiFolder);
      const schema = readSchema(getSchemaFilePath(apiFolder));
      const interfaceContent = this.converter.interfaceContent(schema, iname);
      writeFile(`${this.config.outputDir}/${iname}.ts`, interfaceContent);
    }
  }

  generateComponents(): void {
    throw new Error('Method not implemented.');
  }
  generateSingleTypes(): void {
    throw new Error('Method not implemented.');
  }
}
