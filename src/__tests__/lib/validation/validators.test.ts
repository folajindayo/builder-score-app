import {
  validateOrThrow,
  validateSafe,
  validateAsync,
  formatZodError,
  getFirstErrorMessage,
  ValidationError,
} from "@/lib/validation/validators";
import { z, ZodError } from "zod";

describe("Validators", () => {
  const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(18),
  });

  describe("validateOrThrow", () => {
    it("returns validated data for correct input", () => {
      const data = {
        name: "John",
        email: "john@example.com",
        age: 25,
      };

      const result = validateOrThrow(userSchema, data);
      expect(result).toEqual(data);
    });

    it("throws ValidationError for invalid data", () => {
      const data = {
        name: "J",
        email: "invalid",
        age: 15,
      };

      expect(() => validateOrThrow(userSchema, data)).toThrow(ValidationError);
    });

    it("includes error details in ValidationError", () => {
      const data = {
        name: "J",
        email: "invalid",
        age: 15,
      };

      try {
        validateOrThrow(userSchema, data);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        if (error instanceof ValidationError) {
          expect(error.errors).toBeDefined();
          expect(Object.keys(error.errors)).toContain("name");
          expect(Object.keys(error.errors)).toContain("email");
        }
      }
    });
  });

  describe("validateSafe", () => {
    it("returns success result for valid data", () => {
      const data = {
        name: "John",
        email: "john@example.com",
        age: 25,
      };

      const result = validateSafe(userSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it("returns error result for invalid data", () => {
      const data = {
        name: "J",
        email: "invalid",
        age: 15,
      };

      const result = validateSafe(userSchema, data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError);
      }
    });
  });

  describe("validateAsync", () => {
    it("validates correct data asynchronously", async () => {
      const data = {
        name: "John",
        email: "john@example.com",
        age: 25,
      };

      const result = await validateAsync(userSchema, data);
      expect(result).toEqual(data);
    });

    it("throws ValidationError for invalid data", async () => {
      const data = {
        name: "J",
        email: "invalid",
        age: 15,
      };

      await expect(validateAsync(userSchema, data)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("formatZodError", () => {
    it("formats Zod errors into readable structure", () => {
      const data = {
        name: "J",
        email: "invalid",
      };

      try {
        userSchema.parse(data);
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toBeDefined();
          expect(typeof formatted).toBe("object");
          expect(Object.keys(formatted).length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("getFirstErrorMessage", () => {
    it("returns first error message from ZodError", () => {
      const data = {
        name: "J",
        email: "invalid",
      };

      try {
        userSchema.parse(data);
      } catch (error) {
        if (error instanceof ZodError) {
          const message = getFirstErrorMessage(error);
          expect(message).toBeTruthy();
          expect(typeof message).toBe("string");
        }
      }
    });
  });
});

