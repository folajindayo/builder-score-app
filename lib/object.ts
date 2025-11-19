/**
 * Object utility functions
 * Common object manipulation utilities
 */

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Pick specific keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}

/**
 * Get nested property safely
 */
export function get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }

  return result;
}

/**
 * Set nested property
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let target = obj;

  for (const key of keys) {
    if (!(key in target)) {
      target[key] = {};
    }
    target = target[key];
  }

  target[lastKey] = value;
}

/**
 * Check if value is object
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Check if objects are equal
 */
export function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Get object keys with type safety
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Get object values with type safety
 */
export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

/**
 * Get object entries with type safety
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Filter object by predicate
 */
export function filterObject<T extends object>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of entries(obj)) {
    if (predicate(key, value)) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Map object values
 */
export function mapObject<T extends object, U>(
  obj: T,
  mapper: (key: keyof T, value: T[keyof T]) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;

  for (const [key, value] of entries(obj)) {
    result[key] = mapper(key, value);
  }

  return result;
}

