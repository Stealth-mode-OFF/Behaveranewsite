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

/* ─── UI Sanity: visual hierarchy guardrails ─── */

test('proof chips do not exceed 44px height on desktop', async ({ page }) => {
  await page.goto('/');

  // Wait for the proof chips to render (they animate in)
  const chips = page.locator('[data-testid="proof-chip"]');
  await expect(chips.first()).toBeVisible({ timeout: 10000 });

  const count = await chips.count();
  expect(count).toBeGreaterThanOrEqual(3);

  for (let i = 0; i < count; i++) {
    const box = await chips.nth(i).boundingBox();
    expect(box).toBeTruthy();
    // Proof chips must stay compact — max 44px tall
    expect(box!.height).toBeLessThanOrEqual(44);
    // Sanity: must be at least 20px (not collapsed)
    expect(box!.height).toBeGreaterThanOrEqual(20);
  }
});

test('primary CTA button has proper touch target and dominance', async ({ page }) => {
  await page.goto('/');

  // The hero CTA is the first primary button visible
  const heroCta = page.locator('a[href*="demo"], button').filter({ hasText: /demo|vyzkoušet|try/i }).first();
  await expect(heroCta).toBeVisible({ timeout: 10000 });

  const box = await heroCta.boundingBox();
  expect(box).toBeTruthy();
  // Min touch target: 44px (WCAG), should be around 48-52px for hero
  expect(box!.height).toBeGreaterThanOrEqual(44);
  // Must not be absurdly tall
  expect(box!.height).toBeLessThanOrEqual(60);
});
