import { expect, test } from '@playwright/test';

test('onboarding step 1 form allows progressing to next steps', async ({ page }) => {
  await page.goto('/start');

  const acceptCookiesButton = page.getByRole('button', {
    name: /Accept all|Přijmout vše|Alle akzeptieren|Alles akzeptieren/i,
  });

  if (await acceptCookiesButton.isVisible({ timeout: 2500 }).catch(() => false)) {
    await acceptCookiesButton.click();
  }

  await expect(page.locator('h1').first()).toBeVisible();

  await page.locator('input[autocomplete="organization"]').fill('Acme Corp');
  await page.getByPlaceholder('12345678').fill('12345678');

  const nameInputs = page.locator('input[autocomplete="name"]');
  await nameInputs.nth(0).fill('John Doe');
  await nameInputs.nth(1).fill('Jane Admin');

  const emailInputs = page.locator('input[autocomplete="email"]');
  await emailInputs.nth(0).fill('john@example.com');
  await emailInputs.nth(1).fill('jane@example.com');

  await page.getByRole('button', { name: /Continue|Pokračovat|Weiter/i }).click();
  await expect(page.locator('h2')).toContainText(/Build teams|Sestavte týmy|Teams/i);

  await page.getByRole('button', { name: /Continue|Pokračovat|Weiter/i }).click();
  await expect(page.getByText(/Number of employees|Počet zaměstnanců|Anzahl der Mitarbeiter/i)).toBeVisible();
});
