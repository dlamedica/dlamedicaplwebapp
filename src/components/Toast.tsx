import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
  darkMode: boolean;
}

export const ToastComponent: React.FC<ToastProps> = ({ toast, onClose, darkMode }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return darkMode ? 'bg-green-900 bg-opacity-30 border-green-700' : 'bg-green-50 border-green-200';
      case 'error':
        return darkMode ? 'bg-red-900 bg-opacity-30 border-red-700' : 'bg-red-50 border-red-200';
      case 'info':
        return darkMode ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200';
      case 'warning':
        return darkMode ? 'bg-yellow-900 bg-opacity-30 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      default:
        return darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'error':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'info':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      default:
        return darkMode ? 'text-white' : 'text-gray-900';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 animate-slide-in ${getBgColor()}`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className={`flex-1 text-sm font-medium ${getTextColor()}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={`flex-shrink-0 p-1 rounded transition-colors ${
          darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
        }`}
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  darkMode: boolean;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose, darkMode }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onClose={onClose}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

