import React from 'react';
import CountUp from './CountUp';
import AnimatedSection from './AnimatedSection';
import './statCardStyles.css';

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  gradient?: string;
  suffix?: string;
  prefix?: string;
  darkMode?: boolean;
  infoTooltip?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

/**
 * Unikalny komponent StatCard dla statystyk
 * Wszystkie style i animacje są stworzone od podstaw
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#38b6ff',
  gradient,
  suffix = '',
  prefix = '',
  darkMode = false,
  infoTooltip,
  trend,
  className = '',
  delay = 0
}) => {
  const gradientClass = gradient || `from-[${color}] to-[${color}]dd`;

  return (
    <AnimatedSection animation="fadeIn" delay={delay}>
      <div
        className={`
          stat-card
          group relative
          p-6 rounded-2xl
          ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'}
          education-glass
          border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}
          shadow-lg
          transition-all duration-500
          hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
          overflow-hidden
          ${className}
        `}
      >
        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
          style={{
            background: `radial-gradient(circle at center, ${color}40, transparent 70%)`
          }}
        />

        {/* Content */}
        <div className="flex items-center relative z-10">
          {/* Icon */}
          <div
            className={`
              p-4 rounded-xl
              bg-gradient-to-br ${gradientClass}
              mr-4
              education-icon-wrapper
              shadow-lg
              group-hover:scale-110 group-hover:rotate-3
              transition-all duration-300
            `}
          >
            <div className="text-white">
              {icon}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {title}
              </p>
              {infoTooltip && (
                <span className="text-xs text-gray-400 cursor-help" title={infoTooltip}>
                  ℹ️
                </span>
              )}
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {prefix}
              <CountUp end={value} duration={2000} />
              {suffix}
            </p>
            
            {/* Trend */}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${
                trend.isPositive
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                <span className={trend.isPositive ? '↑' : '↓'} />
                <span className="ml-1">
                  {Math.abs(trend.value)}% vs poprzedni okres
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shine Effect */}
        <div className="stat-card-shine absolute inset-0 rounded-2xl pointer-events-none" />
      </div>
    </AnimatedSection>
  );
};

export default StatCard;

