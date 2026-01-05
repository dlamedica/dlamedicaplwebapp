import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites, isFavorite } from '../../lib/api/favorites';

interface FavoriteButtonProps {
  jobOfferId: string;
  darkMode: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  jobOfferId,
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

  // Check if job is favorited on component mount
  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    } else {
      setChecking(false);
    }
  }, [user, jobOfferId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    
    setChecking(true);
    const { isFavorite: favoriteStatus, error } = await isFavorite(jobOfferId);
    
    if (error) {
      console.error('Error checking favorite status:', error);
    } else {
      setIsFav(favoriteStatus);
    }
    
    setChecking(false);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login
      history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    setLoading(true);

    try {
      if (isFav) {
        // Remove from favorites
        const { error } = await removeFromFavorites(jobOfferId);
        if (error) {
          console.error('Error removing from favorites:', error);
          alert('Błąd podczas usuwania z ulubionych');
        } else {
          setIsFav(false);
        }
      } else {
        // Add to favorites
        const { error } = await addToFavorites(jobOfferId);
        if (error) {
          console.error('Error adding to favorites:', error);
          alert('Błąd podczas dodawania do ulubionych');
        } else {
          setIsFav(true);
        }
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
          <FaRegHeart />
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
          {isFav ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
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

export default FavoriteButton;