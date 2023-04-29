import puppeteer, { Page } from 'puppeteer';

/**
 * Launches a new page on the desired URL.
 * Top-Level-Entrypoint for a scrapper script.
 * 
 * @param url The URL to launch.
 * @param executionFn A function that handles the script.
 */
export async function launchPage(url: string, executionFn: (page: Page) => Promise<void>) {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    executionFn(page);
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
}