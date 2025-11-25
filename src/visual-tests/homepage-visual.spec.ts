import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for homepage
 * These tests capture screenshots and compare them against baselines
 */

test.describe('Homepage Visual Tests', () => {
  test('should match homepage snapshot', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match header snapshot', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toHaveScreenshot('homepage-header.png', {
      animations: 'disabled',
    });
  });

  test('should match navigation snapshot', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation');
    await expect(nav).toHaveScreenshot('homepage-nav.png', {
      animations: 'disabled',
    });
  });

  test('should match main content snapshot', async ({ page }) => {
    await page.goto('/');

    const main = page.getByRole('main');
    await expect(main).toHaveScreenshot('homepage-main.png', {
      animations: 'disabled',
    });
  });

  test('should match wallet button snapshot', async ({ page }) => {
    await page.goto('/');

    const walletButton = page.getByRole('button', { name: /connect/i });
    await expect(walletButton).toHaveScreenshot('wallet-button.png', {
      animations: 'disabled',
    });
  });

  test('should match dark mode (if implemented)', async ({ page }) => {
    await page.goto('/');

    // Check if dark mode toggle exists and trigger it
    const darkModeToggle = page.getByRole('button', { name: /dark mode|theme/i });

    if (await darkModeToggle.isVisible().catch(() => false)) {
      await darkModeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition

      await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
});
