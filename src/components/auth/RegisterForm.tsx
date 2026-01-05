import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { MEDICAL_PROFESSIONS } from '../../constants/professions';
// import ReCaptcha, { ReCaptchaHandle } from './ReCaptcha';
import PhoneInput from '../PhoneInput';
import ImageUploader from '../ImageUploader';

interface RegisterFormProps {
  darkMode?: boolean;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  darkMode = false,
  onSuccess,
  onSwitchToLogin
}) => {
  const { signUp, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [fullName, setFullName] = useState('');
  const [studyField, setStudyField] = useState(''); // kierunek studiów
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyBio, setCompanyBio] = useState('');
  const [companyNIP, setCompanyNIP] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+48');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const recaptchaRef = useRef<any>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Nieprawidłowy format email';
    }

    if (isCompany && !companyName.trim()) {
      errors.companyName = 'Nazwa firmy jest wymagana';
    }

    if (isCompany && !companyNIP.trim()) {
      errors.companyNIP = 'NIP jest wymagany';
    } else if (isCompany && !/^\d{10}$/.test(companyNIP.replace(/[\s-]/g, ''))) {
      errors.companyNIP = 'NIP musi zawierać 10 cyfr';
    }

    if (isCompany && !companyAddress.trim()) {
      errors.companyAddress = 'Adres firmy jest wymagany';
    }

    if (isCompany && !companyIndustry) {
      errors.companyIndustry = 'Branża jest wymagana';
    }

    if (!isCompany && !fullName.trim()) {
      errors.fullName = 'Imię i nazwisko jest wymagane';
    }

    // Wymagaj wyboru zawodu
    if (!isCompany && !profession) {
      errors.profession = 'Wybór zawodu jest wymagany';
    }

    // Wymagaj kierunku studiów dla studentów
    if (!isCompany && (profession === 'studentka_student' || profession === 'uczennica_uczen') && !studyField.trim()) {
      errors.studyField = 'Kierunek studiów jest wymagany dla studentów';
    }


    if (!password) {
      errors.password = 'Hasło jest wymagane';
    } else if (password.length < 8) {
      errors.password = 'Hasło musi mieć co najmniej 8 znaków';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Hasło musi zawierać wielką literę, małą literę i cyfrę';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Potwierdź hasło';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (profession === 'inne' && !customProfession.trim()) {
      errors.customProfession = 'Wpisz swój zawód';
    }

    /* 
    // ReCaptcha temporarily disabled to fix user blocker
    if (!recaptchaToken) {
      errors.recaptcha = 'Potwierdź, że nie jesteś robotem';
    }
    */

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Create a more visible error message
      const errorMessages = Object.values(errors).join('. ');
      setError(`Popraw błędy: ${errorMessages}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const profileData = {
      full_name: isCompany ? companyName : fullName,
      zawod: profession || undefined,
      study_field: (profession === 'studentka_student' || profession === 'uczennica_uczen') ? studyField : undefined,
      is_company: isCompany,
      phone: phoneNumber || undefined,
      company_name: isCompany ? companyName : undefined,
      company_logo_url: isCompany ? companyLogo : undefined,
      company_bio: isCompany ? companyBio : undefined,
      company_nip: isCompany ? companyNIP : undefined,
      company_address: isCompany ? companyAddress : undefined,
      company_industry: isCompany ? companyIndustry : undefined,
      newsletter_consent: newsletterConsent,
    };

    const { error } = await signUp(email, password, profileData);

    if (error) {
      setError(error.message);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } else {
      setSuccess('Sprawdź swoją skrzynkę e-mail i kliknij link weryfikacyjny');
      onSuccess?.();
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    setError(null);

    const { error } = await signInWithOAuth(provider);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
      <h2 className="text-2xl font-bold text-center mb-6">Zarejestruj się</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Typ konta
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="accountType"
                checked={!isCompany}
                onChange={() => setIsCompany(false)}
                className="mr-2"
              />
              Konto osobiste
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="accountType"
                checked={isCompany}
                onChange={() => setIsCompany(true)}
                className="mr-2"
              />
              Konto firmowe
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            {isCompany ? 'Nazwa firmy' : 'Imię i nazwisko'} <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={isCompany ? companyName : fullName}
            onChange={(e) => {
              isCompany ? setCompanyName(e.target.value) : setFullName(e.target.value);
              setFieldErrors(prev => ({ ...prev, [isCompany ? 'companyName' : 'fullName']: '' }));
            }}
            required
            disabled={loading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors[isCompany ? 'companyName' : 'fullName']
              ? 'border-red-500'
              : darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
              }`}
            placeholder={isCompany ? "Nazwa firmy" : "Jan Kowalski"}
          />
          {fieldErrors[isCompany ? 'companyName' : 'fullName'] && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors[isCompany ? 'companyName' : 'fullName']}</p>
          )}
        </div>

        {isCompany && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Logo firmy
                <span className="text-gray-500 text-xs ml-2">(opcjonalnie)</span>
              </label>
              <ImageUploader
                value={companyLogo}
                onChange={setCompanyLogo}
                darkMode={darkMode}
                disabled={loading}
                maxSize={2}
                width={120}
                height={120}
                placeholder="Przeciągnij logo tutaj lub kliknij"
              />
              <p className="text-xs text-gray-500 mt-1">
                Obsługiwane formaty: JPG, PNG. Maksymalny rozmiar: 2MB
              </p>
            </div>

            <div>
              <label htmlFor="companyNIP" className="block text-sm font-medium mb-2">
                NIP <span className="text-red-500">*</span>
              </label>
              <input
                id="companyNIP"
                type="text"
                value={companyNIP}
                onChange={(e) => {
                  setCompanyNIP(e.target.value);
                  setFieldErrors(prev => ({ ...prev, companyNIP: '' }));
                }}
                required={isCompany}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.companyNIP
                  ? 'border-red-500'
                  : darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="1234567890"
              />
              {fieldErrors.companyNIP && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.companyNIP}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium mb-2">
                Adres firmy <span className="text-red-500">*</span>
              </label>
              <input
                id="companyAddress"
                type="text"
                value={companyAddress}
                onChange={(e) => {
                  setCompanyAddress(e.target.value);
                  setFieldErrors(prev => ({ ...prev, companyAddress: '' }));
                }}
                required={isCompany}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.companyAddress
                  ? 'border-red-500'
                  : darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="ul. Przykładowa 123, 00-001 Warszawa"
              />
              {fieldErrors.companyAddress && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.companyAddress}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyIndustry" className="block text-sm font-medium mb-2">
                Branża <span className="text-red-500">*</span>
              </label>
              <select
                id="companyIndustry"
                value={companyIndustry}
                onChange={(e) => {
                  setCompanyIndustry(e.target.value);
                  setFieldErrors(prev => ({ ...prev, companyIndustry: '' }));
                }}
                required={isCompany}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.companyIndustry
                  ? 'border-red-500'
                  : darkMode
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
              {fieldErrors.companyIndustry && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.companyIndustry}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyBio" className="block text-sm font-medium mb-2">
                Opis firmy
              </label>
              <textarea
                id="companyBio"
                value={companyBio}
                onChange={(e) => setCompanyBio(e.target.value)}
                disabled={loading}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Krótki opis firmy..."
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors(prev => ({ ...prev, email: '' }));
            }}
            required
            disabled={loading}
            autoComplete="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.email
              ? 'border-red-500'
              : darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
              }`}
            placeholder="twoj@email.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Numer telefonu
            <span className="text-gray-500"> (opcjonalnie)</span>
          </label>
          <PhoneInput
            id="phone"
            value={phoneNumber}
            onChange={setPhoneNumber}
            darkMode={darkMode}
            disabled={loading}
            placeholder="123 456 789"
          />
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium mb-2">
            Zawód medyczny <span className="text-red-500">*</span>
          </label>
          <select
            id="profession"
            value={profession}
            onChange={(e) => {
              setProfession(e.target.value);
              setFieldErrors(prev => ({ ...prev, profession: '' }));
            }}
            required
            disabled={loading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.profession
              ? 'border-red-500'
              : darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="">Wybierz zawód medyczny</option>
            {MEDICAL_PROFESSIONS.map((prof) => (
              <option key={prof.value} value={prof.value}>
                {prof.label}
              </option>
            ))}
          </select>
          {fieldErrors.profession && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.profession}</p>
          )}
        </div>

        {(profession === 'studentka_student' || profession === 'uczennica_uczen') && (
          <div>
            <label htmlFor="studyField" className="block text-sm font-medium mb-2">
              Kierunek studiów <span className="text-red-500">*</span>
            </label>
            <select
              id="studyField"
              value={studyField}
              onChange={(e) => {
                setStudyField(e.target.value);
                setFieldErrors(prev => ({ ...prev, studyField: '' }));
              }}
              required
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.studyField
                ? 'border-red-500'
                : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="">Wybierz kierunek studiów</option>
              <option value="lekarski">Lekarski</option>
              <option value="lekarsko-dentystyczny">Lekarsko-dentystyczny</option>
              <option value="pielegniarstwo">Pielęgniarstwo</option>
              <option value="poloznictwo">Położnictwo</option>
              <option value="farmacja">Farmacja</option>
              <option value="fizjoterapia">Fizjoterapia</option>
              <option value="dietetyka">Dietetyka</option>
              <option value="kosmetologia">Kosmetologia</option>
              <option value="psychologia">Psychologia</option>
              <option value="logopedia">Logopedia</option>
              <option value="radiologia_medyczna">Radiologia medyczna</option>
              <option value="analityka_medyczna">Analityka medyczna</option>
              <option value="ratownictwo_medyczne">Ratownictwo medyczne</option>
              <option value="zdrowie_publiczne">Zdrowie publiczne</option>
              <option value="technik_farmaceutyczny">Technik farmaceutyczny</option>
              <option value="technik_dentystyczny">Technik dentystyczny</option>
              <option value="technik_ortopedyczny">Technik ortopedyczny</option>
              <option value="weterynaria">Weterynaria</option>
              <option value="inne_medyczne">Inne kierunki medyczne</option>
            </select>
            {fieldErrors.studyField && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.studyField}</p>
            )}
          </div>
        )}

        {profession === 'inne' && (
          <div>
            <label htmlFor="customProfession" className="block text-sm font-medium mb-2">
              Wpisz swój zawód <span className="text-red-500">*</span>
            </label>
            <input
              id="customProfession"
              type="text"
              value={customProfession}
              onChange={(e) => {
                setCustomProfession(e.target.value);
                setFieldErrors(prev => ({ ...prev, customProfession: '' }));
              }}
              required
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.customProfession
                ? 'border-red-500'
                : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="Wpisz swój zawód"
            />
            {fieldErrors.customProfession && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.customProfession}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Hasło <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors(prev => ({ ...prev, password: '' }));
              }}
              required
              disabled={loading}
              autoComplete="new-password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${fieldErrors.password
                ? 'border-red-500'
                : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum 8 znaków, wielka i mała litera, cyfra
          </p>
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Potwierdź hasło <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              required
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${fieldErrors.confirmPassword
                ? 'border-red-500'
                : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newsletterConsent}
              onChange={(e) => setNewsletterConsent(e.target.checked)}
              disabled={loading}
              className="mr-2"
            />
            <span className="text-sm">
              Chcę otrzymywać newsletter z najnowszymi artykułami i informacjami medycznymi
            </span>
          </label>
        </div>

        {/* ReCaptcha temporarily disabled
        <div>
          <ReCaptcha
            darkMode={darkMode}
            onVerify={setRecaptchaToken}
            ref={recaptchaRef}
          />
          {fieldErrors.recaptcha && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.recaptcha}</p>
          )}
        </div>
        */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              Lub zarejestruj się przez
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className={`flex justify-center items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FaGoogle className="text-red-500" />
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={loading}
            className={`flex justify-center items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FaFacebook className="text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('apple')}
            disabled={loading}
            className={`flex justify-center items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            <FaApple className={darkMode ? 'text-white' : 'text-gray-900'} />
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Masz już konto?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Zaloguj się
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
