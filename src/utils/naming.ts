import { Config } from '#/Config';
import { pascalCase } from 'change-case';

export function interfaceName(config: Config, apiFolder: string): string {
  return `${config.prefix}${pascalCase(apiFolder)}`;
}
