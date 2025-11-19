import {
  isValidEmail,
  isValidUrl,
  isValidEthAddress,
  isValidPhone,
  validatePassword,
  isValidUsername,
  isValidCreditCard,
  isRequired,
  hasValidLength,
  isInRange,
} from "@/lib/validation";

describe("Validation utilities", () => {
  describe("isValidEmail", () => {
    it("validates email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@example.co.uk")).toBe(true);
      expect(isValidEmail("invalid.email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("validates URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
      expect(isValidUrl("not a url")).toBe(false);
    });
  });

  describe("isValidEthAddress", () => {
    it("validates Ethereum addresses", () => {
      expect(isValidEthAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0")).toBe(true);
      expect(isValidEthAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")).toBe(false);
      expect(isValidEthAddress("not an address")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("validates phone numbers", () => {
      expect(isValidPhone("1234567890")).toBe(true);
      expect(isValidPhone("+1 (555) 123-4567")).toBe(true);
      expect(isValidPhone("123")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("validates strong passwords", () => {
      const result = validatePassword("Password123!");
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("rejects weak passwords", () => {
      const result = validatePassword("weak");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("isValidUsername", () => {
    it("validates usernames", () => {
      expect(isValidUsername("user123")).toBe(true);
      expect(isValidUsername("valid_user")).toBe(true);
      expect(isValidUsername("ab")).toBe(false);
      expect(isValidUsername("user@name")).toBe(false);
    });
  });

  describe("isValidCreditCard", () => {
    it("validates credit card numbers using Luhn", () => {
      expect(isValidCreditCard("4532015112830366")).toBe(true);
      expect(isValidCreditCard("1234567890123456")).toBe(false);
    });
  });

  describe("isRequired", () => {
    it("checks if field is filled", () => {
      expect(isRequired("value")).toBe(true);
      expect(isRequired("   ")).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe("hasValidLength", () => {
    it("validates string length", () => {
      expect(hasValidLength("test", 2, 10)).toBe(true);
      expect(hasValidLength("a", 2, 10)).toBe(false);
      expect(hasValidLength("verylongtext", 2, 5)).toBe(false);
    });
  });

  describe("isInRange", () => {
    it("validates numeric range", () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(15, 1, 10)).toBe(false);
    });
  });
});

