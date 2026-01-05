import { useState, useEffect, useCallback } from 'react';
import { parseQueryString, buildQueryString, updateQueryParams } from '../utils/urlUtils';

/**
 * Custom hook for URL query parameters
 * 
 * @example
 * const [params, setParams] = useQueryParams();
 * 
 * // Get param
 * const page = params.page || '1';
 * 
 * // Update param
 * setParams({ page: '2' });
 */
export function useQueryParams(): [
  Record<string, string>,
  (params: Record<string, string | number | boolean | null | undefined>) => void
] {
  const [params, setParams] = useState<Record<string, string>>(() => {
    return parseQueryString(window.location.search);
  });

  useEffect(() => {
    const handlePopState = () => {
      setParams(parseQueryString(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateParams = useCallback((newParams: Record<string, string | number | boolean | null | undefined>) => {
    updateQueryParams(newParams);
    setParams(parseQueryString(window.location.search));
  }, []);

  return [params, updateParams];
}

/**
 * Hook for single query parameter
 */
export function useQueryParam(
  key: string,
  defaultValue?: string
): [string | null, (value: string | null) => void] {
  const [params, setParams] = useQueryParams();

  const value = params[key] || defaultValue || null;

  const setValue = useCallback((newValue: string | null) => {
    setParams({ [key]: newValue });
  }, [key, setParams]);

  return [value, setValue];
}

