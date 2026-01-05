import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  CalendarIcon,
  FileIcon,
  UserIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  StarIcon,
  DownloadIcon,
  PlusIcon,
  FilterIcon,
  SearchIcon,
  MapMarkerIcon,
  MoneyBillIcon,
  ClockIcon,
  UsersIcon,
  CheckIcon,
  TimesIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  NotesMedicalIcon,
  RedoIcon,
} from '../icons/CustomIconSystem';
import { exampleDataService } from '../../services/exampleDataService';
import { useNotifications } from '../../hooks/useNotifications';
import ExpiryManagementModal from '../ExpiryManagementModal';

interface CompanyDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ darkMode, fontSize }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'events' | 'applications'>('overview');
  const [myJobOffers, setMyJobOffers] = useState(exampleDataService.getJobOffers());
  const [myEvents, setMyEvents] = useState(exampleDataService.getEvents());
  const [applications, setApplications] = useState(exampleDataService.getApplications());
  const [selectedJobOffer, setSelectedJobOffer] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidateNotes, setCandidateNotes] = useState<Record<string, string>>({});
  const [candidateRatings, setCandidateRatings] = useState<Record<string, number>>({});
  const [showExpiryModal, setShowExpiryModal] = useState<string | null>(null);

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

  const getStatusBadge = (status: string, rejectionReason?: string, expiresAt?: Date) => {
    const baseClasses = `px-2 py-1 rounded-full text-xs font-medium`;
    const now = new Date();
    const isExpired = expiresAt && now > expiresAt;
    const daysUntilExpiry = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`} title="Oczekuje na weryfikację">Weryfikacja</span>;
      case 'approved':
        if (isExpired) {
          return <span className={`${baseClasses} bg-red-100 text-red-800`}>Wygasła</span>;
        } else if (daysUntilExpiry <= 7) {
          return <span className={`${baseClasses} bg-orange-100 text-orange-800`} title={`Wygasa za ${daysUntilExpiry} dni`}>Wkrótce wygasa</span>;
        }
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Aktywna</span>;
      case 'expired':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Wygasła</span>;
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`} title={rejectionReason}>
            Odrzucone
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    const baseClasses = `px-2 py-1 rounded-full text-xs font-medium`;
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Nowa</span>;
      case 'reviewed':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Przejrzana</span>;
      case 'interview':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>Zainteresowany</span>;
      case 'accepted':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Zaakceptowany</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Odrzucony</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const updateApplicationStatus = (applicationId: string, newStatus: string) => {
    exampleDataService.updateApplicationStatus(applicationId, newStatus as any, candidateNotes[applicationId]);
    setApplications(exampleDataService.getApplications());
  };

  const updateCandidateRating = (applicationId: string, rating: number) => {
    exampleDataService.rateApplication(applicationId, rating);
    setCandidateRatings(prev => ({ ...prev, [applicationId]: rating }));
    setApplications(exampleDataService.getApplications());
  };

  const renderOverview = () => {
    const pendingJobs = myJobOffers.filter(job => job.status === 'pending').length;
    const approvedJobs = myJobOffers.filter(job => job.status === 'approved').length;
    const totalApplications = applications.length;
    const newApplications = applications.filter(app => app.status === 'pending').length;

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className={`${fontSizes.title} font-bold mb-2`}>Panel Firmowy - Dashboard</h1>
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Zarządzaj swoimi ofertami pracy, wydarzeniami i aplikacjami kandydatów
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <BriefcaseIcon size={32} className="text-blue-500 mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Moje oferty</p>
                <p className={`${fontSizes.title} font-bold`}>{myJobOffers.length}</p>
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="text-green-600">{approvedJobs} aktywne</span>
              <span className="text-yellow-600 ml-3">{pendingJobs} weryfikacja</span>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <FileIcon size={32} className="text-green-500 mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Aplikacje</p>
                <p className={`${fontSizes.title} font-bold`}>{totalApplications}</p>
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="text-blue-600">{newApplications} nowe</span>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <CalendarIcon size={32} className="text-purple-500 mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Wydarzenia</p>
                <p className={`${fontSizes.title} font-bold`}>{myEvents.length}</p>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <EyeIcon size={32} className="text-orange-500 mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Wyświetlenia</p>
                <p className={`${fontSizes.title} font-bold`}>2,847</p>
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="text-green-600">+12% ten tydzień</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Ostatnia aktywność</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <div className="flex items-center">
                <UserIcon size={20} className="text-blue-500 mr-3" />
                <span className={fontSizes.text}>Nowa aplikacja na stanowisko: Lekarz rodzinny</span>
              </div>
              <span className={`${fontSizes.label} text-gray-500`}>5 min temu</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <div className="flex items-center">
                <CheckIcon size={20} className="text-green-500 mr-3" />
                <span className={fontSizes.text}>Oferta "Pediatra" została zaakceptowana</span>
              </div>
              <span className={`${fontSizes.label} text-gray-500`}>2 godz. temu</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <CalendarIcon size={20} className="text-purple-500 mr-3" />
                <span className={fontSizes.text}>Webinar "Nowoczesne technologie" - 45 zapisów</span>
              </div>
              <span className={`${fontSizes.label} text-gray-500`}>1 dzień temu</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMyJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`${fontSizes.title} font-bold`}>Moje oferty pracy</h1>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/dodaj-oferte');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
        >
          <PlusIcon size={20} className="mr-2" />
          Dodaj ofertę
        </button>
      </div>

      {/* Job Offers List */}
      <div className="grid gap-4">
        {myJobOffers.map((job) => (
          <div key={job.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`${fontSizes.subtitle} font-bold`}>{job.position}</h3>
                  {getStatusBadge(job.status, job.rejection_reason, job.expires_at)}
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <MapMarkerIcon size={16} className="text-gray-400" />
                    <span className={fontSizes.text}>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoneyBillIcon size={16} className="text-gray-400" />
                    <span className={fontSizes.text}>{job.salary_range}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon size={16} className="text-gray-400" />
                    <span className={fontSizes.text}>
                      {applications.filter(app => app.job_offer_id === job.id).length} aplikacji
                    </span>
                  </div>
                </div>
                <div className={`${fontSizes.label} text-gray-500 space-y-1`}>
                  <div>Utworzono: {job.created_at.toLocaleDateString('pl-PL')}</div>
                  <div>Wygasa: {job.expires_at.toLocaleDateString('pl-PL')}</div>
                  {job.extension_count && job.extension_count > 0 && (
                    <div className="text-blue-600">Przedłużono: {job.extension_count} razy</div>
                  )}
                </div>
                {job.rejection_reason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <strong>Powód odrzucenia:</strong> {job.rejection_reason}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setSelectedJobOffer(job.id)}
                  className={`${fontSizes.button} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2`}
                >
                  <UsersIcon size={18} /> Aplikacje
                </button>
                {job.status === 'approved' && job.can_extend && (
                  <button
                    onClick={() => setShowExpiryModal(job.id)}
                    className={`${fontSizes.button} ${
                      new Date() > job.expires_at || Math.ceil((job.expires_at.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white rounded-lg transition-colors flex items-center gap-2`}
                  >
                    <RedoIcon size={18} /> Przedłuż
                  </button>
                )}
                {job.status !== 'rejected' && (
                  <button
                    className={`${fontSizes.button} bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2`}
                  >
                    <EditIcon size={18} /> Edytuj
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {myJobOffers.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
            <BriefcaseIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className={`${fontSizes.text} text-gray-500 mb-4`}>Nie masz jeszcze żadnych ofert pracy</p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/dodaj-oferte');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
            >
              Dodaj pierwszą ofertę
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderApplications = () => {
    const jobOfferApplications = selectedJobOffer 
      ? applications.filter(app => app.job_offer_id === selectedJobOffer)
      : applications;
    
    const jobOffer = selectedJobOffer ? myJobOffers.find(job => job.id === selectedJobOffer) : null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`${fontSizes.title} font-bold`}>
              {selectedJobOffer ? `Aplikacje - ${jobOffer?.position}` : 'Wszystkie aplikacje'}
            </h1>
            {selectedJobOffer && (
              <button
                onClick={() => setSelectedJobOffer(null)}
                className="text-[#38b6ff] hover:text-blue-600 text-sm mt-1"
              >
                ← Powrót do wszystkich ofert
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="pending">Nowe</option>
              <option value="reviewed">Przejrzane</option>
              <option value="interview">Zainteresowane</option>
              <option value="accepted">Zaakceptowane</option>
              <option value="rejected">Odrzucone</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-4">
          {jobOfferApplications
            .filter(app => filterStatus === 'all' || app.status === filterStatus)
            .map((application) => (
            <div key={application.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className={`${fontSizes.subtitle} font-bold`}>{application.candidate_name}</h3>
                    {getApplicationStatusBadge(application.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon size={16} className="text-gray-400" />
                        <span className={fontSizes.text}>{application.candidate_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon size={16} className="text-gray-400" />
                        <span className={fontSizes.text}>{application.candidate_phone}</span>
                      </div>
                      {application.cv_url && (
                        <div className="flex items-center gap-2">
                          <DownloadIcon size={16} className="text-blue-500" />
                          <button className="text-blue-500 hover:text-blue-600 text-sm">
                            Pobierz CV
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`${fontSizes.label} text-gray-500`}>
                        Aplikacja: {application.applied_at.toLocaleDateString('pl-PL')}
                      </div>
                      {application.updated_at > application.applied_at && (
                        <div className={`${fontSizes.label} text-gray-500`}>
                          Aktualizacja: {application.updated_at.toLocaleDateString('pl-PL')}
                        </div>
                      )}
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        <span className={`${fontSizes.label} text-gray-500 mr-2`}>Ocena:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => updateCandidateRating(application.id, star)}
                            className={`${
                              (candidateRatings[application.id] || application.rating || 0) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                          >
                            <StarIcon size={20} />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          ({candidateRatings[application.id] || application.rating || 0}/5)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  {application.cover_letter && (
                    <div className="mb-4">
                      <p className={`${fontSizes.text} font-medium mb-2`}>List motywacyjny:</p>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                        {application.cover_letter.length > 200 
                          ? `${application.cover_letter.substring(0, 200)}...`
                          : application.cover_letter}
                      </div>
                    </div>
                  )}

                  {/* Notes Section */}
                  <div className="mb-4">
                    <label className={`block ${fontSizes.text} font-medium mb-2`}>
                      <NotesMedicalIcon size={18} className="inline mr-1" />
                      Notatki prywatne:
                    </label>
                    <textarea
                      value={candidateNotes[application.id] || application.notes || ''}
                      onChange={(e) => setCandidateNotes(prev => ({...prev, [application.id]: e.target.value}))}
                      placeholder="Dodaj notatki o kandydacie..."
                      className={`w-full p-3 border rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => setShowApplicationModal(application.id)}
                    className={`${fontSizes.button} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2`}
                  >
                    <EyeIcon size={18} /> Szczegóły
                  </button>
                  
                  {application.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                        className={`${fontSizes.button} bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors`}
                      >
                        Przejrzyj
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'interview')}
                        className={`${fontSizes.button} bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors`}
                      >
                        Zainteresuj
                      </button>
                    </>
                  )}
                  
                  {application.status === 'reviewed' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'interview')}
                        className={`${fontSizes.button} bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors`}
                      >
                        Zainteresuj
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        className={`${fontSizes.button} bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors`}
                      >
                        Odrzuć
                      </button>
                    </>
                  )}
                  
                  {application.status === 'interview' && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'accepted')}
                        className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors`}
                      >
                        Zaakceptuj
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        className={`${fontSizes.button} bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors`}
                      >
                        Odrzuć
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobOfferApplications.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
            <FileIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className={`${fontSizes.text} text-gray-500`}>
              {selectedJobOffer ? 'Brak aplikacji dla tej oferty' : 'Brak aplikacji'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: BriefcaseIcon },
              { id: 'jobs', label: 'Moje oferty', icon: BriefcaseIcon },
              { id: 'applications', label: 'Aplikacje', icon: FileIcon },
              { id: 'events', label: 'Wydarzenia', icon: CalendarIcon }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'jobs' && renderMyJobs()}
        {(activeTab === 'applications' || selectedJobOffer) && renderApplications()}
        {activeTab === 'events' && (
          <div className="text-center py-8">
            <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className={`${fontSizes.text} text-gray-500`}>Sekcja wydarzeń w budowie</p>
          </div>
        )}
      </div>
      
      {/* Expiry Management Modal */}
      {showExpiryModal && (
        <ExpiryManagementModal
          jobOffer={myJobOffers.find(job => job.id === showExpiryModal)!}
          darkMode={darkMode}
          fontSize={fontSize}
          onClose={() => setShowExpiryModal(null)}
          onExtended={() => {
            setMyJobOffers(exampleDataService.getJobOffers());
            setShowExpiryModal(null);
          }}
        />
      )}
    </div>
  );
};

export default CompanyDashboard;