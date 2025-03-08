import { Config } from '#/Config';
import { StrapiSchemaV5Converter } from '#/services/StrapiSchemaV5Converter';
import { getApiFolders, readDirectory, readFile, writeFile } from '#/utils/fs';
import { interfaceName } from '#/utils/naming';
import { v5SrcFolder } from '#/utils/paths';
import { getSchemaFilePath, readSchema } from '#/utils/schemaUtils';
import { join, parse } from 'path';
import { StrapiGenerator } from './StrapiGenerator';

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
      const schema = readSchema(getSchemaFilePath(apiFolder));
      const interfaceContent = this.converter.generateInterfaceFromSchema(schema, iname);
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
