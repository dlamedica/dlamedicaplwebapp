// 🔒 BEZPIECZEŃSTWO: CSRF Helper - pomocnicze funkcje do obsługi CSRF tokenów po stronie klienta

/**
 * Pobiera CSRF token z response header
 */
export function getCSRFTokenFromHeader(): string | null {
  // Token jest ustawiany przez backend w headerze X-CSRF-Token
  // W React musimy go pobrać z response lub przechować po pierwszym requestcie
  return sessionStorage.getItem('csrf_token');
}

/**
 * Zapisuje CSRF token
 */
export function setCSRFToken(token: string): void {
  sessionStorage.setItem('csrf_token', token);
}

/**
 * Pobiera CSRF token (z sessionStorage lub generuje placeholder)
 */
export function getCSRFToken(): string | null {
  return getCSRFTokenFromHeader();
}

/**
 * Dodaje CSRF token do request headers
 */
export function addCSRFTokenToHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getCSRFToken();
  const headersObj = headers instanceof Headers ? Object.fromEntries(headers.entries()) : { ...headers };
  
  if (token) {
    return {
      ...headersObj,
      'X-CSRF-Token': token,
    };
  }
  
  return headersObj;
}

/**
 * Dodaje CSRF token do body requestu
 */
export function addCSRFTokenToBody(body: any): any {
  const token = getCSRFToken();
  
  if (token && typeof body === 'object' && body !== null) {
    return {
      ...body,
      _csrf: token,
    };
  }
  
  return body;
}

/**
 * Obsługuje response i zapisuje CSRF token jeśli jest w headerze
 */
export function handleCSRFResponse(response: Response): void {
  const token = response.headers.get('X-CSRF-Token');
  if (token) {
    setCSRFToken(token);
  }
}

/**
 * Wrapper dla fetch z automatyczną obsługą CSRF
 */
export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Dodaj CSRF token do headers
  const headers = addCSRFTokenToHeaders(options.headers);
  
  // Jeśli to POST/PUT/DELETE, dodaj też do body
  const method = options.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(addCSRFTokenToBody(JSON.parse(options.body as string)));
    }
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  
  // Zapisz CSRF token z response
  handleCSRFResponse(response);
  
  return response;
}

