/**
 * Endpointy autoryzacji - PostgreSQL
 * Własna implementacja z PostgreSQL
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const {
  generateTokens,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticateToken,
} = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  sessionControlOnLogin,
  createSession,
  logoutAllSessions,
  detectDeviceType,
  getClientIP,
} = require('../middleware/sessionControl');

// ============================================
// WALIDATORY
// ============================================

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Nieprawidłowy adres email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Hasło musi mieć minimum 8 znaków')
    .matches(/[A-Z]/)
    .withMessage('Hasło musi zawierać wielką literę')
    .matches(/[a-z]/)
    .withMessage('Hasło musi zawierać małą literę')
    .matches(/[0-9]/)
    .withMessage('Hasło musi zawierać cyfrę'),
  body('full_name').trim().notEmpty().withMessage('Imię i nazwisko jest wymagane'),
  body('profession').optional().trim(),
  body('account_type').optional().isIn(['individual', 'company', 'university', 'institution']),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Nieprawidłowy adres email'),
  body('password').notEmpty().withMessage('Hasło jest wymagane'),
];

// ============================================
// REJESTRACJA
// ============================================

/**
 * POST /api/auth/register
 * Rejestracja nowego użytkownika
 */
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Walidacja danych wejściowych
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Błąd walidacji',
        details: errors.array() 
      });
    }

    const { 
      email, 
      password, 
      full_name, 
      profession,
      specialization,
      account_type = 'individual',
      company_name,
      city,
    } = req.body;

    // Sprawdź czy email już istnieje
    const existingUser = await db.query(
      'SELECT id FROM auth.users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Użytkownik z tym adresem email już istnieje' });
    }

    // Zahashuj hasło
    const hashedPassword = await hashPassword(password);

    // Utwórz użytkownika w transakcji
    const result = await db.transaction(async (client) => {
      const userId = uuidv4();
      const now = new Date().toISOString();

      // 1. Utwórz rekord w auth.users
      await client.query(
        `INSERT INTO auth.users (
          id, email, encrypted_password, email_confirmed_at,
          created_at, updated_at, role, raw_user_meta_data, aud, is_sso_user, is_anonymous
        ) VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10)`,
        [
          userId,
          email.toLowerCase(),
          hashedPassword,
          now, // Auto-potwierdzenie email
          now,
          'authenticated',
          JSON.stringify({
            full_name,
            profession,
            role: account_type === 'company' ? 'company' : 'user',
          }),
          'authenticated',
          false,
          false,
        ]
      );

      // 2. Utwórz rekord w public.users
      await client.query(
        `INSERT INTO public.users (
          id, email, full_name, profession, specialization,
          account_type, company_name, city, created_at, updated_at,
          is_active, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11)`,
        [
          userId,
          email.toLowerCase(),
          full_name,
          profession || null,
          specialization || null,
          account_type,
          company_name || null,
          city || null,
          now,
          true,
          true,
        ]
      );

      return { id: userId, email: email.toLowerCase() };
    });

    // Wygeneruj tokeny
    const tokens = generateTokens({ 
      id: result.id, 
      email: result.email,
      role: account_type === 'company' ? 'company' : 'user',
    });

    // Zapisz sesję
    await db.query(
      `INSERT INTO auth.sessions (id, user_id, created_at, updated_at, aal, factor_id)
       VALUES ($1, $2, NOW(), NOW(), 'aal1', NULL)`,
      [uuidv4(), result.id]
    );

    res.status(201).json({
      message: 'Rejestracja zakończona pomyślnie',
      user: {
        id: result.id,
        email: result.email,
        full_name,
      },
      ...tokens,
    });

  } catch (error) {
    console.error('❌ Błąd rejestracji:', error);
    res.status(500).json({ error: 'Błąd podczas rejestracji. Spróbuj ponownie.' });
  }
});

// ============================================
// LOGOWANIE
// ============================================

/**
 * POST /api/auth/login
 * Logowanie użytkownika
 */
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Walidacja danych wejściowych
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Błąd walidacji',
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Pobierz użytkownika z informacjami o blokadzie
    const result = await db.query(
      `SELECT 
        au.id, au.email, au.encrypted_password, au.role, au.raw_user_meta_data,
        au.failed_login_attempts, au.locked_until,
        u.full_name, u.profession, u.specialization, u.avatar_url, u.account_type,
        u.company_name, u.city, u.is_active
       FROM auth.users au
       LEFT JOIN public.users u ON u.id = au.id
       WHERE au.email = $1 AND au.deleted_at IS NULL`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    const user = result.rows[0];

    // 🔒 Sprawdź czy konto jest zablokowane
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ 
        error: 'Konto tymczasowo zablokowane',
        message: `Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za ${remainingMinutes} minut.`,
        locked_until: user.locked_until
      });
    }

    // Sprawdź czy konto jest aktywne
    if (user.is_active === false) {
      return res.status(403).json({ error: 'Konto zostało dezaktywowane' });
    }

    // Weryfikuj hasło
    const isValidPassword = await comparePassword(password, user.encrypted_password);
    
    if (!isValidPassword) {
      // 🔒 Zwiększ licznik nieudanych prób
      const newAttempts = (user.failed_login_attempts || 0) + 1;
      const MAX_ATTEMPTS = 5;
      const LOCKOUT_MINUTES = 15;

      if (newAttempts >= MAX_ATTEMPTS) {
        // Zablokuj konto na 15 minut
        await db.query(
          `UPDATE auth.users 
           SET failed_login_attempts = $1, 
               locked_until = NOW() + INTERVAL '${LOCKOUT_MINUTES} minutes',
               updated_at = NOW() 
           WHERE id = $2`,
          [newAttempts, user.id]
        );
        return res.status(423).json({ 
          error: 'Konto zablokowane',
          message: `Zbyt wiele nieudanych prób logowania. Konto zablokowane na ${LOCKOUT_MINUTES} minut.`
        });
      } else {
        await db.query(
          'UPDATE auth.users SET failed_login_attempts = $1, updated_at = NOW() WHERE id = $2',
          [newAttempts, user.id]
        );
        return res.status(401).json({ 
          error: 'Nieprawidłowy email lub hasło',
          remaining_attempts: MAX_ATTEMPTS - newAttempts
        });
      }
    }

    // 🔒 Resetuj licznik nieudanych prób przy udanym logowaniu
    await db.query(
      `UPDATE auth.users
       SET last_sign_in_at = NOW(),
           failed_login_attempts = 0,
           locked_until = NULL,
           updated_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    // ============================================
    // 🛡️ KONTROLA SESJI - MULTI-DEVICE PROTECTION
    // ============================================
    const sessionControl = await sessionControlOnLogin(user.id, req);

    if (!sessionControl.allowed) {
      // Logowanie zablokowane
      const statusCode = sessionControl.error === 'ACCOUNT_SUSPENDED' ? 403 : 401;
      return res.status(statusCode).json({
        error: sessionControl.error,
        message: sessionControl.message,
        reason: sessionControl.reason || null,
        loggedOutAll: sessionControl.loggedOutAll || false,
      });
    }

    // Aktualizuj last_login w public.users
    await db.query(
      'UPDATE public.users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Wygeneruj tokeny
    const userRole = user.raw_user_meta_data?.role ||
                     (user.account_type === 'company' ? 'company' : 'user');

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: userRole,
    });

    // Utwórz nową sesję z pełnymi danymi urządzenia
    const sessionId = uuidv4();
    const sessionInfo = await createSession(user.id, req, sessionId);

    res.json({
      message: 'Logowanie pomyślne',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        profession: user.profession,
        specialization: user.specialization,
        avatar_url: user.avatar_url,
        account_type: user.account_type,
        company_name: user.company_name,
        city: user.city,
        role: userRole,
        user_metadata: user.raw_user_meta_data || {},
      },
      session: {
        id: sessionId,
        device_type: sessionInfo.deviceType,
        ip: sessionInfo.ip,
      },
      ...tokens,
    });

  } catch (error) {
    console.error('❌ Błąd logowania:', error);
    res.status(500).json({ error: 'Błąd podczas logowania. Spróbuj ponownie.' });
  }
});

// ============================================
// WYLOGOWANIE
// ============================================

/**
 * POST /api/auth/logout
 * Wylogowanie użytkownika
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];

    if (sessionId) {
      // Dezaktywuj konkretną sesję
      await db.query(
        `UPDATE auth.sessions SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
        [sessionId]
      );
    } else {
      // Dezaktywuj wszystkie sesje użytkownika
      await db.query(
        `UPDATE auth.sessions SET is_active = FALSE, updated_at = NOW() WHERE user_id = $1`,
        [req.user.id]
      );
    }

    res.json({ message: 'Wylogowano pomyślnie' });
  } catch (error) {
    console.error('❌ Błąd wylogowania:', error);
    res.status(500).json({ error: 'Błąd podczas wylogowania' });
  }
});

/**
 * POST /api/auth/logout-all
 * Wylogowanie ze wszystkich urządzeń
 */
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await logoutAllSessions(req.user.id);
    res.json({ message: 'Wylogowano ze wszystkich urządzeń' });
  } catch (error) {
    console.error('❌ Błąd wylogowania:', error);
    res.status(500).json({ error: 'Błąd podczas wylogowania' });
  }
});

/**
 * GET /api/auth/sessions
 * Pobiera aktywne sesje użytkownika
 */
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, device_type, ip, user_agent, created_at, last_activity
       FROM auth.sessions
       WHERE user_id = $1 AND is_active = TRUE
       ORDER BY last_activity DESC`,
      [req.user.id]
    );

    res.json({
      sessions: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('❌ Błąd pobierania sesji:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania sesji' });
  }
});

// ============================================
// ODŚWIEŻANIE TOKENA
// ============================================

/**
 * POST /api/auth/refresh
 * Odświeżenie tokena dostępu
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token jest wymagany' });
    }

    // Weryfikuj refresh token
    const decoded = verifyToken(refresh_token);
    
    if (!decoded || decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Nieprawidłowy refresh token' });
    }

    // Pobierz użytkownika
    const result = await db.query(
      `SELECT au.id, au.email, au.role, au.raw_user_meta_data, u.account_type
       FROM auth.users au
       LEFT JOIN public.users u ON u.id = au.id
       WHERE au.id = $1 AND au.deleted_at IS NULL`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Użytkownik nie istnieje' });
    }

    const user = result.rows[0];
    const userRole = user.raw_user_meta_data?.role || 
                     (user.account_type === 'company' ? 'company' : 'user');

    // Wygeneruj nowe tokeny
    const tokens = generateTokens({ 
      id: user.id, 
      email: user.email,
      role: userRole,
    });

    res.json({
      message: 'Token odświeżony',
      ...tokens,
    });

  } catch (error) {
    console.error('❌ Błąd odświeżania tokena:', error);
    res.status(500).json({ error: 'Błąd podczas odświeżania tokena' });
  }
});

// ============================================
// POBIERZ AKTUALNEGO UŻYTKOWNIKA
// ============================================

/**
 * GET /api/auth/me
 * Pobiera dane zalogowanego użytkownika
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        au.id, au.email, au.role as auth_role, au.raw_user_meta_data,
        au.email_confirmed_at, au.created_at as auth_created_at,
        u.full_name, u.phone, u.avatar_url, u.profession, u.specialization,
        u.experience_years, u.license_number, u.account_type,
        u.company_name, u.company_nip, u.company_address, u.company_website,
        u.company_logo_url, u.company_description, u.company_size,
        u.city, u.voivodeship, u.country, u.job_seeking, u.available_for_locum,
        u.willing_to_relocate, u.is_active, u.email_verified,
        u.created_at, u.updated_at, u.last_login
       FROM auth.users au
       LEFT JOIN public.users u ON u.id = au.id
       WHERE au.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }

    const user = result.rows[0];
    const role = user.raw_user_meta_data?.role || 
                 (user.account_type === 'company' ? 'company' : 'user');

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      profession: user.profession,
      specialization: user.specialization,
      experience_years: user.experience_years,
      license_number: user.license_number,
      account_type: user.account_type,
      company_name: user.company_name,
      company_nip: user.company_nip,
      company_address: user.company_address,
      company_website: user.company_website,
      company_logo_url: user.company_logo_url,
      company_description: user.company_description,
      company_size: user.company_size,
      city: user.city,
      voivodeship: user.voivodeship,
      country: user.country,
      job_seeking: user.job_seeking,
      available_for_locum: user.available_for_locum,
      willing_to_relocate: user.willing_to_relocate,
      is_active: user.is_active,
      email_verified: user.email_verified,
      role: role,
      user_metadata: user.raw_user_meta_data || {},
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
    });

  } catch (error) {
    console.error('❌ Błąd pobierania użytkownika:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania danych użytkownika' });
  }
});

// ============================================
// ZMIANA HASŁA
// ============================================

/**
 * POST /api/auth/change-password
 * Zmiana hasła zalogowanego użytkownika
 */
router.post('/change-password', authenticateToken, [
  body('current_password').notEmpty().withMessage('Aktualne hasło jest wymagane'),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('Nowe hasło musi mieć minimum 8 znaków')
    .matches(/[A-Z]/)
    .withMessage('Hasło musi zawierać wielką literę')
    .matches(/[a-z]/)
    .withMessage('Hasło musi zawierać małą literę')
    .matches(/[0-9]/)
    .withMessage('Hasło musi zawierać cyfrę'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Błąd walidacji',
        details: errors.array() 
      });
    }

    const { current_password, new_password } = req.body;

    // Pobierz aktualne hasło
    const result = await db.query(
      'SELECT encrypted_password FROM auth.users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }

    // Weryfikuj aktualne hasło
    const isValid = await comparePassword(current_password, result.rows[0].encrypted_password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Nieprawidłowe aktualne hasło' });
    }

    // Zahashuj nowe hasło i zapisz
    const newHashedPassword = await hashPassword(new_password);
    
    await db.query(
      'UPDATE auth.users SET encrypted_password = $1, updated_at = NOW() WHERE id = $2',
      [newHashedPassword, req.user.id]
    );

    res.json({ message: 'Hasło zostało zmienione' });

  } catch (error) {
    console.error('❌ Błąd zmiany hasła:', error);
    res.status(500).json({ error: 'Błąd podczas zmiany hasła' });
  }
});

// ============================================
// RESETOWANIE HASŁA (żądanie)
// ============================================

/**
 * POST /api/auth/forgot-password
 * Wysyła email z linkiem do resetowania hasła
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Nieprawidłowy adres email'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Błąd walidacji',
        details: errors.array() 
      });
    }

    const { email } = req.body;

    // Sprawdź czy użytkownik istnieje
    const result = await db.query(
      'SELECT id FROM auth.users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    );

    // Zawsze zwracaj sukces (bezpieczeństwo - nie ujawniaj czy email istnieje)
    if (result.rows.length === 0) {
      return res.json({ 
        message: 'Jeśli konto istnieje, email z instrukcjami został wysłany' 
      });
    }

    // Wygeneruj token resetowania
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 godzina

    // Zapisz token w bazie
    await db.query(
      `UPDATE auth.users 
       SET recovery_token = $1, recovery_sent_at = NOW(), updated_at = NOW() 
       WHERE id = $2`,
      [resetToken, result.rows[0].id]
    );

    // Wyślij email przez n8n webhook
    try {
      const n8nWebhookUrl = process.env.N8N_PASSWORD_RESET_WEBHOOK || 'https://dlamedica.app.n8n.cloud/webhook/password-reset';
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          token: resetToken
        })
      });
      console.log(`📧 Reset email wysłany do: ${email}`);
    } catch (emailError) {
      console.error('⚠️ Błąd wysyłki emaila reset:', emailError.message);
      // Nie blokuj - użytkownik i tak dostanie komunikat sukcesu
    }

    res.json({ 
      message: 'Jeśli konto istnieje, email z instrukcjami został wysłany',
      // W dev możesz zwrócić token
      ...(process.env.NODE_ENV === 'development' && { reset_token: resetToken }),
    });

  } catch (error) {
    console.error('❌ Błąd resetowania hasła:', error);
    res.status(500).json({ error: 'Błąd podczas resetowania hasła' });
  }
});

// ============================================
// RESETOWANIE HASŁA (wykonanie)
// ============================================

/**
 * POST /api/auth/reset-password
 * Ustawia nowe hasło po weryfikacji tokena
 */
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token jest wymagany'),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('Hasło musi mieć minimum 8 znaków')
    .matches(/[A-Z]/)
    .withMessage('Hasło musi zawierać wielką literę')
    .matches(/[a-z]/)
    .withMessage('Hasło musi zawierać małą literę')
    .matches(/[0-9]/)
    .withMessage('Hasło musi zawierać cyfrę'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Błąd walidacji',
        details: errors.array() 
      });
    }

    const { token, new_password } = req.body;

    // Znajdź użytkownika z tym tokenem
    const result = await db.query(
      `SELECT id, recovery_sent_at 
       FROM auth.users 
       WHERE recovery_token = $1 AND deleted_at IS NULL`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Nieprawidłowy lub wygasły token' });
    }

    // Sprawdź czy token nie wygasł (1 godzina)
    const tokenAge = Date.now() - new Date(result.rows[0].recovery_sent_at).getTime();
    if (tokenAge > 3600000) {
      return res.status(400).json({ error: 'Token wygasł. Poproś o nowy link.' });
    }

    // Zahashuj nowe hasło i zapisz
    const hashedPassword = await hashPassword(new_password);
    
    await db.query(
      `UPDATE auth.users 
       SET encrypted_password = $1, recovery_token = NULL, recovery_sent_at = NULL, updated_at = NOW() 
       WHERE id = $2`,
      [hashedPassword, result.rows[0].id]
    );

    res.json({ message: 'Hasło zostało zresetowane. Możesz się teraz zalogować.' });

  } catch (error) {
    console.error('❌ Błąd resetowania hasła:', error);
    res.status(500).json({ error: 'Błąd podczas resetowania hasła' });
  }
});

// ============================================
// AKTUALIZACJA PROFILU
// ============================================

/**
 * PUT /api/auth/profile
 * Aktualizacja profilu użytkownika
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedFields = [
      'full_name', 'phone', 'avatar_url', 'profession', 'specialization',
      'experience_years', 'license_number', 'company_name', 'company_nip',
      'company_address', 'company_website', 'company_logo_url', 'company_description',
      'company_size', 'city', 'voivodeship', 'country', 'job_seeking',
      'available_for_locum', 'willing_to_relocate',
    ];

    // Mapowanie aliasów (frontend może wysyłać różne nazwy pól)
    const fieldMapping = {
      'profile_image_url': 'avatar_url',
      'company_bio': 'company_description',
    };

    // Filtruj tylko dozwolone pola i mapuj aliasy
    const updates = {};
    for (const [field, value] of Object.entries(req.body)) {
      // Sprawdź czy to alias
      const mappedField = fieldMapping[field] || field;
      
      // Jeśli pole jest dozwolone (lub jego alias)
      if (allowedFields.includes(mappedField)) {
        // Akceptuj wszystkie wartości (nawet puste stringi i null), ale pomiń undefined
        if (value !== undefined) {
          updates[mappedField] = value === '' ? null : value;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Brak danych do aktualizacji' });
    }

    updates.updated_at = new Date().toISOString();

    // Buduj zapytanie UPDATE
    const setClause = Object.keys(updates)
      .map((key, i) => `"${key}" = $${i + 1}`)
      .join(', ');
    
    const values = [...Object.values(updates), req.user.id];

    await db.query(
      `UPDATE public.users SET ${setClause} WHERE id = $${values.length}`,
      values
    );

    // Aktualizuj też metadata w auth.users jeśli zmieniono imię/nazwisko
    if (updates.full_name) {
      await db.query(
        `UPDATE auth.users 
         SET raw_user_meta_data = raw_user_meta_data || $1::jsonb, updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify({ full_name: updates.full_name }), req.user.id]
      );
    }

    // Pobierz zaktualizowany profil
    const result = await db.query(
      `SELECT * FROM public.users WHERE id = $1`,
      [req.user.id]
    );

    res.json({
      message: 'Profil zaktualizowany',
      user: result.rows[0],
    });

  } catch (error) {
    console.error('❌ Błąd aktualizacji profilu:', error);
    res.status(500).json({ error: 'Błąd podczas aktualizacji profilu' });
  }
});

module.exports = router;

