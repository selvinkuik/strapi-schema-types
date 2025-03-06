import { Config } from '#/Config';
import { IStrapiGenerator } from '#/generators/IStrapiGenerator';
import { existsSync, mkdirSync } from 'fs';

export class StrapiGenerator implements IStrapiGenerator {
  constructor(config: Config) {
    if (!existsSync(config.outputDir)) mkdirSync(config.outputDir);
  }

  generateDefaultInterfaces(): void {}

  generateCollections(): void {
    throw new Error('Method not implemented.');
  }
  generateComponents(): void {
    throw new Error('Method not implemented.');
  }
  generateSingleTypes(): void {
    throw new Error('Method not implemented.');
  }
  generateRoutes(): void {
    throw new Error('Method not implemented.');
  }
}
