import path from 'path';
import { StrapiVersion } from './StrapiVersion';

export function getStrapiVersion(args: string[]): StrapiVersion {
  if (args.includes('--v5')) {
    return StrapiVersion.v5;
  } else {
    return StrapiVersion.v4;
  }
}
export function getSourceFolder(args: string[]): string {
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
