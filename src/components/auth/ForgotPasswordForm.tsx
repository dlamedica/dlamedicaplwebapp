import React, { useState } from 'react';
import { db } from '../../lib/apiClient';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

interface ForgotPasswordFormProps {
  darkMode?: boolean;
  onBack?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  darkMode = false,
  onBack
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            darkMode ? 'bg-green-900' : 'bg-green-100'
          }`}>
            <FaEnvelope className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Email wysłany!</h2>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sprawdź swoją skrzynkę pocztową. Wysłaliśmy Ci link do resetowania hasła.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Powrót do logowania
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          darkMode ? 'bg-blue-900' : 'bg-blue-100'
        }`}>
          <FaEnvelope className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Zapomniałeś hasła?</h2>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="twoj@email.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Wysyłanie...' : 'Wyślij link resetowania'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className={`inline-flex items-center text-sm font-medium ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Powrót do logowania
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;