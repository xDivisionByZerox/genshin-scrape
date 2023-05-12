import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { format } from 'prettier';
import { DATA_DIR } from '../const';
import { kebabCase } from './casing';

type DataType = 'books' | 'weapons';

type Locale = 'en' | 'de';

/**
 * Writes a scrape data file.
 * 
 * @param dataName The name of the file in the result directory. 
 * @param data The data to store in the file.
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
  writeFileSync(fullFileName, data);
  format(fullFileName, {
    parser: 'json',
  });
}