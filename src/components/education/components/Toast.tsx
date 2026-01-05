import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, TimesCircleIcon, InfoCircleIcon, WarningIcon, TimesIcon } from '../../icons/PlatformIcons';

const InfoIcon = InfoCircleIcon;
import './toastStyles.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
  darkMode?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  darkMode = false,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    const iconSize = 20;
    switch (type) {
      case 'success':
        return <CheckCircleIcon size={iconSize} className="text-green-500" />;
      case 'error':
        return <TimesCircleIcon size={iconSize} className="text-red-500" />;
      case 'info':
        return <InfoIcon size={iconSize} className="text-blue-500" />;
      case 'warning':
        return <WarningIcon size={iconSize} className="text-yellow-500" />;
      default:
        return <InfoIcon size={iconSize} className="text-blue-500" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: darkMode
            ? 'bg-gradient-to-r from-green-900/90 to-emerald-900/90 border-green-500/50'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          text: darkMode ? 'text-green-100' : 'text-green-800',
          iconBg: 'bg-green-500/20',
        };
      case 'error':
        return {
          bg: darkMode
            ? 'bg-gradient-to-r from-red-900/90 to-rose-900/90 border-red-500/50'
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200',
          text: darkMode ? 'text-red-100' : 'text-red-800',
          iconBg: 'bg-red-500/20',
        };
      case 'info':
        return {
          bg: darkMode
            ? 'bg-gradient-to-r from-blue-900/90 to-cyan-900/90 border-blue-500/50'
            : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200',
          text: darkMode ? 'text-blue-100' : 'text-blue-800',
          iconBg: 'bg-blue-500/20',
        };
      case 'warning':
        return {
          bg: darkMode
            ? 'bg-gradient-to-r from-yellow-900/90 to-amber-900/90 border-yellow-500/50'
            : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200',
          text: darkMode ? 'text-yellow-100' : 'text-yellow-800',
          iconBg: 'bg-yellow-500/20',
        };
      default:
        return {
          bg: darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200',
          text: darkMode ? 'text-gray-100' : 'text-gray-800',
          iconBg: 'bg-gray-500/20',
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const styles = getTypeStyles();
  const positionClass = getPositionStyles();

  return (
    <div
      className={`education-toast ${isVisible && !isLeaving ? 'toast-visible' : 'toast-hidden'} ${positionClass} fixed z-50 max-w-md`}
    >
      <div
        className={`${styles.bg} border-2 rounded-xl p-4 shadow-2xl education-glass backdrop-blur-sm flex items-start gap-3 min-w-[300px]`}
      >
        {/* Icon */}
        <div className={`${styles.iconBg} p-2 rounded-lg flex-shrink-0`}>
          {getIcon()}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={`${styles.text} font-medium text-sm leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-black/5 text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Zamknij"
        >
          <TimesIcon size={16} />
        </button>

        {/* Progress Bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-xl overflow-hidden">
            <div
              className={`h-full ${
                type === 'success'
                  ? 'bg-green-500'
                  : type === 'error'
                  ? 'bg-red-500'
                  : type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              } toast-progress`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;

