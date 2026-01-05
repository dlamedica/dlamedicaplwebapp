import { useState } from 'react';
import { db } from '../../lib/apiClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SimpleRegisterFormProps {
  darkMode?: boolean;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const SimpleRegisterForm: React.FC<SimpleRegisterFormProps> = ({
  darkMode = false,
  onSuccess,
  onSwitchToLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zawod, setZawod] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const zawodyOptions = [
    { value: 'Lekarz', label: 'Lekarz' },
    { value: 'Lekarz stomatolog', label: 'Lekarz stomatolog' },
    { value: 'Farmaceuta', label: 'Farmaceuta' },
    { value: 'Pielęgniarka', label: 'Pielęgniarka' },
    { value: 'Pielęgniarz', label: 'Pielęgniarz' },
    { value: 'Student kierunku medycznego', label: 'Student kierunku medycznego' },
    { value: 'Uczeń szkoły medycznej', label: 'Uczeń szkoły medycznej' },
    { value: 'Weterynarz', label: 'Weterynarz' },
    { value: 'Fizjoterapeuta', label: 'Fizjoterapeuta' },
    { value: 'Technik weterynarii', label: 'Technik weterynarii' },
    { value: 'Zoofizjoterapeuta', label: 'Zoofizjoterapeuta' },
    { value: 'Kynoterapeuta', label: 'Kynoterapeuta' },
    { value: 'Inny', label: 'Inny' },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Register user with local DB Auth
      const { data: authData, error: authError } = await db.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      const user = authData.user;

      if (user) {
        // Step 2: Insert user profile into users table
        const { error: profileError } = await db
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              zawod: zawod,
              role: 'użytkownik',
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          throw profileError;
        }

        setSuccess('Rejestracja zakończona pomyślnie! Sprawdź swoją skrzynkę e-mail.');
        onSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas rejestracji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <h2 className="text-2xl font-bold text-center mb-6">Zarejestruj się</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
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

        <div>
          <label htmlFor="zawod" className="block text-sm font-medium mb-2">
            Zawód
          </label>
          <select
            id="zawod"
            value={zawod}
            onChange={(e) => setZawod(e.target.value)}
            required
            disabled={loading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Wybierz zawód</option>
            {zawodyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Masz już konto?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Zaloguj się
          </button>
        </p>
      </div>
    </div>
  );
};

export default SimpleRegisterForm;