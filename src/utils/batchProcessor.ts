/**
 * Batch processor utility
 * Senior specialist implementation
 * 
 * Processes items in batches with configurable size and delay
 */

import { log } from './logger';

interface BatchProcessorOptions<T, R> {
  batchSize?: number;
  delay?: number;
  onBatch?: (batch: T[]) => Promise<R[]>;
  onItem?: (item: T) => Promise<R>;
  onComplete?: (results: R[]) => void;
  onError?: (error: Error, item: T) => void;
}

class BatchProcessor<T, R> {
  private queue: T[] = [];
  private processing: boolean = false;
  private batchSize: number;
  private delay: number;
  private onBatch?: (batch: T[]) => Promise<R[]>;
  private onItem?: (item: T) => Promise<R>;
  private onComplete?: (results: R[]) => void;
  private onError?: (error: Error, item: T) => void;
  private results: R[] = [];

  constructor(options: BatchProcessorOptions<T, R>) {
    this.batchSize = options.batchSize || 10;
    this.delay = options.delay || 100;
    this.onBatch = options.onBatch;
    this.onItem = options.onItem;
    this.onComplete = options.onComplete;
    this.onError = options.onError;
  }

  /**
   * Add item to queue
   */
  add(item: T): void {
    this.queue.push(item);
    if (!this.processing) {
      this.process();
    }
  }

  /**
   * Add multiple items
   */
  addMany(items: T[]): void {
    this.queue.push(...items);
    if (!this.processing) {
      this.process();
    }
  }

  /**
   * Process queue
   */
  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);

      try {
        let batchResults: R[];

        if (this.onBatch) {
          // Process as batch
          batchResults = await this.onBatch(batch);
        } else if (this.onItem) {
          // Process individually
          batchResults = await Promise.all(
            batch.map((item) => this.onItem!(item))
          );
        } else {
          log.warn('No processor function provided');
          continue;
        }

        this.results.push(...batchResults);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        log.error('Batch processing error', err);

        if (this.onError) {
          batch.forEach((item) => {
            this.onError!(err, item);
          });
        }
      }

      // Delay between batches
      if (this.delay > 0 && this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.delay));
      }
    }

    this.processing = false;

    if (this.onComplete) {
      this.onComplete(this.results);
    }
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Get results
   */
  getResults(): R[] {
    return [...this.results];
  }

  /**
   * Clear queue and results
   */
  clear(): void {
    this.queue = [];
    this.results = [];
  }

  /**
   * Wait for processing to complete
   */
  async waitForCompletion(): Promise<R[]> {
    while (this.processing || this.queue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return this.results;
  }
}

/**
 * Create batch processor
 */
export function createBatchProcessor<T, R>(
  options: BatchProcessorOptions<T, R>
): BatchProcessor<T, R> {
  return new BatchProcessor(options);
}

export default BatchProcessor;

