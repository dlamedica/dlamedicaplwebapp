import React from 'react';

interface ExperienceIconProps {
  className?: string;
  size?: number;
}

const ExperienceIcon: React.FC<ExperienceIconProps> = ({ 
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
      {/* Medical briefcase/bag */}
      <path
        d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Medical cross on briefcase */}
      <path
        d="M12 11v6m-3-3h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Experience stars */}
      <path
        d="M6 3l1 2 2-1-1 2 1 2-2-1-2 1 1-2-1-2 2 1z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M17 2l0.5 1 1-0.5-0.5 1 0.5 1-1-0.5-1 0.5 0.5-1-0.5-1 1 0.5z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M19 21l0.5 1 1-0.5-0.5 1 0.5 1-1-0.5-1 0.5 0.5-1-0.5-1 1 0.5z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
};

export default ExperienceIcon;