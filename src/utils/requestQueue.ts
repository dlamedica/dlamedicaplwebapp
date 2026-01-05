/**
 * Request queue utility
 * Senior specialist implementation
 * 
 * Manages concurrent requests with priority and batching
 */

import { log } from './logger';

interface QueuedRequest<T> {
  id: string;
  priority: number;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

interface RequestQueueOptions {
  maxConcurrent?: number;
  maxQueueSize?: number;
  timeout?: number;
  priority?: 'fifo' | 'priority' | 'lifo';
}

class RequestQueue {
  private queue: QueuedRequest<any>[] = [];
  private running: Set<string> = new Set();
  private maxConcurrent: number;
  private maxQueueSize: number;
  private timeout: number;
  private priority: 'fifo' | 'priority' | 'lifo';

  constructor(options: RequestQueueOptions = {}) {
    this.maxConcurrent = options.maxConcurrent || 5;
    this.maxQueueSize = options.maxQueueSize || 100;
    this.timeout = options.timeout || 30000;
    this.priority = options.priority || 'fifo';
  }

  /**
   * Add request to queue
   */
  async add<T>(
    execute: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Check queue size
      if (this.queue.length >= this.maxQueueSize) {
        const error = new Error('Request queue is full');
        log.error('Request queue full', error);
        reject(error);
        return;
      }

      const id = `req-${Date.now()}-${Math.random()}`;
      const request: QueuedRequest<T> = {
        id,
        priority,
        execute,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(request);
      this.sortQueue();
      this.processQueue();

      // Timeout
      setTimeout(() => {
        if (this.queue.find((r) => r.id === id)) {
          this.queue = this.queue.filter((r) => r.id !== id);
          reject(new Error('Request timeout'));
        }
      }, this.timeout);
    });
  }

  /**
   * Sort queue based on priority
   */
  private sortQueue(): void {
    switch (this.priority) {
      case 'priority':
        this.queue.sort((a, b) => b.priority - a.priority);
        break;
      case 'lifo':
        this.queue.reverse();
        break;
      case 'fifo':
      default:
        // Already in FIFO order
        break;
    }
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    // Check if we can run more requests
    if (this.running.size >= this.maxConcurrent) {
      return;
    }

    // Get next request
    const request = this.queue.shift();
    if (!request) {
      return;
    }

    // Mark as running
    this.running.add(request.id);

    try {
      const result = await request.execute();
      request.resolve(result);
    } catch (error) {
      request.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.running.delete(request.id);
      // Process next request
      this.processQueue();
    }
  }

  /**
   * Get queue status
   */
  getStatus(): {
    queueSize: number;
    running: number;
    maxConcurrent: number;
  } {
    return {
      queueSize: this.queue.length,
      running: this.running.size,
      maxConcurrent: this.maxConcurrent,
    };
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue.forEach((request) => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }

  /**
   * Set max concurrent
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
    this.processQueue();
  }
}

// Singleton instance
export const requestQueue = new RequestQueue();

// Export convenience functions
export const queue = {
  add: <T>(execute: () => Promise<T>, priority?: number) =>
    requestQueue.add(execute, priority),
  getStatus: () => requestQueue.getStatus(),
  clear: () => requestQueue.clear(),
  setMaxConcurrent: (max: number) => requestQueue.setMaxConcurrent(max),
};

export default requestQueue;

