// 🔒 BEZPIECZEŃSTWO: IP Blocking - blokada podejrzanych IP

const SecurityLogger = require('./securityLogger');

// Store blocked IPs in memory (w produkcji użyj Redis)
const blockedIPs = new Map();
const suspiciousIPs = new Map();

// Czas blokady (w milisekundach)
const BLOCK_DURATION = 60 * 60 * 1000; // 1 godzina

// Próg podejrzanych aktywności przed blokadą
const SUSPICIOUS_THRESHOLD = 5;

/**
 * Sprawdza czy IP jest zablokowane
 */
function isIPBlocked(ip) {
  const blockData = blockedIPs.get(ip);
  if (!blockData) {
    return false;
  }

  // Sprawdź czy blokada wygasła
  if (Date.now() > blockData.expires) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
}

/**
 * Blokuje IP na określony czas
 */
function blockIP(ip, reason, duration = BLOCK_DURATION) {
  blockedIPs.set(ip, {
    reason,
    blockedAt: Date.now(),
    expires: Date.now() + duration,
  });

  console.warn(`🚫 IP blocked: ${ip} - Reason: ${reason}`);
}

/**
 * Zwiększa licznik podejrzanych aktywności dla IP
 */
function incrementSuspiciousCount(ip) {
  const current = suspiciousIPs.get(ip) || { count: 0, firstSeen: Date.now() };
  current.count++;
  
  suspiciousIPs.set(ip, current);

  // Jeśli przekroczono próg, zablokuj IP
  if (current.count >= SUSPICIOUS_THRESHOLD) {
    blockIP(ip, `Exceeded suspicious activity threshold (${current.count} incidents)`);
    SecurityLogger.logSuspiciousActivity(
      { ip },
      'IP_BLOCKED',
      { count: current.count, reason: 'Threshold exceeded' }
    );
  }
}

/**
 * Resetuje licznik podejrzanych aktywności (po pewnym czasie)
 */
function resetSuspiciousCount(ip) {
  suspiciousIPs.delete(ip);
}

/**
 * Middleware do sprawdzania zablokowanych IP
 */
const checkBlockedIP = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress;

  if (!ip) {
    return next();
  }

  if (isIPBlocked(ip)) {
    const blockData = blockedIPs.get(ip);
    SecurityLogger.logSuspiciousActivity(req, 'BLOCKED_IP_ACCESS_ATTEMPT', {
      ip,
      reason: blockData.reason,
      blockedAt: new Date(blockData.blockedAt).toISOString(),
    });

    return res.status(403).json({
      error: 'Access denied',
      message: 'Your IP address has been temporarily blocked due to suspicious activity',
      retryAfter: Math.ceil((blockData.expires - Date.now()) / 1000), // sekundy
    });
  }

  next();
};

/**
 * Automatyczna blokada IP po wielu nieudanych próbach autoryzacji
 */
const autoBlockOnFailedAuth = (req, res, next) => {
  // To będzie wywoływane po nieudanej autoryzacji
  // Implementacja w auth middleware
  next();
};

// Cleanup wygasłych blokad (uruchamiaj co 10 minut)
setInterval(() => {
  const now = Date.now();
  
  // Usuń wygasłe blokady
  for (const [ip, data] of blockedIPs.entries()) {
    if (now > data.expires) {
      blockedIPs.delete(ip);
    }
  }
  
  // Resetuj stare liczniki podejrzanych aktywności (po 24h)
  for (const [ip, data] of suspiciousIPs.entries()) {
    if (now - data.firstSeen > 24 * 60 * 60 * 1000) {
      suspiciousIPs.delete(ip);
    }
  }
}, 10 * 60 * 1000);

module.exports = {
  checkBlockedIP,
  blockIP,
  isIPBlocked,
  incrementSuspiciousCount,
  resetSuspiciousCount,
  autoBlockOnFailedAuth,
};

