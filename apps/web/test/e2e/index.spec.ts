import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5274');

  await expect(page.getByRole('heading', { name: '4' })).toBeVisible();
});