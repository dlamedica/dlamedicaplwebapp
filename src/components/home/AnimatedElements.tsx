import React, { useEffect, useRef } from 'react';

// Unikalne animowane elementy stworzone od podstaw dla DlaMedica.pl

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
  darkMode?: boolean;
}

// Animowany licznik liczby
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000,
  className = '',
  darkMode = false
}) => {
  const [displayValue, setDisplayValue] = React.useState('0');
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateValue = () => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    const start = 0;
    const increment = numericValue / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue + suffix);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current) + suffix);
      }
    }, 16);
  };

  return (
    <div ref={ref} className={className}>
      {isVisible ? displayValue : '0'}
    </div>
  );
};

// Animowany gradientowy tekst
export const GradientText: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  colors?: string[];
}> = ({ 
  children, 
  className = '',
  colors = ['#38b6ff', '#9333ea', '#ec4899']
}) => (
  <span 
    className={`bg-clip-text text-transparent font-bold ${className}`}
    style={{
      backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})`,
      backgroundSize: '200% 200%',
      animation: 'gradientText 3s ease infinite'
    }}
  >
    {children}
    <style>{`
      @keyframes gradientText {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `}</style>
  </span>
);

// Animowany kształt - medyczna spirala
export const AnimatedMedicalSpiral: React.FC<{ 
  className?: string; 
  color?: string;
  size?: number;
}> = ({ 
  className = '', 
  color = '#38b6ff',
  size = 100
}) => (
  <div className={`relative ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 50 L50 20 A30 30 0 0 1 80 50 L50 50 A30 30 0 0 1 50 80 L50 50 A30 30 0 0 1 20 50 L50 50 Z"
        fill={color}
        opacity="0.2"
        style={{
          animation: 'spiralRotate 4s linear infinite'
        }}
      />
      <circle cx="50" cy="50" r="3" fill={color}>
        <animate
          attributeName="r"
          values="3;5;3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <style>{`
        @keyframes spiralRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  </div>
);

// Animowany kształt - pulsujące fale
export const PulsingWaves: React.FC<{ 
  className?: string; 
  color?: string;
}> = ({ 
  className = '', 
  color = '#38b6ff'
}) => (
  <div className={`relative ${className}`}>
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="30" stroke={color} strokeWidth="2" fill="none" opacity="0.6">
        <animate attributeName="r" values="30;60;30" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="30" stroke={color} strokeWidth="2" fill="none" opacity="0.4">
        <animate attributeName="r" values="30;60;30" dur="2s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="30" stroke={color} strokeWidth="2" fill="none" opacity="0.2">
        <animate attributeName="r" values="30;60;30" dur="2s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

// Animowany kształt - medyczna wstęga
export const MedicalRibbon: React.FC<{ 
  className?: string; 
  color?: string;
}> = ({ 
  className = '', 
  color = '#38b6ff'
}) => (
  <div className={`relative ${className}`}>
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 20 Q30 0 60 20 T120 20 L120 40 L0 40 Z"
        fill={color}
        opacity="0.3"
        style={{
          animation: 'ribbonWave 3s ease-in-out infinite'
        }}
      />
      <path
        d="M0 20 Q30 0 60 20 T120 20"
        stroke={color}
        strokeWidth="2"
        fill="none"
        style={{
          animation: 'ribbonWave 3s ease-in-out infinite',
          animationDelay: '0.1s'
        }}
      />
      <style>{`
        @keyframes ribbonWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </svg>
  </div>
);

// Animowany kształt - DNA helisa
export const DNAHelix: React.FC<{ 
  className?: string; 
  color?: string;
}> = ({ 
  className = '', 
  color = '#38b6ff'
}) => (
  <div className={`relative ${className}`}>
    <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 0 Q20 30 40 60 Q60 30 40 60 Q20 90 40 120"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        style={{
          animation: 'dnaMove 2s ease-in-out infinite'
        }}
      />
      <path
        d="M40 0 Q60 30 40 60 Q20 30 40 60 Q60 90 40 120"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        style={{
          animation: 'dnaMove 2s ease-in-out infinite',
          animationDelay: '1s'
        }}
      />
      <circle cx="20" cy="30" r="3" fill={color} opacity="0.8">
        <animate attributeName="cy" values="30;90;30" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="90" r="3" fill={color} opacity="0.8">
        <animate attributeName="cy" values="90;30;90" dur="2s" repeatCount="indefinite" />
      </circle>
      <style>{`
        @keyframes dnaMove {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </svg>
  </div>
);

// Animowany kształt - serce medyczne
export const MedicalHeart: React.FC<{ 
  className?: string; 
  color?: string;
  size?: number;
}> = ({ 
  className = '', 
  color = '#38b6ff',
  size = 60
}) => (
  <div className={`relative ${className}`}>
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 15 C25 10, 15 10, 15 20 C15 25, 20 30, 30 40 C40 30, 45 25, 45 20 C45 10, 35 10, 30 15 Z"
        fill={color}
        opacity="0.3"
        style={{
          animation: 'heartBeat 1.5s ease-in-out infinite'
        }}
      />
      <path
        d="M30 15 C25 10, 15 10, 15 20 C15 25, 20 30, 30 40 C40 30, 45 25, 45 20 C45 10, 35 10, 30 15 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        style={{
          animation: 'heartBeat 1.5s ease-in-out infinite'
        }}
      />
      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
        }
      `}</style>
    </svg>
  </div>
);

// Animowany kształt - atom
export const Atom: React.FC<{ 
  className?: string; 
  color?: string;
}> = ({ 
  className = '', 
  color = '#38b6ff'
}) => (
  <div className={`relative ${className}`}>
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="40" ry="10" stroke={color} strokeWidth="2" fill="none" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse cx="50" cy="50" rx="40" ry="10" stroke={color} strokeWidth="2" fill="none" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="60 50 50;420 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse cx="50" cy="50" rx="40" ry="10" stroke={color} strokeWidth="2" fill="none" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="120 50 50;480 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </ellipse>
      <circle cx="50" cy="50" r="4" fill={color} />
    </svg>
  </div>
);

// Animowany kształt - stetoskop
export const Stethoscope: React.FC<{ 
  className?: string; 
  color?: string;
}> = ({ 
  className = '', 
  color = '#38b6ff'
}) => (
  <div className={`relative ${className}`}>
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 20 Q30 10 40 20 Q50 10 60 20 L60 40 Q50 50 40 40 Q30 50 20 40 Z"
        fill={color}
        opacity="0.2"
      />
      <circle cx="40" cy="30" r="8" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M40 38 L40 60 Q30 70 20 60"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{
          animation: 'stethoscopePulse 2s ease-in-out infinite'
        }}
      />
      <circle cx="20" cy="60" r="6" fill={color} opacity="0.8">
        <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" />
      </circle>
      <style>{`
        @keyframes stethoscopePulse {
          0%, 100% { stroke-opacity: 1; }
          50% { stroke-opacity: 0.5; }
        }
      `}</style>
    </svg>
  </div>
);

