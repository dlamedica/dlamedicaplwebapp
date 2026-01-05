import React, { memo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  darkMode?: boolean;
  footer?: React.ReactNode;
}

/**
 * Reusable Modal component
 * Optimized with React.memo
 */
const Modal: React.FC<ModalProps> = memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  darkMode = false,
  footer,
}) => {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  if (!isOpen) return null;

  const sizeStyles: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          darkMode ? 'bg-black/75' : 'bg-black/50'
        } transition-opacity`}
      />

      {/* Modal */}
      <div
        className={`relative ${sizeStyles[size]} w-full ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {title && (
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`ml-auto p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={`px-6 py-4 ${
            darkMode ? 'text-gray-200' : 'text-gray-900'
          }`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`px-6 py-4 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Portal to body
  return createPortal(modalContent, document.body);
}, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.title === nextProps.title &&
    prevProps.size === nextProps.size &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.children === nextProps.children
  );
});

Modal.displayName = 'Modal';

export default Modal;

