import React from 'react';

// Unikalne elementy wizualne stworzone od podstaw dla DlaMedica.pl

interface DecorativeShapeProps {
  className?: string;
  color?: string;
}

// Dekoracyjny kształt medyczny - krzyż w kółku
export const MedicalCrossShape: React.FC<DecorativeShapeProps> = ({ className = '', color = '#38b6ff' }) => (
  <div className={`relative ${className}`}>
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill={color} opacity="0.1"/>
      <circle cx="60" cy="60" r="55" stroke={color} strokeWidth="2"/>
      <rect x="55" y="30" width="10" height="60" fill={color} rx="2"/>
      <rect x="30" y="55" width="60" height="10" fill={color} rx="2"/>
    </svg>
  </div>
);

// Animowany gradient background
export const AnimatedGradientBackground: React.FC<{ className?: string; darkMode?: boolean }> = ({ className = '', darkMode = false }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`}>
    <div className={`absolute -top-1/2 -left-1/2 w-full h-full ${
      darkMode 
        ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20' 
        : 'bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-cyan-100/30'
    } animate-pulse`} style={{
      animation: 'gradient 8s ease infinite',
      backgroundSize: '200% 200%'
    }}></div>
    <style>{`
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </div>
);

// Dekoracyjna linia z gradientem
export const GradientLine: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#38b6ff' }) => (
  <div className={`relative h-1 ${className}`}>
    <div 
      className="absolute inset-0 rounded-full"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6
      }}
    ></div>
  </div>
);

// Dekoracyjne kropki
export const DotsPattern: React.FC<{ className?: string; color?: string; size?: number }> = ({ 
  className = '', 
  color = '#38b6ff', 
  size = 4 
}) => (
  <div className={`absolute inset-0 ${className}`} style={{
    backgroundImage: `radial-gradient(circle, ${color} ${size}px, transparent ${size}px)`,
    backgroundSize: '20px 20px',
    opacity: 0.1
  }}></div>
);

// Unikalny kształt fali
export const WaveShape: React.FC<{ className?: string; color?: string; direction?: 'up' | 'down' }> = ({ 
  className = '', 
  color = '#38b6ff',
  direction = 'down'
}) => (
  <div className={`relative w-full ${className}`} style={{ height: '60px' }}>
    <svg 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none" 
      className={`absolute ${direction === 'down' ? 'top-0' : 'bottom-0'} left-0 w-full h-full`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d={direction === 'down' 
          ? "M0,60 C300,20 600,100 900,60 C1050,40 1150,50 1200,60 L1200,120 L0,120 Z"
          : "M0,60 C300,100 600,20 900,60 C1050,80 1150,70 1200,60 L1200,0 L0,0 Z"
        }
        fill={color}
        opacity="0.1"
      />
    </svg>
  </div>
);

// Dekoracyjny kształt - pulsujące kółka
export const PulsingCircles: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#38b6ff' }) => (
  <div className={`relative ${className}`}>
    <div 
      className="absolute inset-0 rounded-full border-2"
      style={{
        borderColor: color,
        opacity: 0.3,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
    ></div>
    <div 
      className="absolute inset-0 rounded-full border-2"
      style={{
        borderColor: color,
        opacity: 0.2,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '0.5s'
      }}
    ></div>
    <div 
      className="absolute inset-0 rounded-full border-2"
      style={{
        borderColor: color,
        opacity: 0.1,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '1s'
      }}
    ></div>
  </div>
);

// Unikalny kształt - geometryczny wzór
export const GeometricPattern: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#38b6ff' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="none">
      <defs>
        <pattern id="geometric" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20L20 0L40 20L20 40Z" fill="none" stroke={color} strokeWidth="1" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geometric)"/>
    </svg>
  </div>
);

// Dekoracyjny kształt - gradientowy blok
export const GradientBlock: React.FC<{ 
  className?: string; 
  colors?: string[];
  angle?: number;
}> = ({ 
  className = '', 
  colors = ['#38b6ff', '#9333ea'],
  angle = 135
}) => (
  <div 
    className={`absolute inset-0 ${className}`}
    style={{
      background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
      opacity: 0.1
    }}
  ></div>
);

// Unikalny kształt - medyczna spirala
export const MedicalSpiral: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#38b6ff' }) => (
  <div className={`relative ${className}`}>
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M40 40 L40 20 A20 20 0 0 1 60 40 L40 40 A20 20 0 0 1 40 60 L40 40 A20 20 0 0 1 20 40 L40 40 Z" 
        fill={color} 
        opacity="0.2"
      />
      <circle cx="40" cy="40" r="2" fill={color}/>
    </svg>
  </div>
);

