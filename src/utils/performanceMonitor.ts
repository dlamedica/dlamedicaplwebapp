/**
 * Performance monitoring utility
 * Senior specialist implementation
 * 
 * Tracks and reports performance metrics
 */

import { log } from './logger';

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'measure' | 'custom';
  details?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private maxMetrics: number = 100;

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  /**
   * Initialize Performance Observers
   */
  private initializeObservers(): void {
    try {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordNavigation(navEntry);
          }
        });
      });

      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordResource(resourceEntry);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Observe long tasks
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.duration > 50) {
                log.warn('Long task detected', {
                  duration: entry.duration,
                  name: entry.name,
                });
              }
            });
          });

          longTaskObserver.observe({ entryTypes: ['longtask'] });
          this.observers.push(longTaskObserver);
        } catch {
          // Long task observer not supported
        }
      }
    } catch (error) {
      log.error('Failed to initialize performance observers', error as Error);
    }
  }

  /**
   * Record navigation timing
   */
  private recordNavigation(entry: PerformanceNavigationTiming): void {
    const metric: PerformanceMetric = {
      name: 'page-load',
      duration: entry.loadEventEnd - entry.fetchStart,
      timestamp: Date.now(),
      type: 'navigation',
      details: {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.fetchStart,
        loadComplete: entry.loadEventEnd - entry.fetchStart,
        firstPaint: entry.domContentLoadedEventEnd - entry.fetchStart,
        domInteractive: entry.domInteractive - entry.fetchStart,
        dns: entry.domainLookupEnd - entry.domainLookupStart,
        tcp: entry.connectEnd - entry.connectStart,
        request: entry.responseStart - entry.requestStart,
        response: entry.responseEnd - entry.responseStart,
        domProcessing: entry.domComplete - entry.domInteractive,
      },
    };

    this.addMetric(metric);
    log.info('Page load performance', metric.details);
  }

  /**
   * Record resource timing
   */
  private recordResource(entry: PerformanceResourceTiming): void {
    // Only log slow resources
    if (entry.duration > 1000) {
      const metric: PerformanceMetric = {
        name: entry.name,
        duration: entry.duration,
        timestamp: Date.now(),
        type: 'resource',
        details: {
          initiatorType: entry.initiatorType,
          size: entry.transferSize,
          cached: entry.transferSize === 0,
        },
      };

      this.addMetric(metric);
      log.warn('Slow resource detected', metric.details);
    }
  }

  /**
   * Measure custom performance
   */
  measure(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      type: 'measure',
    };

    this.addMetric(metric);

    if (duration > 100) {
      log.warn(`Slow operation: ${name}`, { duration });
    } else {
      log.debug(`Operation: ${name}`, { duration });
    }
  }

  /**
   * Measure async operation
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;

      const metric: PerformanceMetric = {
        name,
        duration,
        timestamp: Date.now(),
        type: 'measure',
      };

      this.addMetric(metric);

      if (duration > 1000) {
        log.warn(`Slow async operation: ${name}`, { duration });
      } else {
        log.debug(`Async operation: ${name}`, { duration });
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      log.error(`Failed operation: ${name}`, error as Error, { duration });
      throw error;
    }
  }

  /**
   * Add metric
   */
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by type
   */
  getMetricsByType(type: PerformanceMetric['type']): PerformanceMetric[] {
    return this.metrics.filter((m) => m.type === type);
  }

  /**
   * Get average duration for a metric name
   */
  getAverageDuration(name: string): number {
    const metrics = this.metrics.filter((m) => m.name === name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / metrics.length;
  }

  /**
   * Get slowest metrics
   */
  getSlowestMetrics(limit: number = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Get Web Vitals
   */
  getWebVitals(): {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
  } {
    const vitals: {
      fcp?: number;
      lcp?: number;
      fid?: number;
      cls?: number;
      ttfb?: number;
    } = {};

    if (typeof window === 'undefined' || !window.performance) {
      return vitals;
    }

    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      vitals.ttfb = navigation.responseStart - navigation.fetchStart;
    }

    // FCP, LCP, FID, CLS would require additional observers or libraries
    // This is a basic implementation

    return vitals;
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export convenience functions
export const monitor = {
  measure: (name: string, fn: () => void) => performanceMonitor.measure(name, fn),
  measureAsync: <T>(name: string, fn: () => Promise<T>) =>
    performanceMonitor.measureAsync(name, fn),
  getMetrics: () => performanceMonitor.getMetrics(),
  getSlowestMetrics: (limit?: number) => performanceMonitor.getSlowestMetrics(limit),
  getWebVitals: () => performanceMonitor.getWebVitals(),
  clearMetrics: () => performanceMonitor.clearMetrics(),
  exportMetrics: () => performanceMonitor.exportMetrics(),
};

export default performanceMonitor;

