import type { Page, WaitForOptions } from 'puppeteer';
import type { IScrapingStrategy } from './scraping-strategy.interface';

export abstract class BaseScrapingStrategy<T> implements IScrapingStrategy<T> {

  abstract getIdList(page: Page): Promise<string[]>;

  abstract getEntry(page: Page, id: string): Promise<T>;

  abstract getEntryName(entry: T): string;

  protected getDefaultNavigationOptions(): WaitForOptions {
    return {
      waitUntil: 'networkidle0',
      timeout: 60000,
    };
  };

  protected getEntryURL(id: string) {
    return `https://wiki.hoyolab.com/pc/genshin/entry/${id}`;
  }

}
