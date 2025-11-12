/**
 * Data normalization utilities
 */

/**
 * Normalizes an array of objects by a key
 */
export function normalizeByKey<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): Record<string, T> {
  return array.reduce((acc, item) => {
    const keyValue = String(item[key]);
    acc[keyValue] = item;
    return acc;
  }, {} as Record<string, T>);
}

/**
 * Normalizes an array into a map structure
 */
export function normalizeToMap<T>(
  array: T[],
  keyFn: (item: T) => string
): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of array) {
    map.set(keyFn(item), item);
  }
  return map;
}

/**
 * Denormalizes a normalized object back to an array
 */
export function denormalize<T>(normalized: Record<string, T>): T[] {
  return Object.values(normalized);
}

