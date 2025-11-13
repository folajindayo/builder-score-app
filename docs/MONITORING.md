# Monitoring & Observability Guide

This document outlines the monitoring and observability setup for the Builder Score App.

## Overview

We use multiple tools for comprehensive monitoring:

- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Web vitals and page views
- **Custom Logging**: Application-level logging
- **Performance Monitoring**: Custom performance metrics

## Error Tracking (Sentry)

### Setup

Sentry is configured for all runtime environments:
- Client-side (browser)
- Server-side (Node.js)
- Edge runtime (Vercel Edge Functions)

### Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  tracesSampleRate: 0.1,
});
```

### Usage

```typescript
import { reportError, addBreadcrumb } from '@/lib/error-reporting';

// Report an error
try {
  await riskyOperation();
} catch (error) {
  reportError(error, {
    userId: user.id,
    action: 'risky_operation',
  });
}

// Add breadcrumb for debugging
addBreadcrumb('User clicked button', 'ui', 'info', {
  buttonId: 'submit',
});
```

### Best Practices

1. **Add Context**: Include relevant context with errors
2. **Use Breadcrumbs**: Track user actions leading to errors
3. **Filter Sensitive Data**: Mask PII in error reports
4. **Set User Context**: Identify users for better debugging
5. **Monitor Performance**: Track slow operations

## Analytics

### Web Vitals

Core Web Vitals are automatically tracked:

- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1

### Custom Events

```typescript
import { trackEvent } from '@/lib/analytics';

// Track custom event
trackEvent('feature_used', {
  feature: 'search',
  query: 'solidity',
});

// Track wallet connection
trackWalletConnect(address, connector);

// Track search
trackSearch(query, filters);
```

### Page Views

Page views are automatically tracked on:
- Initial page load
- Client-side navigation
- History changes

## Performance Monitoring

### Measurement

```typescript
import { startMeasure, endMeasure } from '@/lib/performance-monitoring';

// Manual measurement
startMeasure('api-call');
const data = await fetchData();
const duration = endMeasure('api-call');

// Async function measurement
const result = await measureAsync('heavy-computation', async () => {
  return await computeExpensiveOperation();
});
```

### Metrics

We track the following metrics:

| Metric | Target | Description |
|--------|--------|-------------|
| Page Load Time | < 3s | Total page load time |
| Time to Interactive | < 3.5s | Time until page is interactive |
| First Contentful Paint | < 1.8s | Time to first content |
| API Response Time | < 500ms | Average API response time |

### Long Task Monitoring

```typescript
import { monitorLongTasks } from '@/lib/performance-monitoring';

// Monitor tasks longer than 50ms
const cleanup = monitorLongTasks((duration) => {
  console.warn(`Long task detected: ${duration}ms`);
}, 50);

// Cleanup when done
cleanup();
```

## Custom Logging

### Log Levels

- **DEBUG**: Detailed debugging information
- **INFO**: General informational messages
- **WARN**: Warning messages
- **ERROR**: Error messages

### Usage

```typescript
import { logger, debug, info, warn, error } from '@/lib/custom-logging';

// Simple logging
info('User logged in', { userId: '123' });

// Error logging
error('Failed to fetch data', new Error('Network error'), {
  endpoint: '/api/data',
});

// Retrieve logs
const recentErrors = logger.getLogs('error', 10);
```

### Log Retention

- **Development**: Console only
- **Production**: Sent to remote logging service
- **History**: Last 1000 logs kept in memory

## Feature Flags

### Configuration

```typescript
import { isFeatureEnabled } from '@/lib/feature-flags';

// Check feature flag
if (isFeatureEnabled('darkMode')) {
  // Enable dark mode
}

// React hook
const isDarkModeEnabled = useFeatureFlag('darkMode');
```

### Available Flags

| Flag | Default | Description |
|------|---------|-------------|
| darkMode | true | Dark mode UI |
| newSearchUI | false | New search interface |
| socialSharing | true | Social media sharing |
| notifications | false | Push notifications |
| achievements | false | Gamification features |

## Dashboards

### Sentry Dashboard

Access at: https://sentry.io/organizations/your-org/projects/builder-score-app

Key metrics:
- Error rate
- User impact
- Performance issues
- Release health

### Vercel Analytics

Access at: https://vercel.com/dashboard/analytics

Key metrics:
- Page views
- Unique visitors
- Web vitals
- Geo distribution

## Alerts

### Error Rate Alert

Triggers when error rate exceeds threshold:
- **Threshold**: 1% of requests
- **Action**: Notify on-call engineer
- **Channels**: Email, Slack

### Performance Alert

Triggers when performance degrades:
- **LCP > 4s**: Warning
- **FID > 300ms**: Warning
- **CLS > 0.25**: Warning

### Downtime Alert

Monitors application availability:
- **Uptime target**: 99.9%
- **Check frequency**: Every 1 minute
- **Channels**: PagerDuty, Slack

## Debugging

### Error Investigation

1. **Identify Error**: Check Sentry dashboard
2. **Review Context**: Examine error context and breadcrumbs
3. **Reproduce**: Use session replay to see user actions
4. **Fix**: Implement fix and deploy
5. **Verify**: Monitor error rate after deployment

### Performance Investigation

1. **Identify Issue**: Check Web Vitals scores
2. **Analyze**: Use Chrome DevTools Performance panel
3. **Profile**: Identify bottlenecks
4. **Optimize**: Implement optimizations
5. **Measure**: Verify improvements with A/B test

## Best Practices

### Error Handling

1. **Catch and Report**: Always catch and report errors
2. **Add Context**: Include relevant context
3. **Don't Swallow**: Never silently catch errors
4. **User-Friendly**: Show helpful error messages to users

### Performance

1. **Measure First**: Always measure before optimizing
2. **Set Budgets**: Define performance budgets
3. **Monitor Continuously**: Track metrics over time
4. **Optimize Gradually**: Incremental improvements

### Logging

1. **Appropriate Level**: Use correct log level
2. **Structured Data**: Include structured context
3. **Sensitive Data**: Never log passwords or tokens
4. **Actionable**: Logs should be actionable

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Web Vitals](https://web.dev/vitals/)
- [Performance Best Practices](https://web.dev/performance/)

