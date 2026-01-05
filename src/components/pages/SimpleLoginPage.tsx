import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthProvider';
import SimpleLoginForm from '../auth/SimpleLoginForm';
import SimpleRegisterForm from '../auth/SimpleRegisterForm';

interface SimpleLoginPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SimpleLoginPage: React.FC<SimpleLoginPageProps> = ({ darkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = isLogin ? 'Logowanie – DlaMedica.pl' : 'Rejestracja – DlaMedica.pl';
  }, [isLogin]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      window.history.pushState({}, '', '/profile');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user]);

  const handleSuccess = () => {
    // Redirect to profile page
    window.history.pushState({}, '', '/profile');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md w-full space-y-8">
        {isLogin ? (
          <SimpleLoginForm
            darkMode={darkMode}
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <SimpleRegisterForm
            darkMode={darkMode}
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleLoginPage;