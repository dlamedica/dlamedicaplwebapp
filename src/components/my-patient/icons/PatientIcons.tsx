/**
 * Własne ikony SVG dla modułu Mój Pacjent
 * Tworzone od podstaw - bez zewnętrznych bibliotek
 */

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// === IKONY BADANIA FIZYKALNEGO ===

/** Stetoskop - osłuchiwanie */
export const StethoscopeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M4 7c0-2.5 2-4.5 4.5-4.5S13 4.5 13 7v4c0 1.5-1 3-2.5 3.5" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    <path 
      d="M13 7c0-2.5 2-4.5 4.5-4.5S22 4.5 22 7v0" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    <circle cx="8.5" cy="18" r="3" stroke={color} strokeWidth="2" />
    <path d="M8.5 15v-1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="10" r="2" fill={color} />
    <path d="M20 12v4c0 3-2 5-5 5h-3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Ręka - palpacja */
export const HandPalpationIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M6 8V4a2 2 0 014 0v4M10 8V2a2 2 0 014 0v6M14 8V4a2 2 0 014 0v4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    <path 
      d="M18 8v3a8 8 0 01-8 8h0a8 8 0 01-8-8V8a2 2 0 012-2h12a2 2 0 012 2z" 
      stroke={color} 
      strokeWidth="2" 
    />
    <circle cx="10" cy="12" r="1.5" fill={color} opacity="0.5" />
    <circle cx="14" cy="14" r="1" fill={color} opacity="0.3" />
  </svg>
);

/** Młotek - perkusja */
export const PercussionHammerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="8" y="2" width="8" height="6" rx="2" stroke={color} strokeWidth="2" />
    <path d="M12 8v12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 20h8" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Fale perkusji */}
    <path d="M18 5c1 0 2 0.5 2 1.5s-1 1.5-2 1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M20 4c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

/** Oko - inspekcja */
export const InspectionEyeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" 
      stroke={color} 
      strokeWidth="2" 
    />
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    {/* Refleks */}
    <circle cx="10" cy="10" r="1" fill={color} opacity="0.3" />
  </svg>
);

// === IKONY STATUSU PACJENTA ===

/** Serce z pulsem */
export const HeartPulseIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M12 6c-2-3-6-3-8 0s0 7 8 13c8-6 10-10 8-13s-6-3-8 0z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    <path 
      d="M6 11h3l1.5-3 3 6 1.5-3h3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/** Płuca */
export const LungsIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4v8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 8l-3 1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 8l3 1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path 
      d="M9 9c-3 0-5 2-5 6 0 4 2 5 4 5s3-1 4-3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M15 9c3 0 5 2 5 6 0 4-2 5-4 5s-3-1-4-3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

/** Brzuch */
export const AbdomenIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="13" rx="8" ry="9" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="1.5" fill={color} /> {/* Pępek */}
    <path d="M8 9c1 0 2 1 4 1s3-1 4-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M8 17c1 0 2-1 4-1s3 1 4 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// === IKONY ALERTÓW ===

/** Alert ostrzegawczy */
export const AlertWarningIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M12 3L2 21h20L12 3z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    <path d="M12 10v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill={color} />
  </svg>
);

/** Krytyczny */
export const CriticalIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** OK / Stabilny */
export const StableIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M8 12l3 3 5-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// === IKONY WYNIKÓW ===

/** Wynik prawidłowy */
export const NormalResultIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
    <path d="M7 12l3 3 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Wynik nieprawidłowy */
export const AbnormalResultIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
    <path d="M12 8v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1" fill={color} />
  </svg>
);

// === IKONY AUDIO ===

/** Odtwórz audio */
export const PlayAudioIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M10 8v8l6-4-6-4z" fill={color} />
  </svg>
);

/** Głośnik z falami */
export const SoundWaveIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 9v6h3l5 5V4L7 9H4z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 9c1 1 1 5 0 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M19 7c2 2 2 8 0 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// === IKONY PACJENTA ===

/** Pacjent mężczyzna */
export const PatientMaleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
    <path 
      d="M4 21v-2c0-3 3-5 8-5s8 2 8 5v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {/* Symbol męski */}
    <circle cx="19" cy="5" r="2" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M20.5 3.5l1.5-1.5M22 2h-2M22 2v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/** Pacjent kobieta */
export const PatientFemaleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
    <path 
      d="M4 21v-2c0-3 3-5 8-5s8 2 8 5v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {/* Symbol żeński */}
    <circle cx="20" cy="5" r="2" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M20 7v3M18 9h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/** Pacjent senior */
export const PatientSeniorIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
    <path 
      d="M4 21v-2c0-3 3-5 8-5s8 2 8 5v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {/* Włosy siwe / zmarszczki */}
    <path d="M9 4c0.5-1 2-1.5 3-1.5s2.5 0.5 3 1.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    <path d="M9 5c0.5-0.5 1.5-1 3-1s2.5 0.5 3 1" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
  </svg>
);

// === IKONY AKCJI ===

/** Rozpocznij badanie */
export const StartExamIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Zakończ badanie */
export const EndExamIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" />
    <path d="M9 9l6 6M15 9l-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Mapa ciała */
export const BodyMapIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Sylwetka uproszczona */}
    <circle cx="12" cy="5" r="3" stroke={color} strokeWidth="1.5" />
    <path d="M12 8v5" stroke={color} strokeWidth="1.5" />
    <path d="M8 10l-2 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 10l2 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 13v7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 13v7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Punkt badania */}
    <circle cx="12" cy="11" r="1.5" fill={color} opacity="0.5" />
  </svg>
);

/** Historia badań */
export const ExamHistoryIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 6h18M3 12h18M3 18h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="19" cy="18" r="3" stroke={color} strokeWidth="2" />
    <path d="M19 16v2l1 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// === IKONY ZAKŁADEK I OGÓLNE ===

/** Profil / Dane podstawowe */
export const ProfileDataIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <rect x="16" y="2" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M17 4h4" stroke={color} strokeWidth="1" opacity="0.5" />
  </svg>
);

/** Wywiad / Rozmowa */
export const InterviewIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 6h16M4 10h10M4 14h12M4 18h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="16" r="4" stroke={color} strokeWidth="2" />
    <path d="M18 14v2h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Badanie / Examination */
export const ExaminationIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

/** Badania laboratoryjne */
export const LabTestIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 3v5l-4 8c-1 2 0 4 2 4h10c2 0 3-2 2-4l-4-8V3" stroke={color} strokeWidth="2" />
    <path d="M9 3h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M7 14h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <circle cx="10" cy="16" r="1" fill={color} opacity="0.5" />
    <circle cx="14" cy="17" r="0.7" fill={color} opacity="0.5" />
  </svg>
);

/** Diagnoza */
export const DiagnosisIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <path d="M21 21l-4-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 11h6M11 8v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Plan leczenia */
export const TreatmentIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" />
    <path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <rect x="3" y="2" width="6" height="4" rx="1" fill={color} opacity="0.3" />
    <rect x="15" y="2" width="6" height="4" rx="1" fill={color} opacity="0.3" />
  </svg>
);

/** Historia / Timeline */
export const TimelineIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4v16" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="6" r="2" fill={color} />
    <circle cx="12" cy="12" r="2" fill={color} />
    <circle cx="12" cy="18" r="2" fill={color} />
    <path d="M14 6h6M14 12h4M14 18h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Ikona pacjenta */
export const PatientIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="4" r="2" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M16 2v4M14 4h4" stroke={color} strokeWidth="1" opacity="0.5" />
  </svg>
);

/** Heartbeat / Puls */
export const HeartbeatIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 12h4l2-4 3 8 2-4h7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12h4l2-4 3 8 2-4h7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" filter="blur(2px)" />
  </svg>
);

/** Alert */
export const AlertIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 7v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1" fill={color} />
  </svg>
);

/** Urgent / Pilny */
export const UrgentIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3l9 18H3l9-18z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 10v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill={color} />
  </svg>
);

/** Improving / Poprawa */
export const ImprovingIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 16V8M8 12l4-4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Worsening / Pogorszenie */
export const WorseningIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 8v8M8 12l4 4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Zegar */
export const ClockIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Plus */
export const PlusIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Score / Punkty */
export const ScoreIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/** Level / Poziom */
export const LevelIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="14" width="6" height="8" rx="1" stroke={color} strokeWidth="2" />
    <rect x="9" y="10" width="6" height="12" rx="1" stroke={color} strokeWidth="2" />
    <rect x="15" y="6" width="6" height="16" rx="1" stroke={color} strokeWidth="2" />
    <path d="M18 3l-1.5 1.5M18 3l1.5 1.5M18 3v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Achievement / Osiągnięcie */
export const AchievementIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="6" stroke={color} strokeWidth="2" />
    <path d="M9 6l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14l-2 8 6-3 6 3-2-8" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/** Cost / Koszt */
export const CostIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 6v2M12 16v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M9 10c0-1.5 1.5-2 3-2s3 0.5 3 2c0 2-3 2-3 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="0.5" fill={color} />
  </svg>
);

// === EKSPORT ===

export default {
  StethoscopeIcon,
  HandPalpationIcon,
  PercussionHammerIcon,
  InspectionEyeIcon,
  HeartPulseIcon,
  LungsIcon,
  AbdomenIcon,
  AlertWarningIcon,
  CriticalIcon,
  StableIcon,
  NormalResultIcon,
  AbnormalResultIcon,
  PlayAudioIcon,
  SoundWaveIcon,
  PatientMaleIcon,
  PatientFemaleIcon,
  PatientSeniorIcon,
  StartExamIcon,
  EndExamIcon,
  BodyMapIcon,
  ExamHistoryIcon,
  ProfileDataIcon,
  InterviewIcon,
  ExaminationIcon,
  LabTestIcon,
  DiagnosisIcon,
  TreatmentIcon,
  TimelineIcon,
  PatientIcon,
  HeartbeatIcon,
  AlertIcon,
  UrgentIcon,
  ImprovingIcon,
  WorseningIcon,
  ClockIcon,
  PlusIcon,
  ScoreIcon,
  LevelIcon,
  AchievementIcon,
  CostIcon
};
