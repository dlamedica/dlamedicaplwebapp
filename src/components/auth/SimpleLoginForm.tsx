import { useState } from 'react';
import { db } from '../../lib/apiClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SimpleLoginFormProps {
  darkMode?: boolean;
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const SimpleLoginForm: React.FC<SimpleLoginFormProps> = ({
  darkMode = false,
  onSuccess,
  onSwitchToRegister
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <h2 className="text-2xl font-bold text-center mb-6">Zaloguj się</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                darkMode 
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
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Nie masz konta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Zarejestruj się
          </button>
        </p>
      </div>
    </div>
  );
};

export default SimpleLoginForm;