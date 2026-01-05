import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function testPgConnection() {
  const connectionString = process.env.DATABASE_URL;
  console.log('🔄 Testowanie połączenia z bazą danych Neon za pomocą pg...');
  console.log('📋 Connection string:', connectionString.replace(/:[^@]+@/, ':****@')); // Ukryj hasło
  
  const client = new Client({
    host: 'ep-silent-art-a2ghysu6-pooler.eu-central-1.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_ACv6bPGnWBL5',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Połączono z bazą danych!');
    
    const res = await client.query('SELECT NOW()');
    console.log('⏰ Czas serwera:', res.rows[0].now);
    
    const dbInfo = await client.query(`
      SELECT current_database() as database,
             current_user as user,
             version() as version
    `);
    console.log('📊 Informacje o bazie:', dbInfo.rows[0]);
    
  } catch (err) {
    console.error('❌ Błąd połączenia:', err.message);
  } finally {
    await client.end();
  }
}

testPgConnection();