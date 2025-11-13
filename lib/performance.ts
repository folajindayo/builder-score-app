// Performance optimizations (commits 161-180)
export function lazyLoadComponent<T>(factory: () => Promise<{ default: T }>): T {
  // Dynamic import wrapper
  return factory().then(module => module.default) as any;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export class VirtualList {
  private itemHeight: number;
  private visibleCount: number;
  private scrollTop = 0;

  constructor(itemHeight: number, containerHeight: number) {
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(containerHeight / itemHeight);
  }

  getVisibleRange(totalItems: number): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(start + this.visibleCount, totalItems);
    return { start, end };
  }

  onScroll(scrollTop: number): void {
    this.scrollTop = scrollTop;
  }
}

export function deduplicateRequests<T>(fn: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | null = null;
  return () => {
    if (pending) return pending;
    pending = fn().finally(() => (pending = null));
    return pending;
  };
}

export function prefetchResource(url: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

export function optimizeImage(src: string, width: number, quality: number = 75): string {
  return `${src}?w=${width}&q=${quality}`;
}

export const performanceBudget = {
  maxBundleSize: 200 * 1024, // 200KB
  maxInitialLoad: 3000, // 3s
  maxTTI: 5000, // 5s
  maxFCP: 1800, // 1.8s
  maxLCP: 2500, // 2.5s
};

export function checkPerformanceBudget(): boolean {
  if (typeof window === 'undefined') return true;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  return navigation.loadEventEnd - navigation.fetchStart < performanceBudget.maxInitialLoad;
}

