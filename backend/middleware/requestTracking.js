// 🔒 BEZPIECZEŃSTWO: Request Tracking - śledzenie requestów dla monitoringu

const crypto = require('crypto');
const SecurityLogger = require('./securityLogger');

/**
 * Generuje unikalny ID dla requestu (bez zewnętrznych zależności)
 */
function generateRequestId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Middleware do śledzenia requestów
 */
const trackRequest = (req, res, next) => {
  // Generuj unikalny ID dla requestu
  const requestId = generateRequestId();
  req.requestId = requestId;
  
  // Dodaj request ID do response headers
  res.setHeader('X-Request-ID', requestId);
  
  // Zapisz timestamp rozpoczęcia requestu
  req.requestStartTime = Date.now();
  
  // Loguj request (tylko w development lub dla podejrzanych)
  if (process.env.NODE_ENV === 'development') {
    console.log(`📥 [${requestId}] ${req.method} ${req.path} - IP: ${req.ip}`);
  }
  
  // Śledź czas odpowiedzi
  res.on('finish', () => {
    const duration = Date.now() - req.requestStartTime;
    
    // Loguj długie requesty (potencjalny problem)
    if (duration > 5000) {
      console.warn(`⚠️ Slow request [${requestId}]: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Loguj błędy
    if (res.statusCode >= 400) {
      SecurityLogger.logSuspiciousActivity(req, 'HTTP_ERROR', {
        statusCode: res.statusCode,
        duration,
        requestId,
      });
    }
  });
  
  next();
};

/**
 * Middleware do logowania podejrzanych requestów
 */
const detectSuspiciousRequests = (req, res, next) => {
  const suspiciousPatterns = [
    // SQL injection patterns
    /union.*select/i,
    /select.*from/i,
    /insert.*into/i,
    /delete.*from/i,
    /drop.*table/i,
    /exec\(/i,
    /xp_cmdshell/i,
    
    // Path traversal
    /\.\.\//g,
    /\.\.\\/g,
    
    // Command injection
    /;.*\||&|`|\$\(/,
    
    // XSS patterns
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
  ];
  
  // Sprawdź URL
  const url = req.originalUrl || req.url;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      SecurityLogger.logInjectionAttempt(req, 'URL_INJECTION', url);
      return res.status(400).json({ error: 'Invalid request' });
    }
  }
  
  // Sprawdź query params
  const queryString = JSON.stringify(req.query);
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(queryString)) {
      SecurityLogger.logInjectionAttempt(req, 'QUERY_INJECTION', queryString.substring(0, 200));
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
  }
  
  // Sprawdź user agent (możliwe boty/scannery)
  const userAgent = req.get('user-agent') || '';
  const suspiciousUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
    /burp/i,
    /scanner/i,
  ];
  
  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      SecurityLogger.logSuspiciousActivity(req, 'SUSPICIOUS_USER_AGENT', { userAgent });
      // Nie blokuj, ale zaloguj
    }
  }
  
  next();
};

module.exports = {
  trackRequest,
  detectSuspiciousRequests,
  generateRequestId,
};

