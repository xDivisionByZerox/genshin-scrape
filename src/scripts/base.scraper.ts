import puppeteer from 'puppeteer';
import { parallel } from '../util/parallel';
import type { DataType} from '../util/write-data';
import { writeData } from '../util/write-data';
import type { IScrapingStrategy } from './strategies/scraping-strategy.interface';

export class BaseScraper<T> {

  constructor(
    /**
     * Define the strategy to use for the scraping process.
     */
    private readonly strategy: IScrapingStrategy<T>,
    /**
     * Define the name of the resource being scraped.
     */
    private readonly resourceName: DataType,
  ) { }

  /**
   * Start the scraping process of the configured scraper instance.
   * 
   * @param parallelItemWorkers
   * The amount of parallel workers for each resource item.
   * You can change this value if the process takes too long or is too resource intense.
   * Defaults to `10`.
   */
  async scape(parallelItemWorkers = 10) {
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
          await page.close();
        }
      }),
      parallelItemWorkers,
    );
  }

}
