import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Własne ikony stworzone od podstaw - unikalny design dla DlaMedica.pl

export const CustomCalculatorIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="32" height="36" rx="4" fill={color} opacity="0.1"/>
    <rect x="8" y="6" width="32" height="36" rx="4" stroke={color} strokeWidth="2"/>
    <rect x="12" y="12" width="24" height="8" rx="2" fill={color} opacity="0.2"/>
    <circle cx="18" cy="28" r="3" fill={color}/>
    <circle cx="24" cy="28" r="3" fill={color}/>
    <circle cx="30" cy="28" r="3" fill={color}/>
    <circle cx="18" cy="34" r="3" fill={color}/>
    <circle cx="24" cy="34" r="3" fill={color}/>
    <circle cx="30" cy="34" r="3" fill={color}/>
    <rect x="36" y="28" width="6" height="12" rx="2" fill={color}/>
  </svg>
);

export const CustomBriefcaseIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="28" height="24" rx="2" fill={color} opacity="0.1"/>
    <rect x="10" y="14" width="28" height="24" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 14V10C16 7.79086 17.7909 6 20 6H28C30.2091 6 32 7.79086 32 10V14" stroke={color} strokeWidth="2"/>
    <line x1="24" y1="20" x2="24" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="18" y1="26" x2="30" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CustomUsersIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="14" r="6" fill={color} opacity="0.2"/>
    <circle cx="16" cy="14" r="6" stroke={color} strokeWidth="2"/>
    <path d="M8 32C8 26.4772 11.5817 22 16 22C20.4183 22 24 26.4772 24 32" stroke={color} strokeWidth="2"/>
    <circle cx="32" cy="14" r="6" fill={color} opacity="0.2"/>
    <circle cx="32" cy="14" r="6" stroke={color} strokeWidth="2"/>
    <path d="M24 32C24 26.4772 27.5817 22 32 22C36.4183 22 40 26.4772 40 32" stroke={color} strokeWidth="2"/>
  </svg>
);

export const CustomNewspaperIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="2" fill={color} opacity="0.1"/>
    <rect x="8" y="8" width="32" height="32" rx="2" stroke={color} strokeWidth="2"/>
    <line x1="14" y1="16" x2="34" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="22" x2="34" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="28" x2="26" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <rect x="28" y="28" width="6" height="6" rx="1" fill={color} opacity="0.3"/>
  </svg>
);

export const CustomChartIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="2" fill={color} opacity="0.1"/>
    <rect x="8" y="8" width="32" height="32" rx="2" stroke={color} strokeWidth="2"/>
    <line x1="14" y1="32" x2="14" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="20" y1="32" x2="20" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="26" y1="32" x2="26" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="32" y1="32" x2="32" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const CustomArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L10 8L6 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CustomStarIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#fbbf24', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill={filled ? color : 'none'} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0L10.163 5.52786L16 6.11146L11.8541 9.52786L13.0557 15.4721L8 12.5L2.94427 15.4721L4.1459 9.52786L0 6.11146L5.83697 5.52786L8 0Z" stroke={color} strokeWidth={filled ? 0 : 1.5}/>
  </svg>
);

export const CustomQuoteIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 20C16 16 18 14 22 14C24 14 26 15 26 17C26 19 24 21 22 21C20 21 18 20 18 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 20C32 16 34 14 38 14C40 14 42 15 42 17C42 19 40 21 38 21C36 21 34 20 34 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 28C12 24 14 22 18 22C20 22 22 23 22 25C22 27 20 29 18 29C16 29 14 28 14 26" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CustomShoppingBagIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="14" width="24" height="28" rx="2" fill={color} opacity="0.1"/>
    <rect x="12" y="14" width="24" height="28" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 14V10C16 7.79086 17.7909 6 20 6H28C30.2091 6 32 7.79086 32 10V14" stroke={color} strokeWidth="2"/>
    <circle cx="20" cy="28" r="2" fill={color}/>
    <circle cx="28" cy="28" r="2" fill={color}/>
  </svg>
);

export const CustomTagIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#ef4444' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H8L14 8L8 14H2V2Z" fill={color}/>
    <circle cx="6" cy="6" r="1.5" fill="white"/>
  </svg>
);

export const CustomCalendarIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="12" height="11" rx="1" fill={color} opacity="0.1"/>
    <rect x="2" y="3" width="12" height="11" rx="1" stroke={color} strokeWidth="1.5"/>
    <line x1="5" y1="1" x2="5" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11" y1="1" x2="11" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1.5"/>
    <circle cx="6" cy="10" r="0.8" fill={color}/>
    <circle cx="10" cy="10" r="0.8" fill={color}/>
  </svg>
);

export const CustomMapMarkerIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C5.23858 0 3 2.23858 3 5C3 9 8 16 8 16C8 16 13 9 13 5C13 2.23858 10.7614 0 8 0Z" fill={color} opacity="0.2"/>
    <path d="M8 0C5.23858 0 3 2.23858 3 5C3 9 8 16 8 16C8 16 13 9 13 5C13 2.23858 10.7614 0 8 0Z" stroke={color} strokeWidth="1.5"/>
    <circle cx="8" cy="5" r="2" fill={color}/>
  </svg>
);

export const CustomVideoIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="10" height="10" rx="1" fill={color} opacity="0.1"/>
    <rect x="2" y="3" width="10" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
    <path d="M12 5L14 6V10L12 11V5Z" fill={color}/>
  </svg>
);

export const CustomQuestionIcon: React.FC<IconProps> = ({ className = '', size = 20, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" fill={color} opacity="0.1"/>
    <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5"/>
    <circle cx="10" cy="7" r="1.5" fill={color}/>
    <path d="M10 11V14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 14H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CustomChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#6b7280' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CustomChevronUpIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#6b7280' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10L8 6L12 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CustomSpinnerIcon: React.FC<IconProps> = ({ className = '', size = 24, color = '#38b6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeOpacity="0.2"/>
    <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12" stroke={color} strokeWidth="2" strokeLinecap="round">
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1s"
        repeatCount="indefinite"
        values="0 12 12;360 12 12"
      />
    </path>
  </svg>
);

