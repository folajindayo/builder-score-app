/**
 * Data transformation utility functions
 */

/**
 * Safely parses JSON with error handling
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJSONParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Normalizes data by removing null/undefined values
 * @param obj - The object to normalize
 * @returns Normalized object
 */
export function normalizeData<T extends Record<string, any>>(obj: T): Partial<T> {
  const normalized: any = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      normalized[key] = obj[key];
    }
  }
  return normalized;
}

/**
 * Flattens a nested object into a single level
 * @param obj - The object to flatten
 * @param prefix - Optional prefix for keys
 * @returns Flattened object
 */
export function flattenObject(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else {
      flattened[newKey] = obj[key];
    }
  }
  
  return flattened;
}

/**
 * Safely accesses nested properties in an object
 * @param obj - The object to access
 * @param path - Dot-separated path to the property
 * @param defaultValue - Default value if path doesn't exist
 * @returns The value at the path or default value
 */
export function getNestedValue<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current?.[key] === undefined) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current as T;
}

/**
 * Maps data from one structure to another
 * @param data - The data to map
 * @param mapping - Mapping configuration
 * @returns Mapped data
 */
export function mapData<T extends Record<string, any>, R extends Record<string, any>>(
  data: T,
  mapping: Record<keyof R, keyof T | ((data: T) => any)>
): R {
  const result: any = {};
  
  for (const targetKey in mapping) {
    const sourceKey = mapping[targetKey];
    if (typeof sourceKey === 'function') {
      result[targetKey] = sourceKey(data);
    } else {
      result[targetKey] = data[sourceKey as keyof T];
    }
  }
  
  return result as R;
}

