import React, { useState } from 'react';
import { FaTimes, FaLightbulb, FaPaperPlane } from 'react-icons/fa';
import { useUser } from '../hooks/useUser';

// API call do wysyłania sugestii
const submitSuggestion = async (data: any) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_URL}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return { data: result, error: response.ok ? null : result.error };
  } catch (error) {
    return { data: null, error: 'Wystąpił błąd' };
  }
};

interface ToolSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const ToolSuggestionModal: React.FC<ToolSuggestionModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useUser();

  const MIN_LENGTH = 50;
  const currentLength = description.trim().length;
  const isValid = currentLength >= MIN_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError(`Opis musi zawierać minimum ${MIN_LENGTH} znaków.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Zapisz propozycję w bazie danych
      const { data: suggestionData, error: insertError } = await submitSuggestion({
        description: description.trim(),
        user_id: user?.id || null,
        user_email: user?.email || profile?.email || null,
        user_name: profile?.full_name || profile?.first_name || null,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (insertError) {
        throw insertError;
      }

      // Propozycja została zapisana - admin będzie mógł ją przeglądać w panelu administracyjnym
      console.log('✅ Propozycja pomysłu zapisana:', suggestionData.id);

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setDescription('');
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Błąd podczas zapisywania propozycji:', err);
      setError(err.message || 'Wystąpił błąd podczas zapisywania propozycji. Spróbuj ponownie.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <div className="flex items-center space-x-2">
            <FaLightbulb className="text-yellow-500 text-xl" />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Zaproponuj pomysł
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${darkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dziękujemy za propozycję!
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Twoja propozycja została wysłana i będzie rozpatrzona przez administratora.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Opisz swój pomysł *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError(null);
                  }}
                  required
                  rows={6}
                  placeholder="Opisz szczegółowo swój pomysł na nową funkcjonalność lub ulepszenie platformy. Minimum 50 znaków..."
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${isValid
                    ? 'focus:ring-blue-500 focus:border-blue-500'
                    : 'focus:ring-red-500 focus:border-red-500'
                    } ${darkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${isValid
                    ? darkMode ? 'text-gray-400' : 'text-gray-500'
                    : 'text-red-500'
                    }`}>
                    {currentLength < MIN_LENGTH
                      ? `Pozostało ${MIN_LENGTH - currentLength} znaków (minimum ${MIN_LENGTH})`
                      : `${currentLength} znaków`
                    }
                  </p>
                </div>
              </div>

              {error && (
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
                  }`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    {error}
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                    ? 'text-gray-300 border border-gray-600 hover:bg-gray-800'
                    : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${isSubmitting || !isValid
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-sm" />
                      <span>Wyślij propozycję</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolSuggestionModal;

