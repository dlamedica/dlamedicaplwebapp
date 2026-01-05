/**
 * Caching utilities
 * Senior specialist performance optimizations
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Simple in-memory cache with TTL
 */
export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  constructor(private defaultTTL: number = 5 * 60 * 1000) {} // 5 minutes default

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      expiresAt,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now();
    let cleaned = 0;

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    });

    return cleaned;
  }
}

/**
 * LocalStorage cache wrapper
 */
export class LocalStorageCache<T> {
  constructor(private prefix = 'cache_') {}

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get value from localStorage cache
   */
  get(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(this.getKey(key));
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Set value in localStorage cache
   */
  set(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };

      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (error) {
      // localStorage might be full or disabled
      if (import.meta.env.DEV) {
        console.warn('Failed to set cache:', error);
      }
    }
  }

  /**
   * Delete value from localStorage cache
   */
  delete(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * Clear all cache entries with prefix
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Note: useCachedAsync hook should be created in src/hooks/useCachedAsync.ts
// This file contains only cache classes

