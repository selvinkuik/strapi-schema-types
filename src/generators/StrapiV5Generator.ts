import { join, parse } from 'path';
import { readDirectory, readFile, writeFile } from '../utils/fs';
import { StrapiGenerator } from './StrapiGenerator';
import { pascalCase } from 'change-case';

export class StrapiV5Generator extends StrapiGenerator {
  constructor(private config: Config) {
    super(config);
  }

  generateDefaultInterfaces(): void {
    try {
      const v5Files = readDirectory(this.config.sourceFolder);
      console.log('v5Files:', v5Files);
      v5Files.forEach((file) => {
        const fileName = parse(file).name;
        console.log('fileNamesss:', fileName);
        const fileContent = readFile(join(this.config.sourceFolder, file));
        writeFile(join(this.config.outputDir, `${fileName}.ts`), fileContent);
      });
    } catch (error) {
      console.error('Error generating types from v5 folder:', error);
    }
  }
  generateCollections(): void {
    let apiFolders: string[] = [];

    apiFolders = readDirectory('./src/api').filter(
      (directory) => !directory.startsWith('.')
    );

    for (const apiFolder of apiFolders) {
      const interfaceName = `${this.config.prefix}${pascalCase(apiFolder)}`;
      console.log('interfaceName:', interfaceName);
      // const interfaceContent = createInterface(
      //   `./src/api/${apiFolder}/content-types/${apiFolder}/schema.json`,
      //   interfaceName,
      //   isV5
      // );
      // if (interfaceContent)
      //   fs.writeFileSync(`${outputDir}/${interfaceName}.ts`, interfaceContent);
    }
  }

  generateComponents(): void {
    throw new Error('Method not implemented.');
  }
  generateSingleTypes(): void {
    throw new Error('Method not implemented.');
  }
}
