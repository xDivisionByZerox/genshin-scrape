import { BaseScraper } from './scripts/base.scraper';
import { BookStrategy } from './scripts/strategies/book.strategy';
import { IScrapingStrategy } from './scripts/strategies/scraping-strategy.interface';
import { WeaponStrategy } from './scripts/strategies/weapon.strategy';
import { DataType } from './util/write-data';

(async () => {
  const options: {
    strategy: IScrapingStrategy<unknown>,
    type: DataType,
  }[] = [
      { strategy: new BookStrategy(), type: 'books' },
      { strategy: new WeaponStrategy(), type: 'weapons' },
    ];

  for (const { strategy, type } of options) {
    const scraper = new BaseScraper(strategy, type);
    await scraper.scape().catch(
      (error) => console.error(`Failed scraping process for resource [${type}]. Cause:\n${error}`),
    );
  }
})()