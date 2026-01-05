/**
 * Idle detector utility
 * Senior specialist implementation
 * 
 * Detects when user is idle and triggers callbacks
 */

import { log } from './logger';
import { events } from './eventEmitter';

interface IdleDetectorOptions {
  threshold?: number; // milliseconds
  events?: string[]; // events to listen to
  onIdle?: () => void;
  onActive?: () => void;
}

class IdleDetector {
  private threshold: number;
  private events: string[];
  private onIdle?: () => void;
  private onActive?: () => void;
  private idleTimer: NodeJS.Timeout | null = null;
  private isIdle: boolean = false;
  private lastActivity: number = Date.now();

  constructor(options: IdleDetectorOptions = {}) {
    this.threshold = options.threshold || 60000; // 1 minute default
    this.events = options.events || [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    this.onIdle = options.onIdle;
    this.onActive = options.onActive;

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize idle detection
   */
  private initialize(): void {
    this.events.forEach((event) => {
      window.addEventListener(event, this.handleActivity, { passive: true });
    });

    // Start idle timer
    this.startIdleTimer();
  }

  /**
   * Handle user activity
   */
  private handleActivity = (): void => {
    this.lastActivity = Date.now();

    if (this.isIdle) {
      this.isIdle = false;
      log.debug('User became active');
      events.emit('user-active');
      if (this.onActive) {
        this.onActive();
      }
    }

    // Reset idle timer
    this.startIdleTimer();
  };

  /**
   * Start idle timer
   */
  private startIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      if (!this.isIdle) {
        this.isIdle = true;
        log.debug('User became idle');
        events.emit('user-idle');
        if (this.onIdle) {
          this.onIdle();
        }
      }
    }, this.threshold);
  }

  /**
   * Check if user is idle
   */
  isUserIdle(): boolean {
    return this.isIdle;
  }

  /**
   * Get time since last activity
   */
  getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivity;
  }

  /**
   * Reset idle timer
   */
  reset(): void {
    this.lastActivity = Date.now();
    this.isIdle = false;
    this.startIdleTimer();
  }

  /**
   * Set threshold
   */
  setThreshold(threshold: number): void {
    this.threshold = threshold;
    this.startIdleTimer();
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    this.events.forEach((event) => {
      window.removeEventListener(event, this.handleActivity);
    });
  }
}

// Singleton instance
export const idleDetector = new IdleDetector();

// Export convenience functions
export const idle = {
  isUserIdle: () => idleDetector.isUserIdle(),
  getTimeSinceLastActivity: () => idleDetector.getTimeSinceLastActivity(),
  reset: () => idleDetector.reset(),
  setThreshold: (threshold: number) => idleDetector.setThreshold(threshold),
};

export default idleDetector;

