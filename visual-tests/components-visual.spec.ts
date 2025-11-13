import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for individual components
 */

test.describe('Component Visual Tests', () => {
  test('should match search page layout', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('search-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match leaderboard page layout', async ({ page }) => {
    await page.goto('/leaderboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('leaderboard-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match search input states', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.getByRole('textbox', { name: /search/i });
    
    // Empty state
    await expect(searchInput).toHaveScreenshot('search-input-empty.png');
    
    // Focused state
    await searchInput.focus();
    await expect(searchInput).toHaveScreenshot('search-input-focused.png');
    
    // With text
    await searchInput.fill('0x1234');
    await expect(searchInput).toHaveScreenshot('search-input-filled.png');
  });

  test('should match button states', async ({ page }) => {
    await page.goto('/');
    
    const button = page.getByRole('button', { name: /connect/i });
    
    // Normal state
    await expect(button).toHaveScreenshot('button-normal.png');
    
    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
  });
});

test.describe('Responsive Visual Tests', () => {
  test('should match mobile homepage', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet homepage', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match desktop homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

