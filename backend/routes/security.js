// 🔒 BEZPIECZEŃSTWO: Security Endpoints - informacje o bezpieczeństwie (tylko dla adminów)

const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const SecurityLogger = require('../middleware/securityLogger');
const { isIPBlocked } = require('../middleware/ipBlocking');
const fs = require('fs');
const path = require('path');

// 🔒 Walidacja formatu adresu IP (IPv4 i IPv6)
const isValidIP = (ip) => {
  if (!ip || typeof ip !== 'string') return false;
  
  // IPv4 pattern
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 pattern (simplified - covers most common formats)
  const ipv6Pattern = /^(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7}|::)$/;
  
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

// GET /api/security/status - status bezpieczeństwa (tylko admin)
router.get('/status',
  authenticateToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      // Podstawowe informacje o bezpieczeństwie (bez wrażliwych danych)
      const securityStatus = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        https: req.secure || req.headers['x-forwarded-proto'] === 'https',
        rateLimiting: true,
        csrfProtection: true,
        inputValidation: true,
        fileUploadSecurity: true,
        auditLogging: true,
        ipBlocking: true,
        securityHeaders: true,
      };

      res.json(securityStatus);
    } catch (error) {
      console.error('Error fetching security status:', error);
      res.status(500).json({ error: 'Failed to fetch security status' });
    }
  }
);

// GET /api/security/logs - ostatnie logi bezpieczeństwa (tylko admin)
router.get('/logs',
  authenticateToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const logFile = path.join(__dirname, '../../security.log');
      
      if (!fs.existsSync(logFile)) {
        return res.json({ logs: [], message: 'No security logs found' });
      }

      // Przeczytaj ostatnie 100 linii
      const logContent = fs.readFileSync(logFile, 'utf-8');
      const lines = logContent.split('\n').filter(line => line.trim());
      const recentLogs = lines.slice(-100).map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });

      res.json({
        total: lines.length,
        recent: recentLogs.length,
        logs: recentLogs.reverse(), // Najnowsze na początku
      });
    } catch (error) {
      console.error('Error fetching security logs:', error);
      res.status(500).json({ error: 'Failed to fetch security logs' });
    }
  }
);

// GET /api/security/stats - statystyki bezpieczeństwa (tylko admin)
router.get('/stats',
  authenticateToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const logFile = path.join(__dirname, '../../security.log');
      
      let stats = {
        unauthorizedAccess: 0,
        rateLimitExceeded: 0,
        failedAuth: 0,
        suspiciousActivity: 0,
        injectionAttempts: 0,
        sensitiveDataChanges: 0,
      };

      if (fs.existsSync(logFile)) {
        const logContent = fs.readFileSync(logFile, 'utf-8');
        const lines = logContent.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
          try {
            const entry = JSON.parse(line);
            switch (entry.type) {
              case 'UNAUTHORIZED_ACCESS':
                stats.unauthorizedAccess++;
                break;
              case 'RATE_LIMIT_EXCEEDED':
                stats.rateLimitExceeded++;
                break;
              case 'FAILED_AUTH':
                stats.failedAuth++;
                break;
              case 'SUSPICIOUS_ACTIVITY':
                stats.suspiciousActivity++;
                break;
              case 'INJECTION_ATTEMPT':
                stats.injectionAttempts++;
                break;
              case 'SENSITIVE_DATA_CHANGE':
                stats.sensitiveDataChanges++;
                break;
            }
          } catch {
            // Ignoruj nieprawidłowe linie
          }
        });
      }

      res.json({
        timestamp: new Date().toISOString(),
        stats,
      });
    } catch (error) {
      console.error('Error fetching security stats:', error);
      res.status(500).json({ error: 'Failed to fetch security stats' });
    }
  }
);

// POST /api/security/test-ip - test czy IP jest zablokowane (tylko admin)
router.post('/test-ip',
  authenticateToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { ip } = req.body;
      
      if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
      }

      // 🔒 Walidacja formatu IP
      if (!isValidIP(ip)) {
        return res.status(400).json({ 
          error: 'Invalid IP address format',
          message: 'Podaj prawidłowy adres IPv4 lub IPv6'
        });
      }

      const blocked = isIPBlocked(ip);

      res.json({
        ip,
        blocked,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error testing IP:', error);
      res.status(500).json({ error: 'Failed to test IP' });
    }
  }
);

module.exports = router;

