import React, { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

interface SimpleProfilePageFixedProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SimpleProfilePageFixed: React.FC<SimpleProfilePageFixedProps> = ({ darkMode, fontSize }) => {
  const { user, profile, loading } = useUser();

  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
    console.log('🔍 SimpleProfilePageFixed: Component mounted');
    console.log('🔍 SimpleProfilePageFixed: User:', user ? 'logged in' : 'not logged in');
    console.log('🔍 SimpleProfilePageFixed: Loading:', loading);
  }, []);

  const handleSignOut = async () => {
    console.log('🔍 SimpleProfilePageFixed: Sign out clicked');
    // Simplified sign out - just navigate to home
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  console.log('🔍 SimpleProfilePageFixed: Rendering component');

  if (loading) {
    console.log('🔍 SimpleProfilePageFixed: Showing loading state');
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  // Don't redirect if no user - just show message
  if (!user) {
    console.log('🔍 SimpleProfilePageFixed: No user found, showing login message');
    return (
      <div className={`min-h-screen py-8 px-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-lg shadow-lg p-6 text-center ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <FaUser className="mx-auto text-4xl mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">Wymagane logowanie</h1>
            <p className="mb-6">Aby wyświetlić profil, musisz się zalogować.</p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/login');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-6 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
            >
              Przejdź do logowania
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔍 SimpleProfilePageFixed: Rendering profile for user:', user.email);

  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className={`${
                fontSize === 'large' ? 'text-3xl' : fontSize === 'medium' ? 'text-2xl' : 'text-xl'
              } font-bold`}>
                Profil użytkownika
              </h1>
              <p className={`${
                fontSize === 'large' ? 'text-lg' : fontSize === 'medium' ? 'text-base' : 'text-sm'
              } ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Wyloguj się</span>
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className={`rounded-lg shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <h2 className={`${
            fontSize === 'large' ? 'text-2xl' : fontSize === 'medium' ? 'text-xl' : 'text-lg'
          } font-semibold mb-6`}>
            Informacje o koncie
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Dane podstawowe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className={`p-3 rounded border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Imię i nazwisko</label>
                  <div className={`p-3 rounded border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    {profile?.full_name || 'Nie podano'}
                  </div>
                </div>

                {profile?.profession && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Zawód</label>
                    <div className={`p-3 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      {profile.profession}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Status konta</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status weryfikacji email:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.email_confirmed_at 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.email_confirmed_at ? 'Zweryfikowany' : 'Niezweryfikowany'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Typ konta:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    profile?.is_company 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {profile?.is_company ? 'Firmowe' : 'Osobiste'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Data rejestracji:</span>
                  <span className="text-sm">
                    {new Date(user.created_at).toLocaleDateString('pl-PL')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Information */}
          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-medium mb-4">Informacje debugowania</h3>
            <div className={`p-4 rounded ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <p className="text-sm mb-2">
                <strong>Strona działa poprawnie!</strong> Jeśli widzisz tę sekcję, oznacza to że routing do profilu został naprawiony.
              </p>
              <p className="text-sm mb-2">
                <strong>User ID:</strong> {user.id}
              </p>
              <p className="text-sm mb-2">
                <strong>Current Path:</strong> {window.location.pathname}
              </p>
              <p className="text-sm">
                <strong>Timestamp:</strong> {new Date().toLocaleString('pl-PL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfilePageFixed;