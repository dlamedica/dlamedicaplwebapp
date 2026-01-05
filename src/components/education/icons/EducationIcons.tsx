import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Unikalne ikony SVG dla platformy edukacyjnej DlaMedica.pl
 * Wszystkie ikony są stworzone specjalnie dla tej platformy i są unikalne
 */

// Ikona otwartej książki - ukończone moduły
export const BookOpenIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.89543 4.89543 4 6 4H10C11.1046 4 12 4.89543 12 6V18C12 19.1046 11.1046 20 10 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6C12 4.89543 12.8954 4 14 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H14C12.8954 20 12 19.1046 12 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8H12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="12" r="1" fill={color}/>
    <circle cx="16" cy="12" r="1" fill={color}/>
  </svg>
);

// Ikona wykresu postępu - postęp ogólny
export const ChartLineIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18L9 12L13 16L21 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 8H15L13 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="3" cy="18" r="2" fill={color}/>
    <circle cx="9" cy="12" r="2" fill={color}/>
    <circle cx="13" cy="16" r="2" fill={color}/>
    <circle cx="21" cy="8" r="2" fill={color}/>
  </svg>
);

// Ikona zegara - czas nauki
export const ClockIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
    <path d="M12 3V1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 23V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 12H1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M23 12H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona trofeum - passa
export const TrophyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18V7C18 9.20914 16.2091 11 14 11H10C7.79086 11 6 9.20914 6 7V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11V15C8 17.2091 9.79086 19 12 19C14.2091 19 16 17.2091 16 15V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 19V21H14V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3L5 1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 3L19 1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="7" r="1" fill={color}/>
  </svg>
);

// Ikona strzałki w dół
export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w górę
export const ChevronUpIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona pacjenta - mój pacjent
export const UserInjuredIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 12L8 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 12L16 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 10V8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// Ikona użytkowników - zawody
export const UsersIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <path d="M2 19C2 15.134 5.13401 12 9 12C12.866 12 16 15.134 16 19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2" stroke={color} strokeWidth="2"/>
    <path d="M20 19C20 16.7909 18.2091 15 16 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 4L13 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Ikona zamka - zablokowany
export const LockIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M9 11V7C9 4.79086 10.7909 3 13 3C15.2091 3 17 4.79086 17 7V11" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// Ikona play - rozpocznij
export const PlayIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M10 8L16 12L10 16V8Z" fill={color}/>
    <path d="M10 8L16 12L10 16V8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona gwiazdy - ulubione
export const StarIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9L22 10L16 15L17.5 22.5L12 18L6.5 22.5L8 15L2 10L9.5 9L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

// Ikona zaznaczenia - ukończony
export const CheckCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona pytajnika - quiz
export const QuestionCircleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1" fill={color}/>
  </svg>
);

// Ikona oka - ostatnio oglądane
export const EyeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

// Ikona filtra
export const FilterIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12H18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 18H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="3" cy="6" r="2" fill={color}/>
    <circle cx="6" cy="12" r="2" fill={color}/>
    <circle cx="9" cy="18" r="2" fill={color}/>
  </svg>
);

// Ikona X - zamknij
export const TimesIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona sygnału - poziom trudności
export const SignalIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H5V14H3V18Z" fill={color}/>
    <path d="M7 18H9V10H7V18Z" fill={color}/>
    <path d="M11 18H13V6H11V18Z" fill={color}/>
    <path d="M15 18H17V2H15V18Z" fill={color}/>
    <circle cx="4" cy="18" r="1" fill={color}/>
    <circle cx="8" cy="18" r="1" fill={color}/>
    <circle cx="12" cy="18" r="1" fill={color}/>
    <circle cx="16" cy="18" r="1" fill={color}/>
  </svg>
);

// Ikona wszystkich przedmiotów - książka
export const AllSubjectsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.89543 4.89543 4 6 4H10C11.1046 4 12 4.89543 12 6V20C12 21.1046 11.1046 22 10 22H6C4.89543 22 4 21.1046 4 20V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6C12 4.89543 12.8954 4 14 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H14C12.8954 22 12 21.1046 12 20V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8H12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 12H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="16" r="0.5" fill={color}/>
    <circle cx="14" cy="16" r="0.5" fill={color}/>
  </svg>
);

// Ikona przedklinicznych - DNA
export const PreclinicalIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C8 2 10 4 10 6C10 8 8 10 8 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2C16 2 14 4 14 6C14 8 16 10 16 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10C8 10 10 12 10 14C10 16 8 18 8 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10C16 10 14 12 14 14C14 16 16 18 16 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 18C8 18 10 20 10 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 18C16 18 14 20 14 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="6" r="1.5" fill={color}/>
    <circle cx="16" cy="6" r="1.5" fill={color}/>
    <circle cx="8" cy="14" r="1.5" fill={color}/>
    <circle cx="16" cy="14" r="1.5" fill={color}/>
    <circle cx="8" cy="22" r="1.5" fill={color}/>
    <circle cx="16" cy="22" r="1.5" fill={color}/>
  </svg>
);

// Ikona klinicznych - szpital
export const ClinicalIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8H20V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8L12 2L20 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 14H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="4" r="1" fill={color}/>
  </svg>
);

// Ikona specjalistycznych - błyskawica
export const SpecializedIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="12" r="0.5" fill={color}/>
    <circle cx="16" cy="12" r="0.5" fill={color}/>
  </svg>
);

// Ikona mojego pacjenta - osoba
export const MyPatientIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M6 21C6 17.134 9.13401 14 13 14C16.866 14 20 17.134 20 21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 12L8 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 12L16 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona anatomii - serce anatomiczne
export const AnatomyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C12 5 8 2 6 4C4 6 4 9 6 11C8 13 12 17 12 17C12 17 16 13 18 11C20 9 20 6 18 4C16 2 12 5 12 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 19H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill={color}/>
  </svg>
);

// Ikona fizjologii - energia
export const PhysiologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2"/>
    <path d="M12 4V8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 16V20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 12H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 12H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.75736 7.75736L10.5858 10.5858" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.2426 16.2426L13.4142 13.4142" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.75736 16.2426L10.5858 13.4142" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.2426 7.75736L13.4142 10.5858" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona biochemii - probówka
export const BiochemistryIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 6H16V20C16 21.1046 15.1046 22 14 22H10C8.89543 22 8 21.1046 8 20V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 14H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1" fill={color}/>
  </svg>
);

// Ikona biofizyki - atom
export const BiophysicsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" stroke={color} strokeWidth="2"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(60 12 12)" stroke={color} strokeWidth="2"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(120 12 12)" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

// Ikona mikrobiologii - mikrob
export const MicrobiologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2"/>
    <circle cx="9" cy="9" r="2" fill={color}/>
    <circle cx="15" cy="9" r="2" fill={color}/>
    <circle cx="9" cy="15" r="2" fill={color}/>
    <circle cx="15" cy="15" r="2" fill={color}/>
    <path d="M12 6V8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 16V18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 12H18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Ikona kardiologii - serce
export const CardiologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C12 5 8 2 6 4C4 6 4 9 6 11C8 13 12 17 12 17C12 17 16 13 18 11C20 9 20 6 18 4C16 2 12 5 12 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10V14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 12H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="0.5" fill={color}/>
  </svg>
);

// Ikona pulmonologii - płuca
export const PulmonologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4C8 4 6 6 6 8C6 10 8 12 8 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 4C16 4 18 6 18 8C18 10 16 12 16 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12C8 12 6 14 6 16C6 18 8 20 8 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 12C16 12 18 14 18 16C18 18 16 20 16 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="6" cy="8" r="1" fill={color}/>
    <circle cx="18" cy="8" r="1" fill={color}/>
    <circle cx="6" cy="16" r="1" fill={color}/>
    <circle cx="18" cy="16" r="1" fill={color}/>
  </svg>
);

// Ikona gastroenterologii - układ pokarmowy
export const GastroenterologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8C4 8 6 6 8 8C10 10 8 12 8 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12C8 12 10 14 12 16C14 18 16 18 16 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 18C16 18 18 16 20 14C20 14 20 16 18 18C16 20 16 20 16 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1.5" fill={color}/>
    <circle cx="12" cy="16" r="1.5" fill={color}/>
    <circle cx="18" cy="18" r="1.5" fill={color}/>
  </svg>
);

// Ikona nefrologii - nerka
export const NephrologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4C8 4 6 6 6 8C6 12 8 16 10 18C12 20 14 20 16 18C18 16 20 12 20 8C20 6 18 4 18 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10C10 10 12 8 14 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 14C10 14 12 12 14 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="8" r="1" fill={color}/>
    <circle cx="16" cy="8" r="1" fill={color}/>
  </svg>
);

// Ikona endokrynologii - hormony
export const EndocrinologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 11V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 15L12 11L16 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 19L12 13L18 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="8" r="1" fill={color}/>
  </svg>
);

// Ikona EKG - wykres
export const EKGIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12H6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12L8 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 8L10 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16L12 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4L14 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 18L16 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10L18 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 14H22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 20H22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Ikona ultrasonografii - fale
export const UltrasoundIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12C3 12 5 8 8 8C11 8 13 12 13 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 12C13 12 15 8 18 8C21 8 23 12 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12C3 12 5 16 8 16C11 16 13 12 13 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 12C13 12 15 16 18 16C21 16 23 12 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1" fill={color}/>
    <circle cx="18" cy="8" r="1" fill={color}/>
    <circle cx="8" cy="16" r="1" fill={color}/>
    <circle cx="18" cy="16" r="1" fill={color}/>
  </svg>
);

// Ikona radiologii - rentgen
export const RadiologyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M8 8H16V16H8V8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10L14 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 10L10 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="6" cy="6" r="1" fill={color}/>
    <circle cx="18" cy="6" r="1" fill={color}/>
    <circle cx="6" cy="18" r="1" fill={color}/>
    <circle cx="18" cy="18" r="1" fill={color}/>
  </svg>
);

// Ikona zawodów - grupa ludzi
export const ProfessionsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <path d="M2 19C2 15.134 5.13401 12 9 12C12.866 12 16 15.134 16 19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2" stroke={color} strokeWidth="2"/>
    <path d="M20 19C20 16.7909 18.2091 15 16 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="19" cy="4" r="1.5" stroke={color} strokeWidth="1.5"/>
    <path d="M19 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Ikona odgłosów medycznych - słuchawki i fale dźwiękowe
export const MedicalSoundsIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Słuchawki */}
    <path d="M6 12C6 9.79086 7.79086 8 10 8H14C16.2091 8 18 9.79086 18 12V16C18 18.2091 16.2091 20 14 20H10C7.79086 20 6 18.2091 6 16V12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12H4C2.89543 12 2 11.1046 2 10V8C2 6.89543 2.89543 6 4 6H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 12H20C21.1046 12 22 11.1046 22 10V8C22 6.89543 21.1046 6 20 6H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Fale dźwiękowe */}
    <path d="M8 14C8.5 13.5 9.5 13.5 10 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 14C14.5 13.5 15.5 13.5 16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 16C9.5 15.5 10.5 15.5 11 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 16C13.5 15.5 14.5 15.5 15 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Serce */}
    <path d="M10 9C10 9 11 8 12 9C13 8 14 9 14 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.2"/>
  </svg>
);

