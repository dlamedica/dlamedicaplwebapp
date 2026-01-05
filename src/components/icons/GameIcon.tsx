import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Unikalna ikona gier - własny design
 */
export const GameIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
    <circle cx="8" cy="8" r="1.5" fill={color} />
    <circle cx="16" cy="8" r="1.5" fill={color} />
    <path
      d="M12 12L12 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 14L14 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

