import { Cache } from "@/lib/cache";

describe("Cache", () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache<string>(1000); // 1 second TTL for tests
  });

  describe("set and get", () => {
    it("stores and retrieves values", () => {
      cache.set("key1", "value1");

      expect(cache.get("key1")).toBe("value1");
    });

    it("returns null for non-existent keys", () => {
      expect(cache.get("nonexistent")).toBeNull();
    });

    it("expires values after TTL", async () => {
      cache.set("key1", "value1", 100); // 100ms TTL

      expect(cache.get("key1")).toBe("value1");

      // Wait for expiry
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(cache.get("key1")).toBeNull();
    });
  });

  describe("has", () => {
    it("checks if key exists", () => {
      cache.set("key1", "value1");

      expect(cache.has("key1")).toBe(true);
      expect(cache.has("key2")).toBe(false);
    });
  });

  describe("delete", () => {
    it("removes entries", () => {
      cache.set("key1", "value1");
      expect(cache.has("key1")).toBe(true);

      cache.delete("key1");
      expect(cache.has("key1")).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all entries", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");

      cache.clear();

      expect(cache.size()).toBe(0);
    });
  });

  describe("getOrSet", () => {
    it("returns existing value", async () => {
      cache.set("key1", "cached");

      const value = await cache.getOrSet("key1", async () => "factory");

      expect(value).toBe("cached");
    });

    it("calls factory for missing value", async () => {
      const factory = jest.fn().mockResolvedValue("new-value");

      const value = await cache.getOrSet("key1", factory);

      expect(value).toBe("new-value");
      expect(factory).toHaveBeenCalled();
      expect(cache.get("key1")).toBe("new-value");
    });
  });
});

