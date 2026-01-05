import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/SimpleAuthProvider';
import { db } from '../../lib/apiClient';
import ProfessionEditor from '../profile/ProfessionEditor';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

interface SimpleProfilePageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SimpleProfilePage: React.FC<SimpleProfilePageProps> = ({ darkMode }) => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
  }, []);

  useEffect(() => {
    if (userProfile) {
      setUserDetails(userProfile);
      setLoading(false);
    }
  }, [userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user, authLoading]);

  const handleSignOut = async () => {
    await db.auth.signOut();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleProfessionUpdate = (newZawod: string) => {
    setUserDetails((prev: any) => ({
      ...prev,
      zawod: newZawod
    }));
  };

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profil użytkownika</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Wyloguj się</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* User Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informacje podstawowe</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className={`p-3 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center">
                        <FaUser className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">ID użytkownika</label>
                    <div className={`p-3 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <code className="text-sm">{user.id}</code>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Rola</label>
                    <div className={`p-3 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {userDetails?.role || 'użytkownik'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Data rejestracji</label>
                    <div className={`p-3 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {userDetails?.created_at 
                        ? new Date(userDetails.created_at).toLocaleDateString()
                        : 'Nie określono'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Zawód</h3>
                {userDetails && (
                  <ProfessionEditor
                    currentZawod={userDetails.zawod}
                    userId={user.id}
                    darkMode={darkMode}
                    onUpdate={handleProfessionUpdate}
                  />
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className="text-lg font-semibold mb-2">Status konta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <span>Ostatnie logowanie:</span>
                  <span className="text-sm">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Nie określono'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Instructions */}
        <div className={`rounded-lg shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <h2 className="text-xl font-bold mb-4">Instrukcje konfiguracji bazy danych</h2>
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className="mb-4">Aby aplikacja działała poprawnie, utwórz tabelę <code>users</code> w bazie danych:</p>
            <pre className="text-sm overflow-x-auto">
{`CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  zawod TEXT NOT NULL,
  role TEXT DEFAULT 'użytkownik',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfilePage;