/**
 * Kontekst autoryzacji - PostgreSQL
 * Własna implementacja z lokalnym API
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, UserProfile } from '../types';

// API URL - używaj zmiennej środowiskowej lub domyślnej wartości
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Typy błędów sesji
interface SessionError {
  error: 'ACCOUNT_SUSPENDED' | 'TOO_MANY_DEVICES' | 'SESSION_EXPIRED' | string;
  message: string;
  reason?: string;
  loggedOutAll?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  sessionId: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  redirectPath: string | null;
  sessionError: SessionError | null;
  setRedirectPath: (path: string | null) => void;
  clearSessionError: () => void;
  signUp: (email: string, password: string, profileData?: Partial<UserProfile>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signOutAll: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'facebook' | 'apple') => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper do API calls z tokenem i session ID
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  const sessionId = localStorage.getItem('session_id');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(sessionId && { 'X-Session-ID': sessionId }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error('❌ API Response nie jest JSON:', text);
    throw new Error(`Nieprawidłowa odpowiedź serwera: ${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    // Sprawdź błędy sesji
    if (data.error === 'SESSION_EXPIRED' || data.error === 'ACCOUNT_SUSPENDED') {
      throw { isSessionError: true, ...data };
    }
    throw new Error(data.error || `Błąd ${response.status}: ${response.statusText}`);
  }

  return data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('session_id'));
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<SessionError | null>(null);

  const clearSessionError = () => setSessionError(null);

  // Sprawdź czy użytkownik jest zalogowany przy starcie
  useEffect(() => {
    const initSession = async () => {
      try {
        const wasLoggedOut = localStorage.getItem('userWasLoggedOut');
        if (wasLoggedOut === 'true') {
          setLoading(false);
          return;
        }

        const accessToken = localStorage.getItem('access_token');
        const refreshTokenValue = localStorage.getItem('refresh_token');

        if (!accessToken) {
          setLoading(false);
          return;
        }

        // Spróbuj pobrać dane użytkownika
        try {
          const userData = await apiCall('/auth/me');
          
          const fakeUser: User = {
            id: userData.id,
            email: userData.email,
            role: 'authenticated',
            created_at: userData.created_at,
            user_metadata: userData.user_metadata || {
              full_name: userData.full_name,
              role: userData.role,
            },
          };

          const fakeSession: Session = {
            access_token: accessToken,
            refresh_token: refreshTokenValue || '',
            expires_in: 3600,
            token_type: 'bearer',
            user: fakeUser,
          };

          setSession(fakeSession);
          setUser(fakeUser);
          setProfile({
            id: userData.id,
            user_id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            first_name: userData.full_name?.split(' ')[0],
            last_name: userData.full_name?.split(' ').slice(1).join(' '),
            profession: userData.profession,
            specialization: userData.specialization,
            city: userData.city,
            phone: userData.phone,
            avatar_url: userData.avatar_url,
            profile_image_url: userData.avatar_url, // Alias dla kompatybilności
            role: userData.role,
            is_company: userData.account_type === 'company',
            is_employer: userData.account_type === 'company',
            company_name: userData.company_name,
            company_description: userData.company_description,
            company_bio: userData.company_description, // Alias dla kompatybilności
            company_logo_url: userData.company_logo_url,
            company_website: userData.company_website,
            company_address: userData.company_address,
            company_nip: userData.company_nip,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
          });

          console.log('✅ AuthContext: Sesja przywrócona dla', userData.email);
        } catch (error) {
          // Token wygasł - spróbuj odświeżyć
          if (refreshTokenValue) {
            const refreshed = await refreshTokenFunc();
            if (!refreshed) {
              // Refresh nie zadziałał - wyloguj
              clearAuthData();
            }
          } else {
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Błąd podczas inicjalizacji sesji:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('session_id');
    localStorage.removeItem('userWasLoggedOut');
    setUser(null);
    setProfile(null);
    setSession(null);
    setSessionId(null);
  };

  const refreshTokenFunc = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) return false;

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshTokenValue }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      // Pobierz dane użytkownika z nowym tokenem
      const userData = await apiCall('/auth/me');
      
      const fakeUser: User = {
        id: userData.id,
        email: userData.email,
        role: 'authenticated',
        created_at: userData.created_at,
        user_metadata: userData.user_metadata || {},
      };

      setUser(fakeUser);
      setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: 3600,
        token_type: 'bearer',
        user: fakeUser,
      });

      return true;
    } catch (error) {
      console.error('Błąd odświeżania tokenu:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, profileData?: Partial<UserProfile>) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: profileData?.full_name || `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim(),
          profession: profileData?.profession,
          account_type: profileData?.is_company ? 'company' : 'individual',
          company_name: profileData?.company_name,
          city: profileData?.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: data.error || 'Błąd rejestracji' } };
      }

      // Zapisz tokeny
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.removeItem('userWasLoggedOut');

      const fakeUser: User = {
        id: data.user.id,
        email: data.user.email,
        role: 'authenticated',
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: data.user.full_name,
        },
      };

      setUser(fakeUser);
      setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: 3600,
        token_type: 'bearer',
        user: fakeUser,
      });

      return { data: { user: fakeUser }, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Błąd rejestracji' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Logowanie...', email);
      setSessionError(null);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Sprawdź błędy związane z sesjami
        if (data.error === 'ACCOUNT_SUSPENDED') {
          const error: SessionError = {
            error: 'ACCOUNT_SUSPENDED',
            message: data.message || 'Konto zostało zawieszone. Skontaktuj się z administratorem.',
            reason: data.reason,
          };
          setSessionError(error);
          return { data: null, error };
        }

        if (data.error === 'TOO_MANY_DEVICES') {
          const error: SessionError = {
            error: 'TOO_MANY_DEVICES',
            message: data.message || 'Wykryto logowanie z trzeciego urządzenia. Wszystkie sesje zostały zakończone.',
            loggedOutAll: data.loggedOutAll,
          };
          setSessionError(error);
          // Wyczyść lokalne dane
          clearAuthData();
          return { data: null, error };
        }

        return { data: null, error: { message: data.error || 'Błąd logowania' } };
      }

      // Zapisz tokeny i session ID
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      if (data.session?.id) {
        localStorage.setItem('session_id', data.session.id);
        setSessionId(data.session.id);
      }
      localStorage.removeItem('userWasLoggedOut');

      const fakeUser: User = {
        id: data.user.id,
        email: data.user.email,
        role: 'authenticated',
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata || {
          full_name: data.user.full_name,
          role: data.user.role,
          profession: data.user.profession,
        },
      };

      const fakeSession: Session = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: 3600,
        token_type: 'bearer',
        user: fakeUser,
      };

      setUser(fakeUser);
      setSession(fakeSession);
      setProfile({
        id: data.user.id,
        user_id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        first_name: data.user.full_name?.split(' ')[0],
        last_name: data.user.full_name?.split(' ').slice(1).join(' '),
        profession: data.user.profession,
        specialization: data.user.specialization,
        city: data.user.city,
        avatar_url: data.user.avatar_url,
        profile_image_url: data.user.avatar_url, // Alias dla kompatybilności
        role: data.user.role,
        is_company: data.user.account_type === 'company',
        is_employer: data.user.account_type === 'company',
        company_name: data.user.company_name,
        company_description: data.user.company_description,
        company_bio: data.user.company_description, // Alias dla kompatybilności
        company_logo_url: data.user.company_logo_url,
        company_website: data.user.company_website,
        company_address: data.user.company_address,
        company_nip: data.user.company_nip,
      });

      console.log('✅ AuthContext: Zalogowano pomyślnie, urządzenie:', data.session?.device_type);
      return { data: { user: fakeUser, session: fakeSession }, error: null };
    } catch (error: any) {
      console.error('❌ Błąd logowania:', error);
      return { data: null, error: { message: error.message || 'Błąd logowania' } };
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Wylogowanie...');

    try {
      const token = localStorage.getItem('access_token');
      const currentSessionId = localStorage.getItem('session_id');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(currentSessionId && { 'X-Session-ID': currentSessionId }),
          },
        });
      }
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }

    localStorage.setItem('userWasLoggedOut', 'true');
    clearAuthData();

    // Redirect to home
    window.location.href = '/';
  };

  const signOutAll = async () => {
    console.log('AuthContext: Wylogowanie ze wszystkich urządzeń...');

    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${API_URL}/auth/logout-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }

    localStorage.setItem('userWasLoggedOut', 'true');
    clearAuthData();

    window.location.href = '/';
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    console.log('OAuth nie jest dostępne');
    return { data: null, error: { message: 'Logowanie społecznościowe nie jest obecnie dostępne.' } };
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return { data: { message: data.message }, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Błąd resetowania hasła' } };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      console.log('📤 updateProfile: Wysyłanie danych:', updates);
      
      const data = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      console.log('✅ updateProfile: Otrzymano odpowiedź:', data);

      if (data.user) {
        // Mapuj dane z API i dodaj aliasy dla kompatybilności
        const updatedProfile = { 
          ...profile, 
          ...data.user,
          profile_image_url: data.user.avatar_url || profile?.profile_image_url, // Alias
          company_bio: data.user.company_description || profile?.company_bio, // Alias
        };
        setProfile(updatedProfile);
        return { data: updatedProfile, error: null };
      }

      return { data: null, error: { message: 'Brak danych użytkownika w odpowiedzi' } };
    } catch (error: any) {
      console.error('❌ updateProfile: Błąd:', error);
      return { data: null, error: { message: error.message || 'Błąd aktualizacji profilu' } };
    }
  };

  const value = {
    user,
    profile,
    session,
    sessionId,
    loading,
    isAuthenticated: !!user,
    redirectPath,
    sessionError,
    setRedirectPath,
    clearSessionError,
    signUp,
    signIn,
    signOut,
    signOutAll,
    signInWithOAuth,
    resetPassword,
    updateProfile,
    refreshToken: refreshTokenFunc,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
