import {
  Attribute,
  ComponentAttribute,
  RelationAttribute,
  StrapiSchema,
  StringAttribute,
} from '#/types';
import { readFile } from '#/utils/fs';
import { join } from 'path';
import { v5Api } from './paths';

export function readSchema(filePath: string): StrapiSchema {
  const schemaContent = readFile(filePath);
  return JSON.parse(schemaContent) as StrapiSchema;
}

export function getSchemaFilePath(apiFolder: string): string {
  return join(v5Api, apiFolder, 'content-types', apiFolder, 'schema.json');
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
