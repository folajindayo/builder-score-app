/**
 * Validation utilities for form inputs and data
 */

/**
 * Validates if a string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates if a number is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates if a string matches a pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Validates if a string has minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Validates if a string has maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Validates if a value is a positive number
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Validates if a value is a non-negative number
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Validates if a string is a valid URL
 */
export function isValidURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid email address
 */
export function isValidEmailAddress(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validates if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Validates if a value is a valid integer
 */
export function isValidInteger(value: unknown): value is number {
  return isValidNumber(value) && Number.isInteger(value);
}

