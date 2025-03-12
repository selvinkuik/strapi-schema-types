import { StrapiVersion } from "./StrapiVersion";

export interface Config {
  prefix: string;
  outputDir: string;
  templatesFolderPath: string;
  strapiVersion: StrapiVersion;
}
