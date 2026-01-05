// 🔒 BEZPIECZEŃSTWO: Request Validator - walidacja struktury requestów

const SecurityLogger = require('./securityLogger');

/**
 * Sprawdza czy request ma prawidłową strukturę
 */
const validateRequestStructure = (req, res, next) => {
  // Sprawdź czy body nie jest zbyt głębokie (ochrona przed zagnieżdżonymi obiektami)
  const maxDepth = 10;
  
  function checkDepth(obj, depth = 0) {
    if (depth > maxDepth) {
      return false;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (!checkDepth(obj[key], depth + 1)) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  // Sprawdź body
  if (req.body && typeof req.body === 'object') {
    if (!checkDepth(req.body)) {
      SecurityLogger.logSuspiciousActivity(req, 'DEEP_NESTED_OBJECT', {
        path: req.path,
      });
      return res.status(400).json({
        error: 'Invalid request structure',
        message: 'Request body is too deeply nested',
      });
    }
  }

  // Sprawdź query parameters
  if (req.query && typeof req.query === 'object') {
    if (!checkDepth(req.query)) {
      SecurityLogger.logSuspiciousActivity(req, 'DEEP_NESTED_QUERY', {
        path: req.path,
      });
      return res.status(400).json({
        error: 'Invalid query structure',
        message: 'Query parameters are too deeply nested',
      });
    }
  }

  next();
};

/**
 * Sprawdza czy request nie zawiera zbyt wielu parametrów (ochrona przed DoS)
 */
const validateRequestSize = (req, res, next) => {
  const maxParams = 100;
  const maxKeys = 1000;

  // Sprawdź liczbę parametrów query
  if (req.query && Object.keys(req.query).length > maxParams) {
    SecurityLogger.logSuspiciousActivity(req, 'TOO_MANY_QUERY_PARAMS', {
      count: Object.keys(req.query).length,
    });
    return res.status(400).json({
      error: 'Too many query parameters',
      message: `Maximum ${maxParams} query parameters allowed`,
    });
  }

  // Sprawdź liczbę kluczy w body
  function countKeys(obj, count = 0) {
    if (count > maxKeys) {
      return count;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          count++;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            count = countKeys(obj[key], count);
          }
        }
      }
    }
    
    return count;
  }

  if (req.body && typeof req.body === 'object') {
    const keyCount = countKeys(req.body);
    if (keyCount > maxKeys) {
      SecurityLogger.logSuspiciousActivity(req, 'TOO_MANY_BODY_KEYS', {
        count: keyCount,
      });
      return res.status(400).json({
        error: 'Request body too large',
        message: `Maximum ${maxKeys} keys allowed in request body`,
      });
    }
  }

  next();
};

module.exports = {
  validateRequestStructure,
  validateRequestSize,
};

