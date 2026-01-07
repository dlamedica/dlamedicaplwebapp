/**
 * MCP Server dla DlaMedica
 * Daje Claude dostęp do bazy danych i systemu
 */

const express = require('express');
const { Pool } = require('pg');
const { exec } = require('child_process');
const cors = require('cors');
require('dotenv').config({ path: '../backend/.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dlamedica_db',
  user: process.env.DB_USER || 'dlamedica',
  password: process.env.DB_PASSWORD,
});

// Secret do autoryzacji (zmień na własny!)
const MCP_SECRET = process.env.MCP_SECRET || 'dlamedica-mcp-secret-2025';

// Middleware autoryzacji
const authorize = (req, res, next) => {
  const token = req.headers['x-mcp-token'];
  if (token !== MCP_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// ============================================
// ENDPOINTS
// ============================================

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Lista dostępnych narzędzi (tools)
 */
app.get('/tools', authorize, (req, res) => {
  res.json({
    tools: [
      {
        name: 'query_database',
        description: 'Wykonaj zapytanie SQL na bazie danych PostgreSQL',
        parameters: {
          sql: { type: 'string', description: 'Zapytanie SQL do wykonania' },
          params: { type: 'array', description: 'Parametry zapytania (opcjonalne)', optional: true }
        }
      },
      {
        name: 'list_tables',
        description: 'Pokaż listę wszystkich tabel w bazie danych'
      },
      {
        name: 'describe_table',
        description: 'Pokaż strukturę tabeli',
        parameters: {
          table_name: { type: 'string', description: 'Nazwa tabeli' }
        }
      },
      {
        name: 'run_command',
        description: 'Wykonaj komendę bash na serwerze (ograniczone)',
        parameters: {
          command: { type: 'string', description: 'Komenda do wykonania' }
        }
      },
      {
        name: 'pm2_status',
        description: 'Pokaż status procesów PM2'
      },
      {
        name: 'pm2_logs',
        description: 'Pokaż ostatnie logi z PM2',
        parameters: {
          process_name: { type: 'string', description: 'Nazwa procesu (np. dlamedica-backend)' },
          lines: { type: 'number', description: 'Liczba linii (domyślnie 50)', optional: true }
        }
      },
      {
        name: 'pm2_restart',
        description: 'Restartuj proces PM2',
        parameters: {
          process_name: { type: 'string', description: 'Nazwa procesu do restartu' }
        }
      }
    ]
  });
});

/**
 * Wykonaj narzędzie
 */
app.post('/execute', authorize, async (req, res) => {
  const { tool, parameters } = req.body;

  try {
    let result;

    switch (tool) {
      case 'query_database':
        result = await queryDatabase(parameters.sql, parameters.params);
        break;

      case 'list_tables':
        result = await listTables();
        break;

      case 'describe_table':
        result = await describeTable(parameters.table_name);
        break;

      case 'run_command':
        result = await runCommand(parameters.command);
        break;

      case 'pm2_status':
        result = await runCommand('pm2 jlist');
        break;

      case 'pm2_logs':
        const lines = parameters.lines || 50;
        result = await runCommand(`pm2 logs ${parameters.process_name} --lines ${lines} --nostream`);
        break;

      case 'pm2_restart':
        result = await runCommand(`pm2 restart ${parameters.process_name}`);
        break;

      default:
        return res.status(400).json({ error: `Unknown tool: ${tool}` });
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error('MCP Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// FUNKCJE NARZĘDZI
// ============================================

async function queryDatabase(sql, params = []) {
  // Zabezpieczenie przed destrukcyjnymi operacjami bez potwierdzenia
  const dangerousKeywords = ['DROP DATABASE', 'TRUNCATE', 'DELETE FROM'];
  const upperSql = sql.toUpperCase();

  for (const keyword of dangerousKeywords) {
    if (upperSql.includes(keyword) && !upperSql.includes('WHERE')) {
      throw new Error(`Niebezpieczna operacja wykryta: ${keyword}. Dodaj WHERE lub potwierdź operację.`);
    }
  }

  const result = await pool.query(sql, params);
  return {
    rows: result.rows,
    rowCount: result.rowCount,
    fields: result.fields?.map(f => f.name)
  };
}

async function listTables() {
  const result = await pool.query(`
    SELECT table_name, table_type
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  return result.rows;
}

async function describeTable(tableName) {
  // Zabezpieczenie przed SQL injection
  const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');

  const columns = await pool.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
  `, [safeTableName]);

  const indexes = await pool.query(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = $1
  `, [safeTableName]);

  return {
    table: safeTableName,
    columns: columns.rows,
    indexes: indexes.rows
  };
}

async function runCommand(command) {
  // Lista dozwolonych komend (bezpieczeństwo)
  const allowedPrefixes = [
    'pm2 ', 'ls ', 'cat ', 'head ', 'tail ', 'grep ',
    'df ', 'free ', 'uptime', 'whoami', 'pwd', 'date',
    'npm ', 'node '
  ];

  const isAllowed = allowedPrefixes.some(prefix => command.startsWith(prefix));
  if (!isAllowed) {
    throw new Error(`Komenda niedozwolona. Dozwolone prefiksy: ${allowedPrefixes.join(', ')}`);
  }

  return new Promise((resolve, reject) => {
    exec(command, { timeout: 30000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

// ============================================
// START SERWERA
// ============================================

const PORT = process.env.MCP_PORT || 9001;

app.listen(PORT, () => {
  console.log(`🔌 MCP Server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'dlamedica_db'}`);
  console.log(`🔒 Authorization required (X-MCP-Token header)`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down MCP server...');
  await pool.end();
  process.exit(0);
});
