import { Page } from 'puppeteer';
import { WIKI_URL } from '../../const';
import { autoScroll } from '../../util/auto-scroll';
import { BaseScrapingStrategy } from './base.strategy';

interface IBook {
  id: string;
  imageLink: string;
  title: string;
  wikiURL: string;
  content: string;
}

export class BookStrategy extends BaseScrapingStrategy<IBook> {

  private readonly booksWikiUrl = `${WIKI_URL}/book`;

  async getIdList(page: Page): Promise<string[]> {
    await page.goto(this.booksWikiUrl, this.getDefaultNavigationOptions());

    await autoScroll(page);

    return page.evaluate(() => {
      const bookListElement = document.querySelector('#__layout > main > main > section > div.genshin-half-card.genshin-aggregate-page-child > div');
      const bookElements = [...bookListElement?.children ?? []];
      const attributeName = 'data-value';

      return bookElements.map(
        (elem) => elem.querySelector(`[${attributeName}]`)?.getAttribute(attributeName) ?? 'INVALID_BOOK_ID',
      );
    });
  }

  async getEntry(page: Page, id: string): Promise<IBook> {
    const wikiURL = this.getEntryURL(id);
    await page.goto(wikiURL, this.getDefaultNavigationOptions());
    await autoScroll(page);

    const getFindElementError = (elementType: string) => new Error(`Could not get ${elementType} element of book [${id}].`);

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
      console.log(`[${id}]: Got key "${key}" and value "${value}"`);
    }

    const imageSrc = await imageElementHandle.evaluate((imageElement) => imageElement.src);
    const title = await nameElementHandle.evaluate((nameElement) => nameElement.textContent?.trim() ?? 'INVALID_TITLE');
    // todo - convert headers/sections
    const content = await contentElementHandle.evaluate((contentElementHandle) => contentElementHandle.textContent?.trim() ?? 'INVALID_CONTENT');

    return {
      content,
      id,
      imageLink: imageSrc,
      title,
      wikiURL,
    };
  }

  getEntryName(entry: IBook): string {
    return entry.title;
  }

}

