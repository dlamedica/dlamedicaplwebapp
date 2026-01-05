/**
 * Rozbudowany panel firm z unikalnym designem
 * Wszystkie komponenty stworzone od podstaw
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/apiClient';
import { isCompanyAccount } from '../../utils/permissions';
import {
  CompanyIcon, OverviewIcon, ProfileIcon, LogoutIcon, EditIcon, SaveIcon,
  CancelIcon, StatsIcon, ActivityIcon, CertificateIcon
} from '../../components/icons/CustomIcons';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomBadge } from '../../components/ui/CustomBadge';
import { CustomProgressBar } from '../../components/ui/CustomProgressBar';

interface CompanyDashboardEnhancedProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface JobOffer {
  id: string;
  title: string;
  location: string;
  salary: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  applications: number;
  views: number;
  expiresAt?: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  appliedAt: string;
  status: 'new' | 'reviewed' | 'interested' | 'rejected' | 'hired';
  rating?: number;
  notes?: string;
}

interface CompanyStats {
  totalJobOffers: number;
  activeJobOffers: number;
  totalApplications: number;
  pendingApplications: number;
  hiredCount: number;
  averageRating: number;
}

const CompanyDashboardEnhanced: React.FC<CompanyDashboardEnhancedProps> = ({ darkMode, fontSize }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'analytics' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  // Data state
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<CompanyStats>({
    totalJobOffers: 0,
    activeJobOffers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    hiredCount: 0,
    averageRating: 0
  });

  // Profile form state
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    document.title = 'Panel Firmowy – DlaMedica.pl';
    
    if (user && profile) {
      loadCompanyData();
      initializeForm();
    }
  }, [user, profile]);

  const initializeForm = () => {
    if (profile) {
      setCompanyName(profile.company_name || '');
      setCompanyType(profile.company_type || '');
      setPhone(profile.phone || '');
      setWebsite(profile.website || '');
      setBio(profile.bio || '');
    }
  };

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        // Load job offers
        const { data: jobsData } = await db
          .from('job_offers')
          .select('*')
          .eq('employer_id', user.id)
          .order('created_at', { ascending: false });

        if (jobsData) {
          setJobOffers(jobsData.map(job => ({
            id: job.id,
            title: job.position,
            location: job.location,
            salary: job.salary || 'Do ustalenia',
            status: job.status || 'pending',
            createdAt: job.created_at,
            applications: 0, // TODO: count from applications
            views: 0 // TODO: count from views
          })));

          setStats(prev => ({
            ...prev,
            totalJobOffers: jobsData.length,
            activeJobOffers: jobsData.filter(j => j.status === 'approved').length
          }));
        }

        // Load applications
        // TODO: Implement when applications table exists
        setApplications([]);
      }
    } catch (error) {
      console.error('Błąd ładowania danych firmy:', error);
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
          company_name: companyName || null,
          company_type: companyType || null,
          phone: phone || null,
          website: website || null,
          bio: bio || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profil zaktualizowany pomyślnie!');
      setEditing(false);
      await loadCompanyData();
    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error);
      alert('Błąd podczas aktualizacji profilu');
    }
  };

  const fontSizeClasses = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', button: 'text-sm px-3 py-1' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base px-4 py-2' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg px-5 py-3' }
  };

  const fontSizes = fontSizeClasses[fontSize];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <StatsIcon size={32} color="#3b82f6" />
              <CustomBadge variant="info" darkMode={darkMode} size="sm">
                {stats.activeJobOffers} aktywnych
              </CustomBadge>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Oferty pracy
            </p>
            <p className={`${fontSizes.title} font-bold`}>{stats.totalJobOffers}</p>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ActivityIcon size={32} color="#10b981" />
              <CustomBadge variant="success" darkMode={darkMode} size="sm">
                {stats.pendingApplications} nowych
              </CustomBadge>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Aplikacje
            </p>
            <p className={`${fontSizes.title} font-bold`}>{stats.totalApplications}</p>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CertificateIcon size={32} color="#a855f7" />
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Zatrudnieni
            </p>
            <p className={`${fontSizes.title} font-bold`}>{stats.hiredCount}</p>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <StatsIcon size={32} color="#f59e0b" />
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Średnia ocena
            </p>
            <p className={`${fontSizes.title} font-bold`}>
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
            </p>
          </div>
        </CustomCard>
      </div>

      {/* Ostatnie oferty */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${fontSizes.subtitle} font-bold`}>Ostatnie oferty pracy</h3>
            <CustomButton
              variant="primary"
              size="sm"
              darkMode={darkMode}
              onClick={() => {
                window.history.pushState({}, '', '/add-job-offer');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              Dodaj ofertę
            </CustomButton>
          </div>
          {jobOffers.length === 0 ? (
            <div className="text-center py-8">
              <CompanyIcon size={64} color={darkMode ? '#4b5563' : '#9ca3af'} className="mx-auto mb-4" />
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Nie masz jeszcze żadnych ofert pracy
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobOffers.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg border ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className={`${fontSizes.text} font-medium mb-1`}>{job.title}</h4>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {job.location} • {job.salary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CustomBadge
                        variant={
                          job.status === 'approved' ? 'success' :
                          job.status === 'rejected' ? 'error' : 'warning'
                        }
                        darkMode={darkMode}
                        size="sm"
                      >
                        {job.status === 'approved' ? 'Aktywna' :
                         job.status === 'rejected' ? 'Odrzucona' : 'Oczekuje'}
                      </CustomBadge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {job.applications} aplikacji
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {job.views} wyświetleń
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CustomCard>

      {/* Ostatnie aplikacje */}
      {applications.length > 0 && (
        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Ostatnie aplikacje</h3>
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg border ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`${fontSizes.text} font-medium`}>{app.candidateName}</h4>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {app.jobTitle}
                      </p>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-1`}>
                        {new Date(app.appliedAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    <CustomBadge
                      variant={
                        app.status === 'hired' ? 'success' :
                        app.status === 'rejected' ? 'error' :
                        app.status === 'interested' ? 'info' : 'default'
                      }
                      darkMode={darkMode}
                      size="sm"
                    >
                      {app.status === 'hired' ? 'Zatrudniony' :
                       app.status === 'rejected' ? 'Odrzucony' :
                       app.status === 'interested' ? 'Zainteresowany' :
                       app.status === 'reviewed' ? 'Przejrzany' : 'Nowy'}
                    </CustomBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CustomCard>
      )}
    </div>
  );

  const renderJobs = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${fontSizes.title} font-bold`}>Moje oferty pracy</h2>
          <CustomButton
            variant="primary"
            darkMode={darkMode}
            onClick={() => {
              window.history.pushState({}, '', '/add-job-offer');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Dodaj ofertę
          </CustomButton>
        </div>
        {jobOffers.length === 0 ? (
          <div className="text-center py-12">
            <CompanyIcon size={96} color={darkMode ? '#4b5563' : '#9ca3af'} className="mx-auto mb-4" />
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Nie masz jeszcze żadnych ofert pracy
            </p>
            <CustomButton
              variant="primary"
              darkMode={darkMode}
              onClick={() => {
                window.history.pushState({}, '', '/add-job-offer');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              Utwórz pierwszą ofertę
            </CustomButton>
          </div>
        ) : (
          <div className="space-y-4">
            {jobOffers.map((job) => (
              <div
                key={job.id}
                className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-5 rounded-lg border ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className={`${fontSizes.subtitle} font-bold mb-2`}>{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        📍 {job.location}
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        💰 {job.salary}
                      </span>
                    </div>
                  </div>
                  <CustomBadge
                    variant={
                      job.status === 'approved' ? 'success' :
                      job.status === 'rejected' ? 'error' : 'warning'
                    }
                    darkMode={darkMode}
                  >
                    {job.status === 'approved' ? 'Aktywna' :
                     job.status === 'rejected' ? 'Odrzucona' : 'Oczekuje'}
                  </CustomBadge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-6 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {job.applications} aplikacji
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {job.views} wyświetleń
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Utworzono: {new Date(job.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <CustomButton variant="outline" size="sm" darkMode={darkMode}>
                      Edytuj
                    </CustomButton>
                    <CustomButton variant="primary" size="sm" darkMode={darkMode}>
                      Zobacz aplikacje
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomCard>
  );

  const renderApplications = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-6`}>Aplikacje na oferty</h2>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <ActivityIcon size={96} color={darkMode ? '#4b5563' : '#9ca3af'} className="mx-auto mb-4" />
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Brak aplikacji do wyświetlenia
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-5 rounded-lg border ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`${fontSizes.subtitle} font-bold mb-1`}>{app.candidateName}</h3>
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {app.jobTitle}
                    </p>
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
                      {app.candidateEmail} • {new Date(app.appliedAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <CustomBadge
                    variant={
                      app.status === 'hired' ? 'success' :
                      app.status === 'rejected' ? 'error' :
                      app.status === 'interested' ? 'info' : 'default'
                    }
                    darkMode={darkMode}
                  >
                    {app.status === 'hired' ? 'Zatrudniony' :
                     app.status === 'rejected' ? 'Odrzucony' :
                     app.status === 'interested' ? 'Zainteresowany' :
                     app.status === 'reviewed' ? 'Przejrzany' : 'Nowy'}
                  </CustomBadge>
                </div>
                <div className="flex gap-2 mt-4">
                  <CustomButton variant="outline" size="sm" darkMode={darkMode}>
                    Zobacz CV
                  </CustomButton>
                  <CustomButton variant="primary" size="sm" darkMode={darkMode}>
                    Szczegóły
                  </CustomButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomCard>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h2 className={`${fontSizes.title} font-bold mb-6`}>Analityka rekrutacji</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Postęp rekrutacji</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={fontSizes.text}>Nowe aplikacje</span>
                    <span className={fontSizes.text}>{stats.pendingApplications}</span>
                  </div>
                  <CustomProgressBar
                    value={(stats.pendingApplications / Math.max(stats.totalApplications, 1)) * 100}
                    darkMode={darkMode}
                    variant="gradient"
                    showLabel={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={fontSizes.text}>Zatrudnieni</span>
                    <span className={fontSizes.text}>{stats.hiredCount}</span>
                  </div>
                  <CustomProgressBar
                    value={(stats.hiredCount / Math.max(stats.totalApplications, 1)) * 100}
                    darkMode={darkMode}
                    variant="gradient"
                    color="#10b981"
                    showLabel={false}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Statystyki</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={fontSizes.text}>Współczynnik zatrudnienia</span>
                  <span className={`${fontSizes.subtitle} font-bold`}>
                    {stats.totalApplications > 0
                      ? ((stats.hiredCount / stats.totalApplications) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={fontSizes.text}>Średnia aplikacji na ofertę</span>
                  <span className={`${fontSizes.subtitle} font-bold`}>
                    {stats.totalJobOffers > 0
                      ? (stats.totalApplications / stats.totalJobOffers).toFixed(1)
                      : 0}
                  </span>
                </div>
              </div>
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
          <h2 className={`${fontSizes.title} font-bold`}>Profil firmy</h2>
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
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>Nazwa firmy</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>Typ firmy</label>
              <input
                type="text"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>Strona WWW</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`${fontSizes.text} font-medium block mb-2`}>O firmie</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nazwa firmy</p>
              <p className={`${fontSizes.subtitle} font-medium`}>{companyName || 'Nie podano'}</p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
              <p className={`${fontSizes.subtitle} font-medium`}>{user?.email}</p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Typ firmy</p>
              <p className={`${fontSizes.subtitle} font-medium`}>{companyType || 'Nie podano'}</p>
            </div>
            {phone && (
              <div>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Telefon</p>
                <p className={`${fontSizes.subtitle} font-medium`}>{phone}</p>
              </div>
            )}
            {website && (
              <div>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Strona WWW</p>
                <a href={website} target="_blank" rel="noopener noreferrer" className={`${fontSizes.subtitle} font-medium text-blue-500 hover:underline`}>
                  {website}
                </a>
              </div>
            )}
            {bio && (
              <div>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>O firmie</p>
                <p className={fontSizes.text}>{bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </CustomCard>
  );

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <CustomCard darkMode={darkMode} variant="elevated" className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`${fontSizes.title} font-bold flex items-center`}>
                  <CompanyIcon size={32} color="#3b82f6" className="mr-3" />
                  Panel Firmowy
                </h1>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Witaj, {companyName || user?.email}!
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
                { id: 'jobs', label: 'Oferty', Icon: CompanyIcon },
                { id: 'applications', label: 'Aplikacje', Icon: ActivityIcon },
                { id: 'analytics', label: 'Analityka', Icon: StatsIcon },
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
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardEnhanced;

