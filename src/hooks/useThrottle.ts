import { useRef, useCallback } from 'react';

/**
 * Custom hook for throttled function calls
 * Limits function execution to once per wait time
 * 
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolled!');
 * }, 100);
 * 
 * window.addEventListener('scroll', handleScroll);
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  wait: number
): T {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= wait) {
        lastRun.current = now;
        callback(...args);
      } else {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Schedule next execution
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, wait - timeSinceLastRun);
      }
    }) as T,
    [callback, wait]
  );
}

