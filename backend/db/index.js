/**
 * Klient bazy danych PostgreSQL
 * Lokalne połączenie PostgreSQL
 */

const { Pool } = require('pg');

// Konfiguracja puli połączeń
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dlamedica_db',
  user: process.env.DB_USER || 'dlamedica',
  password: process.env.DB_PASSWORD,
  max: 20, // maksymalna liczba połączeń w puli
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Zwiększony timeout dla stabilniejszych połączeń
});

// Logowanie połączenia
pool.on('connect', () => {
  console.log('📦 Połączono z bazą danych PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Błąd połączenia z bazą danych:', err);
});

/**
 * Wykonaj zapytanie SQL
 * @param {string} text - Zapytanie SQL
 * @param {Array} params - Parametry zapytania
 * @returns {Promise<{rows: Array, rowCount: number}>}
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Logowanie wolnych zapytań (> 100ms)
    if (duration > 100) {
      console.log('⚠️ Wolne zapytanie:', { text: text.substring(0, 100), duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Błąd zapytania SQL:', error.message);
    throw error;
  }
};

/**
 * Pobierz połączenie z puli (dla transakcji)
 * @returns {Promise<PoolClient>}
 */
const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);
  
  // Timeout dla połączenia - automatyczne zwolnienie po 5 sekundach
  const timeout = setTimeout(() => {
    console.error('⚠️ Klient nie został zwolniony w ciągu 5 sekund!');
  }, 5000);
  
  client.query = (...args) => {
    return originalQuery(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    return originalRelease();
  };
  
  return client;
};

/**
 * Wykonaj transakcję
 * @param {Function} callback - Funkcja z zapytaniami transakcji
 * @returns {Promise<any>}
 */
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Sprawdź połączenie z bazą danych
 * @returns {Promise<boolean>}
 */
const checkConnection = async () => {
  try {
    const result = await query('SELECT NOW() as now, current_database() as db');
    console.log('✅ Połączenie z bazą danych OK:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Nie można połączyć się z bazą danych:', error.message);
    return false;
  }
};

/**
 * Zamknij pulę połączeń
 */
const close = async () => {
  await pool.end();
  console.log('📦 Połączenie z bazą danych zamknięte');
};

// ============================================
// FUNKCJE POMOCNICZE DLA ZAPYTAŃ
// ============================================

/**
 * Pobierz jeden rekord
 * @param {string} table - Nazwa tabeli
 * @param {Object} where - Warunki WHERE
 * @param {string} select - Kolumny do pobrania (domyślnie *)
 * @returns {Promise<Object|null>}
 */
const findOne = async (table, where, select = '*') => {
  const keys = Object.keys(where);
  const values = Object.values(where);
  const conditions = keys.map((key, i) => `"${key}" = $${i + 1}`).join(' AND ');
  
  const result = await query(
    `SELECT ${select} FROM "${table}" WHERE ${conditions} LIMIT 1`,
    values
  );
  
  return result.rows[0] || null;
};

/**
 * Pobierz wiele rekordów
 * @param {string} table - Nazwa tabeli
 * @param {Object} where - Warunki WHERE (opcjonalne)
 * @param {Object} options - Opcje (select, orderBy, limit, offset)
 * @returns {Promise<Array>}
 */
const findMany = async (table, where = {}, options = {}) => {
  const { select = '*', orderBy, limit, offset } = options;
  
  let sql = `SELECT ${select} FROM "${table}"`;
  const values = [];
  
  // WHERE
  const keys = Object.keys(where);
  if (keys.length > 0) {
    const conditions = keys.map((key, i) => {
      values.push(where[key]);
      return `"${key}" = $${i + 1}`;
    }).join(' AND ');
    sql += ` WHERE ${conditions}`;
  }
  
  // ORDER BY
  if (orderBy) {
    const orderParts = Object.entries(orderBy).map(([col, dir]) => 
      `"${col}" ${dir === 'desc' ? 'DESC' : 'ASC'}`
    );
    sql += ` ORDER BY ${orderParts.join(', ')}`;
  }
  
  // LIMIT & OFFSET
  if (limit) sql += ` LIMIT ${parseInt(limit)}`;
  if (offset) sql += ` OFFSET ${parseInt(offset)}`;
  
  const result = await query(sql, values);
  return result.rows;
};

/**
 * Wstaw rekord
 * @param {string} table - Nazwa tabeli
 * @param {Object} data - Dane do wstawienia
 * @returns {Promise<Object>}
 */
const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.map(k => `"${k}"`).join(', ');
  
  const result = await query(
    `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  
  return result.rows[0];
};

/**
 * Aktualizuj rekord
 * @param {string} table - Nazwa tabeli
 * @param {Object} where - Warunki WHERE
 * @param {Object} data - Dane do aktualizacji
 * @returns {Promise<Object|null>}
 */
const update = async (table, where, data) => {
  const dataKeys = Object.keys(data);
  const dataValues = Object.values(data);
  const whereKeys = Object.keys(where);
  const whereValues = Object.values(where);
  
  const setClause = dataKeys.map((key, i) => `"${key}" = $${i + 1}`).join(', ');
  const whereClause = whereKeys.map((key, i) => `"${key}" = $${dataKeys.length + i + 1}`).join(' AND ');
  
  const result = await query(
    `UPDATE "${table}" SET ${setClause} WHERE ${whereClause} RETURNING *`,
    [...dataValues, ...whereValues]
  );
  
  return result.rows[0] || null;
};

/**
 * Usuń rekord
 * @param {string} table - Nazwa tabeli
 * @param {Object} where - Warunki WHERE
 * @returns {Promise<boolean>}
 */
const remove = async (table, where) => {
  const keys = Object.keys(where);
  const values = Object.values(where);
  const conditions = keys.map((key, i) => `"${key}" = $${i + 1}`).join(' AND ');
  
  const result = await query(
    `DELETE FROM "${table}" WHERE ${conditions}`,
    values
  );
  
  return result.rowCount > 0;
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  checkConnection,
  close,
  // Funkcje pomocnicze
  findOne,
  findMany,
  insert,
  update,
  remove,
};

