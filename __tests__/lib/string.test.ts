import {
  capitalize,
  titleCase,
  truncate,
  slugify,
  getInitials,
  maskString,
  isValidEmail,
  isValidUrl,
  wordCount,
  pluralize,
} from "@/lib/string";

describe("String utilities", () => {
  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("titleCase", () => {
    it("converts to title case", () => {
      expect(titleCase("hello world")).toBe("Hello World");
      expect(titleCase("the quick brown fox")).toBe("The Quick Brown Fox");
    });
  });

  describe("truncate", () => {
    it("truncates long strings", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
      expect(truncate("Test", 10)).toBe("Test");
    });
  });

  describe("slugify", () => {
    it("converts to URL-friendly slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Test & Example!")).toBe("test-example");
    });
  });

  describe("getInitials", () => {
    it("extracts initials from name", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("Alice Bob Carol")).toBe("AB");
      expect(getInitials("Single")).toBe("S");
    });

    it("respects maxLength parameter", () => {
      expect(getInitials("Alice Bob Carol", 3)).toBe("ABC");
    });
  });

  describe("maskString", () => {
    it("masks middle of string", () => {
      expect(maskString("1234567890")).toBe("1234***7890");
      expect(maskString("test@example.com", 3)).toBe("tes*******com");
    });

    it("returns short strings unchanged", () => {
      expect(maskString("test", 4)).toBe("test");
    });
  });

  describe("isValidEmail", () => {
    it("validates email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("invalid.email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("validates URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://test.org")).toBe(true);
      expect(isValidUrl("not a url")).toBe(false);
    });
  });

  describe("wordCount", () => {
    it("counts words in string", () => {
      expect(wordCount("Hello World")).toBe(2);
      expect(wordCount("One two three four")).toBe(4);
      expect(wordCount("")).toBe(0);
    });
  });

  describe("pluralize", () => {
    it("pluralizes words based on count", () => {
      expect(pluralize("apple", 1)).toBe("apple");
      expect(pluralize("apple", 2)).toBe("apples");
      expect(pluralize("apple", 0)).toBe("apples");
    });

    it("uses custom plural form", () => {
      expect(pluralize("person", 2, "people")).toBe("people");
      expect(pluralize("person", 1, "people")).toBe("person");
    });
  });
});

