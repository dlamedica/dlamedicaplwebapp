/**
 * Error tracking utility
 * Senior specialist implementation
 * 
 * Centralized error tracking with support for multiple services
 */

import { log } from './logger';
import type { AppError } from './errorHandling';

export interface ErrorTrackingConfig {
  enabled: boolean;
  service?: 'sentry' | 'logrocket' | 'custom';
  dsn?: string;
  environment?: string;
  release?: string;
  sampleRate?: number;
}

class ErrorTracker {
  private config: ErrorTrackingConfig;
  private initialized: boolean = false;

  constructor() {
    this.config = {
      enabled: import.meta.env.PROD,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      sampleRate: 1.0,
    };
  }

  /**
   * Initialize error tracking
   */
  initialize(config?: Partial<ErrorTrackingConfig>): void {
    this.config = { ...this.config, ...config };

    if (!this.config.enabled) {
      log.info('Error tracking disabled');
      return;
    }

    try {
      // Initialize Sentry if configured
      if (this.config.service === 'sentry' && this.config.dsn) {
        this.initializeSentry();
      }

      // Initialize LogRocket if configured
      if (this.config.service === 'logrocket' && this.config.dsn) {
        this.initializeLogRocket();
      }

      this.initialized = true;
      log.info('Error tracking initialized', { service: this.config.service });
    } catch (error) {
      log.error('Failed to initialize error tracking', error as Error);
    }
  }

  /**
   * Initialize Sentry
   */
  private initializeSentry(): void {
    // Sentry initialization would go here
    // Example:
    // import * as Sentry from '@sentry/react';
    // Sentry.init({
    //   dsn: this.config.dsn,
    //   environment: this.config.environment,
    //   release: this.config.release,
    //   tracesSampleRate: this.config.sampleRate,
    // });
    log.info('Sentry initialization placeholder');
  }

  /**
   * Initialize LogRocket
   */
  private initializeLogRocket(): void {
    // LogRocket initialization would go here
    // Example:
    // import LogRocket from 'logrocket';
    // LogRocket.init(this.config.dsn);
    log.info('LogRocket initialization placeholder');
  }

  /**
   * Capture exception
   */
  captureException(error: Error | AppError, context?: Record<string, unknown>): void {
    if (!this.config.enabled) {
      return;
    }

    try {
      // Send to error tracking service
      if (this.config.service === 'sentry') {
        // Sentry.captureException(error, { extra: context });
        log.debug('Sentry capture exception', { error, context });
      } else if (this.config.service === 'logrocket') {
        // LogRocket.captureException(error, { extra: context });
        log.debug('LogRocket capture exception', { error, context });
      }

      // Always log locally
      log.error('Exception captured', error, context);

      // Store in sessionStorage for debugging
      this.storeError(error, context);
    } catch (err) {
      log.error('Failed to capture exception', err as Error);
    }
  }

  /**
   * Capture message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.config.enabled) {
      return;
    }

    try {
      if (this.config.service === 'sentry') {
        // Sentry.captureMessage(message, level);
        log.debug('Sentry capture message', { message, level });
      }

      log[level](message);
    } catch (error) {
      log.error('Failed to capture message', error as Error);
    }
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    if (!this.config.enabled) {
      return;
    }

    try {
      if (this.config.service === 'sentry') {
        // Sentry.setUser(user);
        log.debug('Sentry set user', { user });
      }

      // Store in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('error_tracking_user', JSON.stringify(user));
      }
    } catch (error) {
      log.error('Failed to set user context', error as Error);
    }
  }

  /**
   * Set additional context
   */
  setContext(name: string, context: Record<string, unknown>): void {
    if (!this.config.enabled) {
      return;
    }

    try {
      if (this.config.service === 'sentry') {
        // Sentry.setContext(name, context);
        log.debug('Sentry set context', { name, context });
      }

      // Store in sessionStorage
      if (typeof window !== 'undefined') {
        const key = `error_tracking_context_${name}`;
        sessionStorage.setItem(key, JSON.stringify(context));
      }
    } catch (error) {
      log.error('Failed to set context', error as Error);
    }
  }

  /**
   * Store error locally for debugging
   */
  private storeError(error: Error | AppError, context?: Record<string, unknown>): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const errors = JSON.parse(sessionStorage.getItem('tracked_errors') || '[]');
      const errorEntry = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...(error instanceof Error && 'code' in error ? { code: (error as AppError).code } : {}),
        },
        context,
        timestamp: new Date().toISOString(),
      };

      errors.push(errorEntry);
      // Keep only last 20 errors
      const recentErrors = errors.slice(-20);
      sessionStorage.setItem('tracked_errors', JSON.stringify(recentErrors));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Get stored errors
   */
  getStoredErrors(): unknown[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      return JSON.parse(sessionStorage.getItem('tracked_errors') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tracked_errors');
    }
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Export convenience functions
export const tracking = {
  initialize: (config?: Partial<ErrorTrackingConfig>) => errorTracker.initialize(config),
  captureException: (error: Error | AppError, context?: Record<string, unknown>) =>
    errorTracker.captureException(error, context),
  captureMessage: (message: string, level?: 'info' | 'warning' | 'error') =>
    errorTracker.captureMessage(message, level),
  setUser: (user: { id: string; email?: string; username?: string }) =>
    errorTracker.setUser(user),
  setContext: (name: string, context: Record<string, unknown>) =>
    errorTracker.setContext(name, context),
  getStoredErrors: () => errorTracker.getStoredErrors(),
  clearStoredErrors: () => errorTracker.clearStoredErrors(),
};

export default errorTracker;

