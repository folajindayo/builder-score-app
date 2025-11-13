/**
 * LocalStorage Adapter Implementation
 */

import { BaseStorage } from './BaseStorage';

export class LocalStorageAdapter extends BaseStorage {
  async getItem<T>(key: string): Promise<T | null> {
    const prefixedKey = this.getPrefixedKey(key);
    const value = localStorage.getItem(prefixedKey);
    return value ? this.deserialize<T>(value) : null;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key);
    localStorage.setItem(prefixedKey, this.serialize(value));
  }

  async removeItem(key: string): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key);
    localStorage.removeItem(prefixedKey);
  }

  async clear(): Promise<void> {
    const keys = await this.keys();
    keys.forEach((key) => localStorage.removeItem(this.getPrefixedKey(key)));
  }

  async keys(): Promise<string[]> {
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        allKeys.push(this.removePrefixFromKey(key));
      }
    }
    return allKeys;
  }

  async hasItem(key: string): Promise<boolean> {
    const prefixedKey = this.getPrefixedKey(key);
    return localStorage.getItem(prefixedKey) !== null;
  }
}

