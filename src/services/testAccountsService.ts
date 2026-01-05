/**
 * TEST ACCOUNTS SERVICE
 * 
 * PILNY SERWIS do tworzenia kont testowych DlaMedica
 * Używa db.auth.signUp() do bezpiecznego tworzenia użytkowników
 */

import { db } from '../lib/apiClient';

export interface TestAccount {
  email: string;
  password: string;
  role: 'admin' | 'lekarz' | 'student' | 'firma';
  displayName: string;
  profile: {
    first_name: string;
    last_name: string;
    role: string;
    specialization?: string;
    institution?: string;
    year_of_study?: number;
    company_name?: string;
    company_type?: string;
  };
}

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: 'admin@dlamedica.pl',
    password: 'Admin123!',
    role: 'admin',
    displayName: 'Administrator DlaMedica',
    profile: {
      first_name: 'Admin',
      last_name: 'DlaMedica',
      role: 'admin',
      specialization: 'Zarządzanie systemem',
      institution: 'DlaMedica.pl'
    }
  },
  {
    email: 'lekarz@dlamedica.pl',
    password: 'Lekarz123!',
    role: 'lekarz',
    displayName: 'Dr Jan Kowalski',
    profile: {
      first_name: 'Jan',
      last_name: 'Kowalski',
      role: 'lekarz',
      specialization: 'Kardiologia',
      institution: 'Szpital Wojewódzki w Warszawie'
    }
  },
  {
    email: 'student@dlamedica.pl',
    password: 'Student123!',
    role: 'student',
    displayName: 'Anna Wiśniewska',
    profile: {
      first_name: 'Anna',
      last_name: 'Wiśniewska',
      role: 'student',
      institution: 'Warszawski Uniwersytet Medyczny',
      year_of_study: 4
    }
  },
  {
    email: 'firma@dlamedica.pl',
    password: 'Firma123!',
    role: 'firma',
    displayName: 'MedTech Solutions',
    profile: {
      first_name: 'Piotr',
      last_name: 'Nowak',
      role: 'firma',
      company_name: 'MedTech Solutions Sp. z o.o.',
      company_type: 'Technologie medyczne'
    }
  }
];

export interface CreateAccountResult {
  success: boolean;
  email: string;
  message: string;
  error?: any;
}

export interface CreateAccountsProgress {
  current: number;
  total: number;
  currentEmail: string;
  isComplete: boolean;
  results: CreateAccountResult[];
}

/**
 * Tworzy pojedyncze konto testowe
 */
export async function createTestAccount(account: TestAccount): Promise<CreateAccountResult> {
  try {
    console.log(`🔄 Creating test account: ${account.email}`);

    // 1. Sprawdź czy użytkownik już istnieje
    const { data: existingUser } = await db.auth.admin.listUsers();
    const userExists = existingUser.users.find(u => u.email === account.email);
    
    if (userExists) {
      return {
        success: true,
        email: account.email,
        message: 'Konto już istnieje'
      };
    }

    // 2. Utwórz użytkownika przez signUp
    const { data: signUpData, error: signUpError } = await db.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          display_name: account.displayName,
          role: account.role,
          first_name: account.profile.first_name,
          last_name: account.profile.last_name
        }
      }
    });

    if (signUpError) {
      console.error(`❌ SignUp error for ${account.email}:`, signUpError);
      return {
        success: false,
        email: account.email,
        message: `Błąd rejestracji: ${signUpError.message}`,
        error: signUpError
      };
    }

    if (!signUpData.user) {
      return {
        success: false,
        email: account.email,
        message: 'Nie udało się utworzyć użytkownika',
      };
    }

    console.log(`✅ User created in auth: ${signUpData.user.id}`);

    // 3. Utwórz profil użytkownika
    try {
      const { error: profileError } = await db
        .from('users_profiles')
        .insert({
          id: signUpData.user.id,
          email: account.email,
          ...account.profile,
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.warn(`⚠️ Profile creation failed for ${account.email}:`, profileError);
        // Nie przerywamy - konto zostało utworzone
      } else {
        console.log(`✅ Profile created for ${account.email}`);
      }
    } catch (profileErr) {
      console.warn(`⚠️ Profile creation error for ${account.email}:`, profileErr);
    }

    return {
      success: true,
      email: account.email,
      message: 'Konto utworzone pomyślnie'
    };

  } catch (error: any) {
    console.error(`❌ Unexpected error creating ${account.email}:`, error);
    return {
      success: false,
      email: account.email,
      message: `Nieoczekiwany błąd: ${error.message}`,
      error
    };
  }
}

/**
 * Tworzy wszystkie konta testowe z progress tracking
 */
export async function createAllTestAccounts(
  onProgress?: (progress: CreateAccountsProgress) => void
): Promise<CreateAccountsProgress> {
  const results: CreateAccountResult[] = [];
  
  for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
    const account = TEST_ACCOUNTS[i];
    
    // Wywołaj callback progress
    if (onProgress) {
      onProgress({
        current: i,
        total: TEST_ACCOUNTS.length,
        currentEmail: account.email,
        isComplete: false,
        results: [...results]
      });
    }

    // Utwórz konto
    const result = await createTestAccount(account);
    results.push(result);
    
    // Krótka pauza między kontami
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const finalProgress = {
    current: TEST_ACCOUNTS.length,
    total: TEST_ACCOUNTS.length,
    currentEmail: '',
    isComplete: true,
    results
  };

  if (onProgress) {
    onProgress(finalProgress);
  }

  return finalProgress;
}

/**
 * Sprawdza które konta testowe już istnieją
 */
export async function checkExistingTestAccounts(): Promise<{
  existing: string[];
  missing: string[];
  total: number;
}> {
  try {
    const { data: users } = await db.auth.admin.listUsers();
    const existingEmails = users.users.map(u => u.email).filter(Boolean);
    
    const testEmails = TEST_ACCOUNTS.map(acc => acc.email);
    const existing = testEmails.filter(email => existingEmails.includes(email));
    const missing = testEmails.filter(email => !existingEmails.includes(email));

    return {
      existing,
      missing,
      total: testEmails.length
    };
  } catch (error) {
    console.error('Error checking existing accounts:', error);
    return {
      existing: [],
      missing: TEST_ACCOUNTS.map(acc => acc.email),
      total: TEST_ACCOUNTS.length
    };
  }
}

/**
 * Wymuś utworzenie kont (nawet jeśli już istnieją)
 */
export async function forceCreateTestAccounts(
  onProgress?: (progress: CreateAccountsProgress) => void
): Promise<CreateAccountsProgress> {
  // Najpierw usuń istniejące konta testowe
  try {
    const { data: users } = await db.auth.admin.listUsers();
    const testEmails = TEST_ACCOUNTS.map(acc => acc.email);
    
    for (const user of users.users) {
      if (user.email && testEmails.includes(user.email)) {
        console.log(`🗑️ Removing existing test user: ${user.email}`);
        await db.auth.admin.deleteUser(user.id);
      }
    }
  } catch (error) {
    console.warn('Error cleaning existing accounts:', error);
  }

  // Teraz utwórz wszystkie konta
  return createAllTestAccounts(onProgress);
}

export default {
  createTestAccount,
  createAllTestAccounts,
  checkExistingTestAccounts,
  forceCreateTestAccounts,
  TEST_ACCOUNTS
};