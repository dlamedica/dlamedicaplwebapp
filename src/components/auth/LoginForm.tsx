import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaExclamationTriangle, FaLock, FaDesktop } from 'react-icons/fa';

interface LoginFormProps {
  darkMode?: boolean;
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  darkMode = false,
  onSuccess,
  onSwitchToRegister
}) => {
  const { signIn, signInWithOAuth, redirectPath, setRedirectPath, user, isAuthenticated, sessionError, clearSessionError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginAttemptedRef = useRef(false);

  // Wyczyść błąd sesji przy odmontowaniu
  useEffect(() => {
    return () => clearSessionError();
  }, [clearSessionError]);

  // Nasłuchuj zmian stanu użytkownika po próbie logowania
  useEffect(() => {
    if (loginAttemptedRef.current && isAuthenticated && user) {
      console.log('✅ LoginForm: User authenticated, redirecting...', user.email);
      loginAttemptedRef.current = false;

      // Małe opóźnienie aby upewnić się, że wszystkie komponenty są zaktualizowane
      const redirectTimer = setTimeout(() => {
        // Przekieruj użytkownika
        if (redirectPath) {
          console.log('📍 LoginForm: Redirecting to:', redirectPath);
          window.history.pushState({}, '', redirectPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
          setRedirectPath(null);
        } else {
          console.log('✅ LoginForm: Calling onSuccess callback');
          onSuccess?.();
        }
        setLoading(false);
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
    return undefined;
  }, [isAuthenticated, user, redirectPath, onSuccess, setRedirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    loginAttemptedRef.current = true;

    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Przekroczono limit czasu logowania')), 15000)
      );

      const signInPromise = signIn(email, password);

      const result = await Promise.race([signInPromise, timeoutPromise]) as any;
      const { data, error } = result;

      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Wystąpił błąd podczas logowania');
        setLoading(false);
        loginAttemptedRef.current = false;
      } else if (data?.user) {
        // Login successful - useEffect będzie nasłuchiwał zmian stanu
        console.log('✅ LoginForm: Login successful, waiting for auth state update...');
        // Nie ustawiamy loading na false tutaj - useEffect to zrobi gdy użytkownik będzie zalogowany
      } else {
        // No error but also no user data - something went wrong
        setError('Logowanie nie powiodło się. Spróbuj ponownie.');
        setLoading(false);
        loginAttemptedRef.current = false;
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      setError(err.message || 'Wystąpił nieoczekiwany błąd');
      setLoading(false);
      loginAttemptedRef.current = false;
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    setError(null);

    const { error } = await signInWithOAuth(provider);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
      <h2 className="text-2xl font-bold text-center mb-6">Zaloguj się</h2>

      {/* Komunikat błędu sesji - konto zawieszone */}
      {sessionError?.error === 'ACCOUNT_SUSPENDED' && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-start">
            <FaLock className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-red-800">Konto zawieszone</h3>
              <p className="text-red-700 text-sm mt-1">{sessionError.message}</p>
              {sessionError.reason && (
                <p className="text-red-600 text-xs mt-2">Powod: {sessionError.reason}</p>
              )}
              <p className="text-red-600 text-xs mt-2">
                Skontaktuj sie z administratorem: <a href="mailto:support@dlamedica.pl" className="underline">support@dlamedica.pl</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Komunikat błędu sesji - za dużo urządzeń */}
      {sessionError?.error === 'TOO_MANY_DEVICES' && (
        <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <div className="flex items-start">
            <FaDesktop className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-amber-800">Wykryto aktywna sesje na innym urzadzeniu</h3>
              <p className="text-amber-700 text-sm mt-1">{sessionError.message}</p>
              <p className="text-amber-600 text-xs mt-2">
                Mozesz byc zalogowany maksymalnie na 1 telefonie/tablecie i 1 komputerze jednoczesnie.
              </p>
              {sessionError.loggedOutAll && (
                <p className="text-amber-800 font-medium text-sm mt-2">
                  Wszystkie sesje zostaly zakonczone. Zaloguj sie ponownie.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standardowy komunikat błędu */}
      {error && !sessionError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <FaExclamationTriangle className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
            placeholder="twoj@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Hasło
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] pr-10 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#38b6ff] hover:bg-[#2a9fe5] text-white'
            }`}
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              Lub zaloguj się przez
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className={`flex justify-center items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FaGoogle className="text-red-500" />
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={loading}
            className={`flex justify-center items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FaFacebook className="text-[#38b6ff]" />
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('apple')}
            disabled={loading}
            className={`flex justify-center items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FaApple className={darkMode ? 'text-white' : 'text-gray-900'} />
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Nie masz konta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#38b6ff] hover:text-[#2a9fe5] font-medium"
          >
            Zarejestruj się
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;