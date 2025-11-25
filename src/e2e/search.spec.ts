import { test, expect } from '@playwright/test';

test.describe('Search Page', () => {
  test('should display search form', async ({ page }) => {
    await page.goto('/search');

    // Check if search input is present
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await expect(searchInput).toBeVisible();
  });

  test('should allow typing in search input', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.fill('0x1234567890123456789012345678901234567890');

    await expect(searchInput).toHaveValue('0x1234567890123456789012345678901234567890');
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/search');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /search/i })).toBeVisible();

    // Check for main content
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });
});
