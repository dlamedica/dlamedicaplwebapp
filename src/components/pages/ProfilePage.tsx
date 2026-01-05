import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../hooks/useUser';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye, FaEyeSlash, FaCamera, FaPlus, FaBuilding, FaCalendar, FaBriefcase, FaClock, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { MEDICAL_PROFESSIONS } from '../../constants/professions';
import ProfileImageCropper from '../ProfileImageCropper';

interface ProfilePageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  employment_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  expires_at: string;
}

interface Event {
  id: string;
  title: string;
  type: 'conference' | 'webinar';
  date: string;
  location?: string;
  online_url?: string;
  description: string;
  max_participants?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ darkMode }) => {
  const { user, profile, loading: userLoading } = useUser();
  const { signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'events' | 'settings'>('profile');
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyBio, setCompanyBio] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyNIP, setCompanyNIP] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [showImageCropper, setShowImageCropper] = useState(false);
  
  // User content state
  const [userJobOffers, setUserJobOffers] = useState<JobOffer[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  
  // Account management state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
    console.log('🔍 ProfilePage: Component mounted');
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setProfession(profile.profession || '');
      setCustomProfession(profile.custom_profession || '');
      setNewsletterConsent(profile.newsletter_consent || false);
      setCompanyName(profile.company_name || '');
      setCompanyLogo(profile.company_logo_url || '');
      // Mapowanie: company_description -> company_bio (dla kompatybilności z UI)
      setCompanyBio(profile.company_bio || profile.company_description || '');
      setCompanyWebsite(profile.company_website || '');
      // Mapowanie: phone -> companyPhone (w bazie jest tylko kolumna 'phone')
      setCompanyPhone(profile.phone || '');
      setCompanyAddress(profile.company_address || '');
      setCompanyNIP(profile.company_nip || '');
      setCompanyIndustry(profile.company_industry || profile.company_size || '');
      // Mapowanie: avatar_url -> profile_image_url (dla kompatybilności z UI)
      setProfileImage(profile.profile_image_url || profile.avatar_url || '');
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      console.log('🔍 ProfilePage: User not authenticated, redirecting to login');
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (user) {
      console.log('🔍 ProfilePage: User authenticated:', user.email);
    }
  }, [user, userLoading]);

  // Load user's job offers and events
  useEffect(() => {
    if (user && profile?.is_company) {
      loadUserContent();
    }
  }, [user, profile]);

  const loadUserContent = async () => {
    try {
      // Mock data for now - w rzeczywistości pobierz z API
      setUserJobOffers([
        {
          id: '1',
          title: 'Lekarz Internista',
          company: companyName || 'Twoja Firma',
          location: 'Warszawa',
          salary_min: 8000,
          salary_max: 12000,
          employment_type: 'full-time',
          status: 'approved',
          created_at: '2024-01-15',
          expires_at: '2024-03-15'
        },
        {
          id: '2',
          title: 'Pielęgniarka',
          company: companyName || 'Twoja Firma',
          location: 'Kraków',
          salary_min: 5000,
          salary_max: 7000,
          employment_type: 'full-time',
          status: 'pending',
          created_at: '2024-01-20',
          expires_at: '2024-04-20'
        }
      ]);

      setUserEvents([
        {
          id: '1',
          title: 'Konferencja Kardiologiczna 2024',
          type: 'conference',
          date: '2024-03-15',
          location: 'Hotel Marriott, Warszawa',
          description: 'Najnowsze trendy w kardiologii',
          max_participants: 200,
          status: 'approved',
          created_at: '2024-01-10'
        },
        {
          id: '2',
          title: 'Webinar: Telemedycyna w praktyce',
          type: 'webinar',
          date: '2024-02-28',
          online_url: 'https://zoom.us/j/123456789',
          description: 'Praktyczne aspekty telemedycyny',
          max_participants: 100,
          status: 'pending',
          created_at: '2024-01-18'
        }
      ]);
    } catch (error) {
      console.error('Error loading user content:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Mapowanie pól zgodnie z backendem i bazą danych
      // Wysyłamy wszystkie pola (nawet puste) - backend sam zdecyduje co zapisać
      const updates: Record<string, any> = {
        full_name: fullName,
        profession: profession,
        avatar_url: profileImage, // profile_image_url -> avatar_url
        phone: profile?.is_company ? companyPhone : undefined, // companyPhone -> phone (wspólne pole)
      };

      // Dodaj pola firmowe tylko dla kont firmowych
      if (profile?.is_company) {
        updates.company_name = companyName;
        updates.company_logo_url = companyLogo;
        updates.company_description = companyBio; // company_bio -> company_description
        updates.company_website = companyWebsite;
        updates.company_address = companyAddress;
        updates.company_nip = companyNIP;
        // company_industry nie ma w bazie - pomijamy na razie
      }

      // Usuń tylko undefined wartości (puste stringi zostawiamy - użytkownik może chcieć wyczyścić pole)
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      console.log('📤 ProfilePage: Wysyłanie aktualizacji profilu:', updates);

      // Jeśli nie ma żadnych danych do aktualizacji
      if (Object.keys(updates).length === 0) {
        setError('Brak danych do aktualizacji');
        setLoading(false);
        return;
      }

      const { error } = await updateProfile(updates);

      if (error) {
        setError(error.message || 'Błąd podczas aktualizacji profilu');
      } else {
        setSuccess('Profil został zaktualizowany');
        setEditing(false);
      }
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleImageCropped = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl);
    setShowImageCropper(false);
  };

  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'Oczekuje na akceptację',
      approved: 'Zatwierdzone',
      rejected: 'Odrzucone'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const navigateToAddContent = (type: 'job' | 'event') => {
    const path = type === 'job' ? '/add-job-offer' : '/add-event';
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  console.log('🔍 ProfilePage: Rendering - userLoading:', userLoading, 'user:', !!user);

  if (userLoading) {
    console.log('🔍 ProfilePage: Showing loading state');
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🔍 ProfilePage: No user, returning null (will redirect)');
    return null; // Will redirect via useEffect
  }

  console.log('🔍 ProfilePage: Rendering main content for user:', user.email);

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
                {editing && (
                  <button
                    onClick={() => setShowImageCropper(true)}
                    className="absolute -bottom-1 -right-1 bg-[#38b6ff] text-white p-1 rounded-full hover:bg-[#2a9fe5] transition-colors"
                  >
                    <FaCamera className="text-xs" />
                  </button>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.is_company ? companyName || 'Firma' : fullName || 'Użytkownik'}
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
              {['profile', 'jobs', 'events', 'settings'].map((tab) => {
                const tabLabels = {
                  profile: 'Profil',
                  jobs: 'Oferty pracy',
                  events: 'Wydarzenia',
                  settings: 'Ustawienia'
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

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Informacje o profilu</h2>
              {!editing && (
                <button
                  onClick={() => {
                    console.log('🔧 Kliknięto Edytuj profil, ustawiam editing=true');
                    setEditing(true);
                  }}
                  className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edytuj profil
                </button>
              )}
              {editing && (
                <span className="text-green-500 font-medium">Tryb edycji aktywny</span>
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
                    <label className="block text-sm font-medium mb-2">
                      {profile?.is_company ? 'Nazwa firmy' : 'Imię i nazwisko'}
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile?.is_company ? companyName : fullName}
                        onChange={(e) => profile?.is_company ? setCompanyName(e.target.value) : setFullName(e.target.value)}
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
                        {profile?.is_company ? companyName || 'Nie podano' : fullName || 'Nie podano'}
                      </div>
                    )}
                  </div>

                  {!profile?.is_company && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
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
                      {editing && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Dozwolone tylko litery, cyfry i podkreślenia. Max 30 znaków.
                        </p>
                      )}
                    </div>
                  )}

                  {profile?.is_company && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">NIP</label>
                        {editing ? (
                          <input
                            type="text"
                            value={companyNIP}
                            onChange={(e) => setCompanyNIP(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="1234567890"
                          />
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}>
                            {companyNIP || 'Nie podano'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Branża</label>
                        {editing ? (
                          <select
                            value={companyIndustry}
                            onChange={(e) => setCompanyIndustry(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="">Wybierz branżę</option>
                            <option value="szpital">Szpital</option>
                            <option value="poradnia">Poradnia</option>
                            <option value="przychodnia">Przychodnia</option>
                            <option value="apteka">Apteka</option>
                            <option value="laboratorium">Laboratorium</option>
                            <option value="rehabilitacja">Rehabilitacja</option>
                            <option value="stomatologia">Stomatologia</option>
                            <option value="diagnostyka">Diagnostyka obrazowa</option>
                            <option value="technologie">Technologie medyczne</option>
                            <option value="farmacja">Farmacja</option>
                            <option value="medycyna_pracy">Medycyna pracy</option>
                            <option value="inne">Inne</option>
                          </select>
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}>
                            {companyIndustry || 'Nie podano'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Strona internetowa</label>
                        {editing ? (
                          <input
                            type="url"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="https://example.com"
                          />
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}>
                            {companyWebsite ? (
                              <a href={companyWebsite} target="_blank" rel="noopener noreferrer" className="text-[#38b6ff] hover:underline">
                                {companyWebsite}
                              </a>
                            ) : (
                              'Nie podano'
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Telefon</label>
                        {editing ? (
                          <input
                            type="tel"
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="+48 123 456 789"
                          />
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}>
                            {companyPhone || 'Nie podano'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Adres</label>
                        {editing ? (
                          <textarea
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Ulica, miasto, kod pocztowy"
                          />
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}>
                            {companyAddress || 'Nie podano'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Opis firmy</label>
                        {editing ? (
                          <textarea
                            value={companyBio}
                            onChange={(e) => setCompanyBio(e.target.value)}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Krótki opis firmy i jej działalności..."
                          />
                        ) : (
                          <div className={`p-2 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                          }`}>
                            {companyBio || 'Nie podano'}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {!profile?.is_company && (
                    <>
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

                      {profession === 'inne' && editing && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Wpisz swój zawód</label>
                          <input
                            type="text"
                            value={customProfession}
                            onChange={(e) => setCustomProfession(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Wpisz swój zawód"
                          />
                        </div>
                      )}
                    </>
                  )}
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

                  <div className="flex items-center justify-between">
                    <span>Ostatnia aktywność:</span>
                    <span>{new Date(profile?.updated_at || user.created_at).toLocaleDateString()}</span>
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

        {/* Job Offers Tab */}
        {activeTab === 'jobs' && profile?.is_company && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Twoje oferty pracy</h2>
              <button
                onClick={() => navigateToAddContent('job')}
                className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
              >
                <FaPlus className="mr-2" />
                Dodaj ofertę
              </button>
            </div>

            <div className="space-y-4">
              {userJobOffers.map((job) => (
                <div key={job.id} className={`border rounded-lg p-4 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.location} • {job.employment_type}
                      </p>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                  
                  {job.salary_min && job.salary_max && (
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Wynagrodzenie: {job.salary_min} - {job.salary_max} PLN
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Opublikowano: {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Wygasa: {new Date(job.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {job.status === 'rejected' && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      Oferta została odrzucona przez administratora
                    </div>
                  )}
                </div>
              ))}
              
              {userJobOffers.length === 0 && (
                <div className="text-center py-8">
                  <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Nie masz jeszcze żadnych ofert pracy
                  </p>
                  <button
                    onClick={() => navigateToAddContent('job')}
                    className="mt-4 px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
                  >
                    Dodaj pierwszą ofertę
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && profile?.is_company && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Twoje wydarzenia</h2>
              <button
                onClick={() => navigateToAddContent('event')}
                className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
              >
                <FaPlus className="mr-2" />
                Dodaj wydarzenie
              </button>
            </div>

            <div className="space-y-4">
              {userEvents.map((event) => (
                <div key={event.id} className={`border rounded-lg p-4 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <FaCalendar className="inline mr-1" />
                        {new Date(event.date).toLocaleDateString()} • {event.type === 'conference' ? 'Konferencja' : 'Webinar'}
                      </p>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {event.description}
                  </p>
                  
                  {event.location && (
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Lokalizacja: {event.location}
                    </p>
                  )}
                  
                  {event.online_url && (
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Link online: <a href={event.online_url} className="text-[#38b6ff] hover:underline">{event.online_url}</a>
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Dodano: {new Date(event.created_at).toLocaleDateString()}
                    </span>
                    {event.max_participants && (
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Max. uczestników: {event.max_participants}
                      </span>
                    )}
                  </div>
                  
                  {event.status === 'rejected' && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      Wydarzenie zostało odrzucone przez administratora
                    </div>
                  )}
                </div>
              ))}
              
              {userEvents.length === 0 && (
                <div className="text-center py-8">
                  <FaCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Nie masz jeszcze żadnych wydarzeń
                  </p>
                  <button
                    onClick={() => navigateToAddContent('event')}
                    className="mt-4 px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
                  >
                    Dodaj pierwsze wydarzenie
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h2 className="text-xl font-semibold mb-6">Ustawienia konta</h2>
            
            <div className="space-y-6">
              {/* Password Change */}
              <div>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  <FaEye className="mr-2" />
                  Zmień hasło
                </button>

                {showPasswordChange && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h3 className="font-semibold mb-4 text-blue-800">Zmiana hasła</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800">
                          Nowe hasło
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] pr-10"
                            placeholder="Nowe hasło"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800">
                          Potwierdź nowe hasło
                        </label>
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff]"
                          placeholder="Potwierdź nowe hasło"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            // Password change logic would go here
                            setError('Funkcja zmiany hasła wymaga dodatkowej konfiguracji');
                          }}
                          className="px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
                        >
                          Zmień hasło
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordChange(false);
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          Anuluj
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Deletion */}
              <div>
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Usuń konto
                </button>

                {showDeleteConfirm && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-start space-x-3">
                      <FaExclamationTriangle className="text-red-600 mt-1" />
                      <div>
                        <p className="text-red-800 mb-4">
                          <strong>Uwaga!</strong> Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane, oferty pracy i wydarzenia zostaną trwale usunięte.
                        </p>
                        <p className="text-red-700 text-sm mb-4">
                          Konta nieaktywne przez ponad rok są automatycznie usuwane przez system.
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              // Account deletion logic would go here
                              setError('Funkcja usunięcia konta wymaga dodatkowej konfiguracji');
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Tak, usuń konto
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            Anuluj
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Activity Info */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h3 className="font-medium mb-2">Informacje o koncie</h3>
                <div className="text-sm space-y-1">
                  <p>• Konta nieaktywne przez 365 dni są automatycznie oznaczane do usunięcia</p>
                  <p>• Ostrzeżenie o usunięciu wysyłane 30 dni przed usunięciem</p>
                  <p>• Logowanie, dodawanie treści lub edycja profilu liczy się jako aktywność</p>
                  <p>• Możesz w każdej chwili pobrać kopię swoich danych</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && (
        <ProfileImageCropper
          darkMode={darkMode}
          onImageCropped={handleImageCropped}
          onCancel={() => setShowImageCropper(false)}
          currentImage={profileImage}
        />
      )}
    </div>
  );
};

export default ProfilePage;