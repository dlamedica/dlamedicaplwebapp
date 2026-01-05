import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const LockIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
    <path
      d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

