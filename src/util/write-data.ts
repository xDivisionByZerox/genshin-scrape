import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { format } from 'prettier';
import { DATA_DIR } from '../const';
import type { Resource } from '../types/resource';
import { kebabCase } from './casing';

export type DataType = `${Resource}s`;

export type Locale = 'en' | 'de';

/**
 * Writes a scrape data file.
 * 
 * @param dataName The name of the file in the result directory. 
 * @param data The data to store in the file. Has to be a JSON string.
 */
export function writeData(dataType: DataType, dataName: string, localeCode: Locale, data: string) {
  const directory = normalize(join(
    DATA_DIR,
    dataType,
    kebabCase(dataName),
  ));
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const fullFileName = normalize(join(directory, `${localeCode}.json`)).replaceAll('/\\/g', '/');
  const contentFormatted = format(data, {
    parser: 'json',
  });
  writeFileSync(fullFileName, contentFormatted);
}
