/**
 * Middleware autoryzacji - PostgreSQL
 * Własna implementacja JWT z lokalną bazą PostgreSQL
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const SecurityLogger = require('./securityLogger');
const { incrementSuspiciousCount } = require('./ipBlocking');

// Konfiguracja JWT
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('❌ FATAL: JWT_SECRET must be set and be at least 32 characters');
  process.exit(1);
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Generuje token JWT dla użytkownika
 * @param {Object} user - Obiekt użytkownika
 * @returns {Object} - access_token i refresh_token
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  };

  const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refresh_token = jwt.sign({ id: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  return { access_token, refresh_token };
};

/**
 * Weryfikuje token JWT
 * @param {string} token - Token JWT
 * @returns {Object|null} - Zdekodowany payload lub null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Hashuje hasło
 * @param {string} password - Hasło w plain text
 * @returns {Promise<string>} - Zahashowane hasło
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Porównuje hasło z hashem
 * @param {string} password - Hasło w plain text
 * @param {string} hash - Hash hasła
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Middleware do weryfikacji tokena JWT
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    SecurityLogger.logUnauthorizedAccess(req, 'Missing token');
    return res.status(401).json({ error: 'Token dostępu jest wymagany' });
  }

  // Walidacja formatu tokena
  if (token.length < 20) {
    SecurityLogger.logSuspiciousActivity(req, 'INVALID_TOKEN_FORMAT', { tokenLength: token.length });
    return res.status(401).json({ error: 'Nieprawidłowy format tokena' });
  }

  try {
    const decoded = verifyToken(token);
    
    if (!decoded) {
      SecurityLogger.logFailedAuth(req, 'Invalid token');
      const ip = req.ip || req.connection?.remoteAddress;
      if (ip) incrementSuspiciousCount(ip);
      return res.status(403).json({ error: 'Nieprawidłowy token' });
    }

    // Pobierz użytkownika z bazy danych
    const user = await db.query(
      `SELECT 
        au.id, au.email, au.role, au.raw_user_meta_data,
        u.full_name, u.profession, u.avatar_url, u.account_type
       FROM auth.users au
       LEFT JOIN public.users u ON u.id = au.id
       WHERE au.id = $1 AND au.deleted_at IS NULL`,
      [decoded.id]
    );

    if (user.rows.length === 0) {
      SecurityLogger.logFailedAuth(req, 'User not found');
      return res.status(403).json({ error: 'Użytkownik nie istnieje' });
    }

    // Dodaj użytkownika do requesta
    req.user = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      role: user.rows[0].role || user.rows[0].raw_user_meta_data?.role || 'user',
      full_name: user.rows[0].full_name,
      profession: user.rows[0].profession,
      avatar_url: user.rows[0].avatar_url,
      account_type: user.rows[0].account_type,
      user_metadata: user.rows[0].raw_user_meta_data || {},
    };

    next();
  } catch (error) {
    SecurityLogger.logFailedAuth(req, error.message || 'Token verification failed');
    return res.status(403).json({ error: 'Weryfikacja tokena nie powiodła się' });
  }
};

/**
 * Middleware sprawdzający rolę użytkownika
 * @param {Array<string>} roles - Dozwolone role
 */
const requireRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Wymagana autentykacja' });
    }

    try {
      // Pobierz profil z rolą z bazy
      const result = await db.query(
        `SELECT u.account_type, au.raw_user_meta_data
         FROM public.users u
         JOIN auth.users au ON au.id = u.id
         WHERE u.id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Profil użytkownika nie znaleziony' });
      }

      const userRole = result.rows[0].raw_user_meta_data?.role || 
                       result.rows[0].account_type || 
                       'user';

      if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'Niewystarczające uprawnienia' });
      }

      req.userProfile = result.rows[0];
      next();
    } catch (error) {
      console.error('Błąd weryfikacji roli:', error);
      return res.status(500).json({ error: 'Błąd weryfikacji uprawnień' });
    }
  };
};

/**
 * Middleware sprawdzający czy użytkownik ma konto premium
 */
const requirePremium = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Wymagana autentykacja' });
  }

  try {
    const result = await db.query(
      `SELECT raw_user_meta_data->>'is_premium' as is_premium
       FROM auth.users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0 || result.rows[0].is_premium !== 'true') {
      return res.status(403).json({ error: 'Wymagana subskrypcja premium' });
    }

    next();
  } catch (error) {
    console.error('Błąd weryfikacji premium:', error);
    return res.status(500).json({ error: 'Błąd weryfikacji premium' });
  }
};

/**
 * Opcjonalna autentykacja - nie blokuje jeśli brak tokena
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    
    if (decoded) {
      const user = await db.query(
        `SELECT id, email, role, raw_user_meta_data
         FROM auth.users
         WHERE id = $1 AND deleted_at IS NULL`,
        [decoded.id]
      );

      if (user.rows.length > 0) {
        req.user = {
          id: user.rows[0].id,
          email: user.rows[0].email,
          role: user.rows[0].role || user.rows[0].raw_user_meta_data?.role || 'user',
          user_metadata: user.rows[0].raw_user_meta_data || {},
        };
      }
    }
  } catch (error) {
    // Ignoruj błędy - opcjonalna autentykacja
    req.user = null;
  }

  next();
};

/**
 * Walidacja API Key dla integracji n8n/zewnętrznych
 * WYMAGA ustawienia N8N_API_KEY w .env (bez fallbacków!)
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.N8N_API_KEY;

  if (!validKey) {
    console.error('❌ N8N_API_KEY not configured in environment');
    return res.status(503).json({ error: 'API key not configured' });
  }

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

module.exports = {
  // Tokeny
  generateTokens,
  verifyToken,
  // Hasła
  hashPassword,
  comparePassword,
  // Middleware
  authenticateToken,
  requireRole,
  requirePremium,
  optionalAuth,
  validateApiKey,
  // Stałe
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
