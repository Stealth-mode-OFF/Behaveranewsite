import { expect, test } from '@playwright/test';

test('homepage renders key layout blocks', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1').first()).toBeVisible();

  const header = page.locator('header').first();
  await expect(header).toBeVisible();
  await expect(header.getByRole('link', { name: /behavera/i }).first()).toBeVisible();

  const footer = page.locator('footer').first();
  await expect(footer).toBeVisible();
  await expect(footer).toContainText(/Behavera/i);
});
