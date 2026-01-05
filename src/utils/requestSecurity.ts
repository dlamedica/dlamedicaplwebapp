// 🔒 BEZPIECZEŃSTWO: Request Security - bezpieczne requesty po stronie klienta

/**
 * Sprawdza czy URL jest bezpieczny przed wykonaniem requestu
 */
export function isSafeURL(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.href);
    
    // Sprawdź protokół (tylko http/https)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Sprawdź czy nie jest to localhost w produkcji (opcjonalne)
    if (import.meta.env.PROD && 
        (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1')) {
      console.warn('⚠️ Request to localhost in production:', url);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid URL:', url);
    return false;
  }
}

/**
 * Bezpieczny wrapper dla fetch z dodatkowymi zabezpieczeniami
 */
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Sprawdź czy URL jest bezpieczny
  if (!isSafeURL(url)) {
    throw new Error('Niebezpieczny URL');
  }

  // Dodaj timeout
  const timeout = options.timeout || 30000; // 30 sekund default
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Dodaj security headers
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    throw error;
  }
}

/**
 * Sprawdza czy response jest bezpieczny
 */
export function validateResponse(response: Response): boolean {
  // Sprawdź status code
  if (response.status >= 500) {
    console.error('Server error:', response.status);
    return false;
  }

  // Sprawdź content-type (opcjonalne)
  const contentType = response.headers.get('content-type');
  if (contentType && !contentType.includes('application/json') && 
      !contentType.includes('text/') && !contentType.includes('image/')) {
    console.warn('Unexpected content-type:', contentType);
  }

  return true;
}

/**
 * Bezpieczne parsowanie JSON z walidacją
 */
export async function safeJsonParse<T = any>(response: Response): Promise<T> {
  const text = await response.text();
  
  // Sprawdź czy nie zawiera niebezpiecznych skryptów
  if (text.includes('<script') || text.includes('javascript:')) {
    throw new Error('Niebezpieczna zawartość w odpowiedzi');
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Nieprawidłowa odpowiedź JSON');
  }
}

