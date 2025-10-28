export const STORAGE_KEYS = {
  SERVICES: "servicin:services",
  LOCATIONS: "servicin:locations",
  SCHEDULES: "servicin:schedules",
  CONTRACTS: "servicin:contracts",
  AUTH: "servicin:auth",
  USERS: "servicin:users",
} as const;

export class LocalStorage {
  static get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === "undefined") {
        return defaultValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      const parsed = JSON.parse(item) as T;
      return parsed;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  static remove(key: string): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  static clear(): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  static has(key: string): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

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
    } catch {
      return [];
    }
  }

  static getUserSpecificKey(userId: string, baseKey: string): string {
    const key = `${baseKey}:${userId}`;
    return key;
  }
}
