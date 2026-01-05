import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CreditCardIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <path d="M2 9H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M6 15H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

