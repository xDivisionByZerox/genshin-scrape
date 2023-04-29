import { Page } from 'puppeteer';

/**
 * Scrolls the provided page to the bottom.
 * This ensures that lazy elements are loaded.
 */
export async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    let totalHeight = 0;
    let distance = 100;
    let scrollHeight = Number.MAX_SAFE_INTEGER;
    while (totalHeight < scrollHeight - window.innerHeight) {
      scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  });
}
