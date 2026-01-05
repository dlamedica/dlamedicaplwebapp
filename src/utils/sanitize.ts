// 🔒 BEZPIECZEŃSTWO: Sanitization - ochrona przed XSS attacks

import DOMPurify from 'dompurify';

/**
 * Sanityzuje HTML string przed renderowaniem (ochrona przed XSS)
 */
export function sanitizeHTML(dirty: string | null | undefined): string {
  if (!dirty) {
    return '';
  }

  // DOMPurify usuwa wszystkie niebezpieczne elementy i atrybuty
  return DOMPurify.sanitize(dirty, {
    // Dozwolone tagi HTML
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'img', 'hr',
    ],
    // Dozwolone atrybuty
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'class', 'id', 'style',
      'width', 'height', 'target', 'rel',
    ],
    // Dozwolone URI schemes
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Dodatkowe opcje bezpieczeństwa
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    SAFE_FOR_TEMPLATES: false,
    SANITIZE_DOM: true,
    FORCE_BODY: false,
  });
}

/**
 * Sanityzuje tekst (usuwa HTML całkowicie)
 */
export function sanitizeText(dirty: string | null | undefined): string {
  if (!dirty) {
    return '';
  }

  // Usuń wszystkie tagi HTML
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanityzuje URL (sprawdza czy jest bezpieczny)
 */
export function sanitizeURL(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  // Sprawdź czy URL zaczyna się od dozwolonych protokołów
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  const urlObj = new URL(url, window.location.href);
  
  if (!allowedProtocols.includes(urlObj.protocol)) {
    console.warn(`⚠️ Niebezpieczny protokół w URL: ${urlObj.protocol}`);
    return '#';
  }

  return url;
}

/**
 * Sprawdza czy string zawiera potencjalnie niebezpieczne skrypty
 */
export function containsDangerousContent(content: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(content));
}

/**
 * Sanityzuje obiekt z danymi użytkownika
 */
export function sanitizeUserInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeText(input);
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeUserInput(item));
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeUserInput(input[key]);
      }
    }
    return sanitized;
  }
  
  return input;
}

