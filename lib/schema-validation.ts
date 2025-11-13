/**
 * Schema validation utilities
 */

type Validator<T> = (value: unknown) => value is T;

/**
 * Validates a value against a schema
 */
export function validateSchema<T>(
  value: unknown,
  validators: Record<keyof T, Validator<unknown>>
): value is T {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  for (const key in validators) {
    const validator = validators[key];
    if (!validator(obj[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a string validator
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Creates a number validator
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Creates a boolean validator
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Creates an array validator
 */
export function isArray<T>(
  value: unknown,
  itemValidator?: (item: unknown) => item is T
): value is T[] {
  if (!Array.isArray(value)) return false;
  if (itemValidator) {
    return value.every(itemValidator);
  }
  return true;
}
