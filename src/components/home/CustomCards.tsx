import React from 'react';

// Unikalne komponenty kart stworzone od podstaw dla DlaMedica.pl

interface CardProps {
  children: React.ReactNode;
  className?: string;
  darkMode?: boolean;
  highContrast?: boolean;
  hover?: boolean;
}

// Karta z efektem glassmorphism
export const GlassCard: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  darkMode = false,
  highContrast = false,
  hover = true
}) => (
  <div 
    className={`relative rounded-2xl backdrop-blur-md border ${
      highContrast
        ? 'bg-white border-black'
        : darkMode
          ? 'bg-gray-800/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
    } ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]' : ''} ${className}`}
    style={{
      boxShadow: darkMode 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}
  >
    {children}
  </div>
);

// Karta z gradientowym obramowaniem
export const GradientBorderCard: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  darkMode = false,
  highContrast = false,
  hover = true
}) => (
  <div 
    className={`relative rounded-xl p-[2px] ${className}`}
    style={{
      background: highContrast
        ? 'linear-gradient(135deg, #000, #000)'
        : darkMode
          ? 'linear-gradient(135deg, #38b6ff, #9333ea, #38b6ff)'
          : 'linear-gradient(135deg, #38b6ff, #9333ea, #38b6ff)',
      backgroundSize: '200% 200%',
      animation: hover ? 'gradientShift 3s ease infinite' : 'none'
    }}
  >
    <div 
      className={`rounded-xl ${
        highContrast
          ? 'bg-white'
          : darkMode
            ? 'bg-gray-900'
            : 'bg-white'
      } ${hover ? 'transition-all duration-300 hover:shadow-xl' : ''}`}
    >
      {children}
    </div>
    <style>{`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  </div>
);

// Karta z efektem 3D
export const Card3D: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  darkMode = false,
  highContrast = false,
  hover = true
}) => (
  <div 
    className={`relative rounded-xl ${
      highContrast
        ? 'bg-white border-2 border-black'
        : darkMode
          ? 'bg-gray-800'
          : 'bg-white'
    } ${hover ? 'transition-all duration-300 hover:shadow-2xl' : ''} ${className}`}
    style={{
      transformStyle: 'preserve-3d',
      perspective: '1000px'
    }}
    onMouseMove={(e) => {
      if (!hover) return;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }}
    onMouseLeave={(e) => {
      if (!hover) return;
      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }}
  >
    {children}
  </div>
);

// Karta z efektem neon
export const NeonCard: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  darkMode = false,
  highContrast = false,
  hover = true
}) => (
  <div 
    className={`relative rounded-xl p-[1px] ${className}`}
    style={{
      background: highContrast
        ? '#000'
        : darkMode
          ? 'linear-gradient(135deg, #38b6ff, #9333ea)'
          : 'linear-gradient(135deg, #38b6ff, #9333ea)',
      boxShadow: darkMode
        ? '0 0 20px rgba(56, 182, 255, 0.5), 0 0 40px rgba(56, 182, 255, 0.3)'
        : '0 0 20px rgba(56, 182, 255, 0.3), 0 0 40px rgba(56, 182, 255, 0.2)'
    }}
  >
    <div 
      className={`rounded-xl ${
        highContrast
          ? 'bg-white'
          : darkMode
            ? 'bg-gray-900'
            : 'bg-white'
      } ${hover ? 'transition-all duration-300' : ''}`}
    >
      {children}
    </div>
  </div>
);

// Karta z efektem hologramu
export const HologramCard: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  darkMode = false,
  highContrast = false,
  hover = true
}) => (
  <div 
    className={`relative rounded-xl overflow-hidden ${
      highContrast
        ? 'bg-white border-2 border-black'
        : darkMode
          ? 'bg-gray-800/90'
          : 'bg-white/90'
    } ${hover ? 'transition-all duration-300 hover:shadow-xl' : ''} ${className}`}
  >
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: 'linear-gradient(45deg, transparent 30%, rgba(56, 182, 255, 0.5) 50%, transparent 70%)',
        backgroundSize: '200% 200%',
        animation: 'hologram 3s linear infinite'
      }}
    ></div>
    <div className="relative z-10">
      {children}
    </div>
    <style>{`
      @keyframes hologram {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 200%; }
      }
    `}</style>
  </div>
);

// Karta z efektem cienia kolorowego
export const ColoredShadowCard: React.FC<CardProps & { shadowColor?: string }> = ({ 
  children, 
  className = '', 
  darkMode = false,
  highContrast = false,
  hover = true,
  shadowColor = '#38b6ff'
}) => (
  <div 
    className={`relative rounded-xl ${
      highContrast
        ? 'bg-white border-2 border-black'
        : darkMode
          ? 'bg-gray-800'
          : 'bg-white'
    } ${hover ? 'transition-all duration-300 hover:shadow-2xl' : ''} ${className}`}
    style={{
      boxShadow: hover
        ? `0 10px 40px ${shadowColor}40, 0 0 20px ${shadowColor}20`
        : `0 4px 20px ${shadowColor}20`
    }}
  >
    {children}
  </div>
);

