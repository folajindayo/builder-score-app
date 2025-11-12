/**
 * LocalStorage wrapper with type safety and error handling
 */

/**
 * Get an item from localStorage
 * @param key - The storage key
 * @returns The parsed value or null if not found
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Set an item in localStorage
 * @param key - The storage key
 * @param value - The value to store
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Remove an item from localStorage
 * @param key - The storage key
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

