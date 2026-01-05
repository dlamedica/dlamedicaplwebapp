// 🔒 BEZPIECZEŃSTWO: Session Security - zabezpieczenia sesji

/**
 * Sprawdza czy sesja jest bezpieczna
 */
function validateSessionSecurity(req) {
  // Sprawdź czy request jest przez HTTPS
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  
  // Sprawdź czy cookies są secure
  const cookies = req.headers.cookie || '';
  const hasSecureCookie = cookies.includes('Secure') || cookies.includes('HttpOnly');
  
  return {
    isSecure,
    hasSecureCookie,
    isValid: isSecure && (hasSecureCookie || process.env.NODE_ENV === 'development'),
  };
}

/**
 * Middleware do walidacji bezpieczeństwa sesji
 */
const validateSession = (req, res, next) => {
  // W produkcji wymagaj HTTPS
  if (process.env.NODE_ENV === 'production') {
    const sessionSecurity = validateSessionSecurity(req);
    
    if (!sessionSecurity.isSecure) {
      return res.status(403).json({
        error: 'Secure connection required',
        message: 'This application requires HTTPS in production',
      });
    }
  }
  
  next();
};

/**
 * Konfiguracja bezpiecznych cookies
 */
function getSecureCookieOptions() {
  return {
    httpOnly: true, // Zapobiega dostępowi przez JavaScript
    secure: process.env.NODE_ENV === 'production', // Tylko HTTPS w produkcji
    sameSite: 'lax', // Ochrona przed CSRF przy zachowaniu kompatybilności SPA
    maxAge: 24 * 60 * 60 * 1000, // 24 godziny
    path: '/',
  };
}

module.exports = {
  validateSession,
  validateSessionSecurity,
  getSecureCookieOptions,
};

