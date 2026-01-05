/**
 * URL utility functions
 * Senior specialist implementation
 */

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (!queryString) return params;

  queryString
    .replace(/^\?/, '')
    .split('&')
    .forEach((param) => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });

  return params;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return query ? `?${query}` : '';
}

/**
 * Update URL query parameters without reload
 */
export function updateQueryParams(params: Record<string, string | number | boolean | null | undefined>): void {
  const currentParams = parseQueryString(window.location.search);
  const newParams = { ...currentParams, ...params };
  
  // Remove null/undefined values
  Object.keys(newParams).forEach((key) => {
    if (newParams[key] === null || newParams[key] === undefined) {
      delete newParams[key];
    }
  });

  const queryString = buildQueryString(newParams);
  window.history.pushState({}, '', `${window.location.pathname}${queryString}`);
}

/**
 * Get query parameter value
 */
export function getQueryParam(key: string): string | null {
  const params = parseQueryString(window.location.search);
  return params[key] || null;
}

/**
 * Remove query parameter
 */
export function removeQueryParam(key: string): void {
  const params = parseQueryString(window.location.search);
  delete params[key];
  const queryString = buildQueryString(params);
  window.history.pushState({}, '', `${window.location.pathname}${queryString}`);
}

/**
 * Check if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Get path from URL
 */
export function getPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Normalize URL (add protocol if missing)
 */
export function normalizeUrl(url: string, protocol: string = 'https'): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  return `${protocol}://${url}`;
}

