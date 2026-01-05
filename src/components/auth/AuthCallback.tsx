import React, { useEffect, useState } from 'react';
import { db } from '../../lib/apiClient';

interface AuthCallbackProps {
  darkMode: boolean;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ darkMode }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await db.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Email został pomyślnie potwierdzony! Przekierowywanie...');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Nie udało się potwierdzić adresu email. Spróbuj ponownie.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('Wystąpił błąd podczas potwierdzania adresu email.');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-black' : 'bg-white'
    }`}>
      <div className={`max-w-md mx-auto p-8 rounded-lg border ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } shadow-lg`}>
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#38b6ff] border-t-transparent mx-auto mb-4"></div>
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Potwierdzanie adresu email...
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Proszę czekać, trwa weryfikacja Twojego adresu email.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sukces!
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 text-5xl mb-4">❌</div>
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Błąd
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {message}
              </p>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors duration-200"
              >
                Wróć do logowania
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;