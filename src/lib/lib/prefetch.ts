/**
 * Prefetching strategies for data
 *
 * Provides utilities for prefetching data to improve perceived performance
 * and reduce loading times when users navigate to pages.
 */

import { apiCache } from './api-cache';

/**
 * Prefetch options
 */
export interface PrefetchOptions {
  /** Priority level (higher = more important) */
  priority?: 'high' | 'medium' | 'low';
  /** Whether to prefetch in background (non-blocking) */
  background?: boolean;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Prefetches data and stores in cache
 */
export async function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: PrefetchOptions = {}
): Promise<T | null> {
  const { priority = 'medium', background = true, timeout = 10000 } = options;

  try {
    if (background) {
      // Non-blocking prefetch
      fetcher()
        .then((data) => {
          // Data will be cached by apiCache when fetched
          return data;
        })
        .catch((error) => {
          console.warn(`Background prefetch failed for key "${key}":`, error);
        });
      return null;
    }

    // Blocking prefetch with timeout
    const data = await Promise.race([
      fetcher(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Prefetch timeout')), timeout)
      ),
    ]);

    return data;
  } catch (error) {
    if (options.background) {
      console.warn(`Failed to prefetch data for key "${key}":`, error);
    } else {
      console.error(`Failed to prefetch data for key "${key}":`, error);
    }
    return null;
  }
}

/**
 * Prefetches multiple data items
 */
export async function prefetchMultiple<T>(
  items: Array<{ key: string; fetcher: () => Promise<T> }>,
  options: PrefetchOptions = {}
): Promise<Array<{ key: string; success: boolean; data?: T }>> {
  const results = await Promise.allSettled(
    items.map(async ({ key, fetcher }) => {
      const data = await prefetchData(key, fetcher, options);
      return { key, success: data !== null, data: data ?? undefined };
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      key: items[index].key,
      success: false,
    };
  });
}

/**
 * Prefetches data on link hover (for Next.js Link components)
 */
export function createLinkPrefetcher<T>(
  fetcher: () => Promise<T>,
  key: string,
  options: PrefetchOptions = {}
) {
  return {
    onMouseEnter: () => {
      // Prefetch on hover with low priority
      prefetchData(key, fetcher, { ...options, priority: 'low', background: true });
    },
    onFocus: () => {
      // Prefetch on focus with medium priority
      prefetchData(key, fetcher, { ...options, priority: 'medium', background: true });
    },
  };
}

/**
 * Prefetches data when element is visible (using Intersection Observer)
 */
export function createVisibilityPrefetcher<T>(
  fetcher: () => Promise<T>,
  key: string,
  options: PrefetchOptions & { rootMargin?: string } = {}
) {
  const { rootMargin = '200px', ...prefetchOptions } = options;

  return (element: HTMLElement | null) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchData(key, fetcher, {
              ...prefetchOptions,
              priority: 'medium',
              background: true,
            });
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  };
}

/**
 * Prefetches data on route change (for Next.js)
 */
export function prefetchOnRouteChange<T>(
  route: string,
  fetcher: () => Promise<T>,
  key: string,
  options: PrefetchOptions = {}
) {
  if (typeof window === 'undefined') return;

  const handleRouteChange = () => {
    if (window.location.pathname === route) {
      prefetchData(key, fetcher, { ...options, priority: 'high', background: false });
    }
  };

  // Listen for route changes
  window.addEventListener('popstate', handleRouteChange);

  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
}

/**
 * Prefetches critical data immediately
 */
export async function prefetchCritical<T>(
  items: Array<{ key: string; fetcher: () => Promise<T> }>
): Promise<void> {
  await Promise.all(
    items.map(({ key, fetcher }) =>
      prefetchData(key, fetcher, { priority: 'high', background: false })
    )
  );
}
