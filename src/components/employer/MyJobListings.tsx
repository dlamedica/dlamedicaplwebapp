import React, { useState, useEffect } from 'react';
import { getJobOffers, updateJobOffer, deleteJobOffer, JobOffer } from '../../lib/api/job-offers';

interface MyJobListingsProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface JobOfferWithStats extends JobOffer {
  applications: number;
  views: number;
  status: 'active' | 'paused' | 'expired';
}

const MyJobListings: React.FC<MyJobListingsProps> = ({ darkMode, fontSize }) => {
  const [jobOffers, setJobOffers] = useState<JobOfferWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<JobOfferWithStats | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'applications' | 'views'>('date');

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  useEffect(() => {
    fetchJobOffers();
  }, []);

  const fetchJobOffers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getJobOffers();
      if (error) {
        console.error('Error fetching job offers:', error);
      } else if (data) {
        // Add mock stats - in real app, this would come from API
        const offersWithStats: JobOfferWithStats[] = data.map(offer => ({
          ...offer,
          applications: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 500) + 50,
          status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'paused' : 'expired'
        }));
        setJobOffers(offersWithStats);
      }
    } catch (error) {
      console.error('Error fetching job offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (offerId: string, newStatus: 'active' | 'paused') => {
    try {
      // In a real app, you'd update the status in the database
      setJobOffers(prev => 
        prev.map(offer => 
          offer.id === offerId ? { ...offer, status: newStatus } : offer
        )
      );
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę ofertę? Ta akcja jest nieodwracalna.')) {
      return;
    }

    try {
      const result = await deleteJobOffer(offerId);
      if (result.success) {
        setJobOffers(prev => prev.filter(offer => offer.id !== offerId));
      } else {
        alert('Błąd podczas usuwania oferty: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting job offer:', error);
      alert('Wystąpił błąd podczas usuwania oferty');
    }
  };

  const getFilteredAndSortedOffers = () => {
    let filteredOffers = jobOffers;
    
    if (filter !== 'all') {
      filteredOffers = jobOffers.filter(offer => offer.status === filter);
    }

    return filteredOffers.sort((a, b) => {
      switch (sortBy) {
        case 'applications':
          return b.applications - a.applications;
        case 'views':
          return b.views - a.views;
        case 'date':
        default:
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktywna';
      case 'paused':
        return 'Wstrzymana';
      case 'expired':
        return 'Wygasła';
      default:
        return 'Nieznany';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto"></div>
        <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Ładowanie ofert pracy...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${
            fontSize === 'large' ? 'text-2xl' : fontSize === 'medium' ? 'text-xl' : 'text-lg'
          }`}>
            Moje oferty pracy
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
            Zarządzaj swoimi opublikowanymi ofertami
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
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
            <option value="all">Wszystkie oferty</option>
            <option value="active">Aktywne</option>
            <option value="paused">Wstrzymane</option>
            <option value="expired">Wygasłe</option>
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
            <option value="applications">Sortuj po aplikacjach</option>
            <option value="views">Sortuj po wyświetleniach</option>
          </select>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wszystkie oferty</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {jobOffers.length}
          </p>
        </div>
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aktywne</p>
          <p className={`text-2xl font-bold text-green-600`}>
            {jobOffers.filter(o => o.status === 'active').length}
          </p>
        </div>
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Łączne aplikacje</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {jobOffers.reduce((sum, offer) => sum + offer.applications, 0)}
          </p>
        </div>
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Łączne wyświetlenia</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {jobOffers.reduce((sum, offer) => sum + offer.views, 0).toLocaleString('pl-PL')}
          </p>
        </div>
      </div>

      {/* Job Offers List */}
      <div className="space-y-4">
        {getFilteredAndSortedOffers().length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📋
            </div>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
              Brak ofert do wyświetlenia
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
              {filter === 'all' 
                ? 'Nie masz jeszcze żadnych opublikowanych ofert pracy.' 
                : `Nie masz ofert o statusie "${getStatusText(filter).toLowerCase()}".`
              }
            </p>
          </div>
        ) : (
          getFilteredAndSortedOffers().map((offer) => (
            <div
              key={offer.id}
              className={`rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
                        {offer.position}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                        {offer.company} • {offer.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                      {getStatusText(offer.status)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#38b6ff] text-black rounded text-xs">
                      {offer.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {offer.contractType}
                    </span>
                    {offer.salary && (
                      <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {offer.salary}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aplikacje</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {offer.applications}
                      </p>
                    </div>
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wyświetlenia</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {offer.views}
                      </p>
                    </div>
                    <div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Opublikowana</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(offer.postedDate).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col lg:flex-row gap-2">
                  {offer.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange(offer.id, 'paused')}
                      className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                        darkMode 
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                      }`}
                    >
                      Wstrzymaj
                    </button>
                  ) : offer.status === 'paused' ? (
                    <button
                      onClick={() => handleStatusChange(offer.id, 'active')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Aktywuj
                    </button>
                  ) : null}

                  <button
                    onClick={() => {
                      setSelectedOffer(offer);
                      setShowEditModal(true);
                    }}
                    className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors text-sm"
                  >
                    Edytuj
                  </button>

                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Usuń
                  </button>

                  <button className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                  }`}>
                    Statystyki
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal (placeholder) */}
      {showEditModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
                Edytuj ofertę: {selectedOffer.position}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center py-8">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
                Formularz edycji oferty będzie tutaj zaimplementowany...
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                (Można wykorzystać JobPostingForm z predefiniowanymi danymi)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobListings;