import puppeteer from 'puppeteer';
import { parallel } from '../util/parallel';
import { DataType, writeData } from '../util/write-data';
import { IScrapingStrategy } from './strategies/scraping-strategy.interface';

export class BaseScraper<T> {

  constructor(
    private readonly strategy: IScrapingStrategy<T>,
    private readonly resourceName: DataType,
    private readonly parallelItems = 10,
  ) { }

  async scape() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const ids = await this.strategy.getIdList(page);
    await parallel(
      ids.map((id) => async () => {
        const page = await browser.newPage();
        try {
          const entry = await this.strategy.getEntry(page, id);
          const name = this.strategy.getEntryName(entry);
          // todo - extract saving into something like a storage provider
          writeData(this.resourceName, name, 'en', JSON.stringify(entry));
        } finally {
          await page.close()
        }
      }),
      this.parallelItems,
    );
  }

}