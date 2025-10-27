/**
 * Type-safe localStorage utility with error handling and fallback mechanisms
 */

// Storage keys constants
export const STORAGE_KEYS = {
  SERVICES: "servicin:services",
  LOCATIONS: "servicin:locations",
  SCHEDULES: "servicin:schedules",
  CONTRACTS: "servicin:contracts",
  AUTH: "servicin:auth",
  USERS: "servicin:users",
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
        console.log(
          "LocalStorage: Window is undefined, returning default value"
        );
        return defaultValue;
      }

      console.log("LocalStorage: Getting key", key);
      const item = window.localStorage.getItem(key);
      if (item === null) {
        console.log("LocalStorage: Key not found, returning default value");
        return defaultValue;
      }

      const parsed = JSON.parse(item) as T;
      console.log("LocalStorage: Retrieved value", parsed);
      return parsed;
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
        console.log("LocalStorage: Window is undefined, cannot save");
        return false;
      }

      console.log("LocalStorage: Setting key", key, "with value", value);
      window.localStorage.setItem(key, JSON.stringify(value));
      console.log("LocalStorage: Successfully saved to localStorage");
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

  /**
   * Generate user-specific storage key
   */
  static getUserSpecificKey(userId: string, baseKey: string): string {
    const key = `${baseKey}:${userId}`;
    console.log(
      "LocalStorage: Generated user-specific key",
      key,
      "for userId",
      userId,
      "baseKey",
      baseKey
    );
    return key;
  }
}
