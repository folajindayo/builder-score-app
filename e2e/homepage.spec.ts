import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Builder Score/i);
    
    // Check if main heading is present
    await expect(page.getByRole('heading', { name: /Builder Score/i })).toBeVisible();
  });

  test('should display wallet connect button', async ({ page }) => {
    await page.goto('/');
    
    // Check if wallet button is present
    const walletButton = page.getByRole('button', { name: /connect/i });
    await expect(walletButton).toBeVisible();
  });

  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Search link
    await page.getByRole('link', { name: /search/i }).click();
    
    // Verify we're on the search page
    await expect(page).toHaveURL(/\/search/);
  });

  test('should navigate to leaderboard page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Leaderboard link
    await page.getByRole('link', { name: /leaderboard/i }).click();
    
    // Verify we're on the leaderboard page
    await expect(page).toHaveURL(/\/leaderboard/);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await expect(nav).toBeVisible();
    
    // Check for main content
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });

  test('should be responsive', async ({ page, viewport }) => {
    await page.goto('/');
    
    // The page should load regardless of viewport size
    await expect(page.getByRole('heading', { name: /Builder Score/i })).toBeVisible();
    
    if (viewport && viewport.width < 768) {
      // On mobile, check mobile-specific elements if any
      console.log('Testing mobile viewport');
    }
  });
});

