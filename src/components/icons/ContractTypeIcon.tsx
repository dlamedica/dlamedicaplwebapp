import React from 'react';

interface ContractTypeIconProps {
  className?: string;
  size?: number;
}

const ContractTypeIcon: React.FC<ContractTypeIconProps> = ({ 
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
      {/* Document/Contract */}
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Document corner fold */}
      <path
        d="M14 2v6h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Medical cross stamp/seal */}
      <circle
        cx="12"
        cy="15"
        r="3"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.6"
      />
      <path
        d="M12 13v4m-2-2h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Text lines */}
      <path
        d="M8 11h2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M8 19h8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Signature line */}
      <path
        d="M8 21h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
};

export default ContractTypeIcon;