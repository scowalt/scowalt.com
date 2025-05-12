import percySnapshot from '@percy/playwright';
import { Page, test } from '@playwright/test';

test.describe('Homepage Visual Tests', () => {
  test('should match the homepage snapshot', async ({ page }: { page: Page }) => {
    // Navigate to your Next.js application's homepage
    // Make sure your development server is running when you execute these tests locally
    await page.goto('http://localhost:2376/');

    // Wait for any specific elements to load if necessary, e.g.:
    await page.waitForSelector('img');

    // Take a Percy snapshot
    // The first argument is the Playwright page object
    // The second argument is the name of the snapshot (this should be unique per snapshot)
    await percySnapshot(page, 'Homepage');
 });
}); 