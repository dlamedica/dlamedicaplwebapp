import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Unikalne ikony dla sekcji uczelni medycznych
 * Wszystkie ikony są stworzone specjalnie dla DlaMedica.pl
 * Styl minimalistyczny, nowoczesny, spójny z platformą
 */

// Ikona uczelni - budynek akademicki z flagą
export const UniversityIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Budynek główny */}
    <rect x="4" y="8" width="16" height="12" rx="1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Okna */}
    <rect x="6" y="11" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="10" y="11" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="14" y="11" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="18" y="11" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="6" y="15" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="10" y="15" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="14" y="15" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    <rect x="18" y="15" width="2" height="2" rx="0.5" fill={color} opacity="0.6"/>
    {/* Drzwi */}
    <rect x="10" y="17" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.5"/>
    {/* Flaga na dachu */}
    <path d="M12 2L12 8M12 2L15 5M12 2L9 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Krzyż medyczny na fladze */}
    <circle cx="12" cy="4" r="1.5" fill={color} opacity="0.8"/>
    <rect x="11.5" y="2.5" width="1" height="3" fill="white"/>
    <rect x="10.5" y="3.5" width="3" height="1" fill="white"/>
  </svg>
);

// Ikona lokalizacji - pinezka z krzyżem medycznym
export const LocationIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pinezka */}
    <path 
      d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Wewnętrzne koło */}
    <circle cx="12" cy="9" r="3" fill={color} opacity="0.2"/>
    {/* Krzyż medyczny */}
    <rect x="11" y="7" width="2" height="4" fill={color} rx="0.5"/>
    <rect x="9" y="9" width="6" height="2" fill={color} rx="0.5"/>
  </svg>
);

// Ikona gwiazdy - ocena
export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor',
  filled = false
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? color : 'none'} 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Ikona dyplomu/kierunku studiów
export const CourseIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Książka */}
    <path 
      d="M4 19.5C4 18.1 5.1 17 6.5 17H20" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M6.5 2H20V20H6.5C5.1 20 4 18.9 4 17.5V4.5C4 3.1 5.1 2 6.5 2Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Linie tekstu */}
    <path d="M8 7H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M8 10H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M8 13H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    {/* Pieczęć medyczna */}
    <circle cx="18" cy="6" r="2" stroke={color} strokeWidth="1" opacity="0.5"/>
    <rect x="17" y="5" width="2" height="2" fill={color} opacity="0.5"/>
    <rect x="16" y="6" width="4" height="2" fill={color} opacity="0.5"/>
  </svg>
);

// Ikona wyszukiwania
export const SearchIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 16L20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona serca - ulubione
export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor',
  filled = false
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? color : 'none'} 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20.84 4.61C20.33 4.1 19.69 3.84 19 3.84C18.31 3.84 17.67 4.1 17.16 4.61L12 9.77L6.84 4.61C6.33 4.1 5.69 3.84 5 3.84C4.31 3.84 3.67 4.1 3.16 4.61C2.65 5.12 2.39 5.76 2.39 6.45C2.39 7.14 2.65 7.78 3.16 8.29L8.32 13.45L12 17.13L15.68 13.45L20.84 8.29C21.35 7.78 21.61 7.14 21.61 6.45C21.61 5.76 21.35 5.12 20.84 4.61Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Ikona porównywania - waga
export const CompareIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Podstawa wagi */}
    <path d="M12 20V22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 20H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Szalki */}
    <path d="M6 18L6 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 18L18 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Miski */}
    <ellipse cx="6" cy="16" rx="3" ry="1" stroke={color} strokeWidth="1.5"/>
    <ellipse cx="18" cy="16" rx="3" ry="1" stroke={color} strokeWidth="1.5"/>
    {/* Elementy na szalkach */}
    <circle cx="5" cy="14" r="1" fill={color} opacity="0.6"/>
    <circle cx="7" cy="14" r="0.8" fill={color} opacity="0.6"/>
    <circle cx="17" cy="14" r="1" fill={color} opacity="0.6"/>
    <circle cx="19" cy="14" r="0.8" fill={color} opacity="0.6"/>
  </svg>
);

// Ikona filtra
export const FilterIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6H21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="6" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M21 12H3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="12" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M3 18H21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="2" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Ikona oka - zobacz szczegóły
export const EyeIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

// Ikona użytkownika
export const UserIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 21C6 17 8.7 14 12 14C15.3 14 18 17 18 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona kalendarza
export const CalendarIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 3V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="15" r="0.8" fill={color} opacity="0.6"/>
    <circle cx="12" cy="15" r="0.8" fill={color} opacity="0.6"/>
    <circle cx="15" cy="15" r="0.8" fill={color} opacity="0.6"/>
  </svg>
);

// Ikona zamknięcia (X)
export const CloseIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 6L6 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w prawo
export const ArrowRightIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 12H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona strzałki w lewo
export const ArrowLeftIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 12H5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona statystyk/wykresu
export const ChartIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 17L11 13L15 17L21 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="17" r="1.5" fill={color}/>
    <circle cx="11" cy="13" r="1.5" fill={color}/>
    <circle cx="15" cy="17" r="1.5" fill={color}/>
    <circle cx="21" cy="11" r="1.5" fill={color}/>
  </svg>
);

// Ikona książki
export const BookIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 19.5C4 18.1 5.1 17 6.5 17H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V20H6.5C5.1 20 4 18.9 4 17.5V4.5C4 3.1 5.1 2 6.5 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M8 10H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

// Ikona użytkowników (grupa)
export const UsersIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 21C3 17 5.7 14 9 14C12.3 14 15 17 15 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17" cy="7" r="3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 21C14 18.8 15.3 17 17 17C18.7 17 20 18.8 20 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikona nagrody/odznaki
export const AwardIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21L12 17L16 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="8" r="2" fill={color} opacity="0.3"/>
  </svg>
);

// Ikona historii/czasu
export const HistoryIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

