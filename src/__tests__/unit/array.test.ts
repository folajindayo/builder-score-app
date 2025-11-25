import {
  chunk,
  unique,
  groupBy,
  sortBy,
  shuffle,
} from "../../lib/array";

describe("Array Utilities", () => {
  describe("chunk", () => {
    it("should split array into chunks", () => {
      const result = chunk([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("should handle empty array", () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it("should handle chunk size larger than array", () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe("unique", () => {
    it("should remove duplicates", () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it("should handle strings", () => {
      expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
    });

    it("should handle empty array", () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe("groupBy", () => {
    it("should group by key", () => {
      const items = [
        { type: "a", value: 1 },
        { type: "b", value: 2 },
        { type: "a", value: 3 },
      ];
      
      const result = groupBy(items, "type");
      expect(result.a).toHaveLength(2);
      expect(result.b).toHaveLength(1);
    });
  });

  describe("sortBy", () => {
    it("should sort by key", () => {
      const items = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
      ];
      
      const result = sortBy(items, "name");
      expect(result[0].name).toBe("Alice");
      expect(result[2].name).toBe("Charlie");
    });
  });

  describe("shuffle", () => {
    it("should maintain array length", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toHaveLength(5);
    });

    it("should contain same elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });
});

