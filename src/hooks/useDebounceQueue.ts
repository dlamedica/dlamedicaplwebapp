import { useRef, useCallback } from 'react';
import { debounceQueue } from '../utils/debounceQueue';

/**
 * Custom hook for debounce queue
 * 
 * @example
 * const { add, flush, clear } = useDebounceQueue();
 * 
 * const handleChange = (value: string) => {
 *   add(() => saveValue(value));
 * };
 */
export function useDebounceQueue() {
  const add = useCallback(<T,>(fn: () => T | Promise<T>): Promise<T> => {
    return debounceQueue.add(fn);
  }, []);

  const flush = useCallback(async () => {
    await debounceQueue.flush();
  }, []);

  const clear = useCallback(() => {
    debounceQueue.clear();
  }, []);

  const getQueueSize = useCallback(() => {
    return debounceQueue.getQueueSize();
  }, []);

  const setDelay = useCallback((delay: number) => {
    debounceQueue.setDelay(delay);
  }, []);

  return {
    add,
    flush,
    clear,
    getQueueSize,
    setDelay,
  };
}

