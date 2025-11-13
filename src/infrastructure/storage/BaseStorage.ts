/**
 * Base Storage Adapter
 * 
 * Provides common interface for different storage mechanisms.
 */

export interface StorageAdapter {
  /**
   * Get item from storage
   */
  getItem<T>(key: string): Promise<T | null>;

  /**
   * Set item in storage
   */
  setItem<T>(key: string, value: T): Promise<void>;

  /**
   * Remove item from storage
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all items from storage
   */
  clear(): Promise<void>;

  /**
   * Get all keys
   */
  keys(): Promise<string[]>;

  /**
   * Check if key exists
   */
  hasItem(key: string): Promise<boolean>;
}

export abstract class BaseStorage implements StorageAdapter {
  protected readonly prefix: string;

  constructor(prefix: string = 'app') {
    this.prefix = prefix;
  }

  /**
   * Get prefixed key
   */
  protected getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Remove prefix from key
   */
  protected removePrefixFromKey(key: string): string {
    return key.replace(`${this.prefix}:`, '');
  }

  /**
   * Serialize value for storage
   */
  protected serialize<T>(value: T): string {
    try {
      return JSON.stringify(value);
    } catch (error) {
      throw new Error(`Failed to serialize value: ${error}`);
    }
  }

  /**
   * Deserialize value from storage
   */
  protected deserialize<T>(value: string): T {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`Failed to deserialize value: ${error}`);
    }
  }

  abstract getItem<T>(key: string): Promise<T | null>;
  abstract setItem<T>(key: string, value: T): Promise<void>;
  abstract removeItem(key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract keys(): Promise<string[]>;
  abstract hasItem(key: string): Promise<boolean>;
}

