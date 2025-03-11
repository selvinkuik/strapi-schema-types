import {
  Attribute,
  ComponentAttribute,
  RelationAttribute,
  StrapiSchema,
} from '#/types';
import { readFile } from '#/utils/fs';
import { join } from 'path';
import { v5SrcFolder } from './paths';

export function readSchema(filePath: string): StrapiSchema {
  const schemaContent = readFile(filePath);
  return JSON.parse(schemaContent) as StrapiSchema;
}

export function getApiSchemaFilePath(apiFolder: string): string {
  return join(
    v5SrcFolder.api,
    apiFolder,
    'content-types',
    apiFolder,
    'schema.json'
  );
}

export function getComponentSchemaFilePath(componentFilder: string): string {
  return join(v5SrcFolder.components, componentFilder, 'schema.json');
  // wronggg , multiple components in the same folder
}

export function isOptional(attributeValue: Attribute): boolean {
  if (
    (attributeValue as RelationAttribute).relation === 'oneToMany' ||
    (attributeValue as ComponentAttribute).repeatable
  ) {
    return false;
  }
  return attributeValue.required !== true;
}
