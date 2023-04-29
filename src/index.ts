import { BooksScraper } from './scripts/books';

(async () => {
  await new BooksScraper().scrapeData();
})()