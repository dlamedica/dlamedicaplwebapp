// 🔒 BEZPIECZEŃSTWO: Search Sanitizer - sanityzacja zapytań wyszukiwania

const SecurityLogger = require('./securityLogger');

/**
 * Niebezpieczne wzorce w zapytaniach wyszukiwania
 */
const DANGEROUS_SEARCH_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /eval\(/i,
  /expression\(/i,
  /vbscript:/i,
  /data:text\/html/i,
  /union.*select/i,
  /select.*from/i,
  /insert.*into/i,
  /delete.*from/i,
  /drop.*table/i,
  /exec\(/i,
  /xp_cmdshell/i,
  /--/i,
  /\/\*/i,
  /\.\.\//g,
  /\.\.\\/g,
  /;.*\||&|`|\$\(/,
];

/**
 * Sanityzuje zapytanie wyszukiwania
 */
function sanitizeSearchQuery(query) {
  if (typeof query !== 'string' || !query) {
    return '';
  }

  // Sprawdź czy zawiera niebezpieczne wzorce
  for (const pattern of DANGEROUS_SEARCH_PATTERNS) {
    if (pattern.test(query)) {
      SecurityLogger.logInjectionAttempt(
        { path: '/search', method: 'GET' },
        'SEARCH_INJECTION',
        query.substring(0, 200)
      );
      return ''; // Zwróć pusty string dla niebezpiecznych zapytań
    }
  }

  // Usuń niebezpieczne znaki i ogranicz długość
  return query
    .replace(/[<>]/g, '') // Usuń < >
    .replace(/['"]/g, '') // Usuń cudzysłowy
    .trim()
    .substring(0, 200); // Ogranicz długość do 200 znaków
}

/**
 * Middleware do sanityzacji zapytań wyszukiwania
 */
const sanitizeSearch = (req, res, next) => {
  // Sanityzuj parametry wyszukiwania
  if (req.query.q) {
    const originalQuery = req.query.q;
    const sanitizedQuery = sanitizeSearchQuery(originalQuery);
    
    if (sanitizedQuery !== originalQuery) {
      req.query.q = sanitizedQuery;
      
      // Jeśli zapytanie zostało całkowicie usunięte, zwróć błąd
      if (!sanitizedQuery) {
        return res.status(400).json({
          error: 'Invalid search query',
          message: 'Search query contains potentially dangerous content',
        });
      }
    }
  }

  // Sanityzuj inne parametry wyszukiwania
  ['type', 'difficulty', 'category', 'filter'].forEach(param => {
    if (req.query[param]) {
      const sanitized = sanitizeSearchQuery(req.query[param]);
      if (!sanitized) {
        delete req.query[param];
      } else {
        req.query[param] = sanitized;
      }
    }
  });

  next();
};

module.exports = {
  sanitizeSearch,
  sanitizeSearchQuery,
};

