import React, { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import RegisterForm from '../auth/RegisterForm';

interface RegisterPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const RegisterPage: React.FC<RegisterPageProps> = ({ darkMode }) => {
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    document.title = 'Rejestracja – DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Zarejestruj się w DlaMedica.pl i uzyskaj dostęp do narzędzi medycznych, kalkulatorów i bazy ICD.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Rejestracja – DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Stwórz konto w DlaMedica.pl i uzyskaj dostęp do profesjonalnych narzędzi medycznych.');
    }
  }, []);

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

  const handleSwitchToLogin = () => {
    window.history.pushState({}, '', '/login');
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
        <RegisterForm
          darkMode={darkMode}
          onSuccess={handleSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </div>
  );
};

export default RegisterPage;