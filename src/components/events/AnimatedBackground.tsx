import React from 'react';

interface AnimatedBackgroundProps {
  darkMode: boolean;
  type?: 'gradient' | 'particles' | 'waves';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ darkMode, type = 'gradient' }) => {
  if (type === 'particles') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              darkMode ? 'bg-[#38b6ff]' : 'bg-[#38b6ff]'
            } opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'waves') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path
            d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
            fill={darkMode ? 'rgba(56, 182, 255, 0.1)' : 'rgba(56, 182, 255, 0.05)'}
            className="animate-wave"
          />
          <path
            d="M0,500 Q300,400 600,500 T1200,500 L1200,800 L0,800 Z"
            fill={darkMode ? 'rgba(56, 182, 255, 0.08)' : 'rgba(56, 182, 255, 0.03)'}
            className="animate-wave"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>
    );
  }

  // Gradient
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}
    >
      <div className={`absolute inset-0 ${
        darkMode 
          ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(56,182,255,0.1),transparent_50%)]' 
          : 'bg-[radial-gradient(circle_at_30%_20%,rgba(56,182,255,0.05),transparent_50%)]'
      }`} />
      <div className={`absolute inset-0 ${
        darkMode 
          ? 'bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]' 
          : 'bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]'
      }`} />
    </div>
  );
};

export default AnimatedBackground;

