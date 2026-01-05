import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CheckCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path
      d="M8 12L11 15L16 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

