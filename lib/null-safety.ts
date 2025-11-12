/**
 * Null safety utilities
 */

/**
 * Returns a default value if the value is null or undefined
 */
export function defaultValue<T>(value: T | null | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}

/**
 * Throws an error if value is null or undefined
 */
export function assertNotNull<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value is null or undefined');
  }
}

/**
 * Returns value if not null/undefined, otherwise returns default
 */
export function orDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return value !== null && value !== undefined ? value : defaultValue;
}

/**
 * Maps a value if it's not null/undefined, otherwise returns null
 */
export function mapNullable<T, R>(
  value: T | null | undefined,
  mapper: (value: T) => R
): R | null {
  return value !== null && value !== undefined ? mapper(value) : null;
}

/**
 * Maps a value if it's not null/undefined, otherwise returns default
 */
export function mapNullableOrDefault<T, R>(
  value: T | null | undefined,
  mapper: (value: T) => R,
  defaultValue: R
): R {
  return value !== null && value !== undefined ? mapper(value) : defaultValue;
}

/**
 * Chains nullable operations
 */
export function chainNullable<T, R>(
  value: T | null | undefined,
  mapper: (value: T) => R | null | undefined
): R | null | undefined {
  return value !== null && value !== undefined ? mapper(value) : null;
}

/**
 * Filters out null/undefined values from an array
 */
export function filterNulls<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Checks if all values in an array are not null/undefined
 */
export function allNotNull<T>(array: (T | null | undefined)[]): array is T[] {
  return array.every((item) => item !== null && item !== undefined);
}

/**
 * Checks if any value in an array is not null/undefined
 */
export function anyNotNull<T>(array: (T | null | undefined)[]): boolean {
  return array.some((item) => item !== null && item !== undefined);
}

