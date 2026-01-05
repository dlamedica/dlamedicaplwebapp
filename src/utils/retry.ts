/**
 * Retry utility with exponential backoff
 * Senior specialist implementation
 */

import { log } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  onRetry?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'shouldRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  factor: 2,
};

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_OPTIONS.maxRetries,
    initialDelay = DEFAULT_OPTIONS.initialDelay,
    maxDelay = DEFAULT_OPTIONS.maxDelay,
    factor = DEFAULT_OPTIONS.factor,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if should retry
      if (!shouldRetry(lastError)) {
        throw lastError;
      }

      // Last attempt
      if (attempt === maxRetries) {
        log.error('Max retries reached', lastError, { maxRetries, attempt });
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(factor, attempt),
        maxDelay
      );

      log.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, {
        delay,
        error: lastError.message,
      });

      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Unknown error');
}

/**
 * Retry with custom delay function
 */
export async function retryWithCustomDelay<T>(
  fn: () => Promise<T>,
  getDelay: (attempt: number, error: Error) => number,
  options: Omit<RetryOptions, 'initialDelay' | 'maxDelay' | 'factor'> = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_OPTIONS.maxRetries,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!shouldRetry(lastError)) {
        throw lastError;
      }

      if (attempt === maxRetries) {
        log.error('Max retries reached', lastError, { maxRetries, attempt });
        throw lastError;
      }

      const delay = getDelay(attempt + 1, lastError);

      log.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, {
        delay,
        error: lastError.message,
      });

      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown error');
}

/**
 * Retry with jitter (random delay variation)
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { jitter?: number } = {}
): Promise<T> {
  const { jitter = 0.1, ...retryOptions } = options;

  return retry(fn, {
    ...retryOptions,
    onRetry: (error, attempt) => {
      // Add jitter to delay
      const baseDelay = (retryOptions.initialDelay || DEFAULT_OPTIONS.initialDelay) *
        Math.pow(retryOptions.factor || DEFAULT_OPTIONS.factor, attempt - 1);
      const jitterAmount = baseDelay * jitter * (Math.random() * 2 - 1);
      const delay = baseDelay + jitterAmount;

      if (retryOptions.onRetry) {
        retryOptions.onRetry(error, attempt);
      }
    },
  });
}

