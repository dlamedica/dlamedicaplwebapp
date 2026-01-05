import { useState, useCallback, useEffect } from 'react';
import { requestQueue } from '../utils/requestQueue';

/**
 * Custom hook for request queue
 * 
 * @example
 * const { add, status, clear } = useRequestQueue();
 * 
 * const handleRequest = async () => {
 *   const result = await add(() => fetchData(), 1);
 * };
 */
export function useRequestQueue() {
  const [status, setStatus] = useState(() => requestQueue.getStatus());

  const add = useCallback(
    <T,>(execute: () => Promise<T>, priority?: number): Promise<T> => {
      return requestQueue.add(execute, priority);
    },
    []
  );

  const clear = useCallback(() => {
    requestQueue.clear();
    setStatus(requestQueue.getStatus());
  }, []);

  const setMaxConcurrent = useCallback((max: number) => {
    requestQueue.setMaxConcurrent(max);
    setStatus(requestQueue.getStatus());
  }, []);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(requestQueue.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    add,
    clear,
    setMaxConcurrent,
    status,
  };
}

