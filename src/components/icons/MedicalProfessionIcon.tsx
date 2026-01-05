import React from 'react';

interface MedicalProfessionIconProps {
  className?: string;
  size?: number;
}

const MedicalProfessionIcon: React.FC<MedicalProfessionIconProps> = ({ 
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
      {/* Stethoscope */}
      <path
        d="M19 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM17.7 10.7c-.4.4-.4 1 0 1.4l.3.3c.4.4 1 .4 1.4 0l.3-.3c.4-.4.4-1 0-1.4l-.3-.3c-.4-.4-1-.4-1.4 0l-.3.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3v4.5c0 1.38-1.12 2.5-2.5 2.5S3 8.88 3 7.5V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 3v4.5c0 1.38 1.12 2.5 2.5 2.5S18 8.88 18 7.5V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10v6c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.38 1.12-2.5 2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 10v1.5c0 2.76 2.24 5 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Medical cross on chest piece */}
      <path
        d="M2 17h2m0 0v2m0-2v-2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MedicalProfessionIcon;