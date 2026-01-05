import React from 'react';

interface SalaryIconProps {
  className?: string;
  size?: number;
}

const SalaryIcon: React.FC<SalaryIconProps> = ({ 
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
      {/* Money/Banknotes stack */}
      <rect
        x="2"
        y="6"
        width="20"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <rect
        x="3"
        y="8"
        width="18"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <rect
        x="4"
        y="10"
        width="16"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* PLN symbol in center of top bill */}
      <text
        x="12"
        y="9"
        fontSize="6"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.7"
      >
        PLN
      </text>
      
      {/* Medical elements */}
      <circle
        cx="7"
        cy="13"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M7 12v2m-0.7-1h1.4"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      <circle
        cx="17"
        cy="13"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M17 12v2m-0.7-1h1.4"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      {/* Coins */}
      <circle
        cx="19"
        cy="18"
        r="2"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M19 17v2m-0.7-1h1.4"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
};

export default SalaryIcon;