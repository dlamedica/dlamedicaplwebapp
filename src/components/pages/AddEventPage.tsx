import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { FaCalendarAlt, FaMapMarkerAlt, FaGlobe, FaUsers, FaFileAlt, FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaVideo, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import { db } from '../../lib/apiClient';
import { useNotifications } from '../../hooks/useNotifications';

interface AddEventPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const AddEventPage: React.FC<AddEventPageProps> = ({ darkMode }) => {
  const { user, profile } = useUser();
  const { notifyEventSubmitted } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'conference' | 'webinar'>('conference');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [registrationFee, setRegistrationFee] = useState<number | ''>('');
  const [isFree, setIsFree] = useState(true);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
  const [speakers, setSpeakers] = useState('');
  const [program, setProgram] = useState('');
  const [certificates, setCertificates] = useState(false);
  const [cmePoints, setCmePoints] = useState<number | ''>('');
  const [showDateWarning, setShowDateWarning] = useState(false);

  useEffect(() => {
    document.title = 'Dodaj wydarzenie – DlaMedica.pl';
  }, []);

  useEffect(() => {
    if (user) {
      setContactEmail(user.email || '');
      if (profile?.is_company) {
        setContactPhone(profile.company_phone || '');
      }
    }
  }, [profile, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('Not authenticated, redirecting to login');
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user, loading]);

  // Zsynchronizowane z zawodami z rejestracji zwykłych użytkowników
  const targetAudienceOptions = [
    { value: 'all', label: 'Wszyscy' },
    { value: 'analityk_medyczny', label: 'Analityk medyczny' },
    { value: 'asystent_stomatologa', label: 'Asystent stomatologa' },
    { value: 'audiolog', label: 'Audiolog' },
    { value: 'dietetyk', label: 'Dietetyk' },
    { value: 'elektroradiolog', label: 'Elektroradiolog' },
    { value: 'ergoterapeuta', label: 'Ergoterapeuta' },
    { value: 'farmaceuta', label: 'Farmaceuta' },
    { value: 'fizjoterapeuta', label: 'Fizjoterapeuta' },
    { value: 'higienistka_stomatologiczna', label: 'Higienistka stomatologiczna' },
    { value: 'instrumentariusz', label: 'Instrumentariusz' },
    { value: 'laborant_medyczny', label: 'Laborant medyczny' },
    { value: 'lekarz', label: 'Lekarz' },
    { value: 'lekarz_dentysta', label: 'Lekarz dentysta' },
    { value: 'logopeda', label: 'Logopeda' },
    { value: 'masazysta_medyczny', label: 'Masażysta medyczny' },
    { value: 'neurorehabilitant', label: 'Neurorehabilitant' },
    { value: 'opiekun_medyczny', label: 'Opiekun medyczny' },
    { value: 'optometrysta', label: 'Optometrysta' },
    { value: 'ortoptystka', label: 'Ortoptystka' },
    { value: 'ortotyk', label: 'Ortotyk' },
    { value: 'perfuzjonista', label: 'Perfuzjonista' },
    { value: 'pielęgniarka', label: 'Pielęgniarka' },
    { value: 'położna', label: 'Położna' },
    { value: 'protetyk_słuchu', label: 'Protetyk słuchu' },
    { value: 'psycholog_kliniczny', label: 'Psycholog kliniczny' },
    { value: 'radiolog_rtg', label: 'Radiolog (RTG)' },
    { value: 'ratownik_medyczny', label: 'Ratownik medyczny' },
    { value: 'specjalista_ds_zywienia', label: 'Specjalista ds. żywienia' },
    { value: 'studentka_student', label: 'Studentka/Student' },
    { value: 'technik_dentystyczny', label: 'Technik dentystyczny' },
    { value: 'technik_farmaceutyczny', label: 'Technik farmaceutyczny' },
    { value: 'technik_medycyny_nuklearnej', label: 'Technik medycyny nuklearnej' },
    { value: 'technik_ortopedyczny', label: 'Technik ortopedyczny' },
    { value: 'terapeuta_zajęciowy', label: 'Terapeuta zajęciowy' },
    { value: 'uczennica_uczen', label: 'Uczennica/Uczeń' },
    { value: 'inne', label: 'Inne' }
  ];

  // Handler dla checkboxów grup docelowych
  const handleTargetAudienceChange = (value: string) => {
    if (value === 'all') {
      // Jeśli kliknięto "Wszyscy"
      if (targetAudiences.includes('all')) {
        // Jeśli już zaznaczone, odznacz wszystko
        setTargetAudiences([]);
      } else {
        // Jeśli nie zaznaczone, zaznacz wszystkie opcje
        const allValues = targetAudienceOptions.map(option => option.value);
        setTargetAudiences(allValues);
      }
    } else {
      // Dla innych opcji
      if (targetAudiences.includes(value)) {
        // Usuń z zaznaczonych i usuń też "Wszyscy" jeśli było
        setTargetAudiences(prev => prev.filter(item => item !== value && item !== 'all'));
      } else {
        // Dodaj do zaznaczonych
        const newAudiences = [...targetAudiences, value].filter(item => item !== 'all');
        
        // Sprawdź czy wszystkie opcje poza "Wszyscy" są zaznaczone
        const nonAllOptions = targetAudienceOptions.filter(option => option.value !== 'all');
        if (newAudiences.length === nonAllOptions.length) {
          // Jeśli tak, dodaj też "Wszyscy"
          setTargetAudiences([...newAudiences, 'all']);
        } else {
          setTargetAudiences(newAudiences);
        }
      }
    }
  };

  const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
    const eventDate = new Date(selectedDate);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 100);
    
    if (eventDate > maxDate) {
      setShowDateWarning(true);
      // Set to max allowed date
      const maxDateString = maxDate.toISOString().split('T')[0];
      setDate(maxDateString);
    } else {
      setShowDateWarning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!title || !description || !date || !startTime || !contactEmail) {
      setError('Wypełnij wszystkie wymagane pola');
      setLoading(false);
      return;
    }
    
    // Check 100-day limit for events
    const eventDate = new Date(date);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 100);
    
    if (eventDate > maxDate) {
      setError('Wydarzenia mogą być organizowane maksymalnie 100 dni z góry');
      setLoading(false);
      return;
    }

    // For conferences, only companies can create them
    if (type === 'conference' && !profile?.is_company) {
      setError('Konferencje mogą być organizowane tylko przez konta firmowe');
      setLoading(false);
      return;
    }

    if (!isOnline && !location) {
      setError('Podaj lokalizację dla wydarzenia stacjonarnego');
      setLoading(false);
      return;
    }

    if (isOnline && !onlineUrl) {
      setError('Podaj link do wydarzenia online');
      setLoading(false);
      return;
    }

    if (endTime && startTime >= endTime) {
      setError('Czas zakończenia musi być późniejszy niż czas rozpoczęcia');
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        title,
        description,
        type,
        date: `${date}T${startTime}:00`,
        end_time: endTime ? `${date}T${endTime}:00` : null,
        location: isOnline ? null : location,
        online_url: isOnline ? onlineUrl : null,
        is_online: isOnline,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
        registration_fee: isFree ? 0 : (registrationFee ? Number(registrationFee) : null),
        is_free: isFree,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        registration_deadline: registrationDeadline || null,
        target_audience: targetAudiences.join(','),
        speakers,
        program,
        certificates_available: certificates,
        cme_points: cmePoints ? Number(cmePoints) : null,
        organizer_id: user?.id,
        organizer_name: profile?.is_company ? profile.company_name : profile?.full_name,
        organizer_type: profile?.is_company ? 'company' : 'individual',
        status: 'pending', // Wymaga akceptacji administratora
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        can_extend: false // Events cannot be extended after they occur
      };

      // Insert into local DB
      const { data, error: insertError } = await db
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }
      
      setSuccess('Wydarzenie zostało dodane i oczekuje na akceptację administratora');
      
      // Notify admin about new event
      if (user?.id) {
        notifyEventSubmitted(user.id, {
          event_title: title,
          organizer: profile?.company_name || profile?.full_name || 'Nieznany organizator',
          event_type: type,
          location: isOnline ? 'Online' : location
        });
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setType('conference');
      setDate('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setOnlineUrl('');
      setIsOnline(false);
      setMaxParticipants('');
      setRegistrationFee('');
      setIsFree(true);
      setContactPhone('');
      setRegistrationDeadline('');
      setTargetAudiences([]);
      setSpeakers('');
      setProgram('');
      setCertificates(false);
      setCmePoints('');
      setShowDateWarning(false);
      
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania wydarzenia');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (profile?.is_company) {
      window.history.pushState({}, '', '/profil?tab=events');
    } else {
      window.history.pushState({}, '', '/wydarzenia');
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <FaCalendarAlt className="mr-3 text-[#38b6ff]" />
                  Dodaj wydarzenie
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Wszystkie wydarzenia wymagają akceptacji administratora
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <FaCheck className="mr-2" />
              {success}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`rounded-lg shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Podstawowe informacje</h3>
              
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tytuł wydarzenia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="np. Konferencja Kardiologiczna 2024, Webinar o Telemedycynie"
                  required
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Typ wydarzenia</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className={`flex items-center p-3 border rounded-lg transition-colors cursor-pointer ${
                      type === 'conference'
                        ? 'border-[#38b6ff] bg-blue-50 text-[#38b6ff]'
                        : darkMode 
                          ? 'border-gray-600 hover:border-gray-500 text-white' 
                          : 'border-gray-300 hover:border-gray-400 text-black'
                    } ${!profile?.is_company ? 'opacity-50' : ''}`}
                    onClick={() => {
                      setType('conference');
                    }}>
                    <input
                      type="radio"
                      value="conference"
                      checked={type === 'conference'}
                      readOnly
                      className="sr-only"
                    />
                    <FaBuilding className="mr-2" />
                    <div>
                      <div>Konferencja</div>
                      {!profile?.is_company && (
                        <div className="text-xs text-gray-500">Organizują: firmy</div>
                      )}
                    </div>
                  </div>
                  <div 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      type === 'webinar'
                        ? 'border-[#38b6ff] bg-blue-50 text-[#38b6ff]'
                        : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setType('webinar')}>
                    <input
                      type="radio"
                      value="webinar"
                      checked={type === 'webinar'}
                      readOnly
                      className="sr-only"
                    />
                    <FaVideo className="mr-2" />
                    <div>
                      <div>Webinar</div>
                      <div className="text-xs text-gray-500">Organizują: wszyscy</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info about event types */}
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
                <div className="flex items-start">
                  <FaInfoCircle className={`mt-0.5 mr-2 text-sm ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p><strong>Webinary:</strong> Mogą być organizowane przez wszystkich użytkowników</p>
                    <p><strong>Konferencje:</strong> Mogą być organizowane tylko przez konta firmowe, ale są skierowane do wszystkich typów użytkowników</p>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Data wydarzenia <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                />
                <div className="mt-2 flex items-start gap-2 text-xs text-blue-600">
                  <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                  <p>
                    Wydarzenia mogą być organizowane maksymalnie 100 dni z góry. Po odbyciu się wydarzenia nie można go przedłużyć.
                  </p>
                </div>
                {showDateWarning && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-800">
                      Data została automatycznie skorygowana do maksymalnego dozwolonego okresu (100 dni od dziś).
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Godzina rozpoczęcia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Godzina zakończenia</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Location / Online */}
              <div>
                <label className="block text-sm font-medium mb-2">Lokalizacja</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                    />
                    <span className="text-sm">Wydarzenie online</span>
                  </label>
                  
                  {isOnline ? (
                    <input
                      type="url"
                      value={onlineUrl}
                      onChange={(e) => setOnlineUrl(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="https://zoom.us/j/123456789 lub inny link"
                    />
                  ) : (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="np. Hotel Marriott, sala konferencyjna A, Warszawa"
                    />
                  )}
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FaUsers className="inline mr-1" />
                  Maksymalna liczba uczestników
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : '')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="np. 100 (pozostaw puste jeśli bez limitu)"
                  min="1"
                />
              </div>

              {/* Registration Fee */}
              <div>
                <label className="block text-sm font-medium mb-2">Opłata za uczestnictwo</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                    />
                    <span className="text-sm">Wydarzenie bezpłatne</span>
                  </label>
                  
                  {!isFree && (
                    <input
                      type="number"
                      value={registrationFee}
                      onChange={(e) => setRegistrationFee(e.target.value ? Number(e.target.value) : '')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Kwota w PLN"
                      min="0"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Szczegóły i kontakt</h3>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Opis wydarzenia <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Opisz tematykę, cele, czego uczestnicy mogą się spodziewać..."
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium mb-2">Grupa docelowa</label>
                <div className={`border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}>
                  {targetAudienceOptions.map((audience) => (
                    <label key={audience.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={targetAudiences.includes(audience.value)}
                        onChange={() => handleTargetAudienceChange(audience.value)}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                      />
                      <span className={`text-sm ${
                        audience.value === 'all' ? 'font-medium' : ''
                      } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {audience.label}
                      </span>
                    </label>
                  ))}
                </div>
                {targetAudiences.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Wybrane: {targetAudiences.filter(val => val !== 'all').length === targetAudienceOptions.length - 1 
                      ? 'Wszyscy' 
                      : targetAudiences.filter(val => val !== 'all').map(val => 
                          targetAudienceOptions.find(opt => opt.value === val)?.label
                        ).join(', ')
                    }
                  </p>
                )}
              </div>

              {/* Speakers */}
              <div>
                <label className="block text-sm font-medium mb-2">Prelegenci</label>
                <textarea
                  value={speakers}
                  onChange={(e) => setSpeakers(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Lista prelegentów, ich tytuły, specjalizacje..."
                />
              </div>

              {/* Program */}
              <div>
                <label className="block text-sm font-medium mb-2">Program wydarzenia</label>
                <textarea
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Agenda, harmonogram, tematy prezentacji..."
                />
              </div>

              {/* Certificates & CME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={certificates}
                      onChange={(e) => setCertificates(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                    />
                    <span className="text-sm">Certyfikaty uczestnictwa</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Punkty CME</label>
                  <input
                    type="number"
                    value={cmePoints}
                    onChange={(e) => setCmePoints(e.target.value ? Number(e.target.value) : '')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Liczba punktów"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email kontaktowy <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefon kontaktowy</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="+48 123 456 789"
                />
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Termin rejestracji
                </label>
                <input
                  type="date"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                  max={date}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Jeśli nie podasz terminu, rejestracja będzie możliwa do dnia wydarzenia
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="mr-2" />
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Dodawanie...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Dodaj wydarzenie
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className={`mt-6 p-4 rounded-lg ${
            darkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h4 className="font-medium mb-2 text-blue-800">Informacje ważne</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Wszystkie wydarzenia wymagają akceptacji przez administratora</p>
              <p>• Proces weryfikacji może potrwać do 48 godzin</p>
              <p>• Otrzymasz powiadomienie email o statusie Twojego wydarzenia</p>
              <p>• Wydarzenia mogą być organizowane maksymalnie 100 dni z góry</p>
              <p>• Po odbyciu się wydarzenia nie można go przedłużyć</p>
              <p>• Możesz edytować wydarzenia w swoim profilu</p>
              <p>• Wydarzenia są promowane na stronie głównej po akceptacji</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;