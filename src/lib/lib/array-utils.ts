/**
 * Array operation utility functions
 */

/**
 * Paginates an array
 * @param array - The array to paginate
 * @param page - Page number (1-indexed)
 * @param pageSize - Items per page
 * @returns Paginated array slice
 */
export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}

/**
 * Finds the intersection of two arrays
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of common elements
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}

/**
 * Finds the union of two arrays (unique elements from both)
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of unique elements from both arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return Array.from(new Set([...array1, ...array2]));
}

/**
 * Rotates an array by n positions
 * @param array - The array to rotate
 * @param positions - Number of positions to rotate (positive for right, negative for left)
 * @returns Rotated array
 */
export function rotateArray<T>(array: T[], positions: number): T[] {
  if (array.length === 0) return array;
  const n = positions % array.length;
  if (n === 0) return [...array];
  if (n > 0) {
    return [...array.slice(-n), ...array.slice(0, -n)];
  } else {
    return [...array.slice(-n), ...array.slice(0, -n)];
  }
}

/**
 * Processes array in batches with a callback
 * @param array - The array to process
 * @param batchSize - Size of each batch
 * @param callback - Function to call for each batch
 */
export async function batchProcess<T>(
  array: T[],
  batchSize: number,
  callback: (batch: T[], batchIndex: number) => Promise<void>
): Promise<void> {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    await callback(batch, Math.floor(i / batchSize));
  }
}
