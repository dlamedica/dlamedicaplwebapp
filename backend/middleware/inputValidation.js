// 🔒 BEZPIECZEŃSTWO: Input Validation Middleware - ochrona przed injection attacks

const SecurityLogger = require('./securityLogger');

/**
 * Sprawdza czy string zawiera potencjalnie niebezpieczne wzorce
 */
function containsDangerousPatterns(input) {
  if (typeof input !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /union.*select/i, // SQL injection
    /select.*from/i,
    /insert.*into/i,
    /delete.*from/i,
    /drop.*table/i,
    /exec\(/i,
    /xp_cmdshell/i,
    /--/i, // SQL comment
    /\/\*/i, // SQL comment
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanityzuje string - usuwa niebezpieczne znaki
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input;
  }

  // Usuń null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Usuń kontrolne znaki (zachowaj whitespace)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

/**
 * Rekurencyjnie sanityzuje obiekt
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Middleware do sanityzacji danych wejściowych
 */
const sanitizeInput = (req, res, next) => {
  // Sanityzuj body
  if (req.body) {
    // Sprawdź czy nie zawiera niebezpiecznych wzorców
    const bodyString = JSON.stringify(req.body);
    if (containsDangerousPatterns(bodyString)) {
      SecurityLogger.logInjectionAttempt(req, 'XSS_OR_INJECTION', bodyString.substring(0, 200));
      return res.status(400).json({ 
        error: 'Invalid input detected',
        message: 'Request contains potentially dangerous content'
      });
    }
    
    req.body = sanitizeObject(req.body);
  }

  // Sanityzuj query params
  if (req.query) {
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        const value = req.query[key];
        if (typeof value === 'string' && containsDangerousPatterns(value)) {
          SecurityLogger.logInjectionAttempt(req, 'XSS_OR_INJECTION', `${key}=${value.substring(0, 100)}`);
          return res.status(400).json({ 
            error: 'Invalid query parameter',
            message: 'Query parameter contains potentially dangerous content'
          });
        }
        req.query[key] = sanitizeString(value);
      }
    }
  }

  // Sanityzuj params
  if (req.params) {
    for (const key in req.params) {
      if (req.params.hasOwnProperty(key)) {
        const value = req.params[key];
        if (typeof value === 'string' && containsDangerousPatterns(value)) {
          SecurityLogger.logInjectionAttempt(req, 'XSS_OR_INJECTION', `${key}=${value.substring(0, 100)}`);
          return res.status(400).json({ 
            error: 'Invalid parameter',
            message: 'Parameter contains potentially dangerous content'
          });
        }
        req.params[key] = sanitizeString(value);
      }
    }
  }

  next();
};

/**
 * Middleware do walidacji UUID
 */
const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    const uuid = req.params[paramName] || req.body[paramName] || req.query[paramName];
    
    if (!uuid) {
      return next(); // UUID nie jest wymagany
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(uuid)) {
      SecurityLogger.logSuspiciousActivity(req, 'INVALID_UUID', { paramName, value: uuid });
      return res.status(400).json({ 
        error: 'Invalid UUID format',
        message: `Parameter ${paramName} must be a valid UUID`
      });
    }

    next();
  };
};

/**
 * Middleware do walidacji email
 */
const validateEmail = (fieldName = 'email') => {
  return (req, res, next) => {
    const email = req.body[fieldName] || req.query[fieldName];
    
    if (!email) {
      return next(); // Email nie jest wymagany
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        message: `Field ${fieldName} must be a valid email address`
      });
    }

    // Sprawdź długość emaila
    if (email.length > 254) {
      return res.status(400).json({ 
        error: 'Email too long',
        message: 'Email address exceeds maximum length'
      });
    }

    next();
  };
};

/**
 * Middleware do ograniczenia rozmiaru request body
 */
const limitBodySize = (maxSize = 1024 * 1024) => { // 1MB default
  return (req, res, next) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    
    if (contentLength > maxSize) {
      return res.status(413).json({ 
        error: 'Payload too large',
        message: `Request body exceeds maximum size of ${maxSize} bytes`
      });
    }

    next();
  };
};

module.exports = {
  sanitizeInput,
  validateUUID,
  validateEmail,
  limitBodySize,
  containsDangerousPatterns,
  sanitizeString,
};

