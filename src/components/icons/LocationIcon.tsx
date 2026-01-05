import React from 'react';

interface LocationIconProps {
  className?: string;
  size?: number;
}

const LocationIcon: React.FC<LocationIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hospital building with medical cross */}
      <path
        d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Medical cross */}
      <path
        d="M12 6v4m0 0v4m0-4h-3m6 0h-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Location pin marker */}
      <circle
        cx="18"
        cy="6"
        r="4"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M18 2c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="18"
        cy="6"
        r="1.5"
        fill="currentColor"
      />
      {/* Building windows */}
      <rect x="6" y="16" width="2" height="2" fill="currentColor" opacity="0.4" />
      <rect x="10" y="16" width="2" height="2" fill="currentColor" opacity="0.4" />
      <rect x="14" y="16" width="2" height="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
};

export default LocationIcon;