import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  requireEmployer?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  darkMode, 
  fontSize, 
  requireEmployer = false 
}) => {
  const { user, loading, setRedirectPath } = useAuth();

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sprawdzanie uprawnień...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Save current path before redirecting to login
  useEffect(() => {
    if (!loading && !user) {
      setRedirectPath(window.location.pathname);
    }
  }, [loading, user, setRedirectPath]);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              🔒
            </div>
            <h1 className={`${
              fontSize === 'large' ? 'text-3xl' : fontSize === 'medium' ? 'text-2xl' : 'text-xl'
            } font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              Wymagane zalogowanie
            </h1>
            <p className={`${fontSizeClasses[fontSize]} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Aby uzyskać dostęp do tej strony, musisz się zalogować.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`inline-flex items-center px-6 py-3 ${fontSizeClasses[fontSize]} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg mr-4`}
              >
                Zaloguj się
              </button>
              <button
                onClick={() => {
                  history.pushState({}, '', '/register');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`inline-flex items-center px-6 py-3 ${fontSizeClasses[fontSize]} font-semibold rounded-lg transition-colors duration-200 border-2 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                Zarejestruj się
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if employer access is required
  if (requireEmployer) {
    const { profile } = useAuth();
    const userType = user.user_metadata?.user_type;
    const isCompanyFromProfile = profile?.is_company;
    const isCompanyFromMetadata = user.user_metadata?.is_company;
    const isEmployer = userType === 'employer' || userType === 'company' || isCompanyFromProfile || isCompanyFromMetadata;
    
    if (!isEmployer) {
      return (
        <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                🏢
              </div>
              <h1 className={`${
                fontSize === 'large' ? 'text-3xl' : fontSize === 'medium' ? 'text-2xl' : 'text-xl'
              } font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                Dostęp tylko dla pracodawców
              </h1>
              <p className={`${fontSizeClasses[fontSize]} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Panel pracodawcy jest dostępny tylko dla kont firmowych.
              </p>
              <div className="space-y-4">
                <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} text-left`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
                    Jak uzyskać dostęp do panelu pracodawcy?
                  </h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
                    <li className="flex items-start">
                      <span className="text-[#38b6ff] mr-2">•</span>
                      Zarejestruj się jako pracodawca/firma podczas tworzenia konta
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#38b6ff] mr-2">•</span>
                      Jeśli masz już konto, skontaktuj się z nami w celu zmiany typu konta
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#38b6ff] mr-2">•</span>
                      Po weryfikacji otrzymasz dostęp do panelu pracodawcy
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/register');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`px-6 py-3 ${fontSizeClasses[fontSize]} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
                  >
                    Zarejestruj firmę
                  </button>
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/kontakt');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`px-6 py-3 ${fontSizeClasses[fontSize]} font-semibold rounded-lg transition-colors duration-200 border-2 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                    }`}
                  >
                    Skontaktuj się z nami
                  </button>
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/praca');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`px-6 py-3 ${fontSizeClasses[fontSize]} font-semibold rounded-lg transition-colors duration-200 border-2 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                    }`}
                  >
                    Przeglądaj oferty pracy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;