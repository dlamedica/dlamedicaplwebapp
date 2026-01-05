// 🔒 BEZPIECZEŃSTWO: Response Sanitizer - sanityzacja odpowiedzi API

const SecurityLogger = require('./securityLogger');

/**
 * Pola które powinny być usunięte z odpowiedzi
 */
const SENSITIVE_FIELDS = [
  'password',
  'password_hash',
  'passwordHash',
  'secret',
  'secret_key',
  'api_key',
  'apiKey',
  'token',
  'access_token',
  'refresh_token',
  'auth_token',
  'private_key',
  'privateKey',
  'credit_card',
  'creditCard',
  'cvv',
  'ssn',
  'social_security_number',
  'bank_account',
  'bankAccount',
  'pin',
  'otp',
  'verification_code',
  'verificationCode',
];

/**
 * Rekurencyjnie usuwa wrażliwe pola z obiektu
 */
function sanitizeResponseData(obj, depth = 0, maxDepth = 10) {
  if (depth > maxDepth) {
    return obj;
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeResponseData(item, depth + 1, maxDepth));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = SENSITIVE_FIELDS.some(field => 
          lowerKey.includes(field.toLowerCase())
        );
        
        if (isSensitive) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = sanitizeResponseData(obj[key], depth + 1, maxDepth);
        }
      }
    }
    
    return sanitized;
  }

  return obj;
}

/**
 * Endpointy które muszą zwracać tokeny (logowanie, rejestracja, odświeżanie)
 */
const AUTH_TOKEN_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
];

/**
 * Middleware do sanityzacji odpowiedzi
 */
const sanitizeResponse = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = function(data) {
    // Nie sanityzuj tokenów dla endpointów auth - one MUSZĄ zwracać tokeny
    const isAuthEndpoint = AUTH_TOKEN_ENDPOINTS.some(ep => req.path === ep || req.originalUrl === ep);

    if (isAuthEndpoint) {
      // Dla auth endpointów zwróć dane bez zmian
      return originalJson(data);
    }

    // Sanityzuj dane przed wysłaniem
    const sanitizedData = sanitizeResponseData(data);

    // Loguj jeśli coś zostało usunięte
    if (JSON.stringify(data) !== JSON.stringify(sanitizedData)) {
      SecurityLogger.logSuspiciousActivity(req, 'SENSITIVE_DATA_IN_RESPONSE', {
        path: req.path,
        method: req.method,
      });
    }

    return originalJson(sanitizedData);
  };

  next();
};

module.exports = {
  sanitizeResponse,
  sanitizeResponseData,
};

