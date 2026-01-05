import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../hooks/useUser';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye, FaEyeSlash, FaCamera, FaPlus, FaBuilding, FaCalendar, FaBriefcase, FaClock, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { MEDICAL_PROFESSIONS } from '../../constants/professions';

interface ProfilePageDebugProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfilePageDebug: React.FC<ProfilePageDebugProps> = ({ darkMode }) => {
  const { user, profile, loading: userLoading } = useUser();
  const { signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'events' | 'settings'>('profile');
  
  // Form state - simplified
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [profession, setProfession] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);

  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
    console.log('🔍 ProfilePageDebug: Component mounted');
  }, []);

  useEffect(() => {
    if (profile) {
      console.log('🔍 ProfilePageDebug: Profile loaded:', profile);
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setProfession(profile.profession || '');
      setNewsletterConsent(profile.newsletter_consent || false);
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      console.log('🔍 ProfilePageDebug: User not authenticated, redirecting to login');
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user, userLoading]);

  const handleSignOut = async () => {
    console.log('🔍 ProfilePageDebug: Sign out called');
    try {
      await signOut();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('🔍 ProfilePageDebug: Sign out error:', error);
    }
  };

  console.log('🔍 ProfilePageDebug: Rendering, userLoading:', userLoading, 'user:', !!user);

  if (userLoading) {
    console.log('🔍 ProfilePageDebug: Showing loading state');
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🔍 ProfilePageDebug: No user, will redirect');
    return null; // Will redirect via useEffect
  }

  console.log('🔍 ProfilePageDebug: Rendering profile for user:', user.email);

  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {/* Profile Image - simplified without cropper */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <FaCamera className="text-2xl" />
                  </div>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.is_company ? profile?.company_name || 'Firma' : fullName || 'Użytkownik'}
                </h1>
                {username && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <FaUser className="mr-1 text-xs" />
                    @{username}
                  </p>
                )}
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.email}
                </p>
                {profile?.is_company && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    <FaBuilding className="mr-1" />
                    Konto firmowe
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Wyloguj się
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {['profile'].map((tab) => {
                const tabLabels = {
                  profile: 'Profil'
                };
                
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-[#38b6ff] text-[#38b6ff]'
                        : 'border-transparent hover:text-[#38b6ff]'
                    } ${darkMode ? 'text-gray-300 hover:text-[#38b6ff]' : 'text-gray-500 hover:text-[#38b6ff]'}`}
                  >
                    {tabLabels[tab as keyof typeof tabLabels]}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content - simplified */}
        <div className={`rounded-lg shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Informacje o profilu</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
              >
                <FaEdit className="mr-2" />
                Edytuj profil
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Dane podstawowe</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className={`p-2 rounded border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Imię i nazwisko</label>
                  {editing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <div className={`p-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      {fullName || 'Nie podano'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nazwa użytkownika</label>
                  {editing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="nazwa_uzytkownika"
                      maxLength={30}
                    />
                  ) : (
                    <div className={`p-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      {username ? `@${username}` : 'Nie ustawiono'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zawód</label>
                  {editing ? (
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Wybierz zawód</option>
                      {MEDICAL_PROFESSIONS.map((prof) => (
                        <option key={prof.value} value={prof.value}>
                          {prof.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`p-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      {profession ? 
                        MEDICAL_PROFESSIONS.find(p => p.value === profession)?.label || profession 
                        : 'Nie podano'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Status */}
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
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newsletterConsent}
                      onChange={(e) => setNewsletterConsent(e.target.checked)}
                      disabled={!editing}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                    />
                    <span className="text-sm">
                      Zgoda na newsletter
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  console.log('🔍 ProfilePageDebug: Save clicked');
                  setSuccess('Profil został zaktualizowany (demo)');
                  setEditing(false);
                }}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaCheck className="mr-2" />
                {loading ? 'Zapisywanie...' : 'Zapisz'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-2" />
                Anuluj
              </button>
            </div>
          )}

          {/* Debug info */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Debug Info</h3>
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-sm mb-2">✅ <strong>ProfilePageDebug działa!</strong></p>
              <p className="text-sm mb-2">User ID: {user.id}</p>
              <p className="text-sm mb-2">Profile loaded: {profile ? 'Yes' : 'No'}</p>
              <p className="text-sm">Timestamp: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageDebug;