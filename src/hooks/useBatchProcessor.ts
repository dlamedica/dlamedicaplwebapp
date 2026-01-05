import { useRef, useCallback } from 'react';
import { createBatchProcessor, BatchProcessor } from '../utils/batchProcessor';

/**
 * Custom hook for batch processing
 * 
 * @example
 * const { add, addMany, getQueueSize, waitForCompletion } = useBatchProcessor({
 *   batchSize: 10,
 *   delay: 100,
 *   onBatch: async (batch) => {
 *     return await processBatch(batch);
 *   },
 *   onComplete: (results) => {
 *     console.log('All processed:', results);
 *   },
 * });
 */
export function useBatchProcessor<T, R>(
  options: Parameters<typeof createBatchProcessor<T, R>>[0]
) {
  const processorRef = useRef<BatchProcessor<T, R> | null>(null);

  if (!processorRef.current) {
    processorRef.current = createBatchProcessor(options);
  }

  const add = useCallback((item: T) => {
    processorRef.current?.add(item);
  }, []);

  const addMany = useCallback((items: T[]) => {
    processorRef.current?.addMany(items);
  }, []);

  const getQueueSize = useCallback(() => {
    return processorRef.current?.getQueueSize() || 0;
  }, []);

  const getResults = useCallback(() => {
    return processorRef.current?.getResults() || [];
  }, []);

  const clear = useCallback(() => {
    processorRef.current?.clear();
  }, []);

  const waitForCompletion = useCallback(async () => {
    return await processorRef.current?.waitForCompletion() || [];
  }, []);

  return {
    add,
    addMany,
    getQueueSize,
    getResults,
    clear,
    waitForCompletion,
  };
}

