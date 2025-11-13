import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration for visual regression testing
 * Extends base Playwright config with visual testing specific settings
 */
export default defineConfig({
  testDir: './visual-tests',
  fullyParallel: false, // Run visual tests sequentially for consistency
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for visual tests
  workers: 1, // Single worker for consistent screenshots
  reporter: [
    ['html', { outputFolder: 'visual-test-results' }],
    ['json', { outputFile: 'visual-test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'on', // Always take screenshots for visual comparison
    video: 'off', // No videos needed for visual tests
  },

  /* Configure projects for visual testing */
  projects: [
    {
      name: 'chromium-visual',
      use: {
        ...devices['Desktop Chrome'],
        // Consistent viewport for visual regression
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile-visual',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

