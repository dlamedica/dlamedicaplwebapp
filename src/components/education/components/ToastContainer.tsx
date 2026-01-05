import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import { Toast as ToastType } from '../../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
  darkMode?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  darkMode = false,
  position = 'top-right',
}) => {
  if (toasts.length === 0) return null;

  const getContainerClasses = () => {
    const baseClasses = 'fixed z-50 pointer-events-none';
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };
    return `${baseClasses} ${positionClasses[position]}`;
  };

  const getFlexDirection = () => {
    return position.includes('bottom') ? 'flex-col-reverse' : 'flex-col';
  };

  return createPortal(
    <div className={getContainerClasses()}>
      <div className={`flex ${getFlexDirection()} gap-3 ${position.includes('right') ? 'items-end' : position.includes('left') ? 'items-start' : 'items-center'}`}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={onClose}
              darkMode={darkMode}
              position={position}
            />
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ToastContainer;

