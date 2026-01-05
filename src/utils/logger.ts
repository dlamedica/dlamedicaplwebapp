/**
 * Centralized logging utility
 * Senior specialist implementation
 * 
 * Provides structured logging with different levels and environments
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
  stack?: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs: number = 100;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR;
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Debug log (only in development)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Info log
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, context);
    }
  }

  /**
   * Warning log
   */
  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, context);
    }
  }

  /**
   * Error log
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.log(LogLevel.ERROR, message, context, error);
    }
  }

  /**
   * Group logs together
   */
  group(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.group(label);
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.groupEnd();
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      stack: error?.stack,
    };

    // Store log
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const logMethod = this.getConsoleMethod(level);
    const prefix = this.getPrefix(level);

    if (error) {
      logMethod(`${prefix} ${message}`, {
        ...context,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      });
    } else if (context) {
      logMethod(`${prefix} ${message}`, context);
    } else {
      logMethod(`${prefix} ${message}`);
    }

    // In production, send critical errors to error tracking service
    if (level === LogLevel.ERROR && !this.isDevelopment) {
      this.sendToErrorTracking(entry);
    }
  }

  /**
   * Check if should log at this level
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  /**
   * Get console method for log level
   */
  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Get prefix for log level
   */
  private getPrefix(level: LogLevel): string {
    const prefixes = {
      [LogLevel.DEBUG]: '🔍 [DEBUG]',
      [LogLevel.INFO]: 'ℹ️ [INFO]',
      [LogLevel.WARN]: '⚠️ [WARN]',
      [LogLevel.ERROR]: '❌ [ERROR]',
    };
    return prefixes[level] || '';
  }

  /**
   * Send error to error tracking service (Sentry, LogRocket, etc.)
   */
  private sendToErrorTracking(entry: LogEntry): void {
    // Integration with error tracking services
    // Example: Sentry.captureException(entry.error, { extra: entry.context });
    
    // For now, we'll just store it for potential future integration
    if (typeof window !== 'undefined') {
      // Store in sessionStorage for debugging
      try {
        const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
        errors.push(entry);
        // Keep only last 10 errors
        const recentErrors = errors.slice(-10);
        sessionStorage.setItem('app_errors', JSON.stringify(recentErrors));
      } catch {
        // Ignore storage errors
      }
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Convenience functions
export const log = {
  debug: (message: string, context?: Record<string, unknown>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, unknown>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, unknown>) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, unknown>) =>
    logger.error(message, error, context),
  group: (label: string) => logger.group(label),
  groupEnd: () => logger.groupEnd(),
  getLogs: () => logger.getLogs(),
  clearLogs: () => logger.clearLogs(),
  exportLogs: () => logger.exportLogs(),
};

// Export default logger instance
export default logger;

