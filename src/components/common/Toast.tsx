import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  darkMode?: boolean;
}

/**
 * Individual Toast component
 */
const Toast: React.FC<ToastProps> = memo(({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  position = 'top-right',
  darkMode = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const typeStyles: Record<ToastType, { bg: string; icon: string; text: string }> = {
    success: {
      bg: darkMode ? 'bg-green-800' : 'bg-green-50',
      icon: 'text-green-500',
      text: darkMode ? 'text-green-200' : 'text-green-800',
    },
    error: {
      bg: darkMode ? 'bg-red-800' : 'bg-red-50',
      icon: 'text-red-500',
      text: darkMode ? 'text-red-200' : 'text-red-800',
    },
    warning: {
      bg: darkMode ? 'bg-yellow-800' : 'bg-yellow-50',
      icon: 'text-yellow-500',
      text: darkMode ? 'text-yellow-200' : 'text-yellow-800',
    },
    info: {
      bg: darkMode ? 'bg-blue-800' : 'bg-blue-50',
      icon: 'text-blue-500',
      text: darkMode ? 'text-blue-200' : 'text-blue-800',
    },
  };

  const positionStyles: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2'
      }`}
    >
      <div
        className={`${styles.bg} ${styles.text} rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-start gap-3`}
      >
        {/* Icon */}
        <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
          {type === 'success' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {type === 'error' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${styles.text} opacity-70 hover:opacity-100 transition-opacity`}
          aria-label="Close toast"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.type === nextProps.type &&
    prevProps.duration === nextProps.duration &&
    prevProps.position === nextProps.position &&
    prevProps.darkMode === nextProps.darkMode
  );
});

Toast.displayName = 'Toast';

export default Toast;

