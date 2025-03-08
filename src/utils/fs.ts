import { writeFileSync, readdirSync, readFileSync } from 'fs';

export function writeFile(filePath: string, content: string) {
  try {
    writeFileSync(filePath, content);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

export function readDirectory(directoryPath: string): string[] {
  try {
    return readdirSync(directoryPath);
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return [];
  }
}

export function readFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

export function getApiFolders(directories: string[]): string[] {
  return directories.filter((directory) => !directory.startsWith('.'));
}
