# Visual Regression Testing Guide

This document explains how to use visual regression testing in the Builder Score App.

## Overview

Visual regression testing helps catch unintended visual changes in the UI. We use:

- **Playwright**: For capturing screenshots and visual comparisons
- **Chromatic**: For cloud-based visual testing and review workflow

## Running Visual Tests

### Local Visual Tests

```bash
# Run visual regression tests
npm run visual-test

# Update snapshots (when visual changes are intentional)
npm run visual-test -- --update-snapshots

# Run specific visual test
npx playwright test visual-tests/homepage-visual.spec.ts
```

### Chromatic (Cloud)

```bash
# Run Chromatic visual tests
npm run chromatic

# Run with specific branch
npm run chromatic -- --branch-name=feature/my-feature

# Auto-accept changes (use with caution)
npm run chromatic -- --auto-accept-changes
```

## Test Structure

Visual tests are located in `visual-tests/` directory:

```
visual-tests/
├── homepage-visual.spec.ts      # Homepage visual tests
├── components-visual.spec.ts    # Component visual tests
└── ...
```

## Writing Visual Tests

### Basic Screenshot Test

```typescript
import { test, expect } from '@playwright/test';

test('should match component snapshot', async ({ page }) => {
  await page.goto('/');
  
  const component = page.locator('.my-component');
  await expect(component).toHaveScreenshot('component.png', {
    animations: 'disabled',
  });
});
```

### Full Page Screenshot

```typescript
test('should match full page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

### Responsive Screenshots

```typescript
test('should match mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  await expect(page).toHaveScreenshot('mobile.png', {
    fullPage: true,
  });
});
```

## Best Practices

### 1. Disable Animations

Always disable animations for consistent screenshots:

```typescript
await expect(element).toHaveScreenshot('element.png', {
  animations: 'disabled',
});
```

### 2. Wait for Content

Ensure dynamic content is loaded:

```typescript
await page.waitForLoadState('networkidle');
// or
await page.waitForSelector('.content-loaded');
```

### 3. Hide Dynamic Elements

Hide timestamps, random IDs, or other dynamic content:

```typescript
await page.addStyleTag({
  content: '.timestamp { visibility: hidden; }',
});
```

### 4. Test Multiple States

Capture different component states:

```typescript
// Normal state
await expect(button).toHaveScreenshot('button-normal.png');

// Hover state
await button.hover();
await expect(button).toHaveScreenshot('button-hover.png');

// Focused state
await button.focus();
await expect(button).toHaveScreenshot('button-focused.png');
```

### 5. Use Consistent Viewports

Define standard viewport sizes:

```typescript
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
};
```

## Updating Baselines

When visual changes are intentional:

```bash
# Update all snapshots
npm run visual-test -- --update-snapshots

# Update specific test snapshots
npx playwright test visual-tests/homepage-visual.spec.ts --update-snapshots
```

## CI/CD Integration

Visual tests run automatically on:

- Pull requests (comparison against base branch)
- Pushes to main (baseline updates)

### Chromatic Review Process

1. Open PR with visual changes
2. Chromatic runs and detects differences
3. Review changes in Chromatic UI
4. Accept or reject changes
5. Merge when approved

## Snapshot Storage

### Playwright Snapshots

Snapshots are stored in:
- Baselines: `visual-tests/**/*-snapshots/`
- Actual: `visual-test-results/`
- Diff: `visual-test-results/`

### Chromatic

Snapshots are stored in Chromatic cloud:
- Accessible via Chromatic dashboard
- Linked to commits and PRs
- Retained based on plan limits

## Configuration

### Playwright Visual Config

Edit `playwright-visual.config.ts` to customize:

```typescript
export default defineConfig({
  testDir: './visual-tests',
  workers: 1, // Single worker for consistency
  use: {
    screenshot: 'on',
    viewport: { width: 1280, height: 720 },
  },
});
```

### Chromatic Config

Edit `chromatic.config.json`:

```json
{
  "projectToken": "your_token",
  "autoAcceptChanges": false,
  "exitZeroOnChanges": false
}
```

## Troubleshooting

### Inconsistent Screenshots

- Ensure animations are disabled
- Check for dynamic content (timestamps, IDs)
- Use `waitForLoadState('networkidle')`
- Run with single worker (`workers: 1`)

### Large Diffs

- Check font rendering (different OS)
- Verify browser versions match
- Check for anti-aliasing differences
- Use consistent viewport sizes

### False Positives

- Increase threshold tolerance
- Hide truly dynamic elements
- Mock time-dependent content
- Use consistent test data

## Resources

- [Playwright Screenshots](https://playwright.dev/docs/screenshots)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Visual Testing Best Practices](https://www.chromatic.com/blog/visual-testing-best-practices)

