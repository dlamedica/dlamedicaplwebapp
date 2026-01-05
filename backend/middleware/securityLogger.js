// 🔒 BEZPIECZEŃSTWO: Security Logging - logowanie podejrzanych aktywności

const fs = require('fs');
const path = require('path');

const SECURITY_LOG_FILE = path.join(__dirname, '../../security.log');
const MAX_LOG_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Rotacja logów jeśli plik jest za duży
 */
function rotateLogIfNeeded() {
  try {
    if (fs.existsSync(SECURITY_LOG_FILE)) {
      const stats = fs.statSync(SECURITY_LOG_FILE);
      if (stats.size > MAX_LOG_FILE_SIZE) {
        const backupFile = `${SECURITY_LOG_FILE}.${Date.now()}`;
        fs.renameSync(SECURITY_LOG_FILE, backupFile);
        // Zachowaj tylko ostatnie 5 backupów
        const backups = fs.readdirSync(path.dirname(SECURITY_LOG_FILE))
          .filter(f => f.startsWith('security.log.'))
          .sort()
          .reverse()
          .slice(5);
        backups.forEach(backup => {
          fs.unlinkSync(path.join(path.dirname(SECURITY_LOG_FILE), backup));
        });
      }
    }
  } catch (error) {
    console.error('Error rotating security log:', error);
  }
}

/**
 * Zapisuje log do pliku
 */
function writeToLogFile(logEntry) {
  try {
    rotateLogIfNeeded();
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(SECURITY_LOG_FILE, logLine, { flag: 'a' });
  } catch (error) {
    console.error('Error writing to security log file:', error);
  }
}

/**
 * Loguje zdarzenia bezpieczeństwa do monitoringu
 */
class SecurityLogger {
  /**
   * Loguje próbę nieautoryzowanego dostępu
   */
  static logUnauthorizedAccess(req, reason) {
    const logEntry = {
      type: 'UNAUTHORIZED_ACCESS',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
      reason,
      userId: req.user?.id || 'anonymous',
    };
    
    console.warn('⚠️ SECURITY:', JSON.stringify(logEntry));
    writeToLogFile(logEntry);
    // W produkcji: wyślij do systemu monitoringu (Sentry, CloudWatch, etc.)
    if (process.env.SENTRY_DSN) {
      // Integracja z Sentry (jeśli dostępne)
      // Sentry.captureMessage('Unauthorized access attempt', { extra: logEntry });
    }
  }

  /**
   * Loguje próbę przekroczenia rate limitu
   */
  static logRateLimitExceeded(req, limitType) {
    const logEntry = {
      type: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
      limitType,
      userId: req.user?.id || 'anonymous',
    };
    
    console.warn('⚠️ RATE LIMIT:', JSON.stringify(logEntry));
    writeToLogFile(logEntry);
  }

  /**
   * Loguje nieudaną próbę autoryzacji
   */
  static logFailedAuth(req, reason) {
    const logEntry = {
      type: 'FAILED_AUTH',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
      reason,
      email: req.body?.email || 'unknown',
    };
    
    console.warn('⚠️ FAILED AUTH:', JSON.stringify(logEntry));
    writeToLogFile(logEntry);
  }

  /**
   * Loguje podejrzane aktywności
   */
  static logSuspiciousActivity(req, activity, details = {}) {
    const logEntry = {
      type: 'SUSPICIOUS_ACTIVITY',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
      activity,
      details,
      userId: req.user?.id || 'anonymous',
    };
    
    console.error('🚨 SUSPICIOUS:', JSON.stringify(logEntry));
    writeToLogFile(logEntry);
    // W produkcji: wyślij alert do administratora
    if (process.env.ALERT_WEBHOOK_URL) {
      // Można wysłać do webhook (Slack, Discord, etc.)
      // fetch(process.env.ALERT_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(logEntry) });
    }
  }

  /**
   * Loguje próbę SQL injection lub XSS
   */
  static logInjectionAttempt(req, attackType, payload) {
    const logEntry = {
      type: 'INJECTION_ATTEMPT',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
      attackType, // 'SQL_INJECTION', 'XSS', etc.
      payload: payload?.substring(0, 200), // Ogranicz długość
      userId: req.user?.id || 'anonymous',
    };
    
    console.error('🚨 INJECTION ATTEMPT:', JSON.stringify(logEntry));
    writeToLogFile(logEntry);
    // W produkcji: natychmiastowy alert + blokada IP
    if (process.env.ALERT_WEBHOOK_URL) {
      // fetch(process.env.ALERT_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(logEntry) });
    }
  }

  /**
   * Loguje zmianę wrażliwych danych
   */
  static logSensitiveDataChange(req, dataType, changeDetails) {
    const logEntry = {
      type: 'SENSITIVE_DATA_CHANGE',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
      dataType,
      changeDetails,
      userId: req.user?.id || 'unknown',
    };
    
    console.info('🔐 SENSITIVE CHANGE:', JSON.stringify(logEntry));
    writeToLogFile(logEntry);
  }
}

module.exports = SecurityLogger;

