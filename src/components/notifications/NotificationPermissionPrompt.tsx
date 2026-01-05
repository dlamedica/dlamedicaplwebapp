import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface NotificationPermissionPromptProps {
  darkMode: boolean;
  onDismiss?: () => void;
}

const NotificationPermissionPrompt: React.FC<NotificationPermissionPromptProps> = ({
  darkMode,
  onDismiss,
}) => {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już wcześniej odrzucił prompt
    const dismissed = localStorage.getItem('notification_prompt_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Pokaż prompt tylko jeśli:
    // 1. Powiadomienia są obsługiwane
    // 2. Uprawnienie nie zostało jeszcze udzielone
    // 3. Użytkownik nie odrzucił promptu
    if (isSupported && permission === 'default' && !isDismissed) {
      // Pokaż po 3 sekundach od załadowania strony
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission, isDismissed]);

  const handleAllow = async () => {
    const granted = await requestPermission();
    if (granted) {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('notification_prompt_dismissed', 'true');
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible || !isSupported || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <div className={`rounded-lg shadow-xl p-4 ${
        darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 p-2 rounded-full ${
            darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-100'
          }`}>
            <FaBell className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold mb-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Włącz powiadomienia
            </h3>
            <p className={`text-sm mb-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Otrzymuj powiadomienia o promocjach, nowościach i statusie zamówień.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                }`}
              >
                Włącz
              </button>
              <button
                onClick={handleDismiss}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionPrompt;

