import {
  deepClone,
  deepMerge,
  pick,
  omit,
  get,
  set,
  isObject,
  isEqual,
  filterObject,
  mapObject,
} from "@/lib/object";

describe("Object utilities", () => {
  describe("deepClone", () => {
    it("deep clones objects", () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);

      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });
  });

  describe("deepMerge", () => {
    it("merges objects deeply", () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };

      const result = deepMerge(target, source);

      expect(result.b.c).toBe(2);
      expect(result.b.d).toBe(3);
      expect(result.e).toBe(4);
    });
  });

  describe("pick", () => {
    it("picks specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ["a", "c"]);

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe("omit", () => {
    it("omits specified keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ["b"]);

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe("get", () => {
    it("gets nested property", () => {
      const obj = { a: { b: { c: 42 } } };

      expect(get(obj, "a.b.c")).toBe(42);
      expect(get(obj, "a.b.d", "default")).toBe("default");
    });
  });

  describe("set", () => {
    it("sets nested property", () => {
      const obj: any = {};
      set(obj, "a.b.c", 42);

      expect(obj.a.b.c).toBe(42);
    });
  });

  describe("isObject", () => {
    it("checks if value is object", () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject("string")).toBe(false);
    });
  });

  describe("isEqual", () => {
    it("checks object equality", () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });
  });

  describe("filterObject", () => {
    it("filters object by predicate", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterObject(obj, (key, value) => value > 1);

      expect(result).toEqual({ b: 2, c: 3 });
    });
  });

  describe("mapObject", () => {
    it("maps object values", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapObject(obj, (key, value) => value * 2);

      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });
  });
});

