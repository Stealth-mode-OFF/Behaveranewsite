import { expect, test } from '@playwright/test';

test('blog list opens a post detail with article content', async ({ page }) => {
  await page.goto('/blog');

  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const firstPostLink = page.locator('main a[href^="/blog/"]').first();
  const postCount = await page.locator('main a[href^="/blog/"]').count();

  // In CMS-only mode local/dev can have zero posts.
  // If posts exist, validate the full list -> detail flow.
  if (postCount === 0) {
    await expect(page.locator('article')).toHaveCount(0);
    return;
  }

  await expect(firstPostLink).toBeVisible();

  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();
  await firstPostLink.click();

  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator('article').first()).toBeVisible();
});
