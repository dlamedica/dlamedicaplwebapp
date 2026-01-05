import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiResponse, ApiError } from '../services/apiClient';
import { withErrorHandling } from '../utils/errorHandling';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  cache?: boolean;
  retry?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for API calls with loading and error states
 * 
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => apiClient.get<User>('/users/1')
 * );
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    cache = true,
    retry = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await withErrorHandling(
      async () => {
        const response = await apiCall();
        return response.data;
      },
      (err) => {
        const apiError: ApiError = {
          message: err.message,
          code: err.code,
          status: err.statusCode,
        };
        setError(apiError);
        if (onError) {
          onError(apiError);
        }
      }
    );

    if (result.success) {
      setData(result.data);
      if (onSuccess) {
        onSuccess(result.data);
      }
    }

    setLoading(false);
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for POST/PUT/PATCH requests
 */
export function useMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: {
    onSuccess?: (data: TData) => void;
    onError?: (error: ApiError) => void;
  } = {}
): {
  mutate: (variables: TVariables) => Promise<void>;
  data: TData | null;
  loading: boolean;
  error: ApiError | null;
  reset: () => void;
} {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true);
    setError(null);

    const result = await withErrorHandling(
      async () => {
        const response = await mutationFn(variables);
        return response.data;
      },
      (err) => {
        const apiError: ApiError = {
          message: err.message,
          code: err.code,
          status: err.statusCode,
        };
        setError(apiError);
        if (options.onError) {
          options.onError(apiError);
        }
      }
    );

    if (result.success) {
      setData(result.data);
      if (options.onSuccess) {
        options.onSuccess(result.data);
      }
    }

    setLoading(false);
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    data,
    loading,
    error,
    reset,
  };
}

