import {
  formatDate,
  formatDateTime,
  getRelativeTime,
  isToday,
  isYesterday,
  addDays,
  daysBetween,
  parseDate,
} from "@/lib/date";

describe("Date utilities", () => {
  describe("formatDate", () => {
    it("formats date in different styles", () => {
      const date = new Date("2023-06-15");

      expect(formatDate(date, "short")).toContain("Jun");
      expect(formatDate(date, "long")).toContain("June");
      expect(formatDate(date, "full")).toContain("2023");
    });
  });

  describe("formatDateTime", () => {
    it("formats date with time", () => {
      const date = new Date("2023-06-15T14:30:00");
      const result = formatDateTime(date);

      expect(result).toContain("Jun");
      expect(result).toContain("2023");
    });
  });

  describe("getRelativeTime", () => {
    it("returns just now for recent dates", () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe("just now");
    });

    it("returns minutes ago", () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      expect(getRelativeTime(date)).toContain("minute");
    });

    it("returns hours ago", () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toContain("hour");
    });

    it("returns days ago", () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toContain("day");
    });
  });

  describe("isToday", () => {
    it("identifies today correctly", () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe("isYesterday", () => {
    it("identifies yesterday correctly", () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isYesterday(yesterday)).toBe(true);

      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });
  });

  describe("addDays", () => {
    it("adds days to date", () => {
      const date = new Date("2023-06-15");
      const result = addDays(date, 5);

      expect(result.getDate()).toBe(20);
    });

    it("handles negative days", () => {
      const date = new Date("2023-06-15");
      const result = addDays(date, -5);

      expect(result.getDate()).toBe(10);
    });
  });

  describe("daysBetween", () => {
    it("calculates days between dates", () => {
      const date1 = new Date("2023-06-15");
      const date2 = new Date("2023-06-20");

      expect(daysBetween(date1, date2)).toBe(5);
    });
  });

  describe("parseDate", () => {
    it("parses valid date strings", () => {
      const result = parseDate("2023-06-15");

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
    });

    it("returns null for invalid dates", () => {
      expect(parseDate("invalid")).toBeNull();
    });
  });
});

