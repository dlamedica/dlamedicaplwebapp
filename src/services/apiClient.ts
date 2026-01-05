/**
 * API Client with retry logic, error handling, and caching
 * Senior specialist implementation
 */

import { retryWithBackoff, withErrorHandling, createAppError } from '../utils/errorHandling';
import { MemoryCache } from '../utils/cache';
import { isValidUrl } from '../utils/typeGuards';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  cache?: boolean;
  retry?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
  code?: string;
}

/**
 * Advanced API Client with:
 * - Automatic retry with exponential backoff
 * - Request/response caching
 * - Error handling
 * - Timeout support
 * - Request interceptors
 */
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private cache: MemoryCache<ApiResponse<unknown>>;
  private cacheEnabled: boolean;
  private cacheTTL: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL.endsWith('/') 
      ? config.baseURL.slice(0, -1) 
      : config.baseURL;
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.cacheEnabled = config.cacheEnabled ?? true;
    this.cacheTTL = config.cacheTTL || 5 * 60 * 1000; // 5 minutes default
    this.cache = new MemoryCache<ApiResponse<unknown>>(this.cacheTTL);
    this.retries = config.retries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Create cache key from URL and method
   */
  private getCacheKey(url: string, method: string): string {
    return `${method}:${url}`;
  }

  /**
   * Execute request with timeout
   */
  private async executeRequest(
    url: string,
    config: RequestConfig
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw createAppError('Request timeout', 'TIMEOUT_ERROR', 408);
      }
      throw error;
    }
  }

  /**
   * Parse response
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: T;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = (await response.text()) as unknown as T;
    } else {
      data = (await response.blob()) as unknown as T;
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown, response?: Response): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: (error as { code?: string }).code,
        status: response?.status,
        statusText: response?.statusText,
      };
    }

    return {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      status: response?.status,
      statusText: response?.statusText,
    };
  }

  /**
   * Generic request method
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      cache = this.cacheEnabled,
      retry = true,
      method = 'GET',
      ...fetchConfig
    } = config;

    const url = this.buildURL(endpoint, params);
    const cacheKey = this.getCacheKey(url, method);

    // Check cache for GET requests
    if (cache && method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached as ApiResponse<T>;
      }
    }

    // Execute request with retry logic
    const execute = async (): Promise<ApiResponse<T>> => {
      const response = await this.executeRequest(url, {
        ...fetchConfig,
        method,
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw createAppError(
          errorData.message || response.statusText || 'Request failed',
          'API_ERROR',
          response.status,
          errorData
        );
      }

      const parsed = await this.parseResponse<T>(response);

      // Cache successful GET requests
      if (cache && method === 'GET' && response.ok) {
        this.cache.set(cacheKey, parsed);
      }

      return parsed;
    };

    // Use retry logic if enabled
    if (retry && method === 'GET') {
      const result = await withErrorHandling(
        () => retryWithBackoff(execute, this.retries, this.retryDelay),
        (error) => {
          if (import.meta.env.DEV) {
            console.error('API request failed:', error);
          }
        }
      );

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    }

    // Execute without retry
    const result = await withErrorHandling(execute, (error) => {
      if (import.meta.env.DEV) {
        console.error('API request failed:', error);
      }
    });

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Set default header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

/**
 * Create API client instance
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

/**
 * Default API client instance (can be configured)
 */
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000,
});

