/**
 * Event emitter utility
 * Senior specialist implementation
 * 
 * Lightweight event system for application-wide communication
 */

import { log } from './logger';

type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Unsubscribe from event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * Subscribe to event once
   */
  once(event: string, callback: EventCallback): () => void {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, onceCallback);
    };

    return this.on(event, onceCallback);
  }

  /**
   * Emit event
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          log.error(`Error in event handler for ${event}`, error as Error);
        }
      });
    }
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * Get listener count for event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Remove all listeners for event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// Singleton instance
export const eventEmitter = new EventEmitter();

// Export convenience functions
export const events = {
  on: (event: string, callback: EventCallback) => eventEmitter.on(event, callback),
  off: (event: string, callback: EventCallback) => eventEmitter.off(event, callback),
  once: (event: string, callback: EventCallback) => eventEmitter.once(event, callback),
  emit: (event: string, ...args: any[]) => eventEmitter.emit(event, ...args),
  eventNames: () => eventEmitter.eventNames(),
  listenerCount: (event: string) => eventEmitter.listenerCount(event),
  removeAllListeners: (event?: string) => eventEmitter.removeAllListeners(event),
};

export default eventEmitter;

