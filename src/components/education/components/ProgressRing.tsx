import React from 'react';
import CountUp from './CountUp';
import './progressRingStyles.css';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  darkMode?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Unikalny komponent ProgressRing - okrągły wskaźnik postępu
 * Wszystkie style i animacje są stworzone od podstaw
 */
const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#38b6ff',
  backgroundColor,
  darkMode = false,
  showPercentage = true,
  animated = true,
  className = '',
  children
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  const bgColor = backgroundColor || (darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)');

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

  return (
    <div className={`progress-ring-container ${className}`} style={{ width: size, height: size }}>
      <svg
        className={`progress-ring ${animated ? 'progress-ring-animated' : ''}`}
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          className="progress-ring-bg"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-fill"
          style={{
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none'
          }}
        />
        
        {/* Gradient Overlay */}
        <defs>
          <linearGradient id={`progress-gradient-${progressColor.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColor} stopOpacity="1" />
            <stop offset="100%" stopColor={progressColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Content */}
      <div className="progress-ring-content">
        {children ? (
          children
        ) : showPercentage ? (
          <div className="progress-ring-text">
            <CountUp end={Math.round(clampedProgress)} duration={1000} />
            <span className="progress-ring-percent">%</span>
          </div>
        ) : null}
      </div>
      
      {/* Glow Effect */}
      {clampedProgress > 0 && (
        <div
          className="progress-ring-glow"
          style={{
            boxShadow: `0 0 ${size / 4}px ${progressColor}40`
          }}
        />
      )}
    </div>
  );
};

export default ProgressRing;

