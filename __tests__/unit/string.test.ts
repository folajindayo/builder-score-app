import {
  truncate,
  capitalize,
  slugify,
  parseJSON,
} from "../../lib/string";

describe("String Utilities", () => {
  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("should not truncate short strings", () => {
      expect(truncate("Hi", 10)).toBe("Hi");
    });

    it("should handle custom suffix", () => {
      expect(truncate("Hello World", 5, "…")).toBe("Hello…");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should handle already capitalized", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("slugify", () => {
    it("should create URL-friendly slugs", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("should handle special characters", () => {
      expect(slugify("Hello & World!")).toBe("hello-world");
    });

    it("should handle multiple spaces", () => {
      expect(slugify("Hello   World")).toBe("hello-world");
    });
  });

  describe("parseJSON", () => {
    it("should parse valid JSON", () => {
      const result = parseJSON('{"key":"value"}');
      expect(result).toEqual({ key: "value" });
    });

    it("should return null for invalid JSON", () => {
      expect(parseJSON("not json")).toBeNull();
    });

    it("should return default value on error", () => {
      expect(parseJSON("invalid", { default: true })).toEqual({ default: true });
    });
  });
});

