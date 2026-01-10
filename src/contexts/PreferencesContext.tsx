/**
 * Kontekst preferencji użytkownika
 * Synchronizacja dark mode, high contrast, font size z bazą danych
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Preferences {
  dark_mode: boolean;
  high_contrast: boolean;
  font_size: 'small' | 'medium' | 'large';
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sound_enabled: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  loading: boolean;
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  updatePreference: (key: keyof Preferences, value: any) => Promise<void>;
  syncPreferences: () => Promise<void>;
}

const defaultPreferences: Preferences = {
  dark_mode: false,
  high_contrast: false,
  font_size: 'medium',
  language: 'pl',
  notifications_enabled: true,
  email_notifications: true,
  sound_enabled: true
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(() => {
    // Inicjalizacja z localStorage dla niezalogowanych
    const saved = localStorage.getItem('preferences');
    if (saved) {
      try {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });
  const [loading, setLoading] = useState(false);

  // Pomocnicza funkcja do API calls
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('access_token');
    const sessionId = localStorage.getItem('session_id');

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(sessionId && { 'X-Session-ID': sessionId }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, []);

  // Pobierz preferencje z serwera po zalogowaniu
  const syncPreferences = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await apiCall('/preferences');
      if (data.success && data.preferences) {
        const serverPrefs = {
          dark_mode: data.preferences.dark_mode ?? defaultPreferences.dark_mode,
          high_contrast: data.preferences.high_contrast ?? defaultPreferences.high_contrast,
          font_size: data.preferences.font_size ?? defaultPreferences.font_size,
          language: data.preferences.language ?? defaultPreferences.language,
          notifications_enabled: data.preferences.notifications_enabled ?? defaultPreferences.notifications_enabled,
          email_notifications: data.preferences.email_notifications ?? defaultPreferences.email_notifications,
          sound_enabled: data.preferences.sound_enabled ?? defaultPreferences.sound_enabled,
        };
        setPreferences(serverPrefs);
        localStorage.setItem('preferences', JSON.stringify(serverPrefs));
      }
    } catch (error) {
      console.warn('Could not sync preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, apiCall]);

  // Sync przy zmianie stanu autoryzacji
  useEffect(() => {
    if (isAuthenticated && user) {
      syncPreferences();
    }
  }, [isAuthenticated, user, syncPreferences]);

  // Aktualizuj pojedynczą preferencję
  const updatePreference = useCallback(async (key: keyof Preferences, value: any) => {
    // Optymistyczna aktualizacja UI
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('preferences', JSON.stringify(updated));
      return updated;
    });

    // Sync z serwerem jeśli zalogowany
    if (isAuthenticated) {
      try {
        await apiCall('/preferences', {
          method: 'PATCH',
          body: JSON.stringify({ key, value }),
        });
      } catch (error) {
        console.warn('Could not sync preference to server:', error);
      }
    }
  }, [isAuthenticated, apiCall]);

  // Convenience methods
  const toggleDarkMode = useCallback(() => {
    updatePreference('dark_mode', !preferences.dark_mode);
  }, [preferences.dark_mode, updatePreference]);

  const toggleHighContrast = useCallback(() => {
    updatePreference('high_contrast', !preferences.high_contrast);
  }, [preferences.high_contrast, updatePreference]);

  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    updatePreference('font_size', size);
  }, [updatePreference]);

  // Aplikuj dark mode do dokumentu
  useEffect(() => {
    if (preferences.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.dark_mode]);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        darkMode: preferences.dark_mode,
        highContrast: preferences.high_contrast,
        fontSize: preferences.font_size,
        toggleDarkMode,
        toggleHighContrast,
        setFontSize,
        updatePreference,
        syncPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
