import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const BalanceScaleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2V22M12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2ZM12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20C14 18.8954 13.1046 18 12 18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 8L12 4L21 8M3 16L12 20L21 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

