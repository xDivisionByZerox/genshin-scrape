import puppeteer, { Browser, WaitForOptions } from 'puppeteer';
import { WIKI_URL } from '../const';
import { autoScroll } from '../util/auto-scroll';
import { writeData } from '../util/write-data';
import { parallel } from '../util/parallel';

interface IBook {
  id: string;
  imageLink: string;
  title: string;
  wikiURL: string;
  content: string;
}

export class BooksScraper {

  private readonly booksWikiUrl = `${WIKI_URL}/book`;
  private readonly booksDataFileName = 'books.json';

  private get defaultNavigationOptions(): WaitForOptions {
    return {
      waitUntil: 'networkidle0',
      timeout: 60000,
    };
  };

  async scrapeData() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(this.booksWikiUrl, this.defaultNavigationOptions);

    await autoScroll(page);

    const bookIds = await page.evaluate(() => {
      const bookListElement = document.querySelector('#__layout > main > main > section > div.genshin-half-card.genshin-aggregate-page-child > div');
      return [
        ...bookListElement?.children ?? [],
      ].map(
        (elem) => elem.querySelector('[data-value]')?.getAttribute('data-value') ?? 'INVALID_BOOK_ID',
      );
    });

    console.log('Got IDs for', bookIds.length, 'books:');
    console.log(bookIds);

    const books = await parallel(
      bookIds.map((id) => () => this.getSingleBook(browser, id)),
      10,
    );
    writeData(this.booksDataFileName, JSON.stringify(books));

    await browser.close();
  }

  private async getSingleBook(browser: Browser, bookId: string): Promise<IBook> {
    const page = await browser.newPage();
    try {
      const wikiURL = this.getEntryURL(bookId);
      await page.goto(wikiURL, this.defaultNavigationOptions);
      await autoScroll(page);

      const getFindElementError = (elementType: string) => new Error(`Could not get ${elementType} element of book [${bookId}].`);

      await page.screenshot();
      const mainElementHandle = await page.$('#__layout > main > div > div.genshin-entry-page > div.genshin-entry-child-page');
      if (!mainElementHandle) {
        throw getFindElementError('main');
      }

      const headerElementHandle = await mainElementHandle.$('.detail-header');
      if (!headerElementHandle) {
        throw getFindElementError('header');
      }

      const imageElementHandle = await headerElementHandle.$('img.d-img-show');
      if (!imageElementHandle) {
        throw getFindElementError('image');
      }

      const nameElementHandle = await headerElementHandle.$('.detail-header-common-name');
      if (!nameElementHandle) {
        throw getFindElementError('name');
      }

      const contentElementHandle = await mainElementHandle.$('.entry-body-module');
      if (!contentElementHandle) {
        throw getFindElementError('content');
      }

      const metaItemsHandle = await mainElementHandle.$$('.base-info-item');
      for (const metaItemHandle of metaItemsHandle) {
        const { key, value } = await metaItemHandle.evaluate((metaItem) => {
          const [keyElement, valueElement] = metaItem.children;
          return {
            key: keyElement?.textContent?.trim() ?? null,
            value: valueElement?.textContent?.trim() ?? '',
          }
        });
        console.log(`[${bookId}]: Got key "${key}" and value "${value}"`);
      }

      const imageSrc = await imageElementHandle.evaluate((imageElement) => imageElement.src);
      const title = await nameElementHandle.evaluate((nameElement) => nameElement.textContent?.trim() ?? 'INVALID_TITLE');
      // todo - convert headers/sections
      const content = await contentElementHandle.evaluate((contentElementHandle) => contentElementHandle.textContent?.trim() ?? 'INVALID_CONTENT');

      return {
        content,
        id: bookId,
        imageLink: imageSrc,
        title,
        wikiURL,
      } satisfies IBook;
    } finally {
      await page.close();
    }
  }

  private getEntryURL(id: string) {
    return `https://wiki.hoyolab.com/pc/genshin/entry/${id}`;
  }

}

