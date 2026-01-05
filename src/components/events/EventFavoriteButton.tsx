import React, { useState, useEffect } from 'react';
import { HeartIcon } from '../icons/CustomIcons';
import { useAuth } from '../../contexts/AuthContext';

interface EventFavoriteButtonProps {
  eventId: string | number;
  darkMode: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const EventFavoriteButton: React.FC<EventFavoriteButtonProps> = ({
  eventId,
  darkMode,
  size = 'medium',
  showText = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const sizeClasses = {
    small: {
      button: 'p-2',
      icon: 'text-sm',
      text: 'text-xs'
    },
    medium: {
      button: 'p-3',
      icon: 'text-base',
      text: 'text-sm'
    },
    large: {
      button: 'p-4',
      icon: 'text-lg',
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  // Sprawdź ulubione z localStorage (tymczasowe rozwiązanie)
  useEffect(() => {
    checkFavoriteStatus();
  }, [user, eventId]);

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
    const eventIdStr = String(eventId);
    setIsFav(favorites.includes(eventIdStr));
    setChecking(false);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Przekieruj do logowania
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    setLoading(true);

    try {
      const favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
      const eventIdStr = String(eventId);

      if (isFav) {
        // Usuń z ulubionych
        const updatedFavorites = favorites.filter((id: string) => id !== eventIdStr);
        localStorage.setItem('eventFavorites', JSON.stringify(updatedFavorites));
        setIsFav(false);
      } else {
        // Dodaj do ulubionych
        const updatedFavorites = [...favorites, eventIdStr];
        localStorage.setItem('eventFavorites', JSON.stringify(updatedFavorites));
        setIsFav(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Wystąpił błąd');
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <button
        disabled
        className={`${currentSize.button} rounded-lg transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800 text-gray-600' 
            : 'bg-gray-100 text-gray-400'
        } ${className}`}
      >
        <div className={`${currentSize.icon} animate-pulse`}>
          <HeartIcon size={size === 'small' ? 16 : size === 'large' ? 24 : 20} color="currentColor" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${currentSize.button} rounded-lg transition-all duration-200 
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isFav 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : darkMode 
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-red-400' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500'
        }
        ${className}
      `}
      title={
        !user 
          ? 'Zaloguj się, aby dodać do ulubionych'
          : isFav 
            ? 'Usuń z ulubionych' 
            : 'Dodaj do ulubionych'
      }
      aria-label={
        !user 
          ? 'Zaloguj się, aby dodać do ulubionych'
          : isFav 
            ? 'Usuń z ulubionych' 
            : 'Dodaj do ulubionych'
      }
    >
      <div className={`flex items-center ${showText ? 'space-x-2' : ''}`}>
        <div className={`${currentSize.icon} ${loading ? 'animate-pulse' : ''}`}>
          <HeartIcon 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            color={isFav ? '#ef4444' : 'currentColor'}
            filled={isFav}
          />
        </div>
        {showText && (
          <span className={currentSize.text}>
            {loading 
              ? '...' 
              : isFav 
                ? 'Usunięto' 
                : 'Dodaj'
            }
          </span>
        )}
      </div>
    </button>
  );
};

export default EventFavoriteButton;

