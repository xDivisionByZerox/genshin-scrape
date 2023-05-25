import type { Page } from 'puppeteer';

export interface IScrapingStrategy<T> {

  /**
   * Get a list of IDs for the specific resource.
   * 
   * @param page A individual browser page.
   */
  getIdList(page: Page): Promise<string[]>;

  /**
   * Get a single resource.
   * 
   * @param page An individual browser page. 
   * @param id The specific resource ID to scrape. 
   */
  getEntry(page: Page, id: string): Promise<T>;

  /**
   * Get the unique name of a resource.
   * 
   * @param entry 
   */
  getEntryName(entry: T): string;

}