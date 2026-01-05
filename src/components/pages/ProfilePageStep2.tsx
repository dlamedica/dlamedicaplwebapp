import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../contexts/AuthContext';

interface ProfilePageStep2Props {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfilePageStep2: React.FC<ProfilePageStep2Props> = ({ darkMode, fontSize }) => {
  const [error, setError] = useState<string | null>(null);
  
  // Wrap hooks in try-catch
  let user = null;
  let profile = null;
  let userLoading = false;
  
  try {
    const userHook = useUser();
    user = userHook.user;
    profile = userHook.profile;
    userLoading = userHook.loading;
  } catch (err) {
    setError(`useUser error: ${err}`);
  }
  
  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
    console.log('ProfilePageStep2: Mounted');
    console.log('User:', user);
    console.log('Profile:', profile);
    console.log('Loading:', userLoading);
  }, [user, profile, userLoading]);
  
  if (error) {
    return (
      <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Błąd</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (userLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h1 className="text-2xl font-bold mb-4">Profil użytkownika (Step 2)</h1>
          <p>Hooki załadowane pomyślnie!</p>
          <div className="mt-4 space-y-2">
            <p>User: {user ? user.email : 'Brak użytkownika'}</p>
            <p>Profile: {profile ? 'Załadowany' : 'Brak profilu'}</p>
            <p>Loading: {userLoading ? 'Tak' : 'Nie'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageStep2;