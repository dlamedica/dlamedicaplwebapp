import React, { useState, useEffect } from 'react';
import { FaHeart, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaBuilding, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getUserFavorites, removeFromFavorites, FavoriteWithJobOffer } from '../../lib/api/favorites';
import FavoriteButton from '../job-offers/FavoriteButton';

interface FavoritesPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ darkMode, fontSize }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteWithJobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    document.title = 'Ulubione oferty pracy | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        'content',
        'Twoje ulubione oferty pracy w branży medycznej. Zarządzaj swoimi zapisanymi ofertami.'
      );
    }

    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getUserFavorites();

    if (fetchError) {
      console.error('Error fetching favorites:', fetchError);
      setError('Nie udało się załadować ulubionych ofert');
    } else {
      setFavorites(data);
    }

    setLoading(false);
  };

  const handleRemoveFavorite = async (jobOfferId: string) => {
    const { error } = await removeFromFavorites(jobOfferId);
    
    if (error) {
      console.error('Error removing favorite:', error);
      alert('Nie udało się usunąć z ulubionych');
    } else {
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.job_offer_id !== jobOfferId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              ❤️
            </div>
            <h1 className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Zaloguj się, aby zobaczyć ulubione
            </h1>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              Musisz być zalogowany, aby zarządzać ulubionymi ofertami pracy.
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
            <FaHeart className={`text-red-500 mr-3 ${fontSizes.subtitle}`} />
            <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ulubione oferty pracy
            </h1>
          </div>
          <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Zarządzaj swoimi ulubionymi ofertami pracy w branży medycznej
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie ulubionych ofert...
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
              onClick={fetchFavorites}
              className={`mt-4 px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors duration-200 bg-red-600 text-white hover:bg-red-700`}
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-12">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              💼
            </div>
            <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nie masz jeszcze ulubionych ofert
            </h3>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              Przeglądaj oferty pracy i dodawaj je do ulubionych, klikając ikonę serca.
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

        {/* Favorites List */}
        {!loading && !error && favorites.length > 0 && (
          <div className="space-y-6">
            <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Znaleziono {favorites.length} {favorites.length === 1 ? 'ulubioną ofertę' : 'ulubionych ofert'}
            </div>

            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => openJobDetail(favorite.job_offer_id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className={`${fontSizes.cardTitle} font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {favorite.job_offers.position}
                    </h3>
                    <div className={`flex items-center ${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      <FaBuilding className="mr-2" />
                      {favorite.job_offers.company}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FavoriteButton
                      jobOfferId={favorite.job_offer_id}
                      darkMode={darkMode}
                      size="medium"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(favorite.job_offer_id);
                      }}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        darkMode 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                      }`}
                      title="Usuń z ulubionych"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className={`flex items-center ${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaMapMarkerAlt className="mr-2 text-[#38b6ff]" />
                    {favorite.job_offers.location}
                  </div>
                  <div className={`flex items-center ${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaCalendarAlt className="mr-2 text-[#38b6ff]" />
                    {formatDate(favorite.job_offers.posted_date)}
                  </div>
                  {favorite.job_offers.salary && (
                    <div className={`flex items-center ${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FaMoneyBillWave className="mr-2 text-[#38b6ff]" />
                      {favorite.job_offers.salary}
                    </div>
                  )}
                </div>

                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
                  {favorite.job_offers.description.length > 200 
                    ? `${favorite.job_offers.description.substring(0, 200)}...`
                    : favorite.job_offers.description
                  }
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {favorite.job_offers.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {favorite.job_offers.contract_type}
                    </span>
                  </div>
                  
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Dodano {formatDate(favorite.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Job Offers */}
        {!loading && favorites.length > 0 && (
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

export default FavoritesPage;