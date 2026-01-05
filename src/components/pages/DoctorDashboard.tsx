import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/apiClient';
import { isDoctor } from '../../utils/permissions';
import {
  DoctorIcon, VerificationIcon, SpecializationIcon, StatsIcon, ActivityIcon,
  ProfileIcon, OverviewIcon, LogoutIcon, EditIcon, SaveIcon, CancelIcon,
  CertificateIcon, TimeIcon, CompanyIcon
} from '../../components/icons/CustomIcons';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomBadge } from '../../components/ui/CustomBadge';
import { CustomProgressBar } from '../../components/ui/CustomProgressBar';

interface DoctorDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface VerificationStatus {
  isVerified: boolean;
  verificationDate?: string;
  documentsSubmitted: boolean;
  pendingReview: boolean;
}

interface DoctorStats {
  totalPatients?: number;
  yearsOfExperience?: number;
  specializations: string[];
  certifications: number;
  totalArticles?: number;
  totalAnswers?: number;
  verificationHistory?: Array<{
    date: string;
    status: string;
    notes?: string;
  }>;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ darkMode, fontSize }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'specializations' | 'statistics' | 'activity' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    isVerified: false,
    documentsSubmitted: false,
    pendingReview: false
  });
  const [doctorStats, setDoctorStats] = useState<DoctorStats>({
    specializations: [],
    certifications: 0
  });
  const [editing, setEditing] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [bio, setBio] = useState('');
  const [verificationDocuments, setVerificationDocuments] = useState<File[]>([]);

  useEffect(() => {
    document.title = 'Panel Lekarza – DlaMedica.pl';
    
    if (user && profile) {
      loadDoctorData();
      initializeForm();
    }
  }, [user, profile]);

  const initializeForm = () => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setSpecialization(profile.specialization || '');
      setInstitution(profile.institution || '');
      setPhone(profile.phone || '');
      setWebsite(profile.website || '');
      setLinkedinUrl(profile.linkedin_url || '');
      setBio(profile.bio || '');
      
      if (profile.specialization) {
        setDoctorStats(prev => ({
          ...prev,
          specializations: profile.specialization.split(',').map(s => s.trim())
        }));
      }
    }
  };

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        // Load verification status
        const { data: profileData } = await db
          .from('users_profiles')
          .select('is_verified, updated_at')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setVerificationStatus({
            isVerified: profileData.is_verified || false,
            verificationDate: profileData.updated_at,
            documentsSubmitted: !!profileData.is_verified,
            pendingReview: !profileData.is_verified && !!profileData.updated_at
          });
        }

        // Load certificates count
        const { data: certsData } = await db
          .from('user_certificates')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);

        // Load activity stats (articles, answers, etc.)
        // TODO: Add actual queries when tables exist
        const totalArticles = 0; // await getDoctorArticlesCount(user.id);
        const totalAnswers = 0; // await getDoctorAnswersCount(user.id);

        setDoctorStats(prev => ({
          ...prev,
          certifications: certsData?.length || 0,
          totalArticles,
          totalAnswers,
          verificationHistory: profileData.is_verified
            ? [
                {
                  date: profileData.updated_at,
                  status: 'Zweryfikowany',
                  notes: 'Konto zostało zweryfikowane'
                }
              ]
            : []
        }));
      }
    } catch (error) {
      console.error('Błąd ładowania danych lekarza:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    try {
      const { error } = await db
        .from('users_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          specialization: specialization || null,
          institution: institution || null,
          phone: phone || null,
          website: website || null,
          linkedin_url: linkedinUrl || null,
          bio: bio || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profil zaktualizowany pomyślnie!');
      setEditing(false);
      await loadDoctorData();
    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error);
      alert('Błąd podczas aktualizacji profilu');
    }
  };

  const handleVerificationRequest = async () => {
    if (!user?.id) return;
    if (verificationDocuments.length === 0) {
      alert('Proszę załączyć dokumenty weryfikacyjne');
      return;
    }

    try {
      // TODO: Upload documents to storage and create verification request
      alert('Wniosek o weryfikację został wysłany. Prosimy o cierpliwość podczas weryfikacji.');
      setVerificationStatus(prev => ({
        ...prev,
        documentsSubmitted: true,
        pendingReview: true
      }));
    } catch (error) {
      console.error('Błąd wysyłania wniosku o weryfikację:', error);
      alert('Błąd podczas wysyłania wniosku');
    }
  };

  const fontSizeClasses = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', button: 'text-sm px-3 py-1' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base px-4 py-2' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg px-5 py-3' }
  };

  const fontSizes = fontSizeClasses[fontSize];

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`${fontSizes.text} mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie danych...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status weryfikacji */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
        <h3 className={`${fontSizes.subtitle} font-bold mb-4 flex items-center`}>
          <VerificationIcon size={24} color="#3b82f6" className="mr-2" />
          Status weryfikacji
        </h3>
        {verificationStatus.isVerified ? (
          <div className="flex items-center text-green-500">
            <VerificationIcon size={32} color="#10b981" className="mr-3" />
            <div>
              <p className={`${fontSizes.subtitle} font-bold`}>Zweryfikowany lekarz</p>
              {verificationStatus.verificationDate && (
                <p className={`${fontSizes.text} text-gray-500`}>
                  Zweryfikowano: {new Date(verificationStatus.verificationDate).toLocaleDateString('pl-PL')}
                </p>
              )}
            </div>
          </div>
        ) : verificationStatus.pendingReview ? (
          <div className="flex items-center text-orange-500">
            <TimeIcon size={32} color="#f97316" className="mr-3" />
            <div>
              <p className={`${fontSizes.subtitle} font-bold`}>Weryfikacja w toku</p>
              <p className={`${fontSizes.text} text-gray-500`}>
                Twoje dokumenty są w trakcie weryfikacji
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <CancelIcon size={32} color="#ef4444" className="mr-3" />
            <div>
              <p className={`${fontSizes.subtitle} font-bold`}>Niezweryfikowany</p>
              <p className={`${fontSizes.text} text-gray-500`}>
                Prześlij dokumenty, aby zweryfikować swoje konto
              </p>
            </div>
          </div>
        )}
        </div>
      </CustomCard>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center">
              <SpecializationIcon size={32} color="#3b82f6" className="mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Specjalizacje</p>
                <p className={`${fontSizes.title} font-bold`}>
                  {doctorStats.specializations.length || 0}
                </p>
              </div>
            </div>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center">
              <CertificateIcon size={32} color="#10b981" className="mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Certyfikaty</p>
                <p className={`${fontSizes.title} font-bold`}>{doctorStats.certifications}</p>
              </div>
            </div>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center">
              <CompanyIcon size={32} color="#a855f7" className="mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Instytucja</p>
                <p className={`${fontSizes.text} font-bold`}>{institution || 'Nie podano'}</p>
              </div>
            </div>
          </div>
        </CustomCard>
      </div>

      {/* Specjalizacje */}
      {doctorStats.specializations.length > 0 && (
        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Moje specjalizacje</h3>
            <div className="flex flex-wrap gap-2">
              {doctorStats.specializations.map((spec, index) => (
                <span
                  key={index}
                  className={`${fontSizes.text} bg-blue-100 text-blue-800 px-3 py-1 rounded-full`}
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </CustomCard>
      )}
    </div>
  );

  const renderVerification = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-4`}>Weryfikacja konta lekarza</h2>
      
      {verificationStatus.isVerified ? (
        <div className="text-center py-8">
          <VerificationIcon size={96} color="#10b981" className="mx-auto mb-4" />
          <p className={`${fontSizes.subtitle} font-bold mb-2`}>Twoje konto jest zweryfikowane</p>
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Gratulacje! Twoje konto lekarza zostało zweryfikowane.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Aby zweryfikować swoje konto lekarza, prześlij następujące dokumenty:
            </p>
            <ul className={`${fontSizes.text} list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              <li>Dyplom ukończenia studiów medycznych</li>
              <li>Prawo wykonywania zawodu (PWZ)</li>
              <li>Dokument potwierdzający specjalizację (jeśli dotyczy)</li>
              <li>Dowód tożsamości</li>
            </ul>
          </div>

          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>
              Załącz dokumenty weryfikacyjne (PDF, JPG, PNG)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files) {
                  setVerificationDocuments(Array.from(e.target.files));
                }
              }}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
            {verificationDocuments.length > 0 && (
              <p className={`${fontSizes.text} text-green-500 mt-2`}>
                Załączono {verificationDocuments.length} plik(ów)
              </p>
            )}
          </div>

          <CustomButton
            variant="primary"
            darkMode={darkMode}
            onClick={handleVerificationRequest}
            disabled={verificationDocuments.length === 0}
            icon={<SaveIcon size={18} color="white" />}
          >
            Wyślij wniosek o weryfikację
          </CustomButton>

          {verificationStatus.pendingReview && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className={`${fontSizes.text} text-orange-800 flex items-center`}>
                <TimeIcon size={18} color="#f97316" className="mr-2" />
                Twój wniosek jest w trakcie weryfikacji. Prosimy o cierpliwość.
              </p>
            </div>
          )}
        </div>
      )}
      </div>
    </CustomCard>
  );

  const renderSpecializations = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-4`}>Moje specjalizacje</h2>
      <div className="space-y-4">
        <div>
          <label className={`${fontSizes.text} font-medium block mb-2`}>
            Specjalizacja (oddziel przecinkami dla wielu)
          </label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="np. Kardiologia, Choroby wewnętrzne"
            className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
          />
        </div>
        <CustomButton
          variant="primary"
          darkMode={darkMode}
          onClick={handleUpdateProfile}
        >
          Zapisz specjalizacje
        </CustomButton>
      </div>
      </div>
    </CustomCard>
  );

  const renderStatistics = () => (
    <div className="space-y-6">
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h2 className={`${fontSizes.title} font-bold mb-4`}>Statystyki</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className={`${fontSizes.text} font-medium text-gray-500 mb-2`}>Certyfikaty</h3>
            <p className={`${fontSizes.title} font-bold text-blue-500`}>{doctorStats.certifications}</p>
          </div>
          <div>
            <h3 className={`${fontSizes.text} font-medium text-gray-500 mb-2`}>Specjalizacje</h3>
            <p className={`${fontSizes.title} font-bold text-green-500`}>
              {doctorStats.specializations.length}
            </p>
          </div>
          <div>
            <h3 className={`${fontSizes.text} font-medium text-gray-500 mb-2`}>Artykuły</h3>
            <p className={`${fontSizes.title} font-bold text-purple-500`}>
              {doctorStats.totalArticles || 0}
            </p>
          </div>
          <div>
            <h3 className={`${fontSizes.text} font-medium text-gray-500 mb-2`}>Odpowiedzi</h3>
            <p className={`${fontSizes.title} font-bold text-orange-500`}>
              {doctorStats.totalAnswers || 0}
            </p>
          </div>
        </div>
        </div>
      </CustomCard>

      {/* Historia weryfikacji */}
      {doctorStats.verificationHistory && doctorStats.verificationHistory.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Historia weryfikacji</h3>
          <div className="space-y-3">
            {doctorStats.verificationHistory.map((entry, index) => (
              <div
                key={index}
                className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg border-l-4 ${
                  entry.status === 'Zweryfikowany' ? 'border-green-500' : 'border-orange-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${fontSizes.text} font-medium`}>{entry.status}</p>
                    <p className={`${fontSizes.text} text-gray-500 text-xs`}>
                      {new Date(entry.date).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {entry.notes && (
                      <p className={`${fontSizes.text} text-gray-400 mt-1`}>{entry.notes}</p>
                    )}
                  </div>
                  {entry.status === 'Zweryfikowany' ? (
                    <VerificationIcon size={24} color="#10b981" />
                  ) : (
                    <TimeIcon size={24} color="#f97316" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h2 className={`${fontSizes.title} font-bold mb-4`}>Moja aktywność</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Artykuły</h3>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Opublikowane artykuły: {doctorStats.totalArticles || 0}
            </p>
            <CustomButton
              variant="primary"
              darkMode={darkMode}
              className="mt-4"
            >
              Zobacz moje artykuły
            </CustomButton>
          </div>
          <div>
            <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Odpowiedzi</h3>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Odpowiedzi na pytania: {doctorStats.totalAnswers || 0}
            </p>
            <CustomButton
              variant="success"
              darkMode={darkMode}
              className="mt-4"
            >
              Zobacz moje odpowiedzi
            </CustomButton>
          </div>
        </div>
        </div>
      </CustomCard>

      {/* Ostatnia aktywność */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
        <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Ostatnia aktywność</h3>
        <div className="space-y-3">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <p className={`${fontSizes.text} font-medium`}>Brak ostatniej aktywności</p>
            <p className={`${fontSizes.text} text-gray-500 text-xs`}>
              Zacznij publikować artykuły lub odpowiadać na pytania, aby zobaczyć tutaj swoją aktywność
            </p>
          </div>
        </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderProfile = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${fontSizes.title} font-bold`}>Mój profil</h2>
          {!editing && (
            <CustomButton
              variant="primary"
              size="sm"
              darkMode={darkMode}
              onClick={() => setEditing(true)}
              icon={<EditIcon size={18} color="white" />}
            >
              Edytuj
            </CustomButton>
          )}
        </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>Imię</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
              />
            </div>
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>Nazwisko</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
              />
            </div>
          </div>
          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>Specjalizacja</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>Instytucja</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>Strona WWW</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>LinkedIn</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
          </div>
          <div>
            <label className={`${fontSizes.text} font-medium block mb-2`}>O mnie</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} border rounded-lg px-4 py-2`}
            />
          </div>
          <div className="flex gap-4">
            <CustomButton
              variant="success"
              darkMode={darkMode}
              onClick={handleUpdateProfile}
              icon={<SaveIcon size={18} color="white" />}
            >
              Zapisz
            </CustomButton>
            <CustomButton
              variant="secondary"
              darkMode={darkMode}
              onClick={() => {
                setEditing(false);
                initializeForm();
              }}
              icon={<CancelIcon size={18} color={darkMode ? 'white' : 'gray'} />}
            >
              Anuluj
            </CustomButton>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className={`${fontSizes.text} text-gray-500`}>Imię i nazwisko</p>
            <p className={`${fontSizes.subtitle} font-medium`}>
              {firstName} {lastName}
            </p>
          </div>
          <div>
            <p className={`${fontSizes.text} text-gray-500`}>Email</p>
            <p className={`${fontSizes.subtitle} font-medium`}>{user?.email}</p>
          </div>
          <div>
            <p className={`${fontSizes.text} text-gray-500`}>Specjalizacja</p>
            <p className={`${fontSizes.subtitle} font-medium`}>{specialization || 'Nie podano'}</p>
          </div>
          <div>
            <p className={`${fontSizes.text} text-gray-500`}>Instytucja</p>
            <p className={`${fontSizes.subtitle} font-medium`}>{institution || 'Nie podano'}</p>
          </div>
          {phone && (
            <div>
              <p className={`${fontSizes.text} text-gray-500`}>Telefon</p>
              <p className={`${fontSizes.subtitle} font-medium`}>{phone}</p>
            </div>
          )}
          {website && (
            <div>
              <p className={`${fontSizes.text} text-gray-500`}>Strona WWW</p>
              <a href={website} target="_blank" rel="noopener noreferrer" className={`${fontSizes.subtitle} font-medium text-blue-500 hover:underline`}>
                {website}
              </a>
            </div>
          )}
          {linkedinUrl && (
            <div>
              <p className={`${fontSizes.text} text-gray-500`}>LinkedIn</p>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={`${fontSizes.subtitle} font-medium text-blue-500 hover:underline`}>
                {linkedinUrl}
              </a>
            </div>
          )}
          {bio && (
            <div>
              <p className={`${fontSizes.text} text-gray-500`}>O mnie</p>
              <p className={`${fontSizes.text}`}>{bio}</p>
            </div>
          )}
        </div>
      )}
      </div>
    </CustomCard>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <CustomCard darkMode={darkMode} variant="elevated" className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`${fontSizes.title} font-bold flex items-center`}>
                  <DoctorIcon size={32} color="#3b82f6" className="mr-3" />
                  Panel Lekarza
                </h1>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Witaj, dr {firstName || user?.email}!
                </p>
              </div>
              <CustomButton
                variant="danger"
                size="sm"
                darkMode={darkMode}
                onClick={signOut}
                icon={<LogoutIcon size={18} color="white" />}
              >
                Wyloguj
              </CustomButton>
            </div>
          </div>
        </CustomCard>

        {/* Tabs */}
        <CustomCard darkMode={darkMode} variant="default" className="mb-6">
          <div className="p-0">
            <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Przegląd', Icon: OverviewIcon },
              { id: 'verification', label: 'Weryfikacja', Icon: VerificationIcon },
              { id: 'specializations', label: 'Specjalizacje', Icon: SpecializationIcon },
              { id: 'statistics', label: 'Statystyki', Icon: StatsIcon },
              { id: 'activity', label: 'Aktywność', Icon: ActivityIcon },
              { id: 'profile', label: 'Profil', Icon: ProfileIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 ${fontSizes.text} py-4 px-6 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
                }`}
              >
                <tab.Icon size={20} color={activeTab === tab.id ? '#3b82f6' : 'currentColor'} />
                {tab.label}
              </button>
            ))}
            </div>
          </div>
        </CustomCard>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'verification' && renderVerification()}
          {activeTab === 'specializations' && renderSpecializations()}
          {activeTab === 'statistics' && renderStatistics()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

