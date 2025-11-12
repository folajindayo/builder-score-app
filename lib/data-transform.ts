/**
 * Data transformation utilities
 */

/**
 * Maps an array and transforms each item
 */
export function mapTransform<T, U>(
  array: T[],
  transformFn: (item: T, index: number) => U
): U[] {
  return array.map(transformFn);
}

/**
 * Transforms an object's values
 */
export function transformObjectValues<T, U>(
  obj: Record<string, T>,
  transformFn: (value: T, key: string) => U
): Record<string, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, transformFn(value, key)])
  );
}

/**
 * Transforms an object's keys
 */
export function transformObjectKeys<T>(
  obj: Record<string, T>,
  transformFn: (key: string) => string
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [transformFn(key), value])
  );
}

/**
 * Picks specific keys from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Omits specific keys from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

