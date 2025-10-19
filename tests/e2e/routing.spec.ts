import { test, expect } from '@playwright/test';

import { locales } from '../../i18n.config';

test('redirects root to default locale', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  expect(page.url()).toMatch(/\/pt-PT\/?$/);
});

test('generates localized routes for all locales', async ({ page }) => {
  for (const locale of locales) {
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});
