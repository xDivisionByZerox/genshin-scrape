import { BaseScraper } from './scripts/base.scraper';
import { BookStrategy } from './scripts/strategies/book.strategy';
import type { IScrapingStrategy } from './scripts/strategies/scraping-strategy.interface';
import { WeaponStrategy } from './scripts/strategies/weapon.strategy';
import type { DataType } from './util/write-data';

type Option = {
  strategy: IScrapingStrategy<unknown>;
  type: DataType;
};

const options: Option[] = [
  { strategy: new BookStrategy(), type: 'books' },
  { strategy: new WeaponStrategy(), type: 'weapons' },
];

(async () => {
  for (const { strategy, type } of options) {
    const scraper = new BaseScraper(strategy, type);
    await scraper.scape().catch(
      (error) => console.error(`Failed scraping process for resource [${type}]. Cause:\n${JSON.stringify(error)}`),
    );
  }
})().catch((error) => console.error(error));
