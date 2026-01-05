// 🔒 BEZPIECZEŃSTWO: Request Size Limiter - ograniczenie rozmiaru requestów

/**
 * Middleware do ograniczania rozmiaru requestów
 */
const limitRequestSize = (maxSizeBytes = 10 * 1024 * 1024) => { // 10MB default
  return (req, res, next) => {
    const contentLength = req.get('content-length');
    
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      return res.status(413).json({
        error: 'Payload too large',
        message: `Request body exceeds maximum size of ${maxSizeBytes / 1024 / 1024}MB`,
        maxSize: maxSizeBytes,
      });
    }

    // Monitoruj rozmiar podczas przesyłania
    let receivedBytes = 0;
    const originalOn = req.on.bind(req);
    
    req.on = function(event, callback) {
      if (event === 'data') {
        return originalOn(event, (chunk) => {
          receivedBytes += chunk.length;
          if (receivedBytes > maxSizeBytes) {
            return res.status(413).json({
              error: 'Payload too large',
              message: 'Request body exceeds maximum size',
            });
          }
          callback(chunk);
        });
      }
      return originalOn(event, callback);
    };

    next();
  };
};

/**
 * Różne limity dla różnych typów requestów
 */
const requestSizeLimits = {
  default: 10 * 1024 * 1024, // 10MB
  upload: 50 * 1024 * 1024, // 50MB dla uploadów
  json: 5 * 1024 * 1024, // 5MB dla JSON
  form: 20 * 1024 * 1024, // 20MB dla formularzy
};

module.exports = {
  limitRequestSize,
  requestSizeLimits,
};

