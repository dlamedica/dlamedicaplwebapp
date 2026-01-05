/**
 * Storage manager utility
 * Senior specialist implementation
 * 
 * Unified interface for localStorage and sessionStorage with error handling
 */

import { log } from './logger';

type StorageType = 'local' | 'session';

class StorageManager {
  private storage: Storage;

  constructor(type: StorageType = 'local') {
    if (typeof window === 'undefined') {
      throw new Error('StorageManager can only be used in browser environment');
    }

    this.storage = type === 'local' ? localStorage : sessionStorage;
  }

  /**
   * Get item from storage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      log.error(`Failed to get item from storage: ${key}`, error as Error);
      return defaultValue ?? null;
    }
  }

  /**
   * Set item in storage
   */
  set<T>(key: string, value: T): boolean {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      log.error(`Failed to set item in storage: ${key}`, error as Error);
      
      // Try to handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        log.warn('Storage quota exceeded, attempting cleanup');
        this.cleanup();
        // Try again
        try {
          this.storage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          log.error('Failed to set item after cleanup', retryError as Error);
          return false;
        }
      }
      
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): boolean {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      log.error(`Failed to remove item from storage: ${key}`, error as Error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  clear(): boolean {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      log.error('Failed to clear storage', error as Error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get storage size (approximate)
   */
  getSize(): number {
    let size = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        const value = this.storage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    return size;
  }

  /**
   * Cleanup old items (removes items older than specified days)
   */
  cleanup(maxAgeDays: number = 30): void {
    const now = Date.now();
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;

    const keys = this.keys();
    let cleaned = 0;

    keys.forEach((key) => {
      try {
        const item = this.storage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          // Check if item has timestamp
          if (parsed && typeof parsed === 'object' && 'timestamp' in parsed) {
            const age = now - new Date(parsed.timestamp).getTime();
            if (age > maxAge) {
              this.storage.removeItem(key);
              cleaned++;
            }
          }
        }
      } catch {
        // Ignore parse errors
      }
    });

    if (cleaned > 0) {
      log.info(`Cleaned up ${cleaned} old items from storage`);
    }
  }

  /**
   * Get storage quota (if available)
   */
  async getQuota(): Promise<{ usage: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
        };
      } catch (error) {
        log.error('Failed to get storage quota', error as Error);
      }
    }
    return null;
  }
}

// Singleton instances
export const localStorage = new StorageManager('local');
export const sessionStorage = new StorageManager('session');

// Export convenience functions
export const storage = {
  local: {
    get: <T,>(key: string, defaultValue?: T) => localStorage.get<T>(key, defaultValue),
    set: <T,>(key: string, value: T) => localStorage.set(key, value),
    remove: (key: string) => localStorage.remove(key),
    clear: () => localStorage.clear(),
    has: (key: string) => localStorage.has(key),
    keys: () => localStorage.keys(),
    getSize: () => localStorage.getSize(),
    cleanup: (maxAgeDays?: number) => localStorage.cleanup(maxAgeDays),
    getQuota: () => localStorage.getQuota(),
  },
  session: {
    get: <T,>(key: string, defaultValue?: T) => sessionStorage.get<T>(key, defaultValue),
    set: <T,>(key: string, value: T) => sessionStorage.set(key, value),
    remove: (key: string) => sessionStorage.remove(key),
    clear: () => sessionStorage.clear(),
    has: (key: string) => sessionStorage.has(key),
    keys: () => sessionStorage.keys(),
    getSize: () => sessionStorage.getSize(),
    cleanup: (maxAgeDays?: number) => sessionStorage.cleanup(maxAgeDays),
    getQuota: () => sessionStorage.getQuota(),
  },
};

export default StorageManager;

