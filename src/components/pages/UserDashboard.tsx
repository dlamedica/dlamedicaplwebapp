import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  HeartFilledIcon,
  BriefcaseIcon,
  FileIcon,
  CogIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  MapMarkerIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  GraduationCapIcon,
  IdCardIcon,
  BirthdayCakeIcon,
  BuildingIcon,
  ClockIcon,
  CheckIcon,
  TimesIcon,
  ExclamationTriangleIcon,
  BellIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
} from '../icons/CustomIconSystem';
import { exampleDataService } from '../../services/exampleDataService';

interface UserDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ darkMode, fontSize }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'applications' | 'cv' | 'settings'>('profile');
  const [userProfile, setUserProfile] = useState({
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 123 456 789',
    birthDate: '1990-05-15',
    profession: 'Lekarz rodzinny',
    experience: '5 lat',
    city: 'Warszawa',
    voivodeship: 'mazowieckie',
    profileImage: '/api/placeholder/150/150',
    emailVerified: true,
    bio: 'Doświadczony lekarz rodzinny z pasją do kompleksowej opieki nad pacjentami.'
  });
  
  const [userApplications, setUserApplications] = useState(exampleDataService.getUserApplications('user1'));
  const [userFavorites, setUserFavorites] = useState(exampleDataService.getUserFavorites('user1'));
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploadDate, setCvUploadDate] = useState(new Date('2024-01-15'));
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    jobAlerts: true,
    eventReminders: true,
    applicationUpdates: true
  });

  const fontSizeClasses = {
    small: {
      title: 'text-lg',
      subtitle: 'text-base',
      text: 'text-sm',
      label: 'text-xs',
      button: 'text-sm px-3 py-1'
    },
    medium: {
      title: 'text-xl',
      subtitle: 'text-lg',
      text: 'text-base',
      label: 'text-sm',
      button: 'text-base px-4 py-2'
    },
    large: {
      title: 'text-2xl',
      subtitle: 'text-xl',
      text: 'text-lg',
      label: 'text-base',
      button: 'text-lg px-5 py-3'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  const professions = [
    'Lekarz rodzinny', 'Pediatra', 'Internista', 'Kardiolog', 'Dermatolog',
    'Chirurg', 'Anestezjolog', 'Radiolog', 'Ginekolog', 'Urolog',
    'Pielęgniarka', 'Położna', 'Fizjoterapeuta', 'Farmaceuta', 'Dietetyk'
  ];

  const voivodeships = [
    'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'łódzkie',
    'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie',
    'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie',
    'wielkopolskie', 'zachodniopomorskie'
  ];

  const getApplicationStatusBadge = (status: string) => {
    const baseClasses = `px-2 py-1 rounded-full text-xs font-medium`;
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Wysłana</span>;
      case 'reviewed':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Przejrzana</span>;
      case 'interview':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>Rozmowa</span>;
      case 'accepted':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Zaakceptowana</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Odrzucona</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
      setCvUploadDate(new Date());
    }
  };

  const saveProfile = () => {
    setUserProfile(tempProfile);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempProfile(userProfile);
    setIsEditing(false);
  };

  const removeFromFavorites = (itemId: string, itemType: 'job' | 'event') => {
    exampleDataService.removeFromFavorites('user1', itemId, itemType);
    setUserFavorites(exampleDataService.getUserFavorites('user1'));
  };

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={userProfile.profileImage}
                alt="Zdjęcie profilowe"
                className="w-20 h-20 rounded-full object-cover border-4"
                style={{borderColor: '#38b6ff'}}
              />
              <button 
                className="absolute bottom-0 right-0 text-white p-1 rounded-full transition-colors"
                style={{backgroundColor: '#38b6ff'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9fe5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
              >
                <EditIcon size={12} />
              </button>
            </div>
            <div>
              <h1 className={`${fontSizes.title} font-bold`}>
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className={`${fontSizes.text} text-gray-600`}>{userProfile.profession}</p>
              <p className={`${fontSizes.text} text-gray-500 flex items-center mt-1`}>
                <MapMarkerIcon size={16} className="mr-1" />
                {userProfile.city}, {userProfile.voivodeship}
              </p>
              <div className="flex items-center mt-2">
                {userProfile.emailVerified ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckIcon size={16} className="mr-1" />
                    Email zweryfikowany
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 text-sm">
                    <ExclamationTriangleIcon size={16} className="mr-1" />
                    Email niezweryfikowany
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 text-black rounded-lg transition-colors"
            style={{backgroundColor: '#38b6ff'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9fe5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
          >
            <EditIcon size={18} className="mr-2" />
            Edytuj profil
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Imię</label>
                <input
                  type="text"
                  value={tempProfile.firstName}
                  onChange={(e) => setTempProfile({...tempProfile, firstName: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Nazwisko</label>
                <input
                  type="text"
                  value={tempProfile.lastName}
                  onChange={(e) => setTempProfile({...tempProfile, lastName: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Email</label>
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Telefon</label>
                <input
                  type="tel"
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Data urodzenia</label>
                <input
                  type="date"
                  value={tempProfile.birthDate}
                  onChange={(e) => setTempProfile({...tempProfile, birthDate: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Zawód</label>
                <select
                  value={tempProfile.profession}
                  onChange={(e) => setTempProfile({...tempProfile, profession: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                >
                  {professions.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Miasto</label>
                <input
                  type="text"
                  value={tempProfile.city}
                  onChange={(e) => setTempProfile({...tempProfile, city: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Województwo</label>
                <select
                  value={tempProfile.voivodeship}
                  onChange={(e) => setTempProfile({...tempProfile, voivodeship: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                >
                  {voivodeships.map(voiv => (
                    <option key={voiv} value={voiv}>{voiv}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className={`block ${fontSizes.text} font-medium mb-1`}>O mnie</label>
              <textarea
                value={tempProfile.bio}
                onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Napisz coś o sobie..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
              >
                Zapisz zmiany
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <EnvelopeIcon size={20} className="text-gray-400 mr-3" />
                <span className={fontSizes.text}>{userProfile.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon size={20} className="text-gray-400 mr-3" />
                <span className={fontSizes.text}>{userProfile.phone}</span>
              </div>
              <div className="flex items-center">
                <BirthdayCakeIcon size={20} className="text-gray-400 mr-3" />
                <span className={fontSizes.text}>
                  {new Date(userProfile.birthDate).toLocaleDateString('pl-PL')}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <GraduationCapIcon size={20} className="text-gray-400 mr-3" />
                <span className={fontSizes.text}>Doświadczenie: {userProfile.experience}</span>
              </div>
            </div>
          </div>
        )}

        {userProfile.bio && !isEditing && (
          <div className="mt-4 pt-4 border-t">
            <h3 className={`${fontSizes.subtitle} font-semibold mb-2`}>O mnie</h3>
            <p className={`${fontSizes.text} text-gray-600`}>{userProfile.bio}</p>
          </div>
        )}
      </div>

      {/* Profile Completion */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Kompletność profilu</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={fontSizes.text}>Podstawowe dane</span>
            <CheckIcon size={20} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className={fontSizes.text}>Zdjęcie profilowe</span>
            <CheckIcon size={20} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className={fontSizes.text}>CV</span>
            {cvFile ? <CheckIcon size={20} className="text-green-500" /> : <TimesIcon size={20} className="text-red-500" />}
          </div>
          <div className="flex items-center justify-between">
            <span className={fontSizes.text}>Weryfikacja email</span>
            {userProfile.emailVerified ? <CheckIcon size={20} className="text-green-500" /> : <TimesIcon size={20} className="text-red-500" />}
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#38b6ff] h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">75% ukończone</p>
      </div>
    </div>
  );

  const renderCV = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <h2 className={`${fontSizes.title} font-bold mb-4`}>Zarządzanie CV</h2>
        
        {cvFile || cvUploadDate ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center">
                <FileIcon size={32} className="text-blue-500 mr-3" />
                <div>
                  <p className={`${fontSizes.text} font-medium`}>
                    {cvFile ? cvFile.name : 'CV_Jan_Kowalski.pdf'}
                  </p>
                  <p className={`${fontSizes.label} text-gray-500`}>
                    Ostatnia aktualizacja: {cvUploadDate.toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                  <DownloadIcon size={20} />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <TrashIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FileIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className={`${fontSizes.text} text-gray-500 mb-4`}>
              Nie masz jeszcze wgrane CV
            </p>
          </div>
        )}

        <div className="mt-4">
          <label className="flex items-center justify-center w-full px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors cursor-pointer">
            <UploadIcon size={20} className="mr-2" />
            {cvFile || cvUploadDate ? 'Zaktualizuj CV' : 'Wgraj CV'}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCvUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 text-center mt-2">
            Obsługiwane formaty: PDF, DOC, DOCX (max 5MB)
          </p>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Wskazówki dotyczące CV</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Używaj jasnego i czytelnego formatowania</li>
          <li>• Podkreśl swoje kluczowe umiejętności i doświadczenie</li>
          <li>• Dostosuj CV do konkretnej oferty pracy</li>
          <li>• Sprawdź poprawność danych kontaktowych</li>
          <li>• Użyj profesjonalnego formatu PDF</li>
        </ul>
      </div>
    </div>
  );

  const renderFavorites = () => {
    const favoriteJobs = userFavorites.filter(fav => fav.item_type === 'job');
    const favoriteEvents = userFavorites.filter(fav => fav.item_type === 'event');
    const jobs = exampleDataService.getJobOffers();
    const events = exampleDataService.getEvents();

    return (
      <div className="space-y-6">
        <h1 className={`${fontSizes.title} font-bold`}>Ulubione</h1>
        
        {/* Favorite Job Offers */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Ulubione oferty pracy ({favoriteJobs.length})</h2>
          
          {favoriteJobs.length > 0 ? (
            <div className="space-y-4">
              {favoriteJobs.map(favorite => {
                const job = jobs.find(j => j.id === favorite.item_id);
                if (!job) return null;
                
                return (
                  <div key={favorite.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className={`${fontSizes.text} font-semibold`}>{job.position}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapMarkerIcon size={16} className="mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <MoneyBillIcon size={16} className="mr-1" />
                          {job.salary_range}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-[#38b6ff] text-black rounded text-sm hover:bg-[#2a9fe5] transition-colors">
                        Aplikuj
                      </button>
                      <button 
                        onClick={() => removeFromFavorites(job.id, 'job')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <HeartFilledIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className={`${fontSizes.text} text-gray-500`}>Nie masz jeszcze ulubionych ofert pracy</p>
            </div>
          )}
        </div>

        {/* Favorite Events */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Ulubione wydarzenia ({favoriteEvents.length})</h2>
          
          {favoriteEvents.length > 0 ? (
            <div className="space-y-4">
              {favoriteEvents.map(favorite => {
                const event = events.find(e => e.id === favorite.item_id);
                if (!event) return null;
                
                return (
                  <div key={favorite.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className={`${fontSizes.text} font-semibold`}>{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <CalendarIcon size={16} className="mr-1" />
                          {event.date.toLocaleDateString('pl-PL')}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapMarkerIcon size={16} className="mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-[#38b6ff] text-black rounded text-sm hover:bg-[#2a9fe5] transition-colors">
                        Szczegóły
                      </button>
                      <button 
                        onClick={() => removeFromFavorites(event.id, 'event')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <HeartFilledIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className={`${fontSizes.text} text-gray-500`}>Nie masz jeszcze ulubionych wydarzeń</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApplications = () => (
    <div className="space-y-6">
      <h1 className={`${fontSizes.title} font-bold`}>Moje aplikacje ({userApplications.length})</h1>
      
      {userApplications.length > 0 ? (
        <div className="space-y-4">
          {userApplications.map(application => {
            const job = exampleDataService.getJobOfferById(application.job_offer_id);
            if (!job) return null;
            
            return (
              <div key={application.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${fontSizes.subtitle} font-bold`}>{job.position}</h3>
                      {getApplicationStatusBadge(application.status)}
                    </div>
                    <p className={`${fontSizes.text} text-gray-600 mb-3`}>{job.company}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapMarkerIcon size={18} className="mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon size={18} className="mr-2" />
                        Aplikacja: {application.applied_at.toLocaleDateString('pl-PL')}
                      </div>
                      <div className="flex items-center">
                        <MoneyBillIcon size={18} className="mr-2" />
                        {job.salary_range}
                      </div>
                      {application.updated_at > application.applied_at && (
                        <div className="flex items-center">
                          <ClockIcon size={18} className="mr-2" />
                          Aktualizacja: {application.updated_at.toLocaleDateString('pl-PL')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                      <EyeIcon size={18} className="mr-1" />
                      Szczegóły
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
          <BriefcaseIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className={`${fontSizes.text} text-gray-500 mb-4`}>Nie masz jeszcze żadnych aplikacji</p>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/oferty-pracy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
          >
            Przeglądaj oferty pracy
          </button>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className={`${fontSizes.title} font-bold`}>Ustawienia</h1>
      
      {/* Notification Settings */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Powiadomienia</h2>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Powiadomienia email', desc: 'Otrzymuj powiadomienia na adres email' },
            { key: 'sms', label: 'Powiadomienia SMS', desc: 'Otrzymuj powiadomienia na telefon' },
            { key: 'jobAlerts', label: 'Alerty o nowych ofertach', desc: 'Powiadomienia o ofertach pasujących do Twojego profilu' },
            { key: 'eventReminders', label: 'Przypomnienia o wydarzeniach', desc: 'Przypomnienia przed nadchodzącymi wydarzeniami' },
            { key: 'applicationUpdates', label: 'Aktualizacje aplikacji', desc: 'Powiadomienia o zmianach statusu aplikacji' }
          ].map(setting => (
            <div key={setting.key} className="flex items-center justify-between py-2">
              <div>
                <p className={`${fontSizes.text} font-medium`}>{setting.label}</p>
                <p className={`${fontSizes.label} text-gray-500`}>{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[setting.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    [setting.key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#38b6ff] dark:peer-focus:ring-[#38b6ff] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#38b6ff]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Job Preferences */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Preferencje zawodowe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-2`}>Preferowana lokalizacja</label>
            <input
              type="text"
              placeholder="np. Warszawa, Kraków, Praca zdalna"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-2`}>Typ zatrudnienia</label>
            <select className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}>
              <option>Wszystkie</option>
              <option>Pełny etat</option>
              <option>Pół etatu</option>
              <option>Kontrakt B2B</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors">
            Zapisz preferencje
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Prywatność i bezpieczeństwo</h2>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className={fontSizes.text}>Zmień hasło</span>
              <EditIcon size={20} className="text-gray-400" />
            </div>
          </button>
          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className={fontSizes.text}>Pobierz moje dane</span>
              <DownloadIcon size={20} className="text-gray-400" />
            </div>
          </button>
          <button className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className={fontSizes.text}>Usuń konto</span>
              <TrashIcon size={20} className="text-red-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profil', icon: UserIcon },
              { id: 'cv', label: 'CV', icon: FileIcon },
              { id: 'favorites', label: 'Ulubione', icon: HeartFilledIcon },
              { id: 'applications', label: 'Aplikacje', icon: BriefcaseIcon },
              { id: 'settings', label: 'Ustawienia', icon: CogIcon }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-[#38b6ff] text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'cv' && renderCV()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default UserDashboard;