import React, { useState } from 'react';
import { FaUser, FaLock, FaCode, FaUserMd, FaGraduationCap, FaBuilding, FaShieldAlt, FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers } from '../../data/mockUsers';

interface DevLoginPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface TestAccountDisplay {
  email: string;
  password: string;
  role: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const DevLoginPage: React.FC<DevLoginPageProps> = ({ darkMode, fontSize }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  // Get role description and visual properties
  const getRoleDetails = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: <FaShieldAlt className="text-2xl" />,
          description: 'Pełny dostęp do systemu, zarządzanie użytkownikami i zawartością',
          color: 'from-red-500 to-red-600',
          label: 'Administrator'
        };
      case 'doctor':
        return {
          icon: <FaUserMd className="text-2xl" />,
          description: 'Lekarz specjalista, dostęp do narzędzi medycznych',
          color: 'from-blue-500 to-blue-600',
          label: 'Lekarz'
        };
      case 'student':
        return {
          icon: <FaGraduationCap className="text-2xl" />,
          description: 'Student medycyny, dostęp do materiałów edukacyjnych',
          color: 'from-green-500 to-green-600',
          label: 'Student'
        };
      case 'company':
        return {
          icon: <FaBuilding className="text-2xl" />,
          description: 'Firma medyczna, publikowanie ofert pracy i współpracy',
          color: 'from-purple-500 to-purple-600',
          label: 'Firma'
        };
      default:
        return {
          icon: <FaUser className="text-2xl" />,
          description: 'Konto użytkownika',
          color: 'from-gray-500 to-gray-600',
          label: role
        };
    }
  };

  // Convert mockUsers to display format - filter to show only main 4 accounts
  const mainAccounts = ['admin@dlamedica.pl', 'lekarz@dlamedica.pl', 'student@dlamedica.pl', 'firma@dlamedica.pl'];
  const testAccounts: TestAccountDisplay[] = mockUsers
    .filter(user => mainAccounts.includes(user.email))
    .map(user => {
      const details = getRoleDetails(user.role);
      return {
        email: user.email,
        password: user.password,
        role: user.role,
        name: user.name,
        icon: details.icon,
        description: details.description,
        color: details.color
      };
    });

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const handleTestLogin = async (account: TestAccountDisplay) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔐 DevLoginPage: Attempting login for', account.email);
      const { data, error } = await signIn(account.email, account.password);

      if (error) {
        throw error;
      }

      if (data?.user) {
        setSuccess(`Zalogowano jako ${account.name}`);

        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.history.pushState({}, '', '/dashboard');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Błąd podczas logowania');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] rounded-xl flex items-center justify-center shadow-lg">
              <FaCode className="text-white text-3xl" />
            </div>
          </div>
          <h1 className={`font-bold ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
            DlaMedica - Logowanie Developerskie
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed mb-6`}>
            Szybkie logowanie z kontami testowymi dla różnych ról użytkowników.
          </p>

          {/* Environment warning */}
          <div className={`inline-flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
              Tryb deweloperski - tylko dla rozwoju aplikacji
            </span>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Test Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {testAccounts.map((account) => {
            const roleDetails = getRoleDetails(account.role);
            return (
              <div
                key={account.email}
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${account.color} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      {account.icon}
                    </div>
                    <div>
                      <h3 className={`${fontSizes.cardTitle} font-bold`}>
                        {account.name}
                      </h3>
                      <p className="text-sm opacity-90 capitalize">
                        {roleDetails.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 leading-relaxed`}>
                    {account.description}
                  </p>

                  {/* Credentials */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Dane logowania:
                      </span>
                      <button
                        onClick={() => setShowPasswords(!showPasswords)}
                        className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}
                      >
                        {showPasswords ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FaUser className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {account.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaLock className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {showPasswords ? account.password : '••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    onClick={() => handleTestLogin(account)}
                    disabled={loading}
                    className={`w-full py-3 px-4 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${account.color} text-white hover:shadow-lg`}
                  >
                    {loading ? 'Logowanie...' : `Zaloguj jako ${roleDetails.label}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Links */}
        <div className="text-center space-y-4">
          <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Lub użyj standardowego formularza logowania:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={navigateToLogin}
              className={`px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 ${darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
            >
              Standardowe logowanie
            </button>
            <button
              onClick={navigateToHome}
              className={`px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 ${darkMode
                  ? 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5]'
                }`}
            >
              <FaHome />
              Wróć na stronę główną
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={`mt-12 rounded-xl p-8 ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
          <h3 className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Instrukcje dla developerów
          </h3>
          <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
            <p>
              • <strong>Administrator:</strong> Pełny dostęp do panelu administracyjnego, zarządzanie użytkownikami
            </p>
            <p>
              • <strong>Lekarz:</strong> Dostęp do kalkulatorów medycznych, publikowanie treści
            </p>
            <p>
              • <strong>Student:</strong> Dostęp do materiałów edukacyjnych, ograniczone funkcjonalności
            </p>
            <p>
              • <strong>Firma:</strong> Publikowanie ofert pracy, dostęp do dashboard pracodawcy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevLoginPage;