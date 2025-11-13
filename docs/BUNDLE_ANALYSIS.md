# Bundle Analysis Guide

This document explains how to analyze and optimize bundle sizes in the Builder Score App.

## Why Bundle Size Matters

- **Performance**: Smaller bundles load faster
- **User Experience**: Faster initial page loads
- **SEO**: Better Core Web Vitals scores
- **Cost**: Reduced bandwidth costs

## Running Bundle Analysis

### Full Bundle Analysis

```bash
# Analyze the complete bundle
npm run analyze

# Open the interactive analysis
open .next/analyze/client.html
open .next/analyze/server.html
```

### Size Limit Check

```bash
# Check if bundle sizes are within limits
npm run size-limit

# Update size limits (after optimization)
# Edit .size-limit.json
```

## Size Budgets

Current size budgets:

| Bundle | Limit | Current |
|--------|-------|---------|
| Client Bundle | 300 KB | - |
| Homepage | 50 KB | - |
| Search Page | 50 KB | - |
| Leaderboard | 50 KB | - |

## Optimization Strategies

### 1. Code Splitting

```typescript
// ✅ Good: Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// ❌ Bad: Static import
import { HeavyComponent } from './HeavyComponent';
```

### 2. Tree Shaking

```typescript
// ✅ Good: Named imports
import { useState, useEffect } from 'react';

// ❌ Bad: Namespace import
import * as React from 'react';
```

### 3. Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove unused packages
npm uninstall unused-package
```

### 4. Optimize Images

- Use Next.js Image component
- Serve WebP format
- Implement lazy loading
- Use appropriate sizes

### 5. Minification

Next.js automatically minifies code in production:

- JavaScript minification (Terser)
- CSS minification
- HTML minification

### 6. Compression

Enable gzip/brotli compression:

```javascript
// next.config.js
module.exports = {
  compress: true,
};
```

## Analyzing Specific Pages

### Homepage Analysis

```bash
# Build and analyze
npm run build
npm run analyze

# Check homepage bundle
ls -lh .next/static/chunks/app/page*.js
```

### Component Analysis

Find large components:

```bash
# List all chunks by size
du -sh .next/static/chunks/* | sort -rh | head -10
```

## Common Issues

### Large Dependencies

```bash
# Analyze what's in your bundle
npx webpack-bundle-analyzer .next/analyze/client.json
```

**Solutions:**
- Replace heavy libraries with lighter alternatives
- Use CDN for large libraries
- Implement dynamic imports

### Duplicate Code

**Signs:**
- Same code appears in multiple chunks
- Vendor bundle is unusually large

**Solutions:**
- Configure shared chunks in next.config.js
- Use webpack's SplitChunksPlugin

### Unoptimized Images

**Signs:**
- Large image files in bundle
- Slow page load times

**Solutions:**
- Use next/image component
- Implement image optimization
- Use appropriate image formats

## Monitoring

### CI/CD Integration

Bundle analysis runs automatically on:
- Pull requests (size comparison)
- Pushes to main (baseline update)

### Size Limit in CI

```yaml
# .github/workflows/ci.yml
- name: Check bundle size
  run: npm run size-limit
```

## Best Practices

1. **Set Size Budgets**: Define acceptable sizes for each route
2. **Regular Checks**: Review bundle size with each PR
3. **Progressive Enhancement**: Load features on demand
4. **Lazy Loading**: Defer non-critical code
5. **Monitor Trends**: Track size over time

## Tools

- **@next/bundle-analyzer**: Visual bundle analysis
- **size-limit**: Enforce size budgets
- **webpack-bundle-analyzer**: Detailed analysis
- **bundlephobia**: Check package sizes before installing

## Resources

- [Next.js Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [Web.dev Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

