// 🔒 BEZPIECZEŃSTWO: CSRF Protection Middleware

const crypto = require('crypto');
const SecurityLogger = require('./securityLogger');

// Store CSRF tokens in memory (w produkcji użyj Redis)
const csrfTokens = new Map();

// Czas życia tokena (15 minut)
const TOKEN_TTL = 15 * 60 * 1000;

/**
 * Generuje nowy CSRF token
 */
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Sprawdza czy token jest ważny
 */
function isValidToken(token) {
  if (!token) {
    return false;
  }

  const tokenData = csrfTokens.get(token);
  if (!tokenData) {
    return false;
  }

  // Sprawdź czy token nie wygasł
  if (Date.now() > tokenData.expires) {
    csrfTokens.delete(token);
    return false;
  }

  return true;
}

/**
 * Middleware do generowania CSRF tokena
 */
const generateCSRF = (req, res, next) => {
  // Generuj token tylko dla GET requestów (bezpieczne metody)
  if (req.method === 'GET') {
    const token = generateCSRFToken();
    const expires = Date.now() + TOKEN_TTL;
    
    csrfTokens.set(token, { expires, ip: req.ip });
    
    // Wyślij token w headerze
    res.setHeader('X-CSRF-Token', token);
    
    // Dodaj token do response body jeśli to JSON
    if (req.accepts('json')) {
      res.locals.csrfToken = token;
    }
  }
  
  next();
};

/**
 * Middleware do weryfikacji CSRF tokena
 */
const verifyCSRF = (req, res, next) => {
  // Bezpieczne metody HTTP nie wymagają CSRF protection
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Pobierz token z headerów lub body
  const token = req.headers['x-csrf-token'] || 
                req.headers['x-csrf-token'] || 
                req.body?._csrf ||
                req.query?._csrf;

  if (!token) {
    SecurityLogger.logSuspiciousActivity(req, 'CSRF_TOKEN_MISSING');
    return res.status(403).json({ 
      error: 'CSRF token missing',
      message: 'CSRF token is required for this request'
    });
  }

  if (!isValidToken(token)) {
    SecurityLogger.logSuspiciousActivity(req, 'CSRF_TOKEN_INVALID', { token: token.substring(0, 10) });
    return res.status(403).json({ 
      error: 'Invalid CSRF token',
      message: 'CSRF token is invalid or expired'
    });
  }

  // Sprawdź czy token pochodzi z tego samego IP (dodatkowa ochrona)
  const tokenData = csrfTokens.get(token);
  if (tokenData && tokenData.ip !== req.ip) {
    SecurityLogger.logSuspiciousActivity(req, 'CSRF_TOKEN_IP_MISMATCH', { 
      tokenIP: tokenData.ip, 
      requestIP: req.ip 
    });
    // Nie blokuj, ale zaloguj - IP może się zmienić (mobile, proxy)
  }

  // Usuń użyty token (one-time use)
  csrfTokens.delete(token);

  next();
};

/**
 * Cleanup wygasłych tokenów (uruchamiaj co 5 minut)
 */
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

module.exports = {
  generateCSRF,
  verifyCSRF,
  generateCSRFToken,
};

