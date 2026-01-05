import React from 'react';
import { FaCrown } from 'react-icons/fa';

interface PremiumFeatureBadgeProps {
  darkMode?: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const PremiumFeatureBadge: React.FC<PremiumFeatureBadgeProps> = ({ 
  darkMode = false, 
  size = 'medium', 
  showText = true,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3',
          text: 'text-xs'
        };
      case 'large':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'w-5 h-5',
          text: 'text-base'
        };
      default:
        return {
          container: 'px-3 py-1 text-sm',
          icon: 'w-4 h-4',
          text: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-semibold
      ${darkMode 
        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-100' 
        : 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900'
      }
      ${sizeClasses.container}
      ${className}
    `}>
      <FaCrown className={`${sizeClasses.icon} ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`} />
      {showText && <span className={sizeClasses.text}>Premium</span>}
    </span>
  );
};

export default PremiumFeatureBadge;