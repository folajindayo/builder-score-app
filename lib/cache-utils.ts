/**
 * Cache management utilities
 */

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Simple in-memory cache with TTL support
 */
export class Cache<K, V> {
  private cache: Map<K, CacheEntry<V>> = new Map();
  private defaultTTL?: number;

  constructor(defaultTTL?: number) {
    this.defaultTTL = defaultTTL;
  }

  /**
   * Set a value in the cache
   */
  set(key: K, value: V, ttl?: number): void {
    const expiresAt = ttl || this.defaultTTL
      ? Date.now() + (ttl || this.defaultTTL!)
      : undefined;

    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get a value from the cache
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}

