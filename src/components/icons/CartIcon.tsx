import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CartIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1046 17.8954 19 19 19C20.1046 19 21 18.1046 21 17C21 15.8954 20.1046 15 19 15C17.8954 15 17 15.8954 17 17V13M9 19C9 20.1046 9.89543 21 11 21C12.1046 21 13 20.1046 13 19C13 17.8954 12.1046 17 11 17C9.89543 17 9 17.8954 9 19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

