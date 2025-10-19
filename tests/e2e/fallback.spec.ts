import { test, expect } from '@playwright/test';

test('displays fallback badge when translations are missing', async ({ page }) => {
  await page.goto('/en');
  const badge = page.getByText('Auto-fallback');
  await expect(badge).toBeVisible();
});
