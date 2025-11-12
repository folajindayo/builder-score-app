/**
 * Prefetching strategies for data
 */

/**
 * Prefetches data and stores in cache
 */
export async function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>,
  cache: { set: (key: string, data: T, ttl?: number) => void }
): Promise<void> {
  try {
    const data = await fetcher();
    cache.set(key, data);
  } catch (error) {
    console.error(`Failed to prefetch data for key "${key}":`, error);
  }
}

/**
 * Prefetches multiple data items
 */
export async function prefetchMultiple<T>(
  items: Array<{ key: string; fetcher: () => Promise<T> }>,
  cache: { set: (key: string, data: T, ttl?: number) => void }
): Promise<void> {
  await Promise.allSettled(
    items.map(({ key, fetcher }) => prefetchData(key, fetcher, cache))
  );
}

