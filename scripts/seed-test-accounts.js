/**
 * Skrypt seedujący konta testowe
 * Uruchomienie: node scripts/seed-test-accounts.js
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dlamedica_db',
  user: process.env.DB_USER || 'dlamedica',
  password: process.env.DB_PASSWORD || 'DlaMedica2024',
});

const TEST_PASSWORD = 'Test1234';

const TEST_ACCOUNTS = [
  {
    email: 'admin@dlamedica.pl',
    full_name: 'Administrator Systemu',
    profession: 'Administrator',
    role: 'admin',
    account_type: 'individual',
  },
  {
    email: 'lekarz@dlamedica.pl',
    full_name: 'Dr Jan Kowalski',
    profession: 'Lekarz',
    specialization: 'Kardiologia',
    role: 'lekarz',
    account_type: 'individual',
  },
  {
    email: 'student@dlamedica.pl',
    full_name: 'Anna Nowak',
    profession: 'Student medycyny',
    role: 'student',
    account_type: 'individual',
  },
  {
    email: 'firma@dlamedica.pl',
    full_name: 'MedCorp Sp. z o.o.',
    profession: null,
    role: 'company',
    account_type: 'company',
    company_name: 'MedCorp Sp. z o.o.',
  },
];

async function seedAccounts() {
  const client = await pool.connect();

  try {
    console.log('🌱 Seedowanie kont testowych...\n');

    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

    for (const account of TEST_ACCOUNTS) {
      const userId = uuidv4();
      const now = new Date().toISOString();

      // Sprawdź czy konto już istnieje
      const existing = await client.query(
        'SELECT id FROM auth.users WHERE email = $1',
        [account.email]
      );

      if (existing.rows.length > 0) {
        // Aktualizuj istniejące konto
        const existingId = existing.rows[0].id;

        await client.query(`
          UPDATE auth.users SET
            encrypted_password = $1,
            failed_login_attempts = 0,
            locked_until = NULL,
            updated_at = NOW()
          WHERE id = $2
        `, [hashedPassword, existingId]);

        // Sprawdź czy jest rekord w public.users
        const publicUser = await client.query(
          'SELECT id FROM public.users WHERE id = $1',
          [existingId]
        );

        if (publicUser.rows.length === 0) {
          await client.query(`
            INSERT INTO public.users (id, email, full_name, profession, specialization, account_type, company_name, is_active, email_verified, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true, true, $8, $8)
          `, [existingId, account.email, account.full_name, account.profession, account.specialization || null, account.account_type, account.company_name || null, now]);
        }

        console.log(`✅ Zaktualizowano: ${account.email}`);
      } else {
        // Utwórz nowe konto
        await client.query(`
          INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role, raw_user_meta_data, aud, is_sso_user, is_anonymous)
          VALUES ($1, $2, $3, $4, $4, $4, 'authenticated', $5, 'authenticated', false, false)
        `, [
          userId,
          account.email,
          hashedPassword,
          now,
          JSON.stringify({
            role: account.role,
            full_name: account.full_name,
            created_by: 'seed-script',
          }),
        ]);

        await client.query(`
          INSERT INTO public.users (id, email, full_name, profession, specialization, account_type, company_name, is_active, email_verified, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, true, true, $8, $8)
        `, [userId, account.email, account.full_name, account.profession, account.specialization || null, account.account_type, account.company_name || null, now]);

        console.log(`✅ Utworzono: ${account.email}`);
      }
    }

    console.log('\n========================================');
    console.log('🎉 Konta testowe gotowe!');
    console.log('========================================');
    console.log(`Hasło dla wszystkich kont: ${TEST_PASSWORD}`);
    console.log('----------------------------------------');
    TEST_ACCOUNTS.forEach(acc => {
      console.log(`  ${acc.email}`);
    });
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Błąd:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedAccounts().catch(console.error);
