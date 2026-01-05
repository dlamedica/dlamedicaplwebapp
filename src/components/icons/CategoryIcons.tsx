import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Anatomia - szkielet/kości
export const AnatomiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
    <path d="M12 7.5V9.5M12 9.5V13.5M12 13.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 10.5L6 12.5L8 14.5M16 10.5L18 12.5L16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 17.5L8 19.5M14 17.5L16 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 11L11 13M15 11L13 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <circle cx="10" cy="6" r="0.8" fill="currentColor" opacity="0.6"/>
    <circle cx="14" cy="6" r="0.8" fill="currentColor" opacity="0.6"/>
  </svg>
);

// Fizjologia - serce z EKG
export const FizjologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 6C10 4 7 5 7 8C7 11 12 16 12 16C12 16 17 11 17 8C17 5 14 4 12 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12H11L12 10L13 14L14 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Patologia - mikroskop
export const PatologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="6" y="18" width="12" height="2" rx="1" fill="currentColor"/>
    <path d="M12 18V14M10 14H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 7L18 4M9 7L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
  </svg>
);

// Farmakologia - kapsułka + tabletka
export const FarmakologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 10C6 9 6.5 8.5 7.5 8.5C8.5 8.5 9 9 9 10V14C9 15 8.5 15.5 7.5 15.5C6.5 15.5 6 15 6 14V10Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 10H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Chirurgia - skalpel
export const ChirurgiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 4L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6L16 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    <path d="M5 3L7 5L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.3"/>
    <path d="M19 17L17 19L19 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.3"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
  </svg>
);

// Interna - tułów z krzyżykiem
export const InternaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 6C8 5 8.5 4 10 4H14C15.5 4 16 5 16 6V18C16 19 15.5 20 14 20H10C8.5 20 8 19 8 18V6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 10V14M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Pediatria - dziecko
export const PediatriaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
    <path d="M6 20C6 16 8.5 14 12 14C15.5 14 18 16 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="6.5" r="0.8" fill="currentColor"/>
    <circle cx="14" cy="6.5" r="0.8" fill="currentColor"/>
    <path d="M10 9C10.5 9.5 11.2 9.8 12 9.8C12.8 9.8 13.5 9.5 14 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Ginekologia - symbol kobiecy
export const GinekologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
    <path d="M12 11.5V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="4" r="1" fill="currentColor"/>
  </svg>
);

// Neurologia - mózg z zakrętami
export const NeurologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 5C7 5 5.5 6.5 5.5 8.5C5.5 10.5 7 12 9 12C11 12 12.5 10.5 12.5 8.5C12.5 6.5 11 5 9 5Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 5C17 5 18.5 6.5 18.5 8.5C18.5 10.5 17 12 15 12C13 12 11.5 10.5 11.5 8.5C11.5 6.5 13 5 15 5Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 15C6 13 7.5 11.5 9.5 11.5C11.5 11.5 13 13 13 15" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 15C11 13 12.5 11.5 14.5 11.5C16.5 11.5 18 13 18 15" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 10C8.5 9.5 9 9 9.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M15 10C14.5 9.5 14 9 13.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M10 13C10.5 12.5 11 12 11.5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M13 13C12.5 12.5 12 12 11.5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Kardiologia - serce
export const KardiologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 6C10 4 7 5 7 8C7 11 12 16 12 16C12 16 17 11 17 8C17 5 14 4 12 6Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
    <path d="M12 6C10 4 7 5 7 8C7 11 12 16 12 16C12 16 17 11 17 8C17 5 14 4 12 6Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Pulmonologia - płuca z tchawicą
export const PulmonologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 6C6 6 4 8 4 10V14C4 16 6 18 8 18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 6C18 6 20 8 20 10V14C20 16 18 18 16 18" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Gastroenterologia - żołądek w kształcie S
export const GastroenterologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 6C7 6 6 7 6 8C6 9 7 10 8 10C9 10 10 9 10 8C10 7 9 6 8 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 8C10 9 11 10 12 10C13 10 14 9 14 8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 8C14 9 15 10 16 10C17 10 18 9 18 8C18 7 17 6 16 6C15 6 14 7 14 8Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 8C18 9 17 10 16 10C15 10 14 9 14 8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 8C14 9 13 10 12 10C11 10 10 9 10 8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 8C10 9 9 10 8 10C7 10 6 9 6 8" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Nefrologia - dwie nerki połączone
export const NefrologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 6C6 6 5 7 5 8.5C5 10 6 11.5 7.5 12C7 13 6.5 14.5 7 16C7.5 17.5 8.5 18.5 10 18.5C11.5 18.5 12.5 17.5 13 16C13.5 14.5 13 13 12.5 12C14 11.5 15 10 15 8.5C15 7 14 6 12.5 6C11 6 7 6 7 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M17 6C18 6 19 7 19 8.5C19 10 18 11.5 16.5 12C17 13 17.5 14.5 17 16C16.5 17.5 15.5 18.5 14 18.5C12.5 18.5 11.5 17.5 11 16C10.5 14.5 11 13 11.5 12C10 11.5 9 10 9 8.5C9 7 10 6 11.5 6C13 6 17 6 17 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Endokrynologia - tarczyca + kropla
export const EndokrynologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 6C10.5 6 9 7 9 8.5C9 10 10 11.5 11.5 12C11 13 10.5 14.5 11 16C11.5 17.5 12.5 18.5 14 18.5C15.5 18.5 16.5 17.5 17 16C17.5 14.5 17 13 16.5 12C18 11.5 19 10 19 8.5C19 7 17.5 6 16 6C14.5 6 12 6 12 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="4" r="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Hematologia - kropla z krwinką
export const HematologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3C9 3 6.5 5.5 6.5 8.5C6.5 11.5 9 14 12 14C15 14 17.5 11.5 17.5 8.5C17.5 5.5 15 3 12 3Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 14V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Onkologia - wstążka świadomości
export const OnkologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 6C6 6 5 7 5 9C5 11 6 12 8 12C10 12 11 11 11 9C11 7 10 6 8 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 6C18 6 19 7 19 9C19 11 18 12 16 12C14 12 13 11 13 9C13 7 14 6 16 6Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12C8 14 9 15 11 15C13 15 14 14 14 12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 12C16 14 15 15 13 15C11 15 10 14 10 12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 15C11 17 12 18 14 18C16 18 17 17 17 15" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Psychiatria - głowa z mózgiem/chmurką
export const PsychiatriaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 20C6 16 8.5 14 12 14C15.5 14 18 16 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 7C10 7.5 10.5 8 11.5 8C12.5 8 13 7.5 13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 10C9 10.5 9.5 11 10.5 11C11.5 11 12 10.5 12 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M12 10C12 10.5 12.5 11 13.5 11C14.5 11 15 10.5 15 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M10 11C10.5 11.5 11 12 12 12C13 12 13.5 11.5 14 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Dermatologia - pasek skóry z włosem
export const DermatologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="9" width="14" height="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 9V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Okulistyka - oko
export const OkulistykaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 7C9 7 6.5 9.5 6.5 12.5C6.5 15.5 9 18 12 18C15 18 17.5 15.5 17.5 12.5C17.5 9.5 15 7 12 7Z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Laryngologia - ucho z krzyżykiem
export const LaryngologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 5C7 5 6 6 6 7V9C6 10 7 11 8 11C9 11 10 10 10 9V7C10 6 9 5 8 5Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7C10 8 11 9 12 9C13 9 14 8 14 7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 7C14 8 15 9 16 9C17 9 18 8 18 7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 11V13M11 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Ortopedia - kość długa
export const OrtopediaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 5C7 5 6 6 6 7V17C6 18 7 19 8 19C9 19 10 18 10 17V7C10 6 9 5 8 5Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 5C17 5 18 6 18 7V17C18 18 17 19 16 19C15 19 14 18 14 17V7C14 6 15 5 16 5Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7H14M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Urologia - pęcherz z moczowodami
export const UrologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 18C14 18 16 16 16 14V12C16 10 14 8 12 8C10 8 8 10 8 12V14C8 16 10 18 12 18Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 14V20M14 14V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Anestezjologia - maska anestezjologiczna
export const AnestezjologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="12" rx="7" ry="5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Medycyna ratunkowa - gwiazda życia
export const MedycynaRatunkowaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 8V12M10 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Medycyna rodzinna - dom z krzyżykiem
export const MedycynaRodzinnaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4L4 10V20H20V10L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 20V14H16V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12V14M11 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Medycyna pracy - teczka z krzyżykiem
export const MedycynaPracyIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="6" y="7" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 7H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7V5C9 4 9.5 3 10.5 3H13.5C14.5 3 15 4 15 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 10V12M11 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Medycyna sportowa - biegacz z okręgiem na kolanie
export const MedycynaSportowaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 8V12M14 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14C8 12 9 11 11 11C13 11 14 12 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 12L12 14L14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Geriatria - figurka z laską
export const GeriatriaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 9.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 20C6 17 8.5 15 12 15C15.5 15 18 17 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 18L7 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Medycyna tropikalna - palma + komar
export const MedycynaTropikalnaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 20V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 8L8 6L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L8 9L9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12L8 11L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 7L17 6L18 7M16 9L17 8L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Epidemiologia - wirus/bakteria
export const EpidemiologiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
    <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
    <path d="M8 8L12 12M16 8L12 12M8 16L12 12M16 16L12 12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
    <circle cx="12" cy="6" r="1" fill="currentColor" opacity="0.6"/>
    <circle cx="12" cy="18" r="1" fill="currentColor" opacity="0.6"/>
    <circle cx="6" cy="12" r="1" fill="currentColor" opacity="0.6"/>
    <circle cx="18" cy="12" r="1" fill="currentColor" opacity="0.6"/>
  </svg>
);

// Bioetyka - waga z krzyżykiem
export const BioetykaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 7L12 3L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 17L12 21L18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 9L8 15M16 9L16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 2V4M13 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Prawo medyczne - paragraf z krzyżykiem
export const PrawoMedyczneIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 4C7 4 6 5 6 6V18C6 19 7 20 8 20C9 20 10 19 10 18V6C10 5 9 4 8 4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6H14C15 6 16 7 16 8V10C16 11 15 12 14 12H10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 14V16M15 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Historia medycyny - otwarta książka z krzyżykiem
export const HistoriaMedycynyIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 4C5 4 4 5 4 6V18C4 19 5 20 6 20H12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 4C19 4 20 5 20 6V18C20 19 19 20 18 20H12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 10V12M9 11H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Inny - ogólny symbol
export const InnyIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1"/>
    <path d="M8 8H16V16H8V8Z" fill="currentColor" opacity="0.2"/>
    <path d="M10 10H14M10 12H14M10 14H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </svg>
);

// Map category to icon component
export const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.FC<IconProps>> = {
    anatomia: AnatomiaIcon,
    fizjologia: FizjologiaIcon,
    patologia: PatologiaIcon,
    farmakologia: FarmakologiaIcon,
    chirurgia: ChirurgiaIcon,
    interna: InternaIcon,
    pediatria: PediatriaIcon,
    ginekologia: GinekologiaIcon,
    neurologia: NeurologiaIcon,
    kardiologia: KardiologiaIcon,
    pulmonologia: PulmonologiaIcon,
    gastroenterologia: GastroenterologiaIcon,
    nefrologia: NefrologiaIcon,
    endokrynologia: EndokrynologiaIcon,
    hematologia: HematologiaIcon,
    onkologia: OnkologiaIcon,
    psychiatria: PsychiatriaIcon,
    dermatologia: DermatologiaIcon,
    okulistyka: OkulistykaIcon,
    laryngologia: LaryngologiaIcon,
    ortopedia: OrtopediaIcon,
    urologia: UrologiaIcon,
    anestezjologia: AnestezjologiaIcon,
    medycyna_ratunkowa: MedycynaRatunkowaIcon,
    medycyna_rodzinna: MedycynaRodzinnaIcon,
    medycyna_pracy: MedycynaPracyIcon,
    medycyna_sportowa: MedycynaSportowaIcon,
    geriatria: GeriatriaIcon,
    medycyna_tropikalna: MedycynaTropikalnaIcon,
    epidemiologia: EpidemiologiaIcon,
    bioetyka: BioetykaIcon,
    prawo_medyczne: PrawoMedyczneIcon,
    historia_medycyny: HistoriaMedycynyIcon,
    inny: InnyIcon,
  };

  return iconMap[category] || InnyIcon;
};
