/**
 * Rate limiter utility
 * Senior specialist implementation
 * 
 * Prevents excessive API calls and user actions
 */

import { log } from './logger';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  key?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private defaultMaxRequests: number = 10;
  private defaultWindowMs: number = 60000; // 1 minute

  /**
   * Check if request is allowed
   */
  isAllowed(key: string, options?: Partial<RateLimitOptions>): boolean {
    const maxRequests = options?.maxRequests || this.defaultMaxRequests;
    const windowMs = options?.windowMs || this.defaultWindowMs;
    const now = Date.now();

    const entry = this.limits.get(key);

    // No entry or window expired
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      log.warn('Rate limit exceeded', { key, count: entry.count, maxRequests });
      return false;
    }

    // Increment count
    entry.count++;
    this.limits.set(key, entry);
    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string, options?: Partial<RateLimitOptions>): number {
    const maxRequests = options?.maxRequests || this.defaultMaxRequests;
    const windowMs = options?.windowMs || this.defaultWindowMs;
    const now = Date.now();

    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      return maxRequests;
    }

    return Math.max(0, maxRequests - entry.count);
  }

  /**
   * Get reset time
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key);
    if (!entry) return null;
    return entry.resetTime;
  }

  /**
   * Reset limit for key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all limits
   */
  clear(): void {
    this.limits.clear();
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Rate limit decorator for functions
 */
export function withRateLimit<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  options?: Partial<RateLimitOptions>
): T {
  return ((...args: Parameters<T>) => {
    if (!rateLimiter.isAllowed(key, options)) {
      throw new Error(`Rate limit exceeded for ${key}`);
    }
    return fn(...args);
  }) as T;
}

/**
 * Rate limit hook for React components
 */
export function useRateLimit(key: string, options?: Partial<RateLimitOptions>) {
  const isAllowed = () => rateLimiter.isAllowed(key, options);
  const getRemaining = () => rateLimiter.getRemaining(key, options);
  const getResetTime = () => rateLimiter.getResetTime(key);
  const reset = () => rateLimiter.reset(key);

  return {
    isAllowed,
    getRemaining,
    getResetTime,
    reset,
  };
}

export default rateLimiter;

