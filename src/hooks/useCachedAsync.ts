import { useState, useEffect, useMemo, useCallback } from 'react';
import { LocalStorageCache } from '../utils/cache';

/**
 * React hook for cached async data
 * Automatically caches API responses in localStorage
 * 
 * @example
 * const { data, loading, error, refetch } = useCachedAsync(
 *   `user_${userId}`,
 *   () => fetchUser(userId),
 *   5 * 60 * 1000 // 5 min cache
 * );
 */
export function useCachedAsync<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cache = useMemo(() => new LocalStorageCache<T>(), []);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.get(key);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Fetch from API
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      cache.set(key, result, ttl);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, cache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

