import { useState, useCallback } from 'react';
import { retry, RetryOptions } from '../utils/retry';
import { log } from '../utils/logger';

/**
 * Custom hook for retry logic
 * 
 * @example
 * const { execute, loading, error, retryCount } = useRetry();
 * 
 * const handleSubmit = async () => {
 *   await execute(async () => {
 *     return await api.submit(data);
 *   });
 * };
 */
export function useRetry<T>(options?: RetryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastResult, setLastResult] = useState<T | null>(null);

  const execute = useCallback(
    async (fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      setRetryCount(0);

      try {
        const result = await retry(
          async () => {
            const attemptResult = await fn();
            setRetryCount((prev) => prev + 1);
            return attemptResult;
          },
          {
            ...options,
            onRetry: (err, attempt) => {
              setRetryCount(attempt);
              if (options?.onRetry) {
                options.onRetry(err, attempt);
              }
            },
          }
        );

        setLastResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        log.error('Retry failed', error, { retryCount });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setLastResult(null);
  }, []);

  return {
    execute,
    loading,
    error,
    retryCount,
    lastResult,
    reset,
  };
}

