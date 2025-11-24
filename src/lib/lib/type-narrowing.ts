/**
 * Type narrowing utilities
 */

/**
 * Narrow type to non-nullable
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Narrow type to string
 */
export function narrowToString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Narrow type to number
 */
export function narrowToNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Narrow type to boolean
 */
export function narrowToBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Narrow type to array
 */
export function narrowToArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Narrow type to object
 */
export function narrowToObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Narrow type to specific object shape
 */
export function narrowToShape<T extends Record<string, unknown>>(
  value: unknown,
  keys: (keyof T)[]
): value is T {
  if (!narrowToObject(value)) return false;
  return keys.every((key) => key in value);
}

/**
 * Narrow type to literal value
 */
export function narrowToLiteral<T extends string | number>(value: unknown, literal: T): value is T {
  return value === literal;
}

/**
 * Narrow type to one of literal values
 */
export function narrowToUnion<T extends string | number>(
  value: unknown,
  literals: readonly T[]
): value is T {
  return literals.includes(value as T);
}

/**
 * Narrow type to instance of class
 */
export function narrowToInstance<T>(
  value: unknown,
  constructor: new (...args: any[]) => T
): value is T {
  return value instanceof constructor;
}
