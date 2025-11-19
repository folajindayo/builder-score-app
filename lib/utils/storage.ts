/**
 * Storage utility functions
 */

export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue ?? null;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  remove(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  clear(): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  },

  has(key: string): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(key) !== null;
  },

  keys(): string[] {
    if (typeof window === "undefined") return [];
    return Object.keys(window.localStorage);
  },

  size(): number {
    if (typeof window === "undefined") return 0;
    return window.localStorage.length;
  },
};

export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue ?? null;

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error(`Error reading from sessionStorage: ${key}`, error);
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to sessionStorage: ${key}`, error);
      return false;
    }
  },

  remove(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from sessionStorage: ${key}`, error);
      return false;
    }
  },

  clear(): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing sessionStorage", error);
      return false;
    }
  },

  has(key: string): boolean {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(key) !== null;
  },
};

