// 🔒 BEZPIECZEŃSTWO: Query Sanitizer - sanityzacja parametrów query string

const SecurityLogger = require('./securityLogger');

/**
 * Niebezpieczne znaki i wzorce w query parameters
 */
const DANGEROUS_PATTERNS = [
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
 * Sanityzuje wartość query parameter
 */
function sanitizeQueryValue(value) {
  if (typeof value !== 'string') {
    return value;
  }

  // Sprawdź czy zawiera niebezpieczne wzorce
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(value)) {
      return null; // Odrzuć niebezpieczne wartości
    }
  }

  // Usuń niebezpieczne znaki
  return value
    .replace(/[<>]/g, '') // Usuń < >
    .replace(/['"]/g, '') // Usuń cudzysłowy
    .trim()
    .substring(0, 1000); // Ogranicz długość
}

/**
 * Middleware do sanityzacji query parameters
 */
const sanitizeQueryParams = (req, res, next) => {
  const originalQuery = { ...req.query };
  let hasSuspiciousContent = false;

  // Sanityzuj wszystkie query parameters
  for (const key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      const originalValue = req.query[key];
      const sanitizedValue = sanitizeQueryValue(originalValue);

      if (sanitizedValue === null) {
        // Wykryto niebezpieczną wartość
        hasSuspiciousContent = true;
        SecurityLogger.logInjectionAttempt(req, 'QUERY_INJECTION', {
          parameter: key,
          value: originalValue.substring(0, 200),
        });
        delete req.query[key];
      } else if (sanitizedValue !== originalValue) {
        // Wartość została zmodyfikowana
        req.query[key] = sanitizedValue;
      }
    }
  }

  // Jeśli wykryto podejrzaną zawartość, zablokuj request
  if (hasSuspiciousContent) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      message: 'Query parameters contain potentially dangerous content',
    });
  }

  next();
};

module.exports = {
  sanitizeQueryParams,
  sanitizeQueryValue,
};

