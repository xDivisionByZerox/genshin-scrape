import type { ElementHandle, Page } from 'puppeteer';
import { WIKI_URL } from '../../const';
import { autoScroll } from '../../util/auto-scroll';
import { BaseScrapingStrategy } from './base.strategy';

interface IWeapon {
  id: string;
  imageLink: string;
  name: string;
  rarity: number;
  subStat: string | null;
  type: string;
  wikiURL: string;
}

export class WeaponStrategy extends BaseScrapingStrategy<IWeapon> {

  private readonly weaponsWikiUrl = `${WIKI_URL}/weapon`;

  async getIdList(page: Page): Promise<string[]> {
    await page.goto(this.weaponsWikiUrl, this.getDefaultNavigationOptions());
    await autoScroll(page);

    return page.evaluate(
      () => [...document.querySelectorAll('[data-value]')].map((item) => item.getAttribute('data-value') ?? 'INVALID_WEAPON_ID'),
    );
  }

  async getEntry(page: Page, id: string): Promise<IWeapon> {
    const wikiURL = this.getEntryURL(id);
    await page.goto(wikiURL, this.getDefaultNavigationOptions());
    await autoScroll(page);

    const mainElementHandle = await page.$('#__layout > main > div > div.genshin-entry-page > div.genshin-entry-child-page');
    if (!mainElementHandle) {
      throw new Error('Could not get main element');
    }

    const [
      imageURL, weaponName, rarity, subStat, type,
    ] = await Promise.all([
      this.getImageURL(mainElementHandle),
      this.getName(mainElementHandle),
      this.getRarity(mainElementHandle),
      this.getSubStat(mainElementHandle),
      this.getType(mainElementHandle),
    ]);

    return {
      id: id,
      imageLink: imageURL,
      name: weaponName,
      rarity,
      subStat,
      type,
      wikiURL,
    };
  }

  private async getImageURL(mainElementHandle: ElementHandle<HTMLDivElement>): Promise<string> {
    return mainElementHandle.evaluate((mainElement) => {
      return mainElement
        .querySelector('.detail-header img.d-img-show')
        ?.getAttribute('src')
        ?? 'INVALID_IMAGE_URL'
    });
  }

  private async getName(mainElementHandle: ElementHandle<HTMLDivElement>): Promise<string> {
    return mainElementHandle.evaluate((mainElement) => {
      return mainElement
        .querySelector('.detail-header .detail-header-common-name')
        ?.textContent
        ?.trim()
        ?? 'INVALID_TITLE';
    });
  }

  private async getRarity(mainElementHandle: ElementHandle<HTMLDivElement>): Promise<number> {
    return mainElementHandle.evaluate((mainElementHandle) => {
      return mainElementHandle
        .querySelectorAll('.detail-header-common-level img.level-star-img')
        .length
    });
  }

  private async getType(mainElementHandle: ElementHandle<HTMLDivElement>): Promise<string> {
    return mainElementHandle.evaluate((mainElement) => {
      const metaItems = mainElement.querySelectorAll('.base-info-item');
      for (const item of metaItems) {
        const [keyElement, valueElement] = item.children;
        const key = keyElement?.textContent?.trim() ?? '';
        const value = valueElement?.textContent?.trim() ?? '';
        if (key.toLowerCase() === 'type') {
          return value;
        }
      }

      throw new Error('Was not able to find type value from meta items.');
    });
  }

  private async getSubStat(mainElementHandle: ElementHandle<HTMLDivElement>): Promise<string | null> {
    return mainElementHandle.evaluate((mainElement) => {
      const metaItems = mainElement.querySelectorAll('.base-info-item');
      for (const item of metaItems) {
        const [keyElement, valueElement] = item.children;
        const key = keyElement?.textContent?.trim() ?? '';
        const value = valueElement?.textContent?.trim() ?? '';
        if (key.toLowerCase() === 'secondary attributes') {
          return value;
        }
      }

      return null;
    });
  }

  getEntryName(entry: IWeapon): string {
    return entry.name;
  }

}

