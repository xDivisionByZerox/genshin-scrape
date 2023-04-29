import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { DATA_DIR } from '../const';

/**
 * Writes a scrape data file.
 * 
 * @param fileName The name of the file in the result directory. 
 * @param data The data to store in the file.
 */
export function writeData(fileName: string, data: string) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const fullFileName = normalize(join(DATA_DIR, fileName));
  writeFileSync(fullFileName, data);
}