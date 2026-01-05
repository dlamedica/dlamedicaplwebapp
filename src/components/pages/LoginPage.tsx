import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

interface LoginPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const LoginPage: React.FC<LoginPageProps> = ({ darkMode }) => {
  const [isLogin, setIsLogin] = useState(() => {
    // Check current path to determine initial state
    return window.location.pathname === '/login';
  });
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    document.title = isLogin ? 'Logowanie – DlaMedica.pl' : 'Rejestracja – DlaMedica.pl';
  }, [isLogin]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.history.pushState({}, '', '/profile');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [isAuthenticated]);

  const handleSuccess = () => {
    // Redirect to profile page
    window.history.pushState({}, '', '/profile');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isLoading) {
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
          <LoginForm
            darkMode={darkMode}
            onSuccess={handleSuccess}
            onSwitchToRegister={() => {
              setIsLogin(false);
              window.history.pushState({}, '', '/register');
            }}
          />
        ) : (
          <RegisterForm
            darkMode={darkMode}
            onSuccess={handleSuccess}
            onSwitchToLogin={() => {
              setIsLogin(true);
              window.history.pushState({}, '', '/login');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;