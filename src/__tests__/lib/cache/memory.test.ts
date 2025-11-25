import { MemoryCache, withCache, withCacheAsync } from "@/lib/cache/memory";

describe("MemoryCache", () => {
  let cache: MemoryCache<any>;

  beforeEach(() => {
    cache = new MemoryCache(1000, 10); // 1 second TTL, max 10 items
  });

  afterEach(() => {
    cache.clear();
  });

  describe("set and get", () => {
    it("stores and retrieves values", () => {
      cache.set("key", "value");
      expect(cache.get("key")).toBe("value");
    });

    it("returns null for non-existent keys", () => {
      expect(cache.get("nonexistent")).toBeNull();
    });

    it("overwrites existing values", () => {
      cache.set("key", "value1");
      cache.set("key", "value2");
      expect(cache.get("key")).toBe("value2");
    });
  });

  describe("TTL expiration", () => {
    it("expires entries after TTL", async () => {
      cache.set("key", "value", 50);
      expect(cache.get("key")).toBe("value");

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(cache.get("key")).toBeNull();
    });

    it("uses default TTL when not specified", async () => {
      const shortCache = new MemoryCache(50, 10);
      shortCache.set("key", "value");
      expect(shortCache.get("key")).toBe("value");

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(shortCache.get("key")).toBeNull();
    });
  });

  describe("LRU eviction", () => {
    it("evicts least recently used when at capacity", () => {
      // Fill cache to capacity
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`);
      }

      // Add one more (should evict key0 as it's least recently accessed)
      cache.set("key10", "value10");

      expect(cache.get("key0")).toBeNull();
      expect(cache.get("key10")).toBe("value10");
    });

    it("updates access time on get", () => {
      // Fill cache
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`);
      }

      // Access key0 to update its access time
      cache.get("key0");

      // Add one more (should not evict key0 now)
      cache.set("key10", "value10");

      expect(cache.get("key0")).toBe("value0");
    });
  });

  describe("has", () => {
    it("returns true for existing keys", () => {
      cache.set("key", "value");
      expect(cache.has("key")).toBe(true);
    });

    it("returns false for non-existent keys", () => {
      expect(cache.has("nonexistent")).toBe(false);
    });

    it("returns false for expired keys", async () => {
      cache.set("key", "value", 50);
      expect(cache.has("key")).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(cache.has("key")).toBe(false);
    });
  });

  describe("delete", () => {
    it("removes entries", () => {
      cache.set("key", "value");
      cache.delete("key");
      expect(cache.get("key")).toBeNull();
    });

    it("returns true when entry existed", () => {
      cache.set("key", "value");
      expect(cache.delete("key")).toBe(true);
    });

    it("returns false when entry didn't exist", () => {
      expect(cache.delete("nonexistent")).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all entries", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      cache.clear();
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
    });
  });

  describe("size and keys", () => {
    it("returns correct size", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      expect(cache.size()).toBe(2);
    });

    it("returns all keys", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      const keys = cache.keys();
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
    });
  });
});

