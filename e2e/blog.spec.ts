import { expect, test } from '@playwright/test';

test('blog list opens a post detail with article content', async ({ page }) => {
  await page.goto('/blog');

  await expect(page).toHaveURL(/\/blog$/);

  const firstPostLink = page.locator('main a[href^="/blog/"]').first();
  await expect(firstPostLink).toBeVisible();

  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();

  await firstPostLink.click();

  await expect(page).toHaveURL(new RegExp(`${href?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  await expect(page.locator('article').first()).toBeVisible();
});
