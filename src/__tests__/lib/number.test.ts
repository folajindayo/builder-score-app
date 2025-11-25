import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  abbreviateNumber,
  clamp,
  roundTo,
  randomInt,
  isEven,
  isOdd,
  calculatePercentage,
  calculatePercentageChange,
  sum,
  average,
  median,
} from "@/lib/number";

describe("Number utilities", () => {
  describe("formatNumber", () => {
    it("formats numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
    });
  });

  describe("formatCurrency", () => {
    it("formats numbers as currency", () => {
      expect(formatCurrency(100)).toBe("$100.00");
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });
  });

  describe("formatPercentage", () => {
    it("formats numbers as percentage", () => {
      expect(formatPercentage(50)).toBe("50.00%");
      expect(formatPercentage(33.333)).toBe("33.33%");
      expect(formatPercentage(100, 0)).toBe("100%");
    });
  });

  describe("abbreviateNumber", () => {
    it("abbreviates large numbers", () => {
      expect(abbreviateNumber(500)).toBe("500");
      expect(abbreviateNumber(1500)).toBe("1.5K");
      expect(abbreviateNumber(1500000)).toBe("1.5M");
      expect(abbreviateNumber(1500000000)).toBe("1.5B");
    });
  });

  describe("clamp", () => {
    it("clamps number between min and max", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("roundTo", () => {
    it("rounds to specified decimal places", () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(2.5, 0)).toBe(3);
    });
  });

  describe("randomInt", () => {
    it("generates random integer in range", () => {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe("isEven", () => {
    it("checks if number is even", () => {
      expect(isEven(4)).toBe(true);
      expect(isEven(5)).toBe(false);
      expect(isEven(0)).toBe(true);
    });
  });

  describe("isOdd", () => {
    it("checks if number is odd", () => {
      expect(isOdd(3)).toBe(true);
      expect(isOdd(4)).toBe(false);
    });
  });

  describe("calculatePercentage", () => {
    it("calculates percentage of value from total", () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 4)).toBe(25);
      expect(calculatePercentage(5, 0)).toBe(0);
    });
  });

  describe("calculatePercentageChange", () => {
    it("calculates percentage change", () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
      expect(calculatePercentageChange(100, 50)).toBe(-50);
      expect(calculatePercentageChange(0, 100)).toBe(100);
    });
  });

  describe("sum", () => {
    it("calculates sum of numbers", () => {
      expect(sum([1, 2, 3, 4])).toBe(10);
      expect(sum([])).toBe(0);
    });
  });

  describe("average", () => {
    it("calculates average of numbers", () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([])).toBe(0);
    });
  });

  describe("median", () => {
    it("finds median of odd-length array", () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
    });

    it("finds median of even-length array", () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it("handles empty array", () => {
      expect(median([])).toBe(0);
    });
  });
});

