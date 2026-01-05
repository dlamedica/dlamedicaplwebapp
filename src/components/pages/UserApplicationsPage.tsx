import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaEye, FaCheck, FaTimes, FaClock, FaTrash, FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getUserApplications, withdrawApplication, ApplicationWithJobOffer } from '../../lib/api/applications';

interface UserApplicationsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const UserApplicationsPage: React.FC<UserApplicationsPageProps> = ({ darkMode, fontSize }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn'>('all');

  const fontSizeClasses = {
    small: {
      title: 'text-2xl',
      subtitle: 'text-lg',
      cardTitle: 'text-lg',
      cardText: 'text-sm',
      buttonText: 'text-sm'
    },
    medium: {
      title: 'text-3xl',
      subtitle: 'text-xl',
      cardTitle: 'text-xl',
      cardText: 'text-base',
      buttonText: 'text-base'
    },
    large: {
      title: 'text-4xl',
      subtitle: 'text-2xl',
      cardTitle: 'text-2xl',
      cardText: 'text-lg',
      buttonText: 'text-lg'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  useEffect(() => {
    document.title = 'Moje aplikacje | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        'content',
        'Śledź status swoich aplikacji na pozycje medyczne. Zarządzaj aplikacjami na oferty pracy.'
      );
    }

    if (user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getUserApplications();

    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      setError('Nie udało się załadować aplikacji');
    } else {
      setApplications(data);
    }

    setLoading(false);
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Czy na pewno chcesz wycofać tę aplikację?')) {
      return;
    }

    const { error } = await withdrawApplication(applicationId);
    
    if (error) {
      console.error('Error withdrawing application:', error);
      alert('Nie udało się wycofać aplikacji');
    } else {
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'withdrawn' as const }
            : app
        )
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'reviewing':
        return <FaEye className="text-blue-500" />;
      case 'accepted':
        return <FaCheck className="text-green-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      case 'withdrawn':
        return <FaTrash className="text-gray-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Oczekująca';
      case 'reviewing':
        return 'W trakcie przeglądu';
      case 'accepted':
        return 'Zaakceptowana';
      case 'rejected':
        return 'Odrzucona';
      case 'withdrawn':
        return 'Wycofana';
      default:
        return 'Nieznany';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return darkMode ? 'bg-yellow-900/20 text-yellow-300 border-yellow-600' : 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'reviewing':
        return darkMode ? 'bg-blue-900/20 text-blue-300 border-blue-600' : 'bg-blue-50 text-blue-800 border-blue-200';
      case 'accepted':
        return darkMode ? 'bg-green-900/20 text-green-300 border-green-600' : 'bg-green-50 text-green-800 border-green-200';
      case 'rejected':
        return darkMode ? 'bg-red-900/20 text-red-300 border-red-600' : 'bg-red-50 text-red-800 border-red-200';
      case 'withdrawn':
        return darkMode ? 'bg-gray-800 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200';
      default:
        return darkMode ? 'bg-gray-800 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getFilterCount = (status: string) => {
    if (status === 'all') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  const openJobDetail = (jobOfferId: string) => {
    history.pushState({}, '', `/job/${jobOfferId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!user) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📄
            </div>
            <h1 className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Zaloguj się, aby zobaczyć aplikacje
            </h1>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              Musisz być zalogowany, aby zarządzać swoimi aplikacjami na oferty pracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`px-8 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
              >
                Zaloguj się
              </button>
              <button
                onClick={() => {
                  history.pushState({}, '', '/register');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`px-8 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 border-2 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                Zarejestruj się
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaPaperPlane className={`text-[#38b6ff] mr-3 ${fontSizes.subtitle}`} />
            <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Moje aplikacje
            </h1>
          </div>
          <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Śledź status swoich aplikacji na pozycje medyczne
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Wszystkie', count: getFilterCount('all') },
              { key: 'pending', label: 'Oczekujące', count: getFilterCount('pending') },
              { key: 'reviewing', label: 'W przegląd', count: getFilterCount('reviewing') },
              { key: 'accepted', label: 'Zaakceptowane', count: getFilterCount('accepted') },
              { key: 'rejected', label: 'Odrzucone', count: getFilterCount('rejected') },
              { key: 'withdrawn', label: 'Wycofane', count: getFilterCount('withdrawn') }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg ${fontSizes.buttonText} font-medium transition-colors duration-200 ${
                  filter === tab.key
                    ? 'bg-[#38b6ff] text-black'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie aplikacji...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-red-900/20 border border-red-600' : 'bg-red-50 border border-red-200'}`}>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
              {error}
            </p>
            <button
              onClick={fetchApplications}
              className={`mt-4 px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors duration-200 bg-red-600 text-white hover:bg-red-700`}
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📋
            </div>
            <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {filter === 'all' ? 'Nie masz jeszcze aplikacji' : `Brak aplikacji w kategorii "${getStatusText(filter)}"`}
            </h3>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              {filter === 'all' 
                ? 'Przeglądaj oferty pracy i aplikuj na interesujące Cię pozycje.'
                : 'Sprawdź inne kategorie lub przeglądaj nowe oferty pracy.'
              }
            </p>
            <button
              onClick={() => {
                history.pushState({}, '', '/job-offers');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`px-8 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
            >
              Przeglądaj oferty pracy
            </button>
          </div>
        )}

        {/* Applications List */}
        {!loading && !error && filteredApplications.length > 0 && (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 
                        className={`${fontSizes.cardTitle} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} cursor-pointer hover:text-[#38b6ff]`}
                        onClick={() => openJobDetail(application.job_offer_id)}
                      >
                        {application.job_offers.position}
                      </h3>
                    </div>
                    <div className={`flex items-center ${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <FaBuilding className="mr-2" />
                      {application.job_offers.company}
                    </div>
                    <div className={`flex items-center ${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FaMapMarkerAlt className="mr-2" />
                      {application.job_offers.location}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className={`${fontSizes.cardText} font-medium`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    
                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleWithdrawApplication(application.id)}
                        className={`px-3 py-1 ${fontSizes.buttonText} rounded-lg transition-colors ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-900/20' 
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        Wycofaj
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <FaCalendarAlt className="text-[#38b6ff]" />
                      <span>Data aplikacji:</span>
                    </div>
                    <div className="ml-6">{formatDate(application.created_at)}</div>
                  </div>
                  
                  {application.updated_at !== application.created_at && (
                    <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <FaClock className="text-[#38b6ff]" />
                        <span>Ostatnia aktualizacja:</span>
                      </div>
                      <div className="ml-6">{formatDate(application.updated_at)}</div>
                    </div>
                  )}
                </div>

                {application.cover_letter && (
                  <div className="mt-4">
                    <h4 className={`${fontSizes.cardText} font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      List motywacyjny:
                    </h4>
                    <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
                      {application.cover_letter.length > 200 
                        ? `${application.cover_letter.substring(0, 200)}...`
                        : application.cover_letter
                      }
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {application.job_offers.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {application.job_offers.contract_type}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => openJobDetail(application.job_offer_id)}
                    className={`px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors border-2 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                    }`}
                  >
                    Zobacz ofertę
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Job Offers */}
        {!loading && filteredApplications.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                history.pushState({}, '', '/job-offers');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`px-8 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 border-2 ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              Przeglądaj więcej ofert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserApplicationsPage;