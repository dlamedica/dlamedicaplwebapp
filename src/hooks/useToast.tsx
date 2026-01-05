import React, { useState, useCallback } from 'react';
import Toast from '../components/common/Toast';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Custom hook for toast notifications
 * 
 * @example
 * const { showToast, toasts } = useToast();
 * 
 * showToast('Success!', 'success');
 * showToast('Error occurred', 'error');
 */
export function useToast(position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right') {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 5000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => {
    if (toasts.length === 0) return null;

    return createPortal(
      <div>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
            position={position}
            darkMode={darkMode}
          />
        ))}
      </div>,
      document.body
    );
  }, [toasts, position, darkMode, removeToast]);

  return {
    showToast,
    toasts,
    ToastContainer,
    setDarkMode,
  };
}
