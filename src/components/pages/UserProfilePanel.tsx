/**
 * Panel profilu użytkownika z unikalnym designem
 * Wszystkie komponenty stworzone od podstaw
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/apiClient';
import {
  UserIcon, EditIcon, LogoutIcon, CameraIcon, CheckIcon, CloseIcon,
  UploadIcon, DownloadIcon, FileIcon, HeartIcon, BriefcaseIcon,
  CalendarIcon, ClockIcon, LocationIcon, BuildingIcon, EyeIcon,
  NotificationIcon, LockIcon, SettingsIcon, PhoneIcon, EmailIcon,
  StarIcon, TrashIcon, ExternalLinkIcon, ProfileIcon, OverviewIcon,
  SaveIcon, CancelIcon
} from '../../components/icons/CustomIcons';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomBadge } from '../../components/ui/CustomBadge';
import EducationalMaterials from '../profile/EducationalMaterials';

interface UserProfilePanelProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Mock user data
const mockUserProfile = {
  id: '1',
  email: 'jan.kowalski@email.com',
  firstName: 'Jan',
  lastName: 'Kowalski',
  fullName: 'Jan Kowalski',
  phone: '+48 123 456 789',
  dateOfBirth: '1985-03-15',
  profession: 'lekarz',
  profileImage: null,
  cvFile: {
    name: 'CV_Jan_Kowalski.pdf',
    uploadDate: '2024-01-15',
    size: '245 KB'
  },
  emailVerified: true,
  createdAt: '2023-06-10'
};

// Mock favorite job offers
const mockFavoriteJobs = [
  {
    id: '1',
    title: 'Lekarz Kardiolog',
    company: 'Szpital Wojewódzki',
    location: 'Warszawa',
    salary: '12000-18000 PLN',
    addedAt: '2024-01-10',
    status: 'active',
    description: 'Poszukujemy doświadczonego kardiologa...'
  },
  {
    id: '2',
    title: 'Lekarz Internista',
    company: 'Prywatna Klinika Medyczna',
    location: 'Kraków',
    salary: '10000-14000 PLN',
    addedAt: '2024-01-12',
    status: 'active',
    description: 'Zatrudnimy lekarza internistę...'
  },
  {
    id: '3',
    title: 'Kardiolog Dziecięcy',
    company: 'Instytut Matki i Dziecka',
    location: 'Warszawa',
    salary: '15000-20000 PLN',
    addedAt: '2024-01-08',
    status: 'expired',
    description: 'Specjalista kardiologii dziecięcej...'
  }
];

// Mock favorite events
const mockFavoriteEvents = [
  {
    id: '1',
    title: 'Konferencja Kardiologiczna 2024',
    organizer: 'Polskie Towarzystwo Kardiologiczne',
    date: '2024-03-15',
    location: 'Centrum Konferencyjne, Warszawa',
    addedAt: '2024-01-10',
    status: 'upcoming',
    type: 'conference'
  },
  {
    id: '2',
    title: 'Webinar o Echokardiografii',
    organizer: 'MedEdu',
    date: '2024-02-20',
    location: 'Online',
    addedAt: '2024-01-12',
    status: 'upcoming',
    type: 'webinar'
  }
];

// Mock user applications
const mockUserApplications = [
  {
    id: '1',
    jobId: '101',
    jobTitle: 'Lekarz Kardiolog',
    company: 'Szpital Wojewódzki',
    location: 'Warszawa',
    appliedAt: '2024-01-12',
    status: 'reviewed',
    statusUpdatedAt: '2024-01-15',
    notes: 'Kandydatura jest rozpatrywana przez komisję rekrutacyjną'
  },
  {
    id: '2',
    jobId: '102',
    jobTitle: 'Lekarz Rodzinny',
    company: 'Centrum Medyczne',
    location: 'Gdańsk',
    appliedAt: '2024-01-08',
    status: 'rejected',
    statusUpdatedAt: '2024-01-10',
    notes: 'Dziękujemy za zainteresowanie. W tej chwili poszukujemy kandydata z większym doświadczeniem.'
  },
  {
    id: '3',
    jobId: '103',
    jobTitle: 'Konsultant Kardiolog',
    company: 'Klinika Serca',
    location: 'Warszawa',
    appliedAt: '2024-01-14',
    status: 'new',
    statusUpdatedAt: '2024-01-14',
    notes: null
  }
];

const professionOptions = [
  { value: 'lekarz', label: 'Lekarz' },
  { value: 'pielegniarka', label: 'Pielęgniarka' },
  { value: 'polozna', label: 'Położna' },
  { value: 'ratownik', label: 'Ratownik medyczny' },
  { value: 'farmaceuta', label: 'Farmaceuta' },
  { value: 'fizjoterapeuta', label: 'Fizjoterapeuta' },
  { value: 'dietetyk', label: 'Dietetyk' },
  { value: 'laborant', label: 'Laborant' },
  { value: 'biotechnolog', label: 'Biotechnolog' },
  { value: 'psycholog', label: 'Psycholog' },
  { value: 'student', label: 'Student medycyny' },
  { value: 'inne', label: 'Inne' }
];

const voivodeshipOptions = [
  'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
  'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie',
  'podkarpackie', 'podlaskie', 'pomorskie', 'śląskie',
  'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie'
];

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ darkMode, fontSize }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'materials' | 'cv' | 'favorites' | 'applications' | 'settings'>('profile');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(profile?.first_name || mockUserProfile.firstName);
  const [lastName, setLastName] = useState(profile?.last_name || mockUserProfile.lastName);
  const [phone, setPhone] = useState(profile?.phone || mockUserProfile.phone);
  const [dateOfBirth, setDateOfBirth] = useState(mockUserProfile.dateOfBirth);
  const [profession, setProfession] = useState(profile?.role || mockUserProfile.profession);
  const [specialization, setSpecialization] = useState(profile?.specialization || '');
  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('');
  const [voivodeship, setVoivodeship] = useState('');
  const [hasCVSubmitted, setHasCVSubmitted] = useState(!!mockUserProfile.cvFile);
  const [canChangeProfession, setCanChangeProfession] = useState(!mockUserProfile.cvFile);
  const [profileImage, setProfileImage] = useState<string | null>(profile?.avatar_url || mockUserProfile.profileImage);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [searchRadius, setSearchRadius] = useState('50');
  const [preferredJobTypes, setPreferredJobTypes] = useState<string[]>(['full-time']);

  useEffect(() => {
    document.title = 'Mój profil – DlaMedica.pl';
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setSpecialization(profile.specialization || '');
      setProfileImage(profile.avatar_url || null);
    }
  }, [profile]);

  const fontSizeClasses = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg' }
  };

  const fontSizes = fontSizeClasses[fontSize];

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <CustomBadge variant="info" darkMode={darkMode} size="sm">
            <ClockIcon size={12} color="white" className="mr-1" />
            Wysłana
          </CustomBadge>
        );
      case 'reviewed':
        return (
          <CustomBadge variant="warning" darkMode={darkMode} size="sm">
            <EyeIcon size={12} color="white" className="mr-1" />
            Przejrzana
          </CustomBadge>
        );
      case 'accepted':
        return (
          <CustomBadge variant="success" darkMode={darkMode} size="sm">
            <CheckIcon size={12} color="white" className="mr-1" />
            Zaakceptowana
          </CustomBadge>
        );
      case 'rejected':
        return (
          <CustomBadge variant="error" darkMode={darkMode} size="sm">
            <CloseIcon size={12} color="white" className="mr-1" />
            Odrzucona
          </CustomBadge>
        );
      default:
        return null;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <CustomBadge variant="success" darkMode={darkMode} size="sm">
            <CheckIcon size={12} color="white" className="mr-1" />
            Aktywna
          </CustomBadge>
        );
      case 'expired':
        return (
          <CustomBadge variant="default" darkMode={darkMode} size="sm">
            <ClockIcon size={12} className="mr-1" />
            Wygasła
          </CustomBadge>
        );
      default:
        return null;
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const { error } = await db
          .from('users_profiles')
          .update({
            first_name: firstName || null,
            last_name: lastName || null,
            phone: phone || null,
            specialization: specialization || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
        alert('Profil zaktualizowany pomyślnie!');
        setEditing(false);
      }
    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error);
      alert('Błąd podczas aktualizacji profilu');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Czy na pewno chcesz się wylogować?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
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

  const removeFavoriteJob = (jobId: string) => {
    alert(`Usunięto ofertę z ulubionych`);
  };

  const removeFavoriteEvent = (eventId: string) => {
    alert(`Usunięto wydarzenie z ulubionych`);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', Icon: UserIcon },
    { id: 'materials', label: 'Materiały', Icon: DownloadIcon },
    { id: 'cv', label: 'CV', Icon: FileIcon },
    { id: 'favorites', label: 'Ulubione', Icon: HeartIcon },
    { id: 'applications', label: 'Aplikacje', Icon: BriefcaseIcon },
    { id: 'settings', label: 'Ustawienia', Icon: SettingsIcon }
  ];

  const renderProfile = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${fontSizes.title} font-bold`}>Dane osobowe</h2>
          {!editing && (
            <CustomButton
              variant="primary"
              size="sm"
              darkMode={darkMode}
              onClick={() => setEditing(true)}
              icon={<EditIcon size={18} color="white" />}
            >
              Edytuj profil
            </CustomButton>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Podstawowe informacje */}
          <div>
            <h3 className={`${fontSizes.subtitle} font-medium mb-4`}>Podstawowe informacje</h3>

            <div className="space-y-4">
              <div>
                <label className={`${fontSizes.text} font-medium block mb-2`}>Email</label>
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={fontSizes.text}>{user?.email || mockUserProfile.email}</span>
                  {mockUserProfile.emailVerified && (
                    <CheckIcon size={18} color="#10b981" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${fontSizes.text} font-medium block mb-2`}>Imię</label>
                  {editing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className={`p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${fontSizes.text}`}>
                      {firstName || 'Nie podano'}
                    </div>
                  )}
                </div>
                <div>
                  <label className={`${fontSizes.text} font-medium block mb-2`}>Nazwisko</label>
                  {editing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className={`p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${fontSizes.text}`}>
                      {lastName || 'Nie podano'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`${fontSizes.text} font-medium block mb-2`}>Telefon</label>
                {editing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    placeholder="+48 123 456 789"
                  />
                ) : (
                  <div className={`p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  } ${fontSizes.text}`}>
                    {phone || 'Nie podano'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informacje zawodowe */}
          <div>
            <h3 className={`${fontSizes.subtitle} font-medium mb-4`}>Informacje zawodowe</h3>

            <div className="space-y-4">
              <div>
                <label className={`${fontSizes.text} font-medium block mb-2`}>Zawód</label>
                {editing ? (
                  <div>
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      disabled={!canChangeProfession}
                      className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                      } ${!canChangeProfession ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {professionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {!canChangeProfession && (
                      <p className={`mt-1 text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        ⚠️ Nie możesz zmienić zawodu po wysłaniu CV
                      </p>
                    )}
                  </div>
                ) : (
                  <div className={`p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  } ${fontSizes.text}`}>
                    {professionOptions.find(p => p.value === profession)?.label || 'Nie podano'}
                  </div>
                )}
              </div>

              <div>
                <label className={`${fontSizes.text} font-medium block mb-2`}>Doświadczenie</label>
                {editing ? (
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    placeholder="np. 5 lat, świeży absolwent"
                  />
                ) : (
                  <div className={`p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  } ${fontSizes.text}`}>
                    {experience || 'Nie podano'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${fontSizes.text} font-medium block mb-2`}>Miasto</label>
                  {editing ? (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className={`p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${fontSizes.text}`}>
                      {city || 'Nie podano'}
                    </div>
                  )}
                </div>
                <div>
                  <label className={`${fontSizes.text} font-medium block mb-2`}>Województwo</label>
                  {editing ? (
                    <select
                      value={voivodeship}
                      onChange={(e) => setVoivodeship(e.target.value)}
                      className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="">Wybierz...</option>
                      {voivodeshipOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${fontSizes.text}`}>
                      {voivodeship || 'Nie podano'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={fontSizes.text}>Data rejestracji:</span>
                <span className={fontSizes.text}>{new Date(mockUserProfile.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Przyciski akcji */}
        {editing && (
          <div className="mt-6 flex gap-4">
            <CustomButton
              variant="success"
              darkMode={darkMode}
              onClick={handleUpdateProfile}
              disabled={loading}
              icon={<SaveIcon size={18} color="white" />}
            >
              {loading ? 'Zapisywanie...' : 'Zapisz'}
            </CustomButton>
            <CustomButton
              variant="secondary"
              darkMode={darkMode}
              onClick={() => setEditing(false)}
              icon={<CancelIcon size={18} color={darkMode ? 'white' : 'gray'} />}
            >
              Anuluj
            </CustomButton>
          </div>
        )}
      </div>
    </CustomCard>
  );

  const renderCV = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-6`}>Moje CV</h2>

        {mockUserProfile.cvFile ? (
          <div className="space-y-6">
            {/* Aktualne CV */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileIcon size={32} color="#ef4444" />
                  <div>
                    <h3 className={`${fontSizes.text} font-medium`}>{mockUserProfile.cvFile.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Przesłane: {new Date(mockUserProfile.cvFile.uploadDate).toLocaleDateString('pl-PL')} • {mockUserProfile.cvFile.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CustomButton
                    variant="primary"
                    size="sm"
                    darkMode={darkMode}
                    icon={<EyeIcon size={16} color="white" />}
                  >
                    Podgląd
                  </CustomButton>
                  <CustomButton
                    variant="success"
                    size="sm"
                    darkMode={darkMode}
                    icon={<DownloadIcon size={16} color="white" />}
                  >
                    Pobierz
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Prześlij nowe CV */}
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
            }`}>
              <UploadIcon size={48} color={darkMode ? '#6b7280' : '#9ca3af'} className="mx-auto mb-4" />
              <h3 className={`${fontSizes.text} font-medium mb-2`}>Zaktualizuj CV</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Przeciągnij plik tutaj lub kliknij, aby wybrać
              </p>
              <label>
                <CustomButton
                  variant="primary"
                  darkMode={darkMode}
                  icon={<UploadIcon size={18} color="white" />}
                >
                  Wybierz plik
                </CustomButton>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
              </label>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Obsługiwane formaty: PDF, DOC, DOCX (max. 5MB)
              </p>
            </div>

            {/* Wskazówki */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Wskazówki dotyczące CV
              </h4>
              <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                <li>• Zadbaj o aktualne dane kontaktowe</li>
                <li>• Umieść najważniejsze doświadczenia na początku</li>
                <li>• Dodaj swoje specjalizacje i certyfikaty</li>
                <li>• Używaj słów kluczowych związanych z Twoją branżą</li>
                <li>• Zachowaj przejrzysty i profesjonalny format</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FileIcon size={64} color={darkMode ? '#4b5563' : '#9ca3af'} className="mx-auto mb-4" />
            <p className={`${fontSizes.text} mb-4`}>Nie masz jeszcze przesłanego CV</p>
            <label>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                icon={<UploadIcon size={18} color="white" />}
              >
                Prześlij CV
              </CustomButton>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
            </label>
          </div>
        )}
      </div>
    </CustomCard>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      {/* Ulubione oferty pracy */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h2 className={`${fontSizes.title} font-bold mb-6`}>Ulubione oferty pracy</h2>

          <div className="space-y-4">
            {mockFavoriteJobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`${fontSizes.subtitle} font-semibold`}>{job.title}</h3>
                      {getJobStatusBadge(job.status)}
                    </div>
                    <div className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <BuildingIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        <span className={fontSizes.text}>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        <span className={fontSizes.text}>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartIcon size={16} color="#ef4444" />
                        <span className={fontSizes.text}>Dodano: {new Date(job.addedAt).toLocaleDateString('pl-PL')}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-blue-500 mt-2">{job.salary}</p>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <CustomButton
                      variant="primary"
                      size="sm"
                      darkMode={darkMode}
                      icon={<ExternalLinkIcon size={14} color="white" />}
                    >
                      Zobacz
                    </CustomButton>
                    <CustomButton
                      variant="success"
                      size="sm"
                      darkMode={darkMode}
                      disabled={job.status === 'expired'}
                      icon={<BriefcaseIcon size={14} color="white" />}
                    >
                      Aplikuj
                    </CustomButton>
                    <CustomButton
                      variant="danger"
                      size="sm"
                      darkMode={darkMode}
                      onClick={() => removeFavoriteJob(job.id)}
                      icon={<TrashIcon size={14} color="white" />}
                    >
                      Usuń
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomCard>

      {/* Ulubione wydarzenia */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h2 className={`${fontSizes.title} font-bold mb-6`}>Ulubione wydarzenia</h2>

          <div className="space-y-4">
            {mockFavoriteEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`${fontSizes.subtitle} font-semibold mb-2`}>{event.title}</h3>
                    <div className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <BuildingIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        <span className={fontSizes.text}>{event.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        <span className={fontSizes.text}>{new Date(event.date).toLocaleDateString('pl-PL')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        <span className={fontSizes.text}>{event.location}</span>
                      </div>
                    </div>
                    <CustomBadge
                      variant={event.type === 'conference' ? 'info' : 'success'}
                      darkMode={darkMode}
                      size="sm"
                      className="mt-2"
                    >
                      {event.type === 'conference' ? 'Konferencja' : 'Webinar'}
                    </CustomBadge>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <CustomButton
                      variant="primary"
                      size="sm"
                      darkMode={darkMode}
                      icon={<ExternalLinkIcon size={14} color="white" />}
                    >
                      Zobacz
                    </CustomButton>
                    <CustomButton
                      variant="success"
                      size="sm"
                      darkMode={darkMode}
                      icon={<CalendarIcon size={14} color="white" />}
                    >
                      Zapisz się
                    </CustomButton>
                    <CustomButton
                      variant="danger"
                      size="sm"
                      darkMode={darkMode}
                      onClick={() => removeFavoriteEvent(event.id)}
                      icon={<TrashIcon size={14} color="white" />}
                    >
                      Usuń
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderApplications = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-6`}>Moje aplikacje</h2>

        <div className="space-y-4">
          {mockUserApplications.map((application) => (
            <div
              key={application.id}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`${fontSizes.subtitle} font-semibold`}>{application.jobTitle}</h3>
                    {getApplicationStatusBadge(application.status)}
                  </div>
                  <div className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-2">
                      <BuildingIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                      <span className={fontSizes.text}>{application.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                      <span className={fontSizes.text}>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                      <span className={fontSizes.text}>Aplikacja: {new Date(application.appliedAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                      <span className={fontSizes.text}>Aktualizacja: {new Date(application.statusUpdatedAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>

                  {application.notes && (
                    <div className={`mt-3 p-3 rounded-lg border ${
                      darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <NotificationIcon size={16} color="#3b82f6" />
                        <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                          Informacja od pracodawcy:
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                        {application.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <CustomButton
                    variant="primary"
                    size="sm"
                    darkMode={darkMode}
                    icon={<ExternalLinkIcon size={14} color="white" />}
                  >
                    Zobacz ofertę
                  </CustomButton>
                  {application.status === 'new' && (
                    <CustomButton
                      variant="danger"
                      size="sm"
                      darkMode={darkMode}
                      icon={<CloseIcon size={14} color="white" />}
                    >
                      Wycofaj
                    </CustomButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomCard>
  );

  const renderSettings = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-6`}>Ustawienia konta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Powiadomienia */}
          <div>
            <h3 className={`${fontSizes.subtitle} font-medium mb-4`}>Powiadomienia</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={fontSizes.text}>Powiadomienia e-mail</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={fontSizes.text}>Powiadomienia SMS</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={jobAlerts}
                  onChange={(e) => setJobAlerts(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={fontSizes.text}>Alerty o nowych ofertach pracy</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventReminders}
                  onChange={(e) => setEventReminders(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className={fontSizes.text}>Przypomnienia o wydarzeniach</span>
              </label>
            </div>
          </div>

          {/* Preferencje pracy */}
          <div>
            <h3 className={`${fontSizes.subtitle} font-medium mb-4`}>Preferencje pracy</h3>
            <div className="space-y-4">
              <div>
                <label className={`${fontSizes.text} font-medium block mb-2`}>Promień poszukiwań</label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className={`w-full ${fontSizes.text} px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                  <option value="unlimited">Bez ograniczeń</option>
                </select>
              </div>

              <div>
                <label className={`${fontSizes.text} font-medium block mb-2`}>Preferowane typy zatrudnienia</label>
                <div className="space-y-2">
                  {[
                    { value: 'full-time', label: 'Pełny etat' },
                    { value: 'part-time', label: 'Niepełny etat' },
                    { value: 'contract', label: 'Kontrakt' },
                    { value: 'internship', label: 'Staż' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferredJobTypes.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredJobTypes([...preferredJobTypes, option.value]);
                          } else {
                            setPreferredJobTypes(preferredJobTypes.filter(type => type !== option.value));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${fontSizes.text}`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bezpieczeństwo */}
          <div>
            <h3 className={`${fontSizes.subtitle} font-medium mb-4`}>Bezpieczeństwo</h3>
            <div className="space-y-4">
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => alert('Funkcja zmiany hasła będzie dostępna wkrótce')}
                icon={<LockIcon size={18} color="white" />}
                className="w-full"
              >
                Zmień hasło
              </CustomButton>

              <CustomButton
                variant="danger"
                darkMode={darkMode}
                onClick={() => alert('Funkcja usuwania konta będzie dostępna wkrótce')}
                icon={<TrashIcon size={18} color="white" />}
                className="w-full"
              >
                Usuń konto
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Zapisz ustawienia */}
        <div className="mt-6">
          <CustomButton
            variant="success"
            darkMode={darkMode}
            onClick={() => alert('Ustawienia zapisane!')}
            icon={<CheckIcon size={18} color="white" />}
          >
            Zapisz ustawienia
          </CustomButton>
        </div>
      </div>
    </CustomCard>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <CustomCard darkMode={darkMode} variant="elevated" className="mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                {/* Zdjęcie profilowe */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CameraIcon size={24} color={darkMode ? '#6b7280' : '#9ca3af'} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowImageUpload(true)}
                    className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <CameraIcon size={12} color="white" />
                  </button>
                </div>

                <div>
                  <h1 className={`${fontSizes.title} font-bold`}>
                    {firstName} {lastName}
                  </h1>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user?.email || mockUserProfile.email}
                    {mockUserProfile.emailVerified && (
                      <CheckIcon size={16} color="#10b981" className="inline ml-2" />
                    )}
                  </p>
                </div>
              </div>

              <CustomButton
                variant="danger"
                darkMode={darkMode}
                onClick={handleSignOut}
                icon={<LogoutIcon size={18} color="white" />}
              >
                Wyloguj się
              </CustomButton>
            </div>

            {/* Tabs */}
            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <nav className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-500 font-medium'
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
                    }`}
                  >
                    <tab.Icon size={18} color={activeTab === tab.id ? '#3b82f6' : 'currentColor'} />
                    <span className={fontSizes.text}>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </CustomCard>

        {/* Content */}
        <div>
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'materials' && <EducationalMaterials darkMode={darkMode} fontSize={fontSize} />}
          {activeTab === 'cv' && renderCV()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Modal do zmiany zdjęcia */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <CustomCard darkMode={darkMode} variant="elevated" className="max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`${fontSizes.subtitle} font-semibold`}>Zmień zdjęcie profilowe</h3>
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <CloseIcon size={20} color={darkMode ? '#9ca3af' : '#6b7280'} />
                  </button>
                </div>

                <div className="mb-4">
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Wybierz zdjęcie profilowe:
                  </p>
                  <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <li>• Maksymalny rozmiar: 5MB</li>
                    <li>• Dozwolone formaty: JPG, PNG, GIF</li>
                    <li>• Zalecany rozmiar: 200x200 pikseli</li>
                  </ul>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div className="flex justify-end">
                  <CustomButton
                    variant="secondary"
                    darkMode={darkMode}
                    onClick={() => setShowImageUpload(false)}
                  >
                    Anuluj
                  </CustomButton>
                </div>
              </div>
            </CustomCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePanel;

