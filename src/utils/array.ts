/**
 * Array manipulation utilities for Builder Score App
 */

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove duplicates based on a key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array randomly
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0;
  });
}

/**
 * Find intersection of multiple arrays
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, arr) => acc.filter((item) => arr.includes(item)));
}

/**
 * Find difference between two arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item));
}

/**
 * Find union of multiple arrays
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/**
 * Partition array based on predicate
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  
  array.forEach((item) => {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });
  
  return [pass, fail];
}

/**
 * Get random items from array
 */
export function sample<T>(array: T[], count = 1): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Sum array values
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate average of array values
 */
export function average(array: number[]): number {
  return array.length === 0 ? 0 : sum(array) / array.length;
}

/**
 * Get min value from array
 */
export function min(array: number[]): number {
  return Math.min(...array);
}

/**
 * Get max value from array
 */
export function max(array: number[]): number {
  return Math.max(...array);
}

/**
 * Count occurrences in array
 */
export function countBy<T>(array: T[], key: keyof T): Record<string, number> {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      result[group] = (result[group] || 0) + 1;
      return result;
    },
    {} as Record<string, number>
  );
}

/**
 * Flatten nested array
 */
export function flatten<T>(array: any[]): T[] {
  return array.flat(Infinity) as T[];
}

/**
 * Remove falsy values from array
 */
export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}

/**
 * Get first n items
 */
export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, Math.max(0, count));
}

/**
 * Get last n items
 */
export function takeLast<T>(array: T[], count: number): T[] {
  return array.slice(Math.max(0, array.length - count));
}

/**
 * Rotate array
 */
export function rotate<T>(array: T[], positions: number): T[] {
  const len = array.length;
  const offset = ((positions % len) + len) % len;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

