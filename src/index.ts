import fs from 'fs';
import { getConfig } from '#/arguments';
import { Config } from './Config';
import { StrapiGenerator } from './generators/StrapiGenerator';
import { StrapiV5Generator } from './generators/StrapiV5Generator';
import { StrapiVersion } from './StrapiVersion';

const config: Config = getConfig(process.argv.slice(2));

if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

let generator: StrapiGenerator;

switch (config.strapiVersion) {
  case StrapiVersion.v5:
    generator = new StrapiV5Generator(config);
    break;
  default:
    throw new Error('Unsupported Strapi version');
    
}

generator.generateDefaultInterfaces();
generator.generateCollections();
generator.generateComponents();
generator.generateSingleTypes();
generator.generateRoutes();
