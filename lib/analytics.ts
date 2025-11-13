/**
 * Analytics utilities for tracking user interactions
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

/**
 * Track page view
 */
export function trackPageView(page: string, properties?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  const event: AnalyticsEvent = {
    name: 'page_view',
    properties: {
      page,
      ...properties,
      url: window.location.href,
      referrer: document.referrer,
    },
    timestamp: Date.now(),
  };

  sendAnalytics(event);
}

/**
 * Track custom event
 */
export function trackEvent(
  name: string,
  properties?: Record<string, any>
): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: Date.now(),
  };

  sendAnalytics(event);
}

/**
 * Track wallet connection
 */
export function trackWalletConnect(address: string, connector?: string): void {
  trackEvent('wallet_connect', {
    address,
    connector,
  });
}

/**
 * Track wallet disconnection
 */
export function trackWalletDisconnect(address?: string): void {
  trackEvent('wallet_disconnect', {
    address,
  });
}

/**
 * Track search
 */
export function trackSearch(query: string, filters?: Record<string, any>): void {
  trackEvent('search', {
    query,
    filters,
  });
}

/**
 * Track builder profile view
 */
export function trackProfileView(address: string, source?: string): void {
  trackEvent('profile_view', {
    address,
    source,
  });
}

/**
 * Track error
 */
export function trackError(error: Error, context?: Record<string, any>): void {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

/**
 * Track performance metric
 */
export function trackPerformance(
  metric: string,
  value: number,
  unit: string = 'ms'
): void {
  trackEvent('performance', {
    metric,
    value,
    unit,
  });
}

/**
 * Send analytics event to configured service
 */
function sendAnalytics(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event);
    return;
  }

  // Send to Vercel Analytics if available
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('track', event.name, event.properties);
  }

  // Send to custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).catch((error) => {
      console.error('Failed to send analytics:', error);
    });
  }
}

/**
 * Initialize analytics
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Track initial page view
  trackPageView(window.location.pathname);

  // Track page views on navigation
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    trackPageView(window.location.pathname);
  };

  // Track Core Web Vitals
  if ('web-vital' in window) {
    trackWebVitals();
  }
}

/**
 * Track Web Vitals
 */
function trackWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Track when available
  if ('PerformanceObserver' in window) {
    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackPerformance('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        trackPerformance('FID', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page unload
    window.addEventListener('beforeunload', () => {
      trackPerformance('CLS', clsValue);
    });
  }
}

