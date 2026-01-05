/**
 * Performance utilities and helpers
 * Senior specialist optimizations
 */

import { useMemo, useCallback, DependencyList } from 'react';

/**
 * Debounce function for performance optimization
 * Delays execution of function until after wait time has passed
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * Limits function execution to once per wait time
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      lastResult = func(...args) as ReturnType<T>;
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
    return lastResult;
  };
}

// Note: useDebounce hook is in src/hooks/useDebounce.ts

/**
 * Custom hook for memoized expensive calculations
 * With automatic dependency tracking
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Custom hook for stable callbacks
 * Prevents unnecessary re-renders of child components
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps) as T;
}

/**
 * Performance monitoring utility
 * Measures execution time of functions
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T
): T {
  if (import.meta.env.DEV) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Async performance monitoring
 */
export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  if (import.meta.env.DEV) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Check if component should re-render
 * Useful for React.memo custom comparison
 */
export function shouldComponentUpdate<T extends Record<string, unknown>>(
  prevProps: T,
  nextProps: T,
  keysToCompare: (keyof T)[]
): boolean {
  return keysToCompare.some((key) => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    // Deep comparison for objects/arrays
    if (
      typeof prevValue === 'object' &&
      typeof nextValue === 'object' &&
      prevValue !== null &&
      nextValue !== null
    ) {
      return JSON.stringify(prevValue) !== JSON.stringify(nextValue);
    }

    return prevValue !== nextValue;
  });
}

/**
 * Batch state updates for better performance
 */
export function batchUpdates(updates: (() => void)[]): void {
  // In React 18+, automatic batching is enabled
  // This is a utility for explicit batching if needed
  updates.forEach((update) => update());
}

// Note: useIntersectionObserver hook is in src/hooks/useIntersectionObserver.ts

