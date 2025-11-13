/**
 * API request deduplication and caching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

class APICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private ttl: number;

  constructor(ttl: number = 60000) {
    this.ttl = ttl;
  }

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const entry = this.cache.get(key);

    if (entry) {
      // If there's an in-flight request, return its promise
      if (entry.promise) {
        return entry.promise as Promise<T>;
      }

      // If cache is still valid, return cached data
      if (Date.now() - entry.timestamp < this.ttl) {
        return entry.data as T;
      }
    }

    // Create new request
    const promise = fetcher();

    // Store promise to deduplicate concurrent requests
    this.cache.set(key, {
      data: null as unknown,
      timestamp: Date.now(),
      promise: promise as Promise<unknown>,
    });

    try {
      const data = await promise;
      // Update cache with actual data
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
      return data;
    } catch (error) {
      // Remove failed request from cache
      this.cache.delete(key);
      throw error;
    }
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new APICache();

/**
 * Response cache with TTL
 */
export class ResponseCache {
  private cache: Map<string, { data: unknown; expiresAt: number }> = new Map();

  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const responseCache = new ResponseCache();

/**
 * Request deduplication map
 */
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Deduplicates concurrent requests with the same key
 */
export async function deduplicateRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // If there's already a pending request, return its promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  // Create new request
  const promise = fetcher().finally(() => {
    // Remove from pending requests when done
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
