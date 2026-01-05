import React, { useState, useEffect } from 'react';

interface ApplicationsManagerProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface JobApplication {
  id: string;
  jobOfferId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  experience: string;
  coverLetter: string;
  resumeUrl?: string;
  appliedDate: string;
  status: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  notes?: string;
  rating?: number;
}

const ApplicationsManager: React.FC<ApplicationsManagerProps> = ({ darkMode, fontSize }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'job' | 'status'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Mock data - in real app, this would come from API
  const mockApplications: JobApplication[] = [
    {
      id: '1',
      jobOfferId: 'job1',
      jobTitle: 'Lekarz internista',
      candidateName: 'Dr Anna Kowalska',
      candidateEmail: 'anna.kowalska@email.com',
      candidatePhone: '+48 123 456 789',
      experience: '8 lat doświadczenia w internii',
      coverLetter: 'Szanowni Państwo, jestem zainteresowana pracą na stanowisku lekarza internisty w Państwa placówce...',
      appliedDate: '2024-01-15T10:00:00Z',
      status: 'new',
      rating: 4
    },
    {
      id: '2',
      jobOfferId: 'job2',
      jobTitle: 'Pielęgniarka oddziałowa',
      candidateName: 'Magdalena Nowak',
      candidateEmail: 'magdalena.nowak@email.com',
      candidatePhone: '+48 987 654 321',
      experience: '12 lat doświadczenia w pielęgniarstwie',
      coverLetter: 'Witam, posiadam bogate doświadczenie w pracy pielęgniarskiej...',
      appliedDate: '2024-01-14T14:30:00Z',
      status: 'reviewed',
      notes: 'Kandydatka z bardzo dobrymi referencjami',
      rating: 5
    },
    {
      id: '3',
      jobOfferId: 'job1',
      jobTitle: 'Lekarz internista',
      candidateName: 'Dr Piotr Wiśniewski',
      candidateEmail: 'piotr.wisniewski@email.com',
      candidatePhone: '+48 555 123 456',
      experience: '5 lat doświadczenia w medycynie',
      coverLetter: 'Jestem młodym lekarzem z pasją do internii...',
      appliedDate: '2024-01-13T09:15:00Z',
      status: 'interview',
      notes: 'Umówiona rozmowa na piątek',
      rating: 4
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: JobApplication['status']) => {
    switch (status) {
      case 'new':
        return 'Nowa';
      case 'reviewed':
        return 'Przejrzana';
      case 'interview':
        return 'Rozmowa';
      case 'accepted':
        return 'Zaakceptowana';
      case 'rejected':
        return 'Odrzucona';
      default:
        return 'Nieznany';
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: JobApplication['status']) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleRatingChange = (applicationId: string, rating: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, rating } : app
      )
    );
  };

  const handleNotesChange = (applicationId: string, notes: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, notes } : app
      )
    );
  };

  const getFilteredAndSortedApplications = () => {
    let filteredApps = applications;

    if (filter !== 'all') {
      filteredApps = applications.filter(app => app.status === filter);
    }

    if (searchTerm) {
      filteredApps = filteredApps.filter(app =>
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredApps.sort((a, b) => {
      switch (sortBy) {
        case 'job':
          return a.jobTitle.localeCompare(b.jobTitle);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      }
    });
  };

  const renderStarRating = (application: JobApplication) => {
    const rating = application.rating || 0;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRatingChange(application.id, star)}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : darkMode ? 'text-gray-600' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto"></div>
        <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Ładowanie aplikacji...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${
            fontSize === 'large' ? 'text-2xl' : fontSize === 'medium' ? 'text-xl' : 'text-lg'
          }`}>
            Zarządzanie aplikacjami
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
            Przeglądaj i zarządzaj aplikacjami kandydatów
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Szukaj kandydatów..."
              className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
            />
            <svg className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
            } ${fontSizeClasses[fontSize]}`}
          >
            <option value="all">Wszystkie aplikacje</option>
            <option value="new">Nowe</option>
            <option value="reviewed">Przejrzane</option>
            <option value="interview">Rozmowy</option>
            <option value="accepted">Zaakceptowane</option>
            <option value="rejected">Odrzucone</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
            } ${fontSizeClasses[fontSize]}`}
          >
            <option value="date">Sortuj po dacie</option>
            <option value="job">Sortuj po stanowisku</option>
            <option value="status">Sortuj po statusie</option>
          </select>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { key: 'all', label: 'Wszystkie', color: 'text-gray-600' },
          { key: 'new', label: 'Nowe', color: 'text-blue-600' },
          { key: 'reviewed', label: 'Przejrzane', color: 'text-yellow-600' },
          { key: 'interview', label: 'Rozmowy', color: 'text-purple-600' },
          { key: 'accepted', label: 'Zaakceptowane', color: 'text-green-600' }
        ].map(stat => (
          <div key={stat.key} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.key === 'all' 
                ? applications.length 
                : applications.filter(app => app.status === stat.key).length
              }
            </p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {getFilteredAndSortedApplications().length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📄
            </div>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
              Brak aplikacji do wyświetlenia
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
              {searchTerm 
                ? `Nie znaleziono aplikacji pasujących do wyszukiwania "${searchTerm}".`
                : filter === 'all' 
                  ? 'Nie otrzymałeś jeszcze żadnych aplikacji.'
                  : `Nie masz aplikacji o statusie "${getStatusText(filter as any).toLowerCase()}".`
              }
            </p>
          </div>
        ) : (
          getFilteredAndSortedApplications().map((application) => (
            <div
              key={application.id}
              className={`rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
                        {application.candidateName}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                        Aplikacja na: {application.jobTitle}
                      </p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                        {application.candidateEmail} • {application.candidatePhone}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Doświadczenie</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {application.experience}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data aplikacji</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(application.appliedDate).toLocaleDateString('pl-PL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ocena</p>
                      {renderStarRating(application)}
                    </div>
                  </div>

                  {application.notes && (
                    <div className={`p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Notatki:
                      </p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {application.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowDetailModal(true);
                    }}
                    className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors text-sm"
                  >
                    Zobacz szczegóły
                  </button>

                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value as JobApplication['status'])}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
                    }`}
                  >
                    <option value="new">Nowa</option>
                    <option value="reviewed">Przejrzana</option>
                    <option value="interview">Rozmowa</option>
                    <option value="accepted">Zaakceptowana</option>
                    <option value="rejected">Odrzucona</option>
                  </select>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs">
                      Kontakt
                    </button>
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs">
                      CV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
                Szczegóły aplikacji - {selectedApplication.candidateName}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Candidate Info */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Informacje o kandydacie
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Imię i nazwisko:</span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedApplication.candidateName}</span>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email:</span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedApplication.candidateEmail}</span>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Telefon:</span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedApplication.candidatePhone}</span>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Doświadczenie:</span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedApplication.experience}</span>
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Informacje o stanowisku
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stanowisko:</span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedApplication.jobTitle}</span>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status aplikacji:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusText(selectedApplication.status)}
                    </span>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data aplikacji:</span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(selectedApplication.appliedDate).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ocena:</span>
                    <span className="ml-2">{renderStarRating(selectedApplication)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mt-6">
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                List motywacyjny
              </h4>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-line`}>
                  {selectedApplication.coverLetter}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notatki
              </h4>
              <textarea
                value={selectedApplication.notes || ''}
                onChange={(e) => handleNotesChange(selectedApplication.id, e.target.value)}
                placeholder="Dodaj notatki o kandydacie..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
                }`}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Zaakceptuj kandydaturę
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Umów rozmowę
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Wyślij wiadomość
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Odrzuć kandydaturę
              </button>
              <button className={`px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
              }`}>
                Pobierz CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManager;