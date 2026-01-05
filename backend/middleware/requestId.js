// 🔒 BEZPIECZEŃSTWO: Request ID Middleware - unikalne ID dla każdego requestu

const crypto = require('crypto');

/**
 * Generuje unikalny request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Middleware do dodawania request ID
 */
const addRequestId = (req, res, next) => {
  // Generuj lub użyj istniejącego request ID
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  // Dodaj do requestu
  req.requestId = requestId;
  
  // Dodaj do response headers
  res.setHeader('X-Request-ID', requestId);
  
  // Dodaj do response body (jeśli JSON)
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    if (typeof data === 'object' && data !== null) {
      data.requestId = requestId;
    }
    return originalJson(data);
  };
  
  next();
};

module.exports = {
  addRequestId,
  generateRequestId,
};

