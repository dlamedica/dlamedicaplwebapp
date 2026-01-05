/**
 * Debounce queue utility
 * Senior specialist implementation
 * 
 * Queues function calls and executes them after a delay
 */

import { log } from './logger';

interface QueuedCall<T> {
  id: string;
  fn: () => T | Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

class DebounceQueue {
  private queue: QueuedCall<any>[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private delay: number;
  private maxQueueSize: number;
  private processing: boolean = false;

  constructor(delay: number = 300, maxQueueSize: number = 100) {
    this.delay = delay;
    this.maxQueueSize = maxQueueSize;
  }

  /**
   * Add function to queue
   */
  async add<T>(fn: () => T | Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Check queue size
      if (this.queue.length >= this.maxQueueSize) {
        const error = new Error('Debounce queue is full');
        log.error('Debounce queue full', error);
        reject(error);
        return;
      }

      const id = `call-${Date.now()}-${Math.random()}`;
      this.queue.push({
        id,
        fn,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      this.schedule();
    });
  }

  /**
   * Schedule execution
   */
  private schedule(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.execute();
    }, this.delay);
  }

  /**
   * Execute queued functions
   */
  private async execute(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const calls = [...this.queue];
    this.queue = [];

    for (const call of calls) {
      try {
        const result = await call.fn();
        call.resolve(result);
      } catch (error) {
        call.reject(error instanceof Error ? error : new Error(String(error)));
      }
    }

    this.processing = false;

    // If more items were added during execution, schedule again
    if (this.queue.length > 0) {
      this.schedule();
    }
  }

  /**
   * Flush queue immediately
   */
  async flush(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    await this.execute();
  }

  /**
   * Clear queue
   */
  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.queue.forEach((call) => {
      call.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Set delay
   */
  setDelay(delay: number): void {
    this.delay = delay;
  }
}

// Singleton instance
export const debounceQueue = new DebounceQueue();

// Export convenience functions
export const debounceQ = {
  add: <T>(fn: () => T | Promise<T>) => debounceQueue.add(fn),
  flush: () => debounceQueue.flush(),
  clear: () => debounceQueue.clear(),
  getQueueSize: () => debounceQueue.getQueueSize(),
  setDelay: (delay: number) => debounceQueue.setDelay(delay),
};

export default debounceQueue;

