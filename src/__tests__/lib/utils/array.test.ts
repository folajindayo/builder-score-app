import {
  chunk,
  unique,
  uniqueBy,
  shuffle,
  groupBy,
  partition,
  flatten,
  intersection,
  difference,
  union,
  sortBy,
  range,
  compact,
} from "@/lib/utils/array";

describe("Array Utilities", () => {
  describe("chunk", () => {
    it("chunks array into smaller arrays", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe("unique", () => {
    it("returns unique values", () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
    });
  });

  describe("uniqueBy", () => {
    it("returns unique items by key", () => {
      const items = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Charlie" },
      ];
      expect(uniqueBy(items, "id")).toHaveLength(2);
    });
  });

  describe("shuffle", () => {
    it("shuffles array", () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled.sort()).toEqual(arr);
    });
  });

  describe("groupBy", () => {
    it("groups items by key", () => {
      const items = [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
        { type: "vegetable", name: "carrot" },
      ];
      const grouped = groupBy(items, "type");
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });
  });

  describe("partition", () => {
    it("partitions array by predicate", () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });
  });

  describe("flatten", () => {
    it("flattens nested arrays", () => {
      expect(flatten([1, [2, 3], 4, [5]])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("intersection", () => {
    it("finds common elements", () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
  });

  describe("difference", () => {
    it("finds different elements", () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });
  });

  describe("union", () => {
    it("combines unique elements", () => {
      expect(union([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("sortBy", () => {
    it("sorts by key ascending", () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = sortBy(items, "age", "asc");
      expect(sorted[0].age).toBe(20);
    });

    it("sorts by key descending", () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = sortBy(items, "age", "desc");
      expect(sorted[0].age).toBe(30);
    });
  });

  describe("range", () => {
    it("creates range of numbers", () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });
  });

  describe("compact", () => {
    it("removes falsy values", () => {
      expect(compact([0, 1, false, 2, "", 3, null, undefined])).toEqual([1, 2, 3]);
    });
  });
});

