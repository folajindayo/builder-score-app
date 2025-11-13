/**
 * In-Memory Cache Implementation
 */

import { BaseCache, CacheOptions } from './BaseCache';

export class MemoryCache<T> extends BaseCache<T> {
  constructor(options?: CacheOptions) {
    super(options);
    
    // Auto-cleanup expired entries every minute
    setInterval(() => {
      this.cleanExpired();
    }, 60000);
  }

  /**
   * Clear all expired entries (public interface)
   */
  cleanup(): number {
    return this.cleanExpired();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.size(),
      maxSize: this.options.maxSize,
      ttl: this.options.ttl,
      keys: this.keys(),
    };
  }
}

