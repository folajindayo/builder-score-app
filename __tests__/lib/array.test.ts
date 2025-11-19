import {
  unique,
  uniqueBy,
  chunk,
  shuffle,
  groupBy,
  sortBy,
  isEmpty,
  first,
  last,
  sample,
  remove,
  flatten,
  range,
  arraysEqual,
} from "@/lib/array";

describe("Array utilities", () => {
  describe("unique", () => {
    it("removes duplicate values", () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
    });
  });

  describe("uniqueBy", () => {
    it("removes duplicates by key", () => {
      const arr = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 1, name: "Jack" },
      ];

      const result = uniqueBy(arr, "id");
      expect(result.length).toBe(2);
    });
  });

  describe("chunk", () => {
    it("splits array into chunks", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });

  describe("shuffle", () => {
    it("shuffles array elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);

      expect(shuffled.length).toBe(arr.length);
      expect(shuffled).toContain(1);
      expect(shuffled).toContain(5);
    });
  });

  describe("groupBy", () => {
    it("groups items by key", () => {
      const arr = [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
        { type: "vegetable", name: "carrot" },
      ];

      const grouped = groupBy(arr, "type");

      expect(grouped.fruit.length).toBe(2);
      expect(grouped.vegetable.length).toBe(1);
    });
  });

  describe("sortBy", () => {
    it("sorts array by key", () => {
      const arr = [{ age: 30 }, { age: 20 }, { age: 25 }];

      const sorted = sortBy(arr, "age");

      expect(sorted[0].age).toBe(20);
      expect(sorted[2].age).toBe(30);
    });

    it("sorts in descending order", () => {
      const arr = [{ age: 20 }, { age: 30 }, { age: 25 }];

      const sorted = sortBy(arr, "age", "desc");

      expect(sorted[0].age).toBe(30);
      expect(sorted[2].age).toBe(20);
    });
  });

  describe("isEmpty", () => {
    it("checks if array is empty", () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    });
  });

  describe("first and last", () => {
    it("gets first element", () => {
      expect(first([1, 2, 3])).toBe(1);
      expect(first([])).toBeUndefined();
    });

    it("gets last element", () => {
      expect(last([1, 2, 3])).toBe(3);
      expect(last([])).toBeUndefined();
    });
  });

  describe("sample", () => {
    it("gets random element", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);

      expect(arr).toContain(result);
    });
  });

  describe("remove", () => {
    it("removes item from array", () => {
      expect(remove([1, 2, 3, 2], 2)).toEqual([1, 3]);
    });
  });

  describe("flatten", () => {
    it("flattens nested arrays", () => {
      expect(flatten([1, [2, 3], [4, [5]]])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("range", () => {
    it("creates range array", () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
    });
  });

  describe("arraysEqual", () => {
    it("compares arrays for equality", () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(arraysEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });
  });
});

