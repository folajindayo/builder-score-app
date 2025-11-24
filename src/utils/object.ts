/**
 * Object manipulation utilities for Builder Score App
 */

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  
  const clonedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const result: any = {};

  for (const obj of objects) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = deepMerge(result[key] || {}, value);
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result;
}

/**
 * Pick specified keys from object
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: any = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specified keys from object
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result: any = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Get nested property value safely
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) return defaultValue as T;
    result = result[key];
  }

  return result === undefined ? (defaultValue as T) : result;
}

/**
 * Set nested property value safely
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * Flatten nested object
 */
export function flatten(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flatten(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}

/**
 * Unflatten object
 */
export function unflatten(obj: Record<string, any>): any {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      set(result, key, obj[key]);
    }
  }

  return result;
}

/**
 * Map object values
 */
export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key], key as keyof T);
    }
  }

  return result;
}

/**
 * Map object keys
 */
export function mapKeys<T extends object>(
  obj: T,
  fn: (key: keyof T) => string
): Record<string, T[keyof T]> {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[fn(key as keyof T)] = obj[key];
    }
  }

  return result;
}

/**
 * Filter object by predicate
 */
export function filterObject<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (predicate(obj[key], key as keyof T)) {
        result[key] = obj[key];
      }
    }
  }

  return result;
}

/**
 * Invert object keys and values
 */
export function invert(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key;
    }
  }

  return result;
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
 * Check if object has property
 */
export function has(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Freeze object deeply
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return obj;
}

/**
 * Check deep equality of two objects
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Remove undefined/null values from object
 */
export function compact<T extends object>(obj: T): Partial<T> {
  return filterObject(obj, (value) => value != null);
}

/**
 * Defaults: merge with default values
 */
export function defaults<T extends object>(obj: Partial<T>, defaultValues: T): T {
  return { ...defaultValues, ...obj };
}

