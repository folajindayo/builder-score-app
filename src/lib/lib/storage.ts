/**
 * Storage Utilities
 * Unified interface for localStorage and sessionStorage
 */

type StorageType = "local" | "session";

class StorageManager {
  private getStorage(type: StorageType): Storage {
    return type === "local" ? localStorage : sessionStorage;
  }

  /**
   * Set item in storage
   */
  set(key: string, value: any, type: StorageType = "local"): void {
    try {
      const storage = this.getStorage(type);
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error);
    }
  }

  /**
   * Get item from storage
   */
  get<T>(key: string, type: StorageType = "local"): T | null {
    try {
      const storage = this.getStorage(type);
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting storage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string, type: StorageType = "local"): void {
    try {
      const storage = this.getStorage(type);
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  }

  /**
   * Clear all items from storage
   */
  clear(type: StorageType = "local"): void {
    try {
      const storage = this.getStorage(type);
      storage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  /**
   * Check if key exists
   */
  has(key: string, type: StorageType = "local"): boolean {
    return this.get(key, type) !== null;
  }

  /**
   * Get all keys
   */
  keys(type: StorageType = "local"): string[] {
    try {
      const storage = this.getStorage(type);
      return Object.keys(storage);
    } catch (error) {
      console.error("Error getting storage keys:", error);
      return [];
    }
  }
}

export const storage = new StorageManager();
export { StorageManager };
