import React, { useEffect, useState } from 'react';
import { FaEdit, FaUser, FaSignOutAlt, FaCheck, FaTimes, FaCamera, FaBuilding, FaBell, FaLock, FaEye, FaEyeSlash, FaGlobe, FaUpload, FaCrop } from 'react-icons/fa';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../contexts/AuthContext';

interface ProfilePageWorkingProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface MockUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string;
}

interface MockProfile {
  id: string;
  user_id: string;
  full_name?: string;
  username?: string;
  profession?: string;
  newsletter_consent?: boolean;
  is_company?: boolean;
  company_name?: string;
  company_nip?: string;
  company_industry?: string;
  profile_image_url?: string;
}

const ProfilePageWorking: React.FC<ProfilePageWorkingProps> = ({ darkMode, fontSize }) => {
  const { user, profile, loading: userLoading } = useUser();
  const { signOut, updateProfile } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyNIP, setCompanyNIP] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private' | 'contacts'>('public');
  const [language, setLanguage] = useState('pl');
  const [timezone, setTimezone] = useState('Europe/Warsaw');

  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
  }, []);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setProfession(profile.profession || '');
      setCustomProfession(profile.custom_profession || '');
      setNewsletterConsent(profile.newsletter_consent || false);
      setCompanyName(profile.company_name || '');
      setCompanyNIP(profile.company_nip || '');
      setCompanyIndustry(profile.company_industry || '');
      setProfileImage(profile.profile_image_url || '');
      
      // Load settings from profile if available
      setEmailNotifications(profile.email_notifications !== false);
      setSmsNotifications(profile.sms_notifications === true);
      setMarketingEmails(profile.marketing_emails !== false);
      setProfileVisibility(profile.profile_visibility || 'public');
      setLanguage(profile.language || 'pl');
      setTimezone(profile.timezone || 'Europe/Warsaw');
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user, userLoading]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updates = {
        full_name: fullName,
        username: username,
        profession: profession,
        custom_profession: profession === 'inne' ? customProfession : undefined,
        newsletter_consent: newsletterConsent,
        profile_image_url: profileImage,
        company_name: profile?.is_company ? companyName : undefined,
        company_nip: profile?.is_company ? companyNIP : undefined,
        company_industry: profile?.is_company ? companyIndustry : undefined,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        marketing_emails: marketingEmails,
        profile_visibility: profileVisibility,
        language: language,
        timezone: timezone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await updateProfile(updates);
      
      if (error) {
        alert('Błąd podczas aktualizacji profilu: ' + error.message);
      } else {
        alert('Profil zaktualizowany pomyślnie!');
        setEditing(false);
      }
    } catch (err) {
      alert('Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Czy na pewno chcesz się wylogować?')) {
      await signOut();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Plik jest zbyt duży. Maksymalny rozmiar to 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Plik musi być obrazem (JPG, PNG, GIF).');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (userLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const fontSizeClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                  {profileImage ? (
                    <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <FaCamera className="text-2xl" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowImageUpload(true)}
                  className="absolute -bottom-1 -right-1 bg-[#38b6ff] text-white p-1 rounded-full hover:bg-[#2a9fe5] transition-colors"
                >
                  <FaCamera className="text-xs" />
                </button>
              </div>
              
              <div>
                <h1 className={`font-bold ${fontSize === 'large' ? 'text-3xl' : fontSize === 'small' ? 'text-xl' : 'text-2xl'}`}>
                  {profile?.is_company ? companyName || profile?.company_name || 'Firma' : fullName || profile?.full_name || 'Użytkownik'}
                </h1>
                {username && (
                  <p className={`${fontSizeClass} ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <FaUser className="mr-1 text-xs" />
                    @{username}
                  </p>
                )}
                <p className={`${fontSizeClass} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Wyloguj się
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {['profile', 'settings'].map((tab) => {
                const tabLabels = {
                  profile: 'Profil',
                  settings: 'Ustawienia'
                };
                
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium ${fontSizeClass} transition-colors ${
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

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`font-semibold ${fontSize === 'large' ? 'text-2xl' : fontSize === 'small' ? 'text-lg' : 'text-xl'}`}>
                Informacje o profilu
              </h2>
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
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Dane podstawowe</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Email</label>
                    <div className={`p-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    } ${fontSizeClass}`}>
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>
                      {profile?.is_company ? 'Nazwa firmy' : 'Imię i nazwisko'}
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${fontSizeClass}`}
                      />
                    ) : (
                      <div className={`p-2 rounded border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      } ${fontSizeClass}`}>
                        {fullName || 'Nie podano'}
                      </div>
                    )}
                  </div>

                  {!profile?.is_company && (
                    <div>
                      <label className={`block font-medium mb-2 ${fontSizeClass}`}>
                        Nazwa użytkownika (pseudonim)
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fontSizeClass}`}
                          placeholder="nazwa_uzytkownika"
                          maxLength={30}
                        />
                      ) : (
                        <div className={`p-2 rounded border ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                        } ${fontSizeClass}`}>
                          {username ? `@${username}` : 'Nie ustawiono'}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Zawód</label>
                    {editing ? (
                      <select
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${fontSizeClass}`}
                      >
                        <option value="">Wybierz zawód</option>
                        <option value="lekarz">Lekarz</option>
                        <option value="pielegniarka">Pielęgniarka</option>
                        <option value="farmaceuta">Farmaceuta</option>
                        <option value="fizjoterapeuta">Fizjoterapeuta</option>
                        <option value="inne">Inne</option>
                      </select>
                    ) : (
                      <div className={`p-2 rounded border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                      } ${fontSizeClass}`}>
                        {profession || 'Nie podano'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Status konta</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={fontSizeClass}>Status weryfikacji email:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.email_confirmed_at 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.email_confirmed_at ? 'Zweryfikowany' : 'Niezweryfikowany'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={fontSizeClass}>Typ konta:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      profile?.is_company 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {profile?.is_company ? 'Firmowe' : 'Osobiste'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={fontSizeClass}>Data rejestracji:</span>
                    <span className={fontSizeClass}>{new Date(user.created_at).toLocaleDateString('pl-PL')}</span>
                  </div>
                  
                  {profile?.is_company && (
                    <>
                      <div>
                        <label className={`block font-medium mb-2 ${fontSizeClass}`}>NIP firmy</label>
                        {editing ? (
                          <input
                            type="text"
                            value={companyNIP}
                            onChange={(e) => setCompanyNIP(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } ${fontSizeClass}`}
                            placeholder="0000000000"
                          />
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          } ${fontSizeClass}`}>
                            {companyNIP || 'Nie podano'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className={`block font-medium mb-2 ${fontSizeClass}`}>Branża</label>
                        {editing ? (
                          <select
                            value={companyIndustry}
                            onChange={(e) => setCompanyIndustry(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } ${fontSizeClass}`}
                          >
                            <option value="">Wybierz branżę</option>
                            <option value="szpitale">Szpitale</option>
                            <option value="przychodnie">Przychodnie</option>
                            <option value="apteki">Apteki</option>
                            <option value="diagnostyka">Diagnostyka</option>
                            <option value="stomatologia">Stomatologia</option>
                            <option value="kosmetyka_medyczna">Kosmetyka medyczna</option>
                            <option value="inne">Inne</option>
                          </select>
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          } ${fontSizeClass}`}>
                            {companyIndustry || 'Nie podano'}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newsletterConsent}
                        onChange={(e) => setNewsletterConsent(e.target.checked)}
                        disabled={!editing}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                      />
                      <span className={fontSizeClass}>
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
                  onClick={handleUpdateProfile}
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
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h2 className={`font-semibold mb-6 ${fontSize === 'large' ? 'text-2xl' : fontSize === 'small' ? 'text-lg' : 'text-xl'}`}>
              Ustawienia konta
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Powiadomienia */}
              <div>
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Powiadomienia</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-3"
                    />
                    <span className={fontSizeClass}>Powiadomienia e-mail</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-3"
                    />
                    <span className={fontSizeClass}>Powiadomienia SMS</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={marketingEmails}
                      onChange={(e) => setMarketingEmails(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-3"
                    />
                    <span className={fontSizeClass}>E-maile marketingowe</span>
                  </label>
                </div>
              </div>
              
              {/* Prywatność */}
              <div>
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Prywatność</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Widoczność profilu</label>
                    <select
                      value={profileVisibility}
                      onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private' | 'contacts')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${fontSizeClass}`}
                    >
                      <option value="public">Publiczny</option>
                      <option value="contacts">Tylko kontakty</option>
                      <option value="private">Prywatny</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Język i strefa czasowa */}
              <div>
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Regionalne</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Język</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${fontSizeClass}`}
                    >
                      <option value="pl">Polski</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Strefa czasowa</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } ${fontSizeClass}`}
                    >
                      <option value="Europe/Warsaw">Europa/Warszawa</option>
                      <option value="Europe/London">Europa/Londyn</option>
                      <option value="Europe/Berlin">Europa/Berlin</option>
                      <option value="America/New_York">Ameryka/Nowy Jork</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Bezpieczeństwo */}
              <div>
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Bezpieczeństwo</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => alert('Funkcja zmiany hasła będzie dostępna wkrótce')}
                    className="w-full px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors flex items-center justify-center"
                  >
                    <FaLock className="mr-2" />
                    Zmień hasło
                  </button>
                  
                  <button
                    onClick={() => alert('Funkcja dwuskładnikowego uwierzytelniania będzie dostępna wkrótce')}
                    className={`w-full px-4 py-2 rounded transition-colors flex items-center justify-center ${
                      darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FaBell className="mr-2" />
                    Skonfiguruj 2FA
                  </button>
                </div>
              </div>
            </div>
            
            {/* Save Settings Button */}
            <div className="mt-6">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaCheck className="mr-2" />
                {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
              </button>
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`max-w-md w-full mx-4 rounded-lg p-6 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Zmień zdjęcie profilowe</h3>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Wybierz zdjęcie profilowe:
                </p>
                <ul className={`text-xs mb-4 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li>• Maksymalny rozmiar: 5MB</li>
                  <li>• Dozwolone formaty: JPG, PNG, GIF</li>
                  <li>• Zalecany rozmiar: 200x200 pikseli</li>
                  <li>• Zdjęcie zostanie automatycznie przycięte do kwadratu</li>
                </ul>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff]"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageWorking;