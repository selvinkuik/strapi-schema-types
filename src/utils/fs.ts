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

export function readAllJSONFilesRecursively(directoryPath: string): string[] {
  const allFiles: string[] = [];

  function readFilesRecursively(currentPath: string) {
    const entries = readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = `${currentPath}/${entry.name}`;
      if (entry.isDirectory()) {
          (fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        allFiles.push(fullPath.replace(`${directoryPath}/`, ''));
      }
    }
  }
  readFilesRecursively(directoryPath);
  return allFiles;
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
//
