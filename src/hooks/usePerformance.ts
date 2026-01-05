import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '../utils/performanceMonitor';

/**
 * Custom hook for performance monitoring
 * 
 * @example
 * const { measure, measureAsync } = usePerformance();
 * 
 * measure('render-component', () => {
 *   // component logic
 * });
 * 
 * const result = await measureAsync('fetch-data', async () => {
 *   return await fetchData();
 * });
 */
export function usePerformance() {
  const componentName = useRef<string>('Unknown');

  useEffect(() => {
    // Get component name from stack trace (if available)
    const stack = new Error().stack;
    if (stack) {
      const match = stack.match(/at (\w+)/);
      if (match) {
        componentName.current = match[1];
      }
    }
  }, []);

  const measure = useCallback((name: string, fn: () => void) => {
    const fullName = `${componentName.current}:${name}`;
    performanceMonitor.measure(fullName, fn);
  }, []);

  const measureAsync = useCallback(<T,>(name: string, fn: () => Promise<T>): Promise<T> => {
    const fullName = `${componentName.current}:${name}`;
    return performanceMonitor.measureAsync(fullName, fn);
  }, []);

  return {
    measure,
    measureAsync,
    getMetrics: () => performanceMonitor.getMetrics(),
    getSlowestMetrics: (limit?: number) => performanceMonitor.getSlowestMetrics(limit),
  };
}

