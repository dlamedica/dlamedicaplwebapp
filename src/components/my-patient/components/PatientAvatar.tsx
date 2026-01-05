/**
 * Awatar pacjenta z sylwetką
 * Graficzna reprezentacja pacjenta z kolorowym statusem
 */

import React from 'react';
import { PatientAvatarProps, AvatarGender, AvatarStatus } from '../types/physicalExam';
import '../styles/patientAvatarStyles.css';

const PatientAvatar: React.FC<PatientAvatarProps> = ({
  gender,
  ageGroup,
  status,
  size = 'md',
  showStatusRing = true,
  className = ''
}) => {
  // Rozmiary
  const sizes = {
    sm: { container: 40, svg: 28 },
    md: { container: 56, svg: 38 },
    lg: { container: 72, svg: 50 },
    xl: { container: 96, svg: 68 }
  };

  const currentSize = sizes[size];

  // Kolory statusu
  const statusColors = {
    stable: { ring: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', glow: 'rgba(34, 197, 94, 0.3)' },
    warning: { ring: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', glow: 'rgba(245, 158, 11, 0.3)' },
    critical: { ring: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', glow: 'rgba(239, 68, 68, 0.3)' }
  };

  const colors = statusColors[status];

  // Kolor skóry według wieku
  const skinTone = ageGroup === 'senior' ? '#d4a574' : ageGroup === 'middle' ? '#dbb896' : '#e8c4a0';
  const hairColor = ageGroup === 'senior' ? '#9ca3af' : ageGroup === 'middle' ? '#6b7280' : '#374151';

  return (
    <div 
      className={`patient-avatar-container ${className}`}
      style={{ 
        width: currentSize.container, 
        height: currentSize.container,
        position: 'relative'
      }}
    >
      {/* Ring statusu */}
      {showStatusRing && (
        <div 
          className={`patient-avatar-ring status-${status}`}
          style={{
            position: 'absolute',
            inset: -3,
            borderRadius: '50%',
            border: `3px solid ${colors.ring}`,
            boxShadow: `0 0 12px ${colors.glow}`,
            animation: status === 'critical' ? 'avatarPulse 1.5s infinite' : 
                       status === 'warning' ? 'avatarPulse 2.5s infinite' : 'none'
          }}
        />
      )}

      {/* Tło awatara */}
      <div
        className="patient-avatar-bg"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* SVG Sylwetka */}
        <svg
          width={currentSize.svg}
          height={currentSize.svg}
          viewBox="0 0 48 48"
          fill="none"
          className="patient-avatar-svg"
        >
          {gender === 'male' ? (
            // Męska sylwetka
            <>
              {/* Głowa */}
              <ellipse cx="24" cy="14" rx="8" ry="9" fill={skinTone} />
              
              {/* Włosy męskie */}
              <path 
                d="M16 12 C16 6 20 4 24 4 C28 4 32 6 32 12 C32 8 28 6 24 6 C20 6 16 8 16 12"
                fill={hairColor}
              />
              
              {/* Uszy */}
              <ellipse cx="15.5" cy="14" rx="1.5" ry="2" fill={skinTone} />
              <ellipse cx="32.5" cy="14" rx="1.5" ry="2" fill={skinTone} />
              
              {/* Szyja */}
              <rect x="21" y="22" width="6" height="4" fill={skinTone} />
              
              {/* Ciało / ramiona */}
              <path 
                d="M12 46 L12 32 C12 28 16 26 24 26 C32 26 36 28 36 32 L36 46"
                fill={status === 'critical' ? '#dc2626' : status === 'warning' ? '#d97706' : '#3b82f6'}
              />
              
              {/* Koszula / ubranie */}
              <path 
                d="M18 26 L24 30 L30 26 L30 34 L24 38 L18 34 Z"
                fill={status === 'critical' ? '#fca5a5' : status === 'warning' ? '#fde68a' : '#93c5fd'}
                opacity="0.8"
              />
            </>
          ) : (
            // Żeńska sylwetka
            <>
              {/* Głowa */}
              <ellipse cx="24" cy="14" rx="7.5" ry="8.5" fill={skinTone} />
              
              {/* Włosy żeńskie */}
              <path 
                d="M14 16 C14 6 18 2 24 2 C30 2 34 6 34 16 C34 10 30 6 24 6 C18 6 14 10 14 16"
                fill={hairColor}
              />
              <path 
                d="M14 14 C13 18 13 22 15 24 L14 16"
                fill={hairColor}
              />
              <path 
                d="M34 14 C35 18 35 22 33 24 L34 16"
                fill={hairColor}
              />
              
              {/* Uszy */}
              <ellipse cx="16" cy="14" rx="1.2" ry="1.8" fill={skinTone} />
              <ellipse cx="32" cy="14" rx="1.2" ry="1.8" fill={skinTone} />
              
              {/* Szyja */}
              <rect x="21.5" y="21" width="5" height="4" fill={skinTone} />
              
              {/* Ciało / ramiona */}
              <path 
                d="M12 46 L14 32 C14 28 18 26 24 26 C30 26 34 28 34 32 L36 46"
                fill={status === 'critical' ? '#dc2626' : status === 'warning' ? '#d97706' : '#ec4899'}
              />
              
              {/* Dekolt */}
              <path 
                d="M20 26 L24 30 L28 26"
                fill={skinTone}
              />
            </>
          )}
          
          {/* Twarz - oczy */}
          <circle cx="21" cy="13" r="1" fill="#374151" />
          <circle cx="27" cy="13" r="1" fill="#374151" />
          
          {/* Usta */}
          <path 
            d={status === 'critical' ? "M22 17 Q24 16 26 17" : "M22 17 Q24 18 26 17"}
            stroke="#be7c6a" 
            strokeWidth="0.8" 
            fill="none"
          />
        </svg>
      </div>

      {/* Ikona statusu */}
      <div 
        className={`patient-avatar-status-icon status-${status}`}
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          width: size === 'sm' ? 14 : size === 'md' ? 18 : size === 'lg' ? 22 : 26,
          height: size === 'sm' ? 14 : size === 'md' ? 18 : size === 'lg' ? 22 : 26,
          borderRadius: '50%',
          background: colors.ring,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          boxShadow: `0 2px 4px rgba(0,0,0,0.2)`
        }}
      >
        <svg 
          width={size === 'sm' ? 8 : size === 'md' ? 10 : size === 'lg' ? 12 : 14}
          height={size === 'sm' ? 8 : size === 'md' ? 10 : size === 'lg' ? 12 : 14}
          viewBox="0 0 16 16" 
          fill="none"
        >
          {status === 'stable' && (
            <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {status === 'warning' && (
            <>
              <path d="M8 4v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="8" cy="12" r="1" fill="white" />
            </>
          )}
          {status === 'critical' && (
            <>
              <path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default PatientAvatar;

