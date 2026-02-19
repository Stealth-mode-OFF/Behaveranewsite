import { expect, test, type Page } from '@playwright/test';

async function dismissCookieBanner(page: Page) {
  const choices = [
    /Accept all|Přijmout vše|Alle akzeptieren|Alles akzeptieren/i,
    /Essential only|Pouze nezbytné|Nur essenzielle|Nur notwendig/i,
    /Close|Zavřít|Schließen/i,
  ];

  for (const name of choices) {
    const button = page.getByRole('button', { name }).first();
    if (await button.isVisible({ timeout: 1500 }).catch(() => false)) {
      await button.click({ force: true });
      await page.waitForTimeout(150);
      return;
    }
  }
}

test('onboarding step 1 form allows progressing to next steps', async ({ page }) => {
  await page.goto('/start');

  await dismissCookieBanner(page);

  await expect(page.locator('h1').first()).toBeVisible();

  await page.locator('input[autocomplete="organization"]').fill('Acme Corp');
  await page.getByPlaceholder('12345678').fill('12345678');

  const nameInputs = page.locator('input[autocomplete="name"]');
  await nameInputs.nth(0).fill('John Doe');
  await nameInputs.nth(1).fill('Jane Admin');

  const emailInputs = page.locator('input[autocomplete="email"]');
  await emailInputs.nth(0).fill('john@example.com');
  await emailInputs.nth(1).fill('jane@example.com');

  await dismissCookieBanner(page);

  const continueButton = page.getByRole('button', {
    name: /Continue|Pokračovat|Weiter/i,
  });

  await continueButton.scrollIntoViewIfNeeded();
  await continueButton.click({ force: true });
  await expect(page.locator('h2')).toContainText(/Build teams|Sestavte týmy|Teams/i);

  await page.getByRole('button', { name: /Continue|Pokračovat|Weiter/i }).click({ force: true });
  await expect(page.getByText(/Number of employees|Počet zaměstnanců|Anzahl der Mitarbeiter/i)).toBeVisible();
});
