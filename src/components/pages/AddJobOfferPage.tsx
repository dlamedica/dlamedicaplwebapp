import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBuilding, FaFileAlt, FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useNotifications } from '../../hooks/useNotifications';

interface AddJobOfferPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const AddJobOfferPage: React.FC<AddJobOfferPageProps> = ({ darkMode }) => {
  const { notifyJobOfferSubmitted } = useNotifications();
  
  // Mock data dla demonstracji (dopasowane do ProfilePageCompany)
  const mockUser = {
    id: '1',
    email: 'firma@example.com',
    created_at: '2024-01-01'
  };
  
  const mockProfile = {
    is_company: true,
    company_name: 'Przykładowa Firma Medyczna Sp. z o.o.',
    company_phone: '+48 123 456 789'
  };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState('Umowa o pracę');
  const [experienceLevel, setExperienceLevel] = useState('Specjalista');
  const [salaryMin, setSalaryMin] = useState<number | ''>('');
  const [salaryMax, setSalaryMax] = useState<number | ''>('');
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  const [salaryType, setSalaryType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [validUntil, setValidUntil] = useState<string>('');
  const [showDateWarning, setShowDateWarning] = useState(false);

  useEffect(() => {
    document.title = 'Dodaj ofertę pracy – DlaMedica.pl';
  }, []);

  useEffect(() => {
    setContactEmail(mockUser.email);
    setContactPhone(mockProfile.company_phone || '');
  }, []);

  // Sprawdzenie czy to konto firmowe (zawsze true dla mock)
  const isCompanyAccount = mockProfile.is_company;

  // Zsynchronizowane z filtrami "Typy umów" - identyczne opcje
  const employmentTypes = [
    { value: 'Umowa o pracę', label: 'Umowa o pracę' },
    { value: 'Umowa zlecenie', label: 'Umowa zlecenie' },
    { value: 'Umowa o dzieło', label: 'Umowa o dzieło' },
    { value: 'B2B', label: 'B2B' },
    { value: 'Kontrakt', label: 'Kontrakt' },
    { value: 'Praktyki/Staż', label: 'Praktyki/Staż' }
  ];

  // Zsynchronizowane z filtrami "Doświadczenie" - identyczne opcje
  const experienceLevels = [
    { value: 'Specjalista', label: 'Specjalista' },
    { value: 'W trakcie specjalizacji', label: 'W trakcie specjalizacji' },
    { value: 'Absolwent', label: 'Absolwent' }
  ];

  // Zsynchronizowane z filtrami "Typy wynagrodzeń" - identyczne opcje
  const salaryTypes = [
    { value: '', label: 'Wybierz typ wynagrodzenia' },
    { value: '% od wizyty', label: '% od wizyty' },
    { value: 'Stawka za godzinę lub wizytę', label: 'Stawka za godzinę lub wizytę' },
    { value: 'Stawka za miesiąc', label: 'Stawka za miesiąc' }
  ];

  // Zsynchronizowane z filtrami "Lokalizacje" - identyczne województwa
  const polishRegions = [
    'dolnośląskie',
    'kujawsko-pomorskie', 
    'lubelskie',
    'lubuskie',
    'łódzkie',
    'małopolskie',
    'mazowieckie',
    'opolskie',
    'podkarpackie',
    'podlaskie',
    'pomorskie',
    'śląskie',
    'świętokrzyskie',
    'warmińsko-mazurskie',
    'wielkopolskie',
    'zachodniopomorskie',
    'zagranica'
  ];

  // Zsynchronizowane z filtrami wyszukiwarki - identyczna lista zawodów medycznych
  const medicalProfessions = [
    { value: '', label: 'Wybierz zawód' },
    { value: 'Anestezjolog', label: 'Anestezjolog' },
    { value: 'Chirurg', label: 'Chirurg' },
    { value: 'Dermatolog', label: 'Dermatolog' },
    { value: 'Endokrynolog', label: 'Endokrynolog' },
    { value: 'Gastrolog', label: 'Gastrolog' },
    { value: 'Ginekolog', label: 'Ginekolog' },
    { value: 'Hematolog', label: 'Hematolog' },
    { value: 'Internista', label: 'Internista' },
    { value: 'Kardiolog', label: 'Kardiolog' },
    { value: 'Laryngolog', label: 'Laryngolog' },
    { value: 'Nefrolog', label: 'Nefrolog' },
    { value: 'Neurolog', label: 'Neurolog' },
    { value: 'Okulista', label: 'Okulista' },
    { value: 'Onkolog', label: 'Onkolog' },
    { value: 'Ortopeda', label: 'Ortopeda' },
    { value: 'Pediatra', label: 'Pediatra' },
    { value: 'Psychiatra', label: 'Psychiatra' },
    { value: 'Pulmonolog', label: 'Pulmonolog' },
    { value: 'Radiolog', label: 'Radiolog' },
    { value: 'Reumatolog', label: 'Reumatolog' },
    { value: 'Urolog', label: 'Urolog' }
  ];

  const handleValidUntilChange = (date: string) => {
    setValidUntil(date);
    const selectedDate = new Date(date);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 100);
    
    if (selectedDate > maxDate) {
      setShowDateWarning(true);
      // Set to max allowed date
      const maxDateString = maxDate.toISOString().split('T')[0];
      setValidUntil(maxDateString);
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
    if (!title || !description || !location || !contactEmail) {
      setError('Wypełnij wszystkie wymagane pola');
      setLoading(false);
      return;
    }
    
    if (!validUntil) {
      setError('Proszę wybrać datę ważności ogłoszenia');
      setLoading(false);
      return;
    }

    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      setError('Minimalne wynagrodzenie nie może być wyższe od maksymalnego');
      setLoading(false);
      return;
    }

    try {
      const jobOfferData = {
        title,
        description,
        requirements,
        benefits,
        location: isRemote ? 'Praca zdalna' : location,
        is_remote: isRemote,
        employment_type: employmentType,
        experience_level: experienceLevel,
        salary_min: salaryMin ? Number(salaryMin) : null,
        salary_max: salaryMax ? Number(salaryMax) : null,
        salary_negotiable: salaryNegotiable,
        salary_type: salaryType,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        application_deadline: applicationDeadline || null,
        specialization,
        company_id: mockUser.id,
        company_name: mockProfile.company_name,
        company_logo_url: null,
        status: 'pending', // Wymaga akceptacji administratora
        created_at: new Date().toISOString(),
        expires_at: validUntil,
        can_extend: true // Job offers can be extended after expiry
      };

      // Symulacja zapisu (bez rzeczywistego zapisu do bazy danych)
      console.log('Job offer data:', jobOfferData);
      
      // Symulacja opóźnienia
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Oferta pracy została dodana i oczekuje na akceptację administratora');
      
      // Notify admin about new job offer
      notifyJobOfferSubmitted('company1', {
        job_title: title,
        company_name: mockProfile.company_name,
        location: isRemote ? 'Praca zdalna' : location
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setRequirements('');
      setBenefits('');
      setLocation('');
      setIsRemote(false);
      setEmploymentType('Umowa o pracę');
      setExperienceLevel('Specjalista');
      setSalaryMin('');
      setSalaryMax('');
      setSalaryNegotiable(false);
      setSalaryType('');
      setContactPhone('');
      setApplicationDeadline('');
      setSpecialization('');
      setValidUntil('');
      setShowDateWarning(false);
      
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania oferty pracy');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.pushState({}, '', '/profile');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!isCompanyAccount) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Brak dostępu
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Tylko konta firmowe mogą dodawać oferty pracy
          </p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
          >
            Wróć do profilu
          </button>
        </div>
      </div>
    );
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
                  <FaBriefcase className="mr-3 text-[#38b6ff]" />
                  Dodaj ofertę pracy
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Wszystkie oferty wymagają akceptacji administratora
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
              
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tytuł oferty <span className="text-red-500">*</span>
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
                  placeholder="np. Lekarz internista, Pielęgniarka oddziałowa"
                  required
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium mb-2">Zawód</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {medicalProfessions.map((spec) => (
                    <option key={spec.value} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lokalizacja <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="np. Warszawa, Kraków, Gdańsk"
                    required
                    disabled={isRemote}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                    />
                    <span className="text-sm">Praca zdalna</span>
                  </label>
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Typ zatrudnienia</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {employmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium mb-2">Poziom doświadczenia</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Typ wynagrodzenia</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {salaryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FaMoneyBillWave className="inline mr-1" />
                  Stawka od
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value ? Number(e.target.value) : '')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Od (min)"
                    disabled={salaryNegotiable}
                  />
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value ? Number(e.target.value) : '')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Do (max)"
                    disabled={salaryNegotiable}
                  />
                </div>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={salaryNegotiable}
                    onChange={(e) => setSalaryNegotiable(e.target.checked)}
                    className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                  />
                  <span className="text-sm">Wynagrodzenie do negocjacji</span>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Szczegóły i kontakt</h3>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Opis stanowiska <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Opisz obowiązki, zakres pracy, środowisko pracy..."
                  required
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium mb-2">Wymagania</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Wykształcenie, doświadczenie, certyfikaty, uprawnienia..."
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium mb-2">Benefity</label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Prywatna opieka medyczna, szkolenia, elastyczne godziny..."
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email do aplikacji <span className="text-red-500">*</span>
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

              {/* Validity Period */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FaClock className="inline mr-1" />
                  Ogłoszenie ważne do <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => handleValidUntilChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <div className="mt-2 flex items-start gap-2 text-xs text-blue-600">
                  <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                  <p>
                    Ogłoszenie może być aktywne maksymalnie 100 dni. Po wygaśnięciu będzie możliwość przedłużenia.
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

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Termin składania aplikacji (opcjonalnie)
                </label>
                <input
                  type="date"
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                  max={validUntil}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Jeśli nie podasz terminu, aplikacje będą przyjmowane do końca ważności oferty
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
                  Dodaj ofertę
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
              <p>• Wszystkie oferty pracy wymagają akceptacji przez administratora</p>
              <p>• Proces weryfikacji może potrwać do 24 godzin</p>
              <p>• Otrzymasz powiadomienie email o statusie Twojej oferty</p>
              <p>• Oferty mogą być aktywne maksymalnie 100 dni</p>
              <p>• Po wygaśnięciu będzie możliwość przedłużenia oferty</p>
              <p>• Możesz edytować oferty w swoim profilu</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobOfferPage;