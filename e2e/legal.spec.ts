import { expect, test } from '@playwright/test';

for (const path of ['/terms', '/privacy-policy']) {
  test(`legal page ${path} renders content`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('body')).toContainText(/Behavera|Terms|Privacy|Podmínky|Ochrana/i);
  });
}
