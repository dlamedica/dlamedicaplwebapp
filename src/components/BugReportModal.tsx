import React, { useState } from 'react';
import { FaTimes, FaBug, FaPaperPlane } from 'react-icons/fa';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const BugReportModal: React.FC<BugReportModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Log to console for now
    console.log('Bug Report Submitted:', {
      description,
      email: email || 'Anonymous',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setDescription('');
        setEmail('');
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <FaBug className="text-red-500 text-xl" />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Zgłoś błąd
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode 
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
                Dziękujemy za zgłoszenie!
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Twój raport został wysłany i będzie rozpatrzony przez nasz zespół.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Opis błędu *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Opisz szczegółowo napotkany błąd..."
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Adres e-mail (opcjonalnie)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Podaj e-mail, jeśli chcesz otrzymać informację o statusie zgłoszenia
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'text-gray-300 border border-gray-600 hover:bg-gray-800'
                      : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting || !description.trim()
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
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
                      <span>Wyślij</span>
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

export default BugReportModal;