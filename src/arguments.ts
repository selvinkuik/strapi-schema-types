import path from 'path';
import { StrapiVersion } from './StrapiVersion';
import { Config } from './Config';

export function getStrapiVersion(args: string[]): StrapiVersion {
  if (args.includes('--v5')) {
    return StrapiVersion.v5;
  } else {
    return StrapiVersion.v4;
  }
}
export function getTemplatesFolderPath(args: string[]): string {
  if (args.includes('--v5')) {
    return path.join(__dirname, '/v5');
  } else {
    return path.join(__dirname, '/v4');
  }
}
export function getPrefix(args: string[]): string {
  return args.find((arg) => arg.startsWith('--prefix='))?.split('=')[1] || '';
}

export function getOutputDir(args: string[]): string {
  return (
    args.find((arg) => arg.startsWith('--output='))?.split('=')[1] || '_types'
  );
}

export function getConfig(args: string[]): Config {
  const prefix = getPrefix(args);
  const outputDir = getOutputDir(args);
  const templatesFolderPath = getTemplatesFolderPath(args);
  const strapiVersion = getStrapiVersion(args);
  return { prefix, outputDir, templatesFolderPath, strapiVersion };
}
