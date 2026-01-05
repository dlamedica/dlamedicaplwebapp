// 🎨 UNIKALNY SYSTEM IKON - Wszystkie ikony stworzone od podstaw, bez gotowych bibliotek

import React from 'react';

interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

// Bazowy komponent ikony z unikalnym stylem
const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 2,
  children,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {children}
    </svg>
  );
};

// 🎨 UNIKALNE IKONY - Stworzone od podstaw z unikalnym stylem medycznym

export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="15" x2="16" y2="15" />
  </BaseIcon>
);

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <circle cx="12" cy="15" r="1.5" />
  </BaseIcon>
);

export const FileIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </BaseIcon>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </BaseIcon>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </BaseIcon>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </BaseIcon>
);

export const StarIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </BaseIcon>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </BaseIcon>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </BaseIcon>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </BaseIcon>
);

export const MapMarkerIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </BaseIcon>
);

export const PhoneIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </BaseIcon>
);

export const EnvelopeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </BaseIcon>
);

export const GraduationCapIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </BaseIcon>
);

export const IdCardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="14" y2="16" />
    <circle cx="18" cy="8" r="2" />
  </BaseIcon>
);

export const BirthdayCakeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2v20M8 2v20M16 2v20" />
    <path d="M4 8h16M4 12h16M4 16h16" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="12" cy="6" r="1" fill="currentColor" />
    <circle cx="18" cy="6" r="1" fill="currentColor" />
  </BaseIcon>
);

export const BuildingIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <line x1="9" y1="9" x2="9" y2="9" />
    <line x1="9" y1="12" x2="9" y2="12" />
    <line x1="9" y1="15" x2="9" y2="15" />
    <line x1="9" y1="18" x2="9" y2="18" />
  </BaseIcon>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </BaseIcon>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </BaseIcon>
);

export const TimesIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </BaseIcon>
);

export const ExclamationTriangleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
);

export const BellIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <circle cx="18" cy="8" r="1" fill="currentColor" />
  </BaseIcon>
);

export const MoneyBillIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <line x1="6" y1="10" x2="6.01" y2="10" />
    <line x1="6" y1="14" x2="6.01" y2="14" />
    <line x1="18" y1="10" x2="18.01" y2="10" />
    <line x1="18" y1="14" x2="18.01" y2="14" />
  </BaseIcon>
);

export const UsersIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
);

export const NotesMedicalIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </BaseIcon>
);

export const RedoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21.5 2v6h-6M2.5 12a9 9 0 0 1 13-8M21.5 8v6h-6" />
  </BaseIcon>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </BaseIcon>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </BaseIcon>
);

export const CogIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </BaseIcon>
);

// Dodatkowe ikony dla UserDashboard
export const HeartFilledIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </BaseIcon>
);

