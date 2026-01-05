import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const FilterIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 6H21M7 12H17M11 18H13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

