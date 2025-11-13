/**
 * Assertion helpers for runtime validation
 */

/**
 * Asserts that a condition is true, throws error if false
 */
export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Asserts that a value is not null or undefined
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value is null or undefined');
  }
}

/**
 * Asserts that a value is a string
 */
export function assertString(value: unknown, message?: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(message || 'Value is not a string');
  }
}

/**
 * Asserts that a value is a number
 */
export function assertNumber(value: unknown, message?: string): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(message || 'Value is not a number');
  }
}

/**
 * Asserts that a value is an array
 */
export function assertArray<T>(value: unknown, message?: string): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error(message || 'Value is not an array');
  }
}

/**
 * Asserts that a value is an object
 */
export function assertObject(
  value: unknown,
  message?: string
): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(message || 'Value is not an object');
  }
}

/**
 * Asserts that a value is within a range
 */
export function assertInRange(value: number, min: number, max: number, message?: string): void {
  if (value < min || value > max) {
    throw new Error(message || `Value ${value} is not in range [${min}, ${max}]`);
  }
}

/**
 * Asserts that a value is positive
 */
export function assertPositive(value: number, message?: string): void {
  if (value <= 0) {
    throw new Error(message || 'Value must be positive');
  }
}

/**
 * Asserts that a value is non-negative
 */
export function assertNonNegative(value: number, message?: string): void {
  if (value < 0) {
    throw new Error(message || 'Value must be non-negative');
  }
}
