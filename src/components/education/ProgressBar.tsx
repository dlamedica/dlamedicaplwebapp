import React from 'react';
import { CountUp } from './components';
import './styles/educationStyles.css';

interface ProgressBarProps {
  progress: number; // 0-100
  darkMode: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  showMilestones?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  darkMode,
  size = 'medium',
  color = '#38b6ff',
  showPercentage = true,
  animated = true,
  className = '',
  showMilestones = false
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'h-2',
          text: 'text-xs',
          milestone: 'text-[10px]'
        };
      case 'large':
        return {
          container: 'h-6',
          text: 'text-base',
          milestone: 'text-xs'
        };
      default:
        return {
          container: 'h-4',
          text: 'text-sm',
          milestone: 'text-[10px]'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getProgressGradient = () => {
    if (clampedProgress === 100) {
      return 'from-green-500 via-emerald-500 to-green-600';
    } else if (clampedProgress >= 70) {
      return 'from-blue-500 via-cyan-500 to-blue-600';
    } else if (clampedProgress >= 30) {
      return 'from-yellow-500 via-amber-500 to-orange-500';
    } else {
      return 'from-red-500 via-rose-500 to-red-600';
    }
  };

  const getProgressColor = () => {
    if (clampedProgress === 100) {
      return '#10b981';
    } else if (clampedProgress >= 70) {
      return '#3b82f6';
    } else if (clampedProgress >= 30) {
      return '#f59e0b';
    } else {
      return '#ef4444';
    }
  };

  const progressColor = color === '#38b6ff' ? getProgressColor() : color;
  const gradientClass = color === '#38b6ff' ? getProgressGradient() : `from-[${color}] to-[${color}]dd`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showPercentage && (
          <div className="flex items-center space-x-2">
            <span className={`${sizeClasses.text} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <CountUp end={Math.round(clampedProgress)} duration={1000} />%
            </span>
            {clampedProgress === 100 && (
              <span className="text-xs font-semibold text-green-500 animate-pulse">
                ✓ Ukończone
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className={`relative w-full ${sizeClasses.container} rounded-full overflow-hidden ${
        darkMode ? 'bg-gray-700/50' : 'bg-gray-200'
      } shadow-inner`}>
        {/* Background gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-20`}
        />
        
        {/* Progress fill */}
        <div
          className={`relative ${sizeClasses.container} rounded-full transition-all duration-700 ease-out education-progress-bar ${
            animated ? '' : ''
          }`}
          style={{
            width: `${clampedProgress}%`,
            background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd, ${progressColor})`,
            backgroundSize: '200% 100%',
            animation: animated && clampedProgress > 0 && clampedProgress < 100 
              ? 'shimmer 2s infinite' 
              : 'none'
          }}
        >
          {/* Shimmer effect */}
          {clampedProgress > 0 && clampedProgress < 100 && animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
          
          {/* Glow effect */}
          {clampedProgress > 0 && (
            <div 
              className="absolute inset-0 blur-sm opacity-50"
              style={{
                background: `linear-gradient(90deg, ${progressColor}, transparent)`,
                width: '30%',
                right: 0
              }}
            />
          )}
        </div>

        {/* Milestone markers */}
        {showMilestones && size !== 'small' && (
          <>
            {[25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                className={`absolute top-0 bottom-0 w-0.5 ${
                  clampedProgress >= milestone
                    ? 'bg-white opacity-80'
                    : darkMode ? 'bg-gray-600 opacity-30' : 'bg-gray-300 opacity-30'
                } transition-opacity duration-500`}
                style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Progress milestones text */}
      {(showMilestones || size === 'large') && (
        <div className="flex justify-between mt-2">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <span 
              key={milestone}
              className={`${sizeClasses.milestone} font-medium transition-colors ${
                clampedProgress >= milestone
                  ? darkMode ? 'text-white' : 'text-gray-900'
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
              } ${milestone === 100 && clampedProgress >= 100 ? 'text-green-500 font-bold' : ''}`}
            >
              {milestone}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;