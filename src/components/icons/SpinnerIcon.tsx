import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const SpinnerIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} animate-spin`}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="4"
      strokeOpacity="0.25"
    />
    <path
      d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="24"
    />
  </svg>
);

