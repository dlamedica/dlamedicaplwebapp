import React, { useEffect, useState } from 'react';
import { FaEdit, FaUser, FaSignOutAlt, FaCheck, FaTimes, FaCamera, FaBuilding, FaBell, FaLock, FaBriefcase, FaCalendarAlt, FaPlus, FaSpinner, FaEye, FaStar, FaClock, FaDownload, FaUserCheck, FaUserTimes, FaStickyNote, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFileAlt, FaPen } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { exampleDataService, Application } from '../../services/exampleDataService';

interface ProfilePageCompanyProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Mock company account data
const mockUser = {
  id: '1',
  email: 'firma@example.com',
  created_at: '2024-01-01',
  email_confirmed_at: '2024-01-01'
};

const mockProfile = {
  id: '1',
  user_id: '1',
  full_name: 'Przykładowa Firma Medyczna',
  username: 'przykladowa_firma',
  profession: 'firma',
  newsletter_consent: true,
  is_company: true,
  company_name: 'Przykładowa Firma Medyczna Sp. z o.o.',
  company_nip: '1234567890',
  company_industry: 'szpitale',
  profile_image_url: null
};

// Mock data for company job offers
const mockCompanyJobOffers = [
  {
    id: '1',
    title: 'Lekarz Kardiolog',
    location: 'Warszawa',
    salary: '12000-18000 PLN',
    status: 'approved',
    createdAt: '2024-01-10',
    applications: 12,
    views: 156,
    description: 'Poszukujemy doświadczonego kardiologa do pracy w naszym szpitalu...',
    rejectionReason: null
  },
  {
    id: '2',
    title: 'Pielęgniarka Oddziałowa',
    location: 'Warszawa',
    salary: '5500-7000 PLN',
    status: 'pending',
    createdAt: '2024-01-15',
    applications: 8,
    views: 89,
    description: 'Zatrudnimy pielęgniarkę na oddział intensywnej terapii...',
    rejectionReason: null
  },
  {
    id: '3',
    title: 'Fizjoterapeuta',
    location: 'Warszawa',
    salary: '4500-6500 PLN',
    status: 'rejected',
    createdAt: '2024-01-08',
    applications: 3,
    views: 45,
    description: 'Nieodpowiedni opis stanowiska',
    rejectionReason: 'niepelne_dane',
    rejectionNote: 'Brak wymaganych informacji o kwalifikacjach i doświadczeniu'
  }
];

// Mock data for job applications
const mockJobApplications = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Lekarz Kardiolog',
    candidateName: 'Dr Anna Kowalska',
    candidateEmail: 'anna.kowalska@email.com',
    candidatePhone: '+48 123 456 789',
    appliedAt: '2024-01-12',
    status: 'new',
    rating: 0,
    notes: '',
    cvUrl: '/cv/anna-kowalska.pdf',
    coverLetter: 'Szanowni Państwo, jestem doświadczonym kardiologiem z 8-letnim stażem...',
    experience: '8 lat',
    specialization: 'Kardiologia interwencyjna'
  },
  {
    id: '2',
    jobId: '1',
    jobTitle: 'Lekarz Kardiolog',
    candidateName: 'Dr Piotr Wiśniewski',
    candidateEmail: 'piotr.wisniewski@email.com',
    candidatePhone: '+48 987 654 321',
    appliedAt: '2024-01-13',
    status: 'reviewed',
    rating: 4,
    notes: 'Bardzo dobry kandydat, odpowiednie doświadczenie',
    cvUrl: '/cv/piotr-wisniewski.pdf',
    coverLetter: 'Jestem zainteresowany pracą w Państwa placówce...',
    experience: '12 lat',
    specialization: 'Kardiologia kliniczna'
  },
  {
    id: '3',
    jobId: '2',
    jobTitle: 'Pielęgniarka Oddziałowa',
    candidateName: 'Mgr Maria Nowak',
    candidateEmail: 'maria.nowak@email.com',
    candidatePhone: '+48 555 666 777',
    appliedAt: '2024-01-16',
    status: 'interested',
    rating: 5,
    notes: 'Doskonały kandydat, zapraszamy na rozmowę',
    cvUrl: '/cv/maria-nowak.pdf',
    coverLetter: 'Mam 15-letnie doświadczenie w pracy na oddziałach intensywnej terapii...',
    experience: '15 lat',
    specialization: 'Intensywna terapia'
  },
  {
    id: '4',
    jobId: '2',
    jobTitle: 'Pielęgniarka Oddziałowa',
    candidateName: 'Katarzyna Zielińska',
    candidateEmail: 'k.zielinska@email.com',
    candidatePhone: '+48 111 222 333',
    appliedAt: '2024-01-17',
    status: 'rejected',
    rating: 2,
    notes: 'Brak odpowiedniego doświadczenia',
    cvUrl: '/cv/katarzyna-zielinska.pdf',
    coverLetter: 'Jestem absolwentką studiów pielęgniarskich...',
    experience: '1 rok',
    specialization: 'Pielęgniarstwo ogólne'
  }
];

// Mock data for company events
const mockCompanyEvents = [
  {
    id: '1',
    title: 'Konferencja Kardiologiczna 2024',
    date: '2024-03-15',
    location: 'Centrum Konferencyjne, Warszawa',
    type: 'conference',
    status: 'approved',
    createdAt: '2024-01-12',
    participants: 150,
    registrations: 89,
    description: 'Coroczna konferencja dla kardiologów i lekarzy internistów...'
  },
  {
    id: '2',
    title: 'Szkolenie z EKG',
    date: '2024-02-20',
    location: 'Online',
    type: 'webinar',
    status: 'pending',
    createdAt: '2024-01-18',
    participants: 50,
    registrations: 23,
    description: 'Praktyczne szkolenie z interpretacji EKG...'
  }
];

const ProfilePageCompany: React.FC<ProfilePageCompanyProps> = ({ darkMode, fontSize }) => {
  const { signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'applications' | 'events' | 'settings'>('profile');
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(mockProfile.full_name || '');
  const [username, setUsername] = useState(mockProfile.username || '');
  const [profession, setProfession] = useState(mockProfile.profession || '');
  const [customProfession, setCustomProfession] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(mockProfile.newsletter_consent || false);
  const [profileImage, setProfileImage] = useState(mockProfile.profile_image_url || '');
  const [companyName, setCompanyName] = useState(mockProfile.company_name || '');
  const [companyNIP, setCompanyNIP] = useState(mockProfile.company_nip || '');
  const [companyIndustry, setCompanyIndustry] = useState(mockProfile.company_industry || '');
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [language, setLanguage] = useState('pl');
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  
  // Application management state
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationFilters, setApplicationFilters] = useState({
    jobId: 'all',
    status: 'all',
    rating: 'all'
  });
  
  useEffect(() => {
    document.title = 'Profil użytkownika – DlaMedica.pl';
  }, []);
  
  const handleUpdateProfile = async () => {
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      alert('Profil zaktualizowany pomyślnie!');
      setEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleNewsletterChange = async (checked: boolean) => {
    setNewsletterConsent(checked);
    setNewsletterSaving(true);
    
    // Auto-save newsletter consent
    setTimeout(() => {
      setNewsletterSaving(false);
      // Show brief success feedback without alert
    }, 800);
  };
  
  const handleSignOut = async () => {
    if (confirm('Czy na pewno chcesz się wylogować?')) {
      try {
        console.log('ProfilePageCompany: Attempting to sign out...');
        await signOut(); // This will handle everything including redirect
        console.log('ProfilePageCompany: Sign out initiated');
      } catch (error) {
        console.error('ProfilePageCompany: Error signing out:', error);
      }
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Plik jest zbyt duży. Maksymalny rozmiar to 5MB.');
        return;
      }
      
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
  
  const fontSizeClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="mr-1" />
            Weryfikacja
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1" />
            Zaakceptowane
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimes className="mr-1" />
            Odrzucone
          </span>
        );
      default:
        return null;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaClock className="mr-1" />
            Nowa
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaEye className="mr-1" />
            Przejrzana
          </span>
        );
      case 'interested':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaUserCheck className="mr-1" />
            Zainteresowany
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaUserTimes className="mr-1" />
            Odrzucony
          </span>
        );
      default:
        return null;
    }
  };

  const renderStarRating = (rating: number, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const handleApplicationStatusChange = (applicationId: string, newStatus: string) => {
    // Mock function - in real app would call API
    console.log(`Changing application ${applicationId} status to ${newStatus}`);
    alert(`Status aplikacji zmieniony na: ${newStatus}`);
  };

  const handleRatingChange = (applicationId: string, rating: number) => {
    // Mock function - in real app would call API
    console.log(`Rating application ${applicationId} with ${rating} stars`);
  };

  const filteredApplications = mockJobApplications.filter(app => {
    if (applicationFilters.jobId !== 'all' && app.jobId !== applicationFilters.jobId) return false;
    if (applicationFilters.status !== 'all' && app.status !== applicationFilters.status) return false;
    if (applicationFilters.rating !== 'all') {
      const ratingFilter = parseInt(applicationFilters.rating);
      if (app.rating < ratingFilter) return false;
    }
    return true;
  });
  
  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
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
                  {companyName || 'Firma'}
                </h1>
                <p className={`${fontSizeClass} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {mockUser.email}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  <FaBuilding className="mr-1" />
                  Konto firmowe
                </span>
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
              {['profile', 'jobs', 'applications', 'events', 'settings'].map((tab) => {
                const tabLabels = {
                  profile: 'Profil',
                  jobs: 'Moje oferty',
                  applications: 'Aplikacje',
                  events: 'Wydarzenia',
                  settings: 'Ustawienia'
                };
                
                const tabIcons = {
                  profile: <FaUser className="mr-2" />,
                  jobs: <FaBriefcase className="mr-2" />,
                  applications: <FaFileAlt className="mr-2" />,
                  events: <FaCalendarAlt className="mr-2" />,
                  settings: <FaBell className="mr-2" />
                };
                
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium ${fontSizeClass} transition-colors flex items-center ${
                      activeTab === tab
                        ? 'border-[#38b6ff] text-[#38b6ff]'
                        : 'border-transparent hover:text-[#38b6ff]'
                    } ${darkMode ? 'text-gray-300 hover:text-[#38b6ff]' : 'text-gray-500 hover:text-[#38b6ff]'}`}
                  >
                    {tabIcons[tab as keyof typeof tabIcons]}
                    {tabLabels[tab as keyof typeof tabLabels]}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`font-semibold ${fontSize === 'large' ? 'text-2xl' : fontSize === 'small' ? 'text-lg' : 'text-xl'}`}>
                Informacje o firmie
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
                <h3 className={`font-medium mb-4 ${fontSizeClass}`}>Dane firmy</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Email</label>
                    <div className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} ${fontSizeClass}`}>
                      {mockUser.email}
                    </div>
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>Nazwa firmy</label>
                    {editing ? (
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } ${fontSizeClass}`}
                      />
                    ) : (
                      <div className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} ${fontSizeClass}`}>
                        {companyName || 'Nie podano'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block font-medium mb-2 ${fontSizeClass}`}>NIP</label>
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
                      <div className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} ${fontSizeClass}`}>
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
                      <div className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} ${fontSizeClass}`}>
                        {companyIndustry === 'szpitale' ? 'Szpitale' :
                         companyIndustry === 'przychodnie' ? 'Przychodnie' :
                         companyIndustry === 'apteki' ? 'Apteki' :
                         companyIndustry === 'diagnostyka' ? 'Diagnostyka' :
                         companyIndustry === 'stomatologia' ? 'Stomatologia' :
                         companyIndustry === 'kosmetyka_medyczna' ? 'Kosmetyka medyczna' :
                         companyIndustry === 'inne' ? 'Inne' :
                         'Nie podano'}
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
                      mockUser.email_confirmed_at 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mockUser.email_confirmed_at ? 'Zweryfikowany' : 'Niezweryfikowany'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={fontSizeClass}>Typ konta:</span>
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      Firmowe
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={fontSizeClass}>Data rejestracji:</span>
                    <span className={fontSizeClass}>{new Date(mockUser.created_at).toLocaleDateString('pl-PL')}</span>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newsletterConsent}
                        onChange={(e) => handleNewsletterChange(e.target.checked)}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                        disabled={newsletterSaving}
                      />
                      <span className={fontSizeClass}>
                        Zgoda na newsletter
                      </span>
                      {newsletterSaving && (
                        <FaSpinner className="ml-2 animate-spin text-[#38b6ff]" />
                      )}
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

        {activeTab === 'jobs' && (
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className={`font-semibold ${fontSize === 'large' ? 'text-2xl' : fontSize === 'small' ? 'text-lg' : 'text-xl'}`}>
                Moje oferty pracy
              </h2>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/add-job-offer');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
              >
                <FaPlus className="mr-2" />
                Dodaj ofertę
              </button>
            </div>
            
            <div className="space-y-4">
              {mockCompanyJobOffers.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 border rounded-lg ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${fontSizeClass}`}>{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className={`${fontSizeClass} ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2" />
                          Opublikowana: {job.createdAt}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <FaFileAlt className="mr-1" />
                            {job.applications} aplikacji
                          </span>
                          <span className="flex items-center">
                            <FaEye className="mr-1" />
                            {job.views} wyświetleń
                          </span>
                        </div>
                        <div className="font-semibold text-[#38b6ff]">
                          {job.salary}
                        </div>
                      </div>
                      
                      {job.status === 'rejected' && job.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center">
                            <FaTimes className="text-red-500 mr-2" />
                            <span className="text-red-700 font-medium">Powód odrzucenia:</span>
                          </div>
                          <p className="text-red-600 mt-1 text-sm">{job.rejectionNote}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Funkcja podglądu oferty')}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <FaEye className="mr-2" />
                        Podgląd
                      </button>
                      <button
                        onClick={() => alert('Funkcja edycji oferty')}
                        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        <FaEdit className="mr-2" />
                        Edytuj
                      </button>
                      {job.applications > 0 && (
                        <button
                          onClick={() => {
                            setActiveTab('applications');
                            setApplicationFilters({...applicationFilters, jobId: job.id});
                          }}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <FaFileAlt className="mr-2" />
                          Aplikacje ({job.applications})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className={`font-semibold ${fontSize === 'large' ? 'text-2xl' : fontSize === 'small' ? 'text-lg' : 'text-xl'}`}>
                Aplikacje na oferty pracy
              </h2>
              
              {/* Application Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={applicationFilters.jobId}
                  onChange={(e) => setApplicationFilters({...applicationFilters, jobId: e.target.value})}
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${fontSizeClass}`}
                >
                  <option value="all">Wszystkie oferty</option>
                  {mockCompanyJobOffers.map((job) => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
                
                <select
                  value={applicationFilters.status}
                  onChange={(e) => setApplicationFilters({...applicationFilters, status: e.target.value})}
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${fontSizeClass}`}
                >
                  <option value="all">Wszystkie statusy</option>
                  <option value="new">Nowe</option>
                  <option value="reviewed">Przejrzane</option>
                  <option value="interested">Zainteresowany</option>
                  <option value="rejected">Odrzucone</option>
                </select>
                
                <select
                  value={applicationFilters.rating}
                  onChange={(e) => setApplicationFilters({...applicationFilters, rating: e.target.value})}
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } ${fontSizeClass}`}
                >
                  <option value="all">Wszystkie oceny</option>
                  <option value="5">5 gwiazdek</option>
                  <option value="4">4+ gwiazdek</option>
                  <option value="3">3+ gwiazdek</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className={`p-4 border rounded-lg ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold ${fontSizeClass}`}>{application.candidateName}</h3>
                          <p className={`${fontSizeClass} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Aplikacja na: {application.jobTitle}
                          </p>
                        </div>
                        {getApplicationStatusBadge(application.status)}
                      </div>
                      
                      <div className={`${fontSizeClass} ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                        <div className="flex items-center">
                          <FaEnvelope className="mr-2" />
                          {application.candidateEmail}
                        </div>
                        <div className="flex items-center">
                          <FaPhone className="mr-2" />
                          {application.candidatePhone}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2" />
                          Aplikacja: {application.appliedAt}
                        </div>
                        <div className="flex items-center">
                          <FaUser className="mr-2" />
                          Doświadczenie: {application.experience}
                        </div>
                        <div className="flex items-center">
                          <FaStar className="mr-2 text-yellow-400" />
                          Specjalizacja: {application.specialization}
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center mt-3 space-x-2">
                        <span className={`${fontSizeClass} font-medium`}>Ocena:</span>
                        {renderStarRating(application.rating, (rating) => handleRatingChange(application.id, rating))}
                      </div>
                      
                      {/* Notes */}
                      {application.notes && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="flex items-center mb-1">
                            <FaStickyNote className="text-blue-500 mr-2" />
                            <span className="text-blue-700 font-medium">Notatki:</span>
                          </div>
                          <p className="text-blue-600 text-sm">{application.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {/* Status Change Buttons */}
                      <div className="flex gap-2">
                        <select
                          value={application.status}
                          onChange={(e) => handleApplicationStatusChange(application.id, e.target.value)}
                          className={`flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#38b6ff] ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="new">Nowa</option>
                          <option value="reviewed">Przejrzana</option>
                          <option value="interested">Zainteresowany</option>
                          <option value="rejected">Odrzucona</option>
                        </select>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApplicationModal(true);
                          }}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          <FaEye className="mr-1" />
                          Szczegóły
                        </button>
                        <a
                          href={application.cvUrl}
                          download
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                        >
                          <FaDownload className="mr-1" />
                          CV
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredApplications.length === 0 && (
                <div className={`p-8 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                  <FaFileAlt className="text-5xl mx-auto mb-4 text-gray-400" />
                  <p className={`${fontSizeClass} mb-4`}>
                    Brak aplikacji spełniających wybrane kryteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`font-semibold ${fontSize === 'large' ? 'text-2xl' : fontSize === 'small' ? 'text-lg' : 'text-xl'}`}>
                Moje wydarzenia
              </h2>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/add-event');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
              >
                <FaPlus className="mr-2" />
                Dodaj wydarzenie
              </button>
            </div>
            
            <div className={`p-8 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <FaCalendarAlt className="text-5xl mx-auto mb-4 text-gray-400" />
              <p className={`${fontSizeClass} mb-4`}>
                Nie masz jeszcze żadnych wydarzeń.
              </p>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/add-event');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-6 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
              >
                Dodaj pierwsze wydarzenie
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
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
                      checked={marketingEmails}
                      onChange={(e) => setMarketingEmails(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-3"
                    />
                    <span className={fontSizeClass}>E-maile marketingowe</span>
                  </label>
                </div>
              </div>
              
              {/* Język */}
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

        {/* Application Details Modal */}
        {showApplicationModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-2xl w-full rounded-lg p-6 max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaUser className="mr-2 text-[#38b6ff]" />
                  Szczegóły aplikacji
                </h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Candidate Info */}
                <div>
                  <h4 className="font-semibold mb-3 text-[#38b6ff]">Informacje o kandydacie</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Imię i nazwisko:</strong>
                      <p className={fontSizeClass}>{selectedApplication.candidateName}</p>
                    </div>
                    <div>
                      <strong>Email:</strong>
                      <p className={fontSizeClass}>{selectedApplication.candidateEmail}</p>
                    </div>
                    <div>
                      <strong>Telefon:</strong>
                      <p className={fontSizeClass}>{selectedApplication.candidatePhone}</p>
                    </div>
                    <div>
                      <strong>Doświadczenie:</strong>
                      <p className={fontSizeClass}>{selectedApplication.experience}</p>
                    </div>
                    <div>
                      <strong>Specjalizacja:</strong>
                      <p className={fontSizeClass}>{selectedApplication.specialization}</p>
                    </div>
                    <div>
                      <strong>Data aplikacji:</strong>
                      <p className={fontSizeClass}>{selectedApplication.appliedAt}</p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div>
                  <h4 className="font-semibold mb-3 text-[#38b6ff]">Stanowisko</h4>
                  <p className={`font-medium ${fontSizeClass}`}>{selectedApplication.jobTitle}</p>
                </div>

                {/* Cover Letter */}
                <div>
                  <h4 className="font-semibold mb-3 text-[#38b6ff]">List motywacyjny</h4>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`${fontSizeClass} leading-relaxed`}>
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>

                {/* Status and Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-[#38b6ff]">Status</h4>
                    {getApplicationStatusBadge(selectedApplication.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-[#38b6ff]">Ocena</h4>
                    {renderStarRating(selectedApplication.rating, (rating) => handleRatingChange(selectedApplication.id, rating))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-semibold mb-3 text-[#38b6ff]">Notatki prywatne</h4>
                  <textarea
                    defaultValue={selectedApplication.notes}
                    placeholder="Dodaj notatki o kandydacie..."
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } ${fontSizeClass}`}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                <a
                  href={selectedApplication.cvUrl}
                  download
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Pobierz CV
                </a>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageCompany;