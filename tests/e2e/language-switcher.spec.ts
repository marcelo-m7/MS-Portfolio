import { test, expect } from '@playwright/test';

test('switches languages and preserves path', async ({ page }) => {
  await page.goto('/pt-PT/portfolio');
  await page.getByRole('button', { name: /alterar idioma/i }).click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/portfolio/);
  await expect(page.getByRole('heading', { level: 1, name: /Portfolio/i })).toBeVisible();
});
