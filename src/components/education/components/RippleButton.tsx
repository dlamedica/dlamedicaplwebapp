import React, { MouseEvent, useState } from 'react';
import './rippleStyles.css';

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  darkMode?: boolean;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
  darkMode = false
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [rippleId, setRippleId] = useState(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: rippleId
    };

    setRipples(prev => [...prev, newRipple]);
    setRippleId(prev => prev + 1);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return darkMode
          ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white'
          : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white';
      case 'secondary':
        return darkMode
          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      case 'outline':
        return darkMode
          ? 'border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10'
          : 'border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10';
      default:
        return '';
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`ripple-button relative overflow-hidden ${getVariantClasses()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } transition-all duration-300 transform hover:scale-105 active:scale-95`}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`
          }}
        />
      ))}
    </button>
  );
};

export default RippleButton;

