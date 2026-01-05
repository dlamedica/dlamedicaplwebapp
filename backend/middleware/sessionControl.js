/**
 * Session Control Middleware
 * Kontrola sesji - max 1 mobile + 1 desktop
 * Przy 3. urządzeniu wyloguj ze wszystkich
 * Przy >3 unikalnych IP - zawieś konto
 */

const db = require('../db');
const UAParser = require('ua-parser-js');

// Konfiguracja
const MAX_UNIQUE_IPS = 3; // Maksymalna liczba unikalnych IP przed zawieszeniem
const MAX_MOBILE_SESSIONS = 1; // Max sesji mobile/tablet
const MAX_DESKTOP_SESSIONS = 1; // Max sesji desktop

/**
 * Wykrywa typ urządzenia na podstawie User-Agent
 */
function detectDeviceType(userAgent) {
  if (!userAgent) return 'desktop';

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  if (device.type === 'mobile') return 'mobile';
  if (device.type === 'tablet') return 'tablet';
  return 'desktop';
}

/**
 * Pobiera IP klienta z request
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown';
}

/**
 * Generuje fingerprint urządzenia
 */
function generateDeviceFingerprint(req) {
  const ua = req.headers['user-agent'] || '';
  const accept = req.headers['accept'] || '';
  const acceptLang = req.headers['accept-language'] || '';

  // Prosty hash z dostępnych danych
  const data = `${ua}|${accept}|${acceptLang}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Sprawdza i rejestruje IP użytkownika
 * Zwraca informację o przekroczeniu limitu IP
 */
async function checkAndRegisterIP(userId, ip, deviceType, userAgent) {
  // Pobierz wszystkie unikalne IP użytkownika
  const existingIPs = await db.query(
    `SELECT ip_address, device_type, login_count
     FROM auth.user_login_ips
     WHERE user_id = $1
     ORDER BY last_seen DESC`,
    [userId]
  );

  const ipExists = existingIPs.rows.find(row => row.ip_address === ip);

  if (ipExists) {
    // Aktualizuj istniejące IP
    await db.query(
      `UPDATE auth.user_login_ips
       SET last_seen = NOW(), login_count = login_count + 1, device_type = $3, user_agent = $4
       WHERE user_id = $1 AND ip_address = $2`,
      [userId, ip, deviceType, userAgent]
    );
    return { shouldSuspend: false, uniqueIPs: existingIPs.rows.length };
  }

  // Nowe IP - sprawdź limit
  const uniqueIPCount = existingIPs.rows.length + 1;

  // Zapisz nowe IP
  await db.query(
    `INSERT INTO auth.user_login_ips (user_id, ip_address, device_type, user_agent)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, ip_address) DO UPDATE
     SET last_seen = NOW(), login_count = auth.user_login_ips.login_count + 1`,
    [userId, ip, deviceType, userAgent]
  );

  return {
    shouldSuspend: uniqueIPCount > MAX_UNIQUE_IPS,
    uniqueIPs: uniqueIPCount
  };
}

/**
 * Sprawdza aktywne sesje użytkownika
 * Zwraca informację czy należy wylogować ze wszystkich
 */
async function checkActiveSessions(userId, deviceType, currentSessionId) {
  // Pobierz aktywne sesje
  const activeSessions = await db.query(
    `SELECT id, device_type, ip, user_agent, created_at, last_activity
     FROM auth.sessions
     WHERE user_id = $1 AND is_active = TRUE AND id != $2
     ORDER BY last_activity DESC`,
    [userId, currentSessionId || '00000000-0000-0000-0000-000000000000']
  );

  const sessions = activeSessions.rows;

  // Zlicz sesje po typie urządzenia
  const mobileSessions = sessions.filter(s => s.device_type === 'mobile' || s.device_type === 'tablet');
  const desktopSessions = sessions.filter(s => s.device_type === 'desktop');

  // Sprawdź czy to nowa sesja mobile/tablet
  const isMobileDevice = deviceType === 'mobile' || deviceType === 'tablet';

  let shouldLogoutAll = false;
  let existingSessionsOfSameType = isMobileDevice ? mobileSessions : desktopSessions;
  let existingSessionsOfOtherType = isMobileDevice ? desktopSessions : mobileSessions;

  // Jeśli już mamy max sesji tego typu I max sesji innego typu = to 3. urządzenie
  const maxSameType = isMobileDevice ? MAX_MOBILE_SESSIONS : MAX_DESKTOP_SESSIONS;
  const maxOtherType = isMobileDevice ? MAX_DESKTOP_SESSIONS : MAX_MOBILE_SESSIONS;

  if (existingSessionsOfSameType.length >= maxSameType && existingSessionsOfOtherType.length >= maxOtherType) {
    // To jest 3. urządzenie - wyloguj wszystkich
    shouldLogoutAll = true;
  }

  return {
    shouldLogoutAll,
    activeSessions: sessions,
    mobileSessions: mobileSessions.length,
    desktopSessions: desktopSessions.length,
  };
}

/**
 * Wylogowuje wszystkie sesje użytkownika
 */
async function logoutAllSessions(userId) {
  await db.query(
    `UPDATE auth.sessions
     SET is_active = FALSE, updated_at = NOW()
     WHERE user_id = $1`,
    [userId]
  );

  console.log(`🔒 Wylogowano wszystkie sesje użytkownika: ${userId}`);
}

/**
 * Zawiesza konto użytkownika
 */
async function suspendAccount(userId, reason) {
  await db.transaction(async (client) => {
    // Zawieś w auth.users
    await client.query(
      `UPDATE auth.users
       SET is_suspended = TRUE, suspended_at = NOW(), suspension_reason = $2, updated_at = NOW()
       WHERE id = $1`,
      [userId, reason]
    );

    // Zawieś w public.users
    await client.query(
      `UPDATE public.users
       SET is_suspended = TRUE, suspended_at = NOW(), suspension_reason = $2, updated_at = NOW()
       WHERE id = $1`,
      [userId, reason]
    );

    // Wyloguj wszystkie sesje
    await client.query(
      `UPDATE auth.sessions SET is_active = FALSE, updated_at = NOW() WHERE user_id = $1`,
      [userId]
    );
  });

  console.log(`⛔ Konto zawieszone: ${userId}, powód: ${reason}`);
}

/**
 * Tworzy nową sesję
 */
async function createSession(userId, req, sessionId) {
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  const deviceType = detectDeviceType(userAgent);
  const fingerprint = generateDeviceFingerprint(req);

  await db.query(
    `INSERT INTO auth.sessions (id, user_id, ip, user_agent, device_type, device_fingerprint, is_active, created_at, updated_at, last_activity, aal)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW(), NOW(), 'aal1')
     ON CONFLICT (id) DO UPDATE
     SET ip = $3, user_agent = $4, device_type = $5, is_active = TRUE, last_activity = NOW(), updated_at = NOW()`,
    [sessionId, userId, ip, userAgent, deviceType, fingerprint]
  );

  return { ip, userAgent, deviceType, fingerprint };
}

/**
 * Middleware do kontroli sesji przy logowaniu
 * Wywoływane po weryfikacji hasła, przed wydaniem tokena
 */
async function sessionControlOnLogin(userId, req) {
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  const deviceType = detectDeviceType(userAgent);

  // 1. Sprawdź czy konto nie jest zawieszone
  const userResult = await db.query(
    `SELECT is_suspended, suspension_reason FROM auth.users WHERE id = $1`,
    [userId]
  );

  if (userResult.rows[0]?.is_suspended) {
    return {
      allowed: false,
      error: 'ACCOUNT_SUSPENDED',
      message: 'Konto zostało zawieszone z powodu podejrzanej aktywności. Skontaktuj się z administratorem.',
      reason: userResult.rows[0].suspension_reason
    };
  }

  // 2. Sprawdź i zarejestruj IP
  const ipCheck = await checkAndRegisterIP(userId, ip, deviceType, userAgent);

  if (ipCheck.shouldSuspend) {
    // Przekroczono limit IP - zawieś konto
    await suspendAccount(userId, `Przekroczono limit ${MAX_UNIQUE_IPS} unikalnych adresów IP`);
    return {
      allowed: false,
      error: 'ACCOUNT_SUSPENDED',
      message: 'Konto zostało zawieszone z powodu logowania z zbyt wielu lokalizacji. Skontaktuj się z administratorem.',
    };
  }

  // 3. Sprawdź aktywne sesje
  const sessionCheck = await checkActiveSessions(userId, deviceType, null);

  if (sessionCheck.shouldLogoutAll) {
    // 3. urządzenie - wyloguj wszystkich
    await logoutAllSessions(userId);
    return {
      allowed: false,
      error: 'TOO_MANY_DEVICES',
      message: 'Wykryto próbę logowania z trzeciego urządzenia. Wszystkie sesje zostały zakończone. Zaloguj się ponownie.',
      loggedOutAll: true
    };
  }

  // 4. Wyloguj starsze sesje tego samego typu jeśli przekraczamy limit
  const isMobileDevice = deviceType === 'mobile' || deviceType === 'tablet';
  const maxForType = isMobileDevice ? MAX_MOBILE_SESSIONS : MAX_DESKTOP_SESSIONS;
  const sessionsOfType = isMobileDevice ? sessionCheck.mobileSessions : sessionCheck.desktopSessions;

  if (sessionsOfType >= maxForType) {
    // Wyloguj najstarszą sesję tego typu
    await db.query(
      `UPDATE auth.sessions
       SET is_active = FALSE, updated_at = NOW()
       WHERE id = (
         SELECT id FROM auth.sessions
         WHERE user_id = $1 AND device_type = ANY($2) AND is_active = TRUE
         ORDER BY last_activity ASC
         LIMIT 1
       )`,
      [userId, isMobileDevice ? ['mobile', 'tablet'] : ['desktop']]
    );
    console.log(`📱 Wylogowano starszą sesję ${deviceType} użytkownika ${userId}`);
  }

  return {
    allowed: true,
    deviceType,
    ip,
    uniqueIPs: ipCheck.uniqueIPs,
    activeSessions: {
      mobile: sessionCheck.mobileSessions,
      desktop: sessionCheck.desktopSessions
    }
  };
}

/**
 * Middleware do aktualizacji aktywności sesji
 */
async function updateSessionActivity(sessionId) {
  if (!sessionId) return;

  await db.query(
    `UPDATE auth.sessions SET last_activity = NOW() WHERE id = $1`,
    [sessionId]
  ).catch(() => {}); // Ignoruj błędy - nie krytyczne
}

/**
 * Middleware sprawdzający czy sesja jest aktywna
 */
async function checkSessionActive(req, res, next) {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    return next(); // Brak session ID - kontynuuj bez sprawdzania
  }

  try {
    const result = await db.query(
      `SELECT is_active, user_id FROM auth.sessions WHERE id = $1`,
      [sessionId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        error: 'SESSION_EXPIRED',
        message: 'Sesja wygasła lub została zakończona na innym urządzeniu. Zaloguj się ponownie.'
      });
    }

    // Aktualizuj aktywność
    await updateSessionActivity(sessionId);

    next();
  } catch (error) {
    console.error('❌ Błąd sprawdzania sesji:', error);
    next(); // Kontynuuj mimo błędu
  }
}

module.exports = {
  detectDeviceType,
  getClientIP,
  generateDeviceFingerprint,
  checkAndRegisterIP,
  checkActiveSessions,
  logoutAllSessions,
  suspendAccount,
  createSession,
  sessionControlOnLogin,
  updateSessionActivity,
  checkSessionActive,
  MAX_UNIQUE_IPS,
  MAX_MOBILE_SESSIONS,
  MAX_DESKTOP_SESSIONS,
};
