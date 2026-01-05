import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Główne ikony SVG dla całej platformy DlaMedica.pl
 * Wszystkie ikony są stworzone specjalnie dla tej platformy i są unikalne
 * Styl zgodny z CategoryIcons.tsx - proste, minimalistyczne, wyraźne
 */

// ========== IKONY AKCJI I KONTROLI ==========

// Ikona zaznaczenia - Check (FaCheck)
export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona X - Times (FaTimes)
export const TimesIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona edycji - Edit (FaEdit)
export const EditIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona usuwania - Trash (FaTrash)
export const TrashIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona oka - Eye (FaEye)
export const EyeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

// Ikona oka przekreślonego - EyeSlash (FaEyeSlash)
export const EyeSlashIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65661 6 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1751 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 1L23 23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ========== IKONY NAWIGACJI ==========

// Ikona strzałki w dół - ChevronDown (FaChevronDown)
export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w górę - ChevronUp (FaChevronUp)
export const ChevronUpIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w prawo - ChevronRight (FaChevronRight)
export const ChevronRightIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w lewo - ArrowLeft (FaArrowLeft)
export const ArrowLeftIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w prawo - ArrowRight (FaArrowRight)
export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ========== IKONY UŻYTKOWNIKA ==========

// Ikona użytkownika - User (FaUser)
export const UserIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona wielu użytkowników - Users (FaUsers)
export const UsersIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <path d="M3 20C3 16.134 5.68629 13 9 13C12.3137 13 15 16.134 15 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <path d="M21 20C21 17.2386 18.7614 15 16 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona dodawania użytkownika - UserPlus
export const UserPlusIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 8V14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 11H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona użytkownika z check - UserCheck
export const UserCheckIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 11L18 13L22 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona użytkownika z X - UserTimes
export const UserTimesIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 8L22 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 8L18 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona wylogowania - SignOutAlt (FaSignOutAlt)
export const SignOutIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona aparatu - Camera (FaCamera)
export const CameraIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5523 22.5523 20 22 20H2C1.44772 20 1 19.5523 1 19V8C1 7.44772 1.44772 7 2 7H6L8 4H16L18 7H22C22.5523 7 23 7.44772 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="13" r="1.5" fill={color}/>
  </svg>
);

// Ikona zamka - Lock (FaLock)
export const LockIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M9 11V7C9 4.79086 10.7909 3 13 3C15.2091 3 17 4.79086 17 7V11" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// ========== IKONY WYSZUKIWANIA I FILTROWANIA ==========

// Ikona wyszukiwania - Search (FaSearch)
export const SearchIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona filtra - Filter (FaFilter)
export const FilterIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12H18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 18H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="3" cy="6" r="1.5" fill={color}/>
    <circle cx="6" cy="12" r="1.5" fill={color}/>
    <circle cx="9" cy="18" r="1.5" fill={color}/>
  </svg>
);

// ========== IKONY STATUSU I POWIADOMIEŃ ==========

// Ikona zaznaczenia w kółku - CheckCircle (FaCheckCircle)
export const CheckCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona X w kółku - TimesCircle (FaTimesCircle)
export const TimesCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M15 9L9 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 9L15 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona wykrzyknika w kółku - ExclamationCircle (FaExclamationCircle)
export const ExclamationCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// Ikona informacji w kółku - InfoCircle (FaInfoCircle)
export const InfoCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// Ikona ostrzeżenia - Warning (FaExclamationTriangle)
export const WarningIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22H22L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
);

// Alias dla InfoIcon
export const InfoIcon = InfoCircleIcon;

// Ikona dzwonka - Bell (FaBell)
export const BellIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ========== IKONY ULUBIONYCH I OCEN ==========

// Ikona gwiazdy - Star (FaStar)
export const StarIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9L22 10L16 15L17.5 22.5L12 18L6.5 22.5L8 15L2 10L9.5 9L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona odtwarzania - Play (FaPlay)
export const PlayIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M10 8L16 12L10 16V8Z" fill={color}/>
  </svg>
);

// Ikona pauzy - Pause (FaPause)
export const PauseIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <rect x="9" y="8" width="2" height="8" rx="1" fill={color}/>
    <rect x="13" y="8" width="2" height="8" rx="1" fill={color}/>
  </svg>
);

// Ikona głośności - VolumeUp (FaVolumeUp)
export const VolumeUpIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.07 4.93C20.9447 6.80729 22 9.34829 22 12C22 14.6517 20.9447 17.1927 19.07 19.07M15.54 8.46C16.4774 9.39764 17 10.6692 17 12C17 13.3308 16.4774 14.6024 15.54 15.54" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona wyciszenia - VolumeMute (FaVolumeMute)
export const VolumeMuteIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 9L17 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 9L23 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona płuc - Lungs
export const LungsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V8C12 9.10457 11.1046 10 10 10H8C6.89543 10 6 10.8954 6 12V20C6 21.1046 6.89543 22 8 22H10C11.1046 22 12 21.1046 12 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V8C12 9.10457 12.8954 10 14 10H16C17.1046 10 18 10.8954 18 12V20C18 21.1046 17.1046 22 16 22H14C12.8954 22 12 21.1046 12 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6H10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 6H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona zakładki - Bookmark (FaBookmark)
export const BookmarkIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona powtórzenia - Redo (FaRedo)
export const RedoIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M21.5 2V8H15.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.5 8C21.5 12.9706 17.4706 17 12.5 17C9.18629 17 6.34829 15.0457 4.5 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 12.5L4.5 10.5L6.5 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona serca - Heart (FaHeart)
export const HeartIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C12 5 8 2 6 4C4 6 4 9 6 11C8 13 12 17 12 17C12 17 16 13 18 11C20 9 20 6 18 4C16 2 12 5 12 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ========== IKONY PLIKÓW I DOKUMENTÓW ==========

// Ikona pliku - FileAlt (FaFileAlt)
export const FileIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 16H12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona pobierania - Download (FaDownload)
export const DownloadIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona wgrywania - Upload (FaUpload)
export const UploadIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L12 3L7 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ========== IKONY CZASU I DATY ==========

// Ikona kalendarza - CalendarAlt (FaCalendarAlt)
export const CalendarIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="15" r="1" fill={color}/>
    <circle cx="12" cy="15" r="1" fill={color}/>
    <circle cx="15" cy="15" r="1" fill={color}/>
  </svg>
);

// Ikona zegara - Clock (FaClock)
export const ClockIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

// ========== IKONY LOKALIZACJI I KONTAKTU ==========

// Ikona lokalizacji - MapMarkerAlt (FaMapMarkerAlt)
export const LocationIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="9" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="9" r="1" fill={color}/>
  </svg>
);

// Ikona budynku - Building (FaBuilding)
export const BuildingIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 21V7L12 3L19 7V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 13H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 17H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona telefonu - Phone (FaPhone)
export const PhoneIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2131 21.3522 21.4011C21.1472 21.5891 20.9053 21.7321 20.6399 21.8212C20.3746 21.9103 20.0922 21.9437 19.812 21.9192C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.12 4.19C2.09557 3.90978 2.12914 3.62741 2.21841 3.36207C2.30768 3.09674 2.45088 2.85482 2.63916 2.64982C2.82744 2.44482 3.05661 2.28128 3.31178 2.16968C3.56695 2.05808 3.84274 2.00113 4.121 2.002H7.121C7.68185 1.99522 8.22749 2.16708 8.68264 2.49352C9.13779 2.81996 9.48028 3.28623 9.661 3.82L10.721 6.96C10.8849 7.48865 10.9183 8.05542 10.8178 8.60152C10.7173 9.14762 10.4863 9.65511 10.151 10.08L8.621 11.61C10.0615 13.7775 12.2225 15.9385 14.39 17.379L15.92 15.85C16.3449 15.5147 16.8524 15.2837 17.3985 15.1832C17.9446 15.0827 18.5114 15.1161 19.04 15.28L22.18 16.34C22.7151 16.5205 23.1817 16.8631 23.5084 17.3184C23.8351 17.7737 24.0071 18.3195 24 18.88L22 16.92Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona koperty - Envelope (FaEnvelope)
export const EnvelopeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 5L12 13L21 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona globu - Globe (FaGlobe)
export const GlobeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 3C14.5013 5.73835 15.9228 9.29203 16 13C15.9228 16.708 14.5013 20.2616 12 23C9.49872 20.2616 8.07725 16.708 8 13C8.07725 9.29203 9.49872 5.73835 12 3Z" stroke={color} strokeWidth="2"/>
  </svg>
);

// ========== IKONY ZAKUPÓW ==========

// Ikona koszyka - ShoppingCart (FaShoppingCart)
export const ShoppingCartIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1046 17.8954 19 19 19C20.1046 19 21 18.1046 21 17V13M9 19.5C9.82843 19.5 10.5 20.1716 10.5 21C10.5 21.8284 9.82843 22.5 9 22.5C8.17157 22.5 7.5 21.8284 7.5 21C7.5 20.1716 8.17157 19.5 9 19.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="21" r="1.5" fill={color}/>
  </svg>
);

// ========== IKONY PREMIUM I STATUSU ==========

// Ikona premium - Premium (unikalna ikona dla platformy)
export const PremiumIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Gwiazda premium */}
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Korona */}
    <path d="M12 6L10 8L8 7L9 9L7 10L10 10L12 12L14 10L17 10L15 9L16 7L14 8L12 6Z" fill={color === 'currentColor' ? 'rgba(255, 255, 255, 0.9)' : color} opacity="0.8"/>
  </svg>
);

// ========== IKONY MEDYCZNE ==========

// Ikona stetoskopu - Stethoscope (FaStethoscope)
export const StethoscopeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6V4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 12C12 15.3137 9.31371 18 6 18C2.68629 18 0 15.3137 0 12C0 8.68629 2.68629 6 6 6C9.31371 6 12 8.68629 12 12Z" stroke={color} strokeWidth="2"/>
    <path d="M18 12C18 15.3137 20.6863 18 24 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona lekarza - UserMd (FaUserMd)
export const DoctorIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 4H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="10" r="1" fill={color}/>
  </svg>
);

// Ikona tabletek - Pills (FaPills)
export const PillsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8Z" stroke={color} strokeWidth="2"/>
    <path d="M8 16C8 13.7909 9.79086 12 12 12C14.2091 12 16 13.7909 16 16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16Z" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="8" r="1" fill={color}/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// ========== IKONY SPOŁECZNOŚCIOWE ==========

// Ikona Facebook - Facebook (FaFacebook)
export const FacebookIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona YouTube - Youtube (FaYoutube)
export const YoutubeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.4981 4.80824 21.0707 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.42C2.92931 4.55318 2.50189 4.80824 2.16129 5.15941C1.82068 5.51057 1.57875 5.94541 1.46 6.42C1.14521 8.14159 0.990803 9.89159 1 11.645C0.990803 13.3984 1.14521 15.1484 1.46 16.87C1.57875 17.3446 1.82068 17.7794 2.16129 18.1306C2.50189 18.4818 2.92931 18.7368 3.4 18.87C5.12 19.29 12 19.29 12 19.29C12 19.29 18.88 19.29 20.6 18.87C21.0707 18.7368 21.4981 18.4818 21.8387 18.1306C22.1793 17.7794 22.4212 17.3446 22.54 16.87C22.8548 15.1484 23.0092 13.3984 23 11.645C23.0092 9.89159 22.8548 8.14159 22.54 6.42Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.75 15.02L15.5 11.645L9.75 8.27V15.02Z" fill={color}/>
  </svg>
);

// Ikona Instagram - Instagram (FaInstagram)
export const InstagramIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill={color}/>
  </svg>
);

// Ikona TikTok - Tiktok (FaTiktok)
export const TiktokIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69C18.37 5.45 17.75 3.82 17.75 2H14.5V14.5C14.5 16.71 12.71 18.5 10.5 18.5C8.29 18.5 6.5 16.71 6.5 14.5C6.5 12.29 8.29 10.5 10.5 10.5C10.85 10.5 11.19 10.56 11.5 10.66V7.41C11.19 7.36 10.86 7.33 10.5 7.33C6.36 7.33 3 10.69 3 14.83C3 18.97 6.36 22.33 10.5 22.33C14.64 22.33 18 18.97 18 14.83V8.75C19.13 9.83 20.5 10.5 22 10.5V7.25C20.89 7.25 19.82 6.99 19.59 6.69Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona Twitter/X - XTwitter (FaXTwitter)
export const XTwitterIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25H21.308L14.554 10.51L22.5 21.75H16.17L10.916 14.933L4.854 21.75H1.788L9.054 13.016L1.5 2.25H7.932L12.654 8.482L18.244 2.25ZM17.076 19.77H18.956L7.044 4.126H5.044L17.076 19.77Z" fill={color}/>
  </svg>
);

// Ikona LinkedIn - LinkedIn
export const LinkedinIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M8 10V16M8 8V8.01M12 16V10M16 16V13C16 12.4477 15.5523 12 15 12C14.4477 12 14 12.4477 14 13V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="8" r="1" fill={color}/>
  </svg>
);

// ========== IKONY DODATKOWE ==========

// Ikona plusa - Plus (FaPlus)
export const PlusIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona minusa - Minus (FaMinus)
export const MinusIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona kopiowania - Copy (FaCopy)
export const CopyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 15H4C3.44772 15 3 14.5523 3 14V4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona ustawień - Cog (FaCog)
export const SettingsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 1V3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 21V23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.22 4.22L5.64 5.64" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18.36 18.36L19.78 19.78" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M1 12H3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M21 12H23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.22 19.78L5.64 18.36" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona spinnera - Spinner (FaSpinner)
export const SpinnerIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416" opacity="0.3">
      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
    </circle>
  </svg>
);

// Ikona zewnętrznego linku - ExternalLinkAlt (FaExternalLinkAlt)
export const ExternalLinkIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13V19C18 19.5523 17.5523 20 17 20H5C4.44772 20 4 19.5523 4 19V7C4 6.44772 4.44772 6 5 6H11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 3H21V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14L21 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona kalkulatora - Calculator (FaCalculator)
export const CalculatorIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M8 6H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="7" cy="11" r="1" fill={color}/>
    <circle cx="12" cy="11" r="1" fill={color}/>
    <circle cx="17" cy="11" r="1" fill={color}/>
    <circle cx="7" cy="15" r="1" fill={color}/>
    <circle cx="12" cy="15" r="1" fill={color}/>
    <circle cx="17" cy="15" r="1" fill={color}/>
    <circle cx="7" cy="19" r="1" fill={color}/>
    <circle cx="12" cy="19" r="1" fill={color}/>
    <rect x="15" y="17" width="4" height="4" rx="1" stroke={color} strokeWidth="2"/>
  </svg>
);

// Ikona książki - Book (FaBook)
export const BookIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona dyplomu - GraduationCap (FaGraduationCap)
export const GraduationCapIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 14L22 9L12 4L2 9L12 14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 10V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 18V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona teczki - Briefcase (FaBriefcase)
export const BriefcaseIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 7V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona pieniędzy - MoneyBillWave (FaMoneyBillWave)
export const MoneyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2"/>
    <circle cx="7" cy="12" r="1" fill={color}/>
    <circle cx="17" cy="12" r="1" fill={color}/>
    <path d="M12 9V15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona papierowego samolotu - PaperPlane (FaPaperPlane)
export const PaperPlaneIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona żarówki - Lightbulb (FaLightbulb)
export const LightbulbIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.79086 2 8 3.79086 8 6C8 7.5 8.5 8.8 9.3 9.8C9.5 10.1 9.7 10.3 9.8 10.5C10.1 11 10.2 11.5 10.2 12V13C10.2 13.5523 10.6477 14 11.2 14H12.8C13.3523 14 13.8 13.5523 13.8 13V12C13.8 11.5 13.9 11 14.2 10.5C14.3 10.3 14.5 10.1 14.7 9.8C15.5 8.8 16 7.5 16 6C16 3.79086 14.2091 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 18H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 21H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona certyfikatu - Certificate (FaCertificate)
export const CertificateIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V7L15 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 2V7H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
);

// Ikona faktury - FileInvoice (FaFileInvoice)
export const InvoiceIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 14H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 18H12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona karty kredytowej - CreditCard (FaCreditCard)
export const CreditCardIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M2 10H22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 14H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona Google - Google (FaGoogle)
export const GoogleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill={color} opacity="0.9"/>
    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.11 18.63 6.68 16.7 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill={color} opacity="0.9"/>
    <path d="M5.84 14.1C5.62 13.43 5.5 12.72 5.5 12C5.5 11.28 5.62 10.57 5.84 9.9V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.1Z" fill={color} opacity="0.9"/>
    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.35 3.88C17.45 2.18 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.68 7.3 9.11 5.38 12 5.38Z" fill={color} opacity="0.9"/>
  </svg>
);

// Ikona Apple - Apple (FaApple)
export const AppleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28C16.07 21.28 14.89 21.05 13.73 20.97C12.43 20.88 11.25 20.28 10.05 20.28C8.75 20.28 7.46 20.97 6.36 20.99C5.24 21.03 3.97 20.4 2.99 19.37C0.95 17.15 0.3 13.75 1.64 11.45C2.64 9.75 4.35 8.65 6.17 8.65C7.27 8.65 8.24 9.25 9.04 9.25C9.79 9.25 10.9 8.58 12.18 8.7C12.88 8.7 14.19 8.88 15.19 9.88C13.35 10.95 12.7 13.15 13.5 15.15C14.25 17.05 15.4 18.95 17.05 20.28ZM12.15 2.01C13.05 0.9 14.35 0.27 15.45 0.5C15.66 2.65 14.96 4.62 13.87 5.89C12.78 7.16 11.39 7.94 10.19 7.7C9.95 5.65 10.75 3.72 12.15 2.01Z" fill={color}/>
  </svg>
);

// Ikona korony - Crown
export const CrownIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 16H19V20H5V16Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona medalu - Medal
export const MedalIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="6" stroke={color} strokeWidth="2"/>
    <path d="M12 2V6M12 18V22M8 12H4M20 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="2" fill={color}/>
  </svg>
);

// Ikona nagrody - Award
export const AwardIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="6" stroke={color} strokeWidth="2"/>
    <path d="M7 12L12 17L17 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona trofeum - Trophy
export const TrophyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4C3.5 9 3 8.5 3 8V6C3 5.5 3.5 5 4 5H6M18 9H20C20.5 9 21 8.5 21 8V6C21 5.5 20.5 5 20 5H18M6 5H18M7 5V9C7 12 9 14 12 14C15 14 17 12 17 9V5H7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14V21M9 18H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona wykresu liniowego - ChartLine
export const ChartLineIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16L11 12L15 16L21 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 10H15V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

