// 🔒 BEZPIECZEŃSTWO: Audit Log - szczegółowe logowanie operacji dla compliance

const SecurityLogger = require('./securityLogger');

/**
 * Typy operacji do logowania
 */
const AUDIT_OPERATIONS = {
  // Autoryzacja
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  PASSWORD_RESET: 'PASSWORD_RESET',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  
  // Dane użytkownika
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PROFILE_VIEW: 'PROFILE_VIEW',
  PROFILE_DELETE: 'PROFILE_DELETE',
  
  // Dane wrażliwe
  DATA_ACCESS: 'DATA_ACCESS',
  DATA_MODIFY: 'DATA_MODIFY',
  DATA_DELETE: 'DATA_DELETE',
  DATA_EXPORT: 'DATA_EXPORT',
  
  // Administracja
  ADMIN_ACTION: 'ADMIN_ACTION',
  ROLE_CHANGE: 'ROLE_CHANGE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  
  // System
  CONFIG_CHANGE: 'CONFIG_CHANGE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
};

/**
 * Loguje operację do audit log
 */
function logAuditEvent(req, operation, details = {}) {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    operation,
    userId: req.user?.id || 'anonymous',
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('user-agent'),
    method: req.method,
    path: req.path,
    requestId: req.requestId,
    details,
  };

  // Loguj do konsoli (w produkcji wyślij do systemu logowania)
  console.log('📋 AUDIT:', JSON.stringify(auditEntry));
  
  // Jeśli to wrażliwa operacja, loguj też do SecurityLogger
  const sensitiveOperations = [
    AUDIT_OPERATIONS.PASSWORD_CHANGE,
    AUDIT_OPERATIONS.PROFILE_DELETE,
    AUDIT_OPERATIONS.ADMIN_ACTION,
    AUDIT_OPERATIONS.ROLE_CHANGE,
    AUDIT_OPERATIONS.DATA_DELETE,
  ];
  
  if (sensitiveOperations.includes(operation)) {
    SecurityLogger.logSensitiveDataChange(req, operation, details);
  }
}

/**
 * Middleware do automatycznego logowania operacji
 */
const auditLog = (operation, getDetails = null) => {
  return (req, res, next) => {
    // Loguj przed wykonaniem
    const details = getDetails ? getDetails(req) : {};
    logAuditEvent(req, operation, details);
    
    // Śledź czas wykonania
    const startTime = Date.now();
    
    // Hook do logowania po zakończeniu
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const success = res.statusCode < 400;
      
      logAuditEvent(req, operation, {
        ...details,
        success,
        statusCode: res.statusCode,
        duration,
      });
    });
    
    next();
  };
};

/**
 * Loguje dostęp do wrażliwych danych
 */
function logDataAccess(req, dataType, recordId = null) {
  logAuditEvent(req, AUDIT_OPERATIONS.DATA_ACCESS, {
    dataType,
    recordId,
  });
}

/**
 * Loguje modyfikację danych
 */
function logDataModify(req, dataType, recordId, changes = {}) {
  logAuditEvent(req, AUDIT_OPERATIONS.DATA_MODIFY, {
    dataType,
    recordId,
    changes: Object.keys(changes), // Tylko klucze, nie wartości
  });
}

/**
 * Loguje usunięcie danych
 */
function logDataDelete(req, dataType, recordId) {
  logAuditEvent(req, AUDIT_OPERATIONS.DATA_DELETE, {
    dataType,
    recordId,
  });
}

module.exports = {
  AUDIT_OPERATIONS,
  logAuditEvent,
  auditLog,
  logDataAccess,
  logDataModify,
  logDataDelete,
};
