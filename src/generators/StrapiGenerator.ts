import { existsSync, mkdirSync } from 'fs';
import { IStrapiGenerator } from './IStrapiGenerator';

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
}
