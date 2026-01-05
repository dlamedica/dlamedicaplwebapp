import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const EbookIcon: React.FC<IconProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="8" y="4" width="48" height="56" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 12H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 20H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 28H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 36H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 44H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 52H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
    <circle cx="12" cy="24" r="1" fill="currentColor"/>
  </svg>
);

export const EmptyCartIcon: React.FC<IconProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="12" y="8" width="40" height="48" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 16H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 24H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 32H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 40H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 48H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="12" r="1" fill="currentColor"/>
    <circle cx="16" cy="20" r="1" fill="currentColor"/>
    <circle cx="16" cy="28" r="1" fill="currentColor"/>
  </svg>
);

