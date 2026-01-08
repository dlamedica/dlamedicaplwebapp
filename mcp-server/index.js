/**
 * MCP Server dla DlaMedica
 * Daje Claude dostęp do bazy danych, systemu i n8n
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

// n8n Configuration
const N8N_URL = process.env.N8N_URL || 'https://dlamedica.app.n8n.cloud';
const N8N_API_KEY = process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDU4ODQ4My0zZjEyLTQ0MDctODJhYi05NWRhMmRjOWUyYmUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2OTQ4OTQ5fQ.tEFpN-03zsC_lg3Vnwn5XQgya33h4ZCqLg73C8PXT9o';

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
      },
      // n8n Tools
      {
        name: 'n8n_list_workflows',
        description: 'Pokaż listę wszystkich workflow w n8n'
      },
      {
        name: 'n8n_get_workflow',
        description: 'Pobierz szczegóły workflow',
        parameters: {
          workflow_id: { type: 'string', description: 'ID workflow' }
        }
      },
      {
        name: 'n8n_activate_workflow',
        description: 'Aktywuj/deaktywuj workflow',
        parameters: {
          workflow_id: { type: 'string', description: 'ID workflow' },
          active: { type: 'boolean', description: 'true = aktywuj, false = deaktywuj' }
        }
      },
      {
        name: 'n8n_execute_workflow',
        description: 'Uruchom workflow manualnie',
        parameters: {
          workflow_id: { type: 'string', description: 'ID workflow' },
          data: { type: 'object', description: 'Dane wejściowe (opcjonalne)', optional: true }
        }
      },
      {
        name: 'n8n_create_workflow',
        description: 'Stwórz nowy workflow',
        parameters: {
          name: { type: 'string', description: 'Nazwa workflow' },
          nodes: { type: 'array', description: 'Tablica nodes workflow' },
          connections: { type: 'object', description: 'Połączenia między nodes' }
        }
      },
      {
        name: 'n8n_update_workflow',
        description: 'Aktualizuj istniejący workflow',
        parameters: {
          workflow_id: { type: 'string', description: 'ID workflow' },
          data: { type: 'object', description: 'Dane do aktualizacji' }
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

      // n8n Tools
      case 'n8n_list_workflows':
        result = await n8nRequest('GET', '/workflows');
        break;

      case 'n8n_get_workflow':
        result = await n8nRequest('GET', `/workflows/${parameters.workflow_id}`);
        break;

      case 'n8n_activate_workflow':
        result = await n8nRequest('PATCH', `/workflows/${parameters.workflow_id}`, {
          active: parameters.active
        });
        break;

      case 'n8n_execute_workflow':
        result = await n8nRequest('POST', `/workflows/${parameters.workflow_id}/run`, parameters.data || {});
        break;

      case 'n8n_create_workflow':
        result = await n8nRequest('POST', '/workflows', {
          name: parameters.name,
          nodes: parameters.nodes,
          connections: parameters.connections,
          active: false
        });
        break;

      case 'n8n_update_workflow':
        result = await n8nRequest('PUT', `/workflows/${parameters.workflow_id}`, parameters.data);
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
    'npm ', 'node ', 'curl '
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
// n8n API Functions
// ============================================

async function n8nRequest(method, endpoint, body = null) {
  const url = `${N8N_URL}/api/v1${endpoint}`;

  const options = {
    method,
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  console.log(`🔗 n8n API: ${method} ${endpoint}`);

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`n8n API Error (${response.status}): ${errorText}`);
  }

  return response.json();
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
