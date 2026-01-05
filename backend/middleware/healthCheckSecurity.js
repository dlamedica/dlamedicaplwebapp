// 🔒 BEZPIECZEŃSTWO: Health Check Security - bezpieczne health check endpoints

/**
 * Bezpieczny health check - nie ujawnia wrażliwych informacji
 */
const secureHealthCheck = (req, res) => {
  // Podstawowe informacje (bez wrażliwych danych)
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DlaMedica Education API',
    version: process.env.APP_VERSION || '1.0.0',
  };

  // W development dodaj więcej informacji
  if (process.env.NODE_ENV === 'development') {
    health.environment = process.env.NODE_ENV;
    health.uptime = process.uptime();
  }

  res.json(health);
};

/**
 * Szczegółowy health check (tylko dla adminów)
 */
const detailedHealthCheck = async (req, res) => {
  // Wymaga autoryzacji admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DlaMedica Education API',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    node: process.version,
  };

  res.json(health);
};

module.exports = {
  secureHealthCheck,
  detailedHealthCheck,
};

