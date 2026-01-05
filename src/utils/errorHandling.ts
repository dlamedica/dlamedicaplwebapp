/**
 * Error handling utilities
 * Senior specialist error management
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp: string;
}

/**
 * Create standardized error object
 */
export function createAppError(
  message: string,
  code?: string,
  statusCode?: number,
  details?: unknown
): AppError {
  return {
    message,
    code,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Error handler for async functions
 * Wraps async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => void
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const appError = error instanceof Error
      ? createAppError(error.message, 'UNKNOWN_ERROR', undefined, error)
      : createAppError('An unknown error occurred', 'UNKNOWN_ERROR');

    if (errorHandler) {
      errorHandler(appError);
    }

    // Log error using centralized logger
    // Dynamic import to avoid circular dependency
    if (import.meta.env.DEV) {
      import('./logger').then(({ log }) => {
        log.error('Error caught', appError, { originalError: error });
      }).catch(() => {
        // Fallback to console if logger fails
        console.error('Error caught:', appError, error);
      });
    }

    return { success: false, error: appError };
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Safe async function execution
 * Never throws, always returns result object
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: Error }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Error boundary helper
 * Extracts error information for logging
 */
export function extractErrorInfo(error: unknown): {
  message: string;
  stack?: string;
  name?: string;
  code?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: (error as { code?: string }).code,
    };
  }

  return {
    message: String(error),
  };
}

