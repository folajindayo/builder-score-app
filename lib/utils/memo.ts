/**
 * Memoization utilities
 */

export function createMemoCache<T>() {
  const cache = new Map<string, { value: T; timestamp: number }>();

  return {
    get(key: string, ttl?: number): T | undefined {
      const entry = cache.get(key);
      if (!entry) return undefined;

      if (ttl && Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
        return undefined;
      }

      return entry.value;
    },

    set(key: string, value: T): void {
      cache.set(key, { value, timestamp: Date.now() });
    },

    has(key: string): boolean {
      return cache.has(key);
    },

    delete(key: string): boolean {
      return cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },

    size(): number {
      return cache.size;
    },
  };
}

export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 5 * 60 * 1000
): T {
  const cache = createMemoCache<ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key, ttl);

    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttl?: number
): T {
  const cache = createMemoCache<Promise<Awaited<ReturnType<T>>>>();

  return (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key, ttl);

    if (cached !== undefined) {
      return cached;
    }

    const promise = fn(...args);
    cache.set(key, promise);

    try {
      return await promise;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  }) as T;
}

export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

