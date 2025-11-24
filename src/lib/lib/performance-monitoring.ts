/**
 * Performance monitoring utilities
 */

interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
}

const performanceMarks = new Map<string, PerformanceMark>();

/**
 * Start performance measurement
 */
export function startMeasure(name: string): void {
  if (typeof performance === 'undefined') return;

  const mark: PerformanceMark = {
    name,
    startTime: performance.now(),
  };

  performanceMarks.set(name, mark);

  if (performance.mark) {
    performance.mark(`${name}-start`);
  }
}

/**
 * End performance measurement
 */
export function endMeasure(name: string): number | undefined {
  if (typeof performance === 'undefined') return undefined;

  const mark = performanceMarks.get(name);
  if (!mark) {
    console.warn(`No performance mark found for: ${name}`);
    return undefined;
  }

  const duration = performance.now() - mark.startTime;
  mark.duration = duration;

  if (performance.mark && performance.measure) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  // Clean up
  performanceMarks.delete(name);

  return duration;
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  startMeasure(name);
  try {
    const result = await fn();
    endMeasure(name);
    return result;
  } catch (error) {
    endMeasure(name);
    throw error;
  }
}

/**
 * Measure sync function execution time
 */
export function measure<T>(name: string, fn: () => T): T {
  startMeasure(name);
  try {
    const result = fn();
    endMeasure(name);
    return result;
  } catch (error) {
    endMeasure(name);
    throw error;
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): {
  navigation?: PerformanceNavigationTiming;
  paint?: PerformancePaintTiming[];
  resources?: PerformanceResourceTiming[];
} {
  if (typeof performance === 'undefined') return {};

  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  const paint = performance.getEntriesByType('paint') as PerformancePaintTiming[];

  const resources = performance.getEntriesByType(
    'resource'
  ) as PerformanceResourceTiming[];

  return { navigation, paint, resources };
}

/**
 * Get page load time
 */
export function getPageLoadTime(): number | undefined {
  if (typeof performance === 'undefined') return undefined;

  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  if (!navigation) return undefined;

  return navigation.loadEventEnd - navigation.fetchStart;
}

/**
 * Get time to interactive
 */
export function getTimeToInteractive(): number | undefined {
  if (typeof performance === 'undefined') return undefined;

  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  if (!navigation) return undefined;

  return navigation.domInteractive - navigation.fetchStart;
}

/**
 * Get first contentful paint
 */
export function getFirstContentfulPaint(): number | undefined {
  if (typeof performance === 'undefined') return undefined;

  const paint = performance.getEntriesByType('paint') as PerformancePaintTiming[];
  const fcp = paint.find((entry) => entry.name === 'first-contentful-paint');

  return fcp?.startTime;
}

/**
 * Monitor long tasks
 */
export function monitorLongTasks(
  callback: (duration: number) => void,
  threshold: number = 50
): () => void {
  if (typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.duration > threshold) {
        callback(entry.duration);
      }
    });
  });

  try {
    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // longtask not supported
  }

  return () => observer.disconnect();
}

/**
 * Report performance to analytics
 */
export function reportPerformance(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    // Wait a bit for all metrics to be available
    setTimeout(() => {
      const metrics = {
        pageLoadTime: getPageLoadTime(),
        timeToInteractive: getTimeToInteractive(),
        firstContentfulPaint: getFirstContentfulPaint(),
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('[Performance Metrics]', metrics);
      }

      // Send to analytics
      if (typeof window !== 'undefined' && (window as any).va) {
        (window as any).va('track', 'performance_metrics', metrics);
      }
    }, 1000);
  });
}

