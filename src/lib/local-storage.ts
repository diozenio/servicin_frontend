/**
 * Type-safe localStorage utility with error handling and fallback mechanisms
 */

// Storage keys constants
export const STORAGE_KEYS = {
  SERVICES: "servicin:services",
  LOCATIONS: "servicin:locations",
  SCHEDULES: "servicin:schedules",
  CONTRACTS: "servicin:contracts",
} as const;

/**
 * Generic localStorage operations with type safety
 */
export class LocalStorage {
  /**
   * Get data from localStorage with type safety
   */
  static get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === "undefined") {
        return defaultValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set data to localStorage with error handling
   */
  static set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key: string): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage data
   */
  static clear(): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  static has(key: string): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get all keys that start with a prefix
   */
  static getKeysWithPrefix(prefix: string): string[] {
    try {
      if (typeof window === "undefined") {
        return [];
      }

      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error(`Error getting keys with prefix "${prefix}":`, error);
      return [];
    }
  }
}
