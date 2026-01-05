import React from 'react';

interface PublicationDateIconProps {
  className?: string;
  size?: number;
}

const PublicationDateIcon: React.FC<PublicationDateIconProps> = ({ 
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
      {/* Calendar base */}
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Calendar header */}
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Calendar rings */}
      <path
        d="M8 2v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Date numbers with medical theme */}
      <circle
        cx="8"
        cy="14"
        r="1.5"
        fill="currentColor"
        opacity="0.3"
      />
      <text
        x="8"
        y="15"
        fontSize="4"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
      >
        15
      </text>
      
      {/* Medical cross on highlighted date */}
      <circle
        cx="16"
        cy="18"
        r="2"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 17v2m-1-1h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Clock for recent posts */}
      <circle
        cx="18"
        cy="6"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M18 5v1.5l1 1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* Additional date dots */}
      <circle cx="12" cy="14" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
};

export default PublicationDateIcon;