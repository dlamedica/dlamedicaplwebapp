import React from 'react';
import './skeletonStyles.css';

interface SkeletonModuleListProps {
  darkMode: boolean;
  count?: number;
}

const SkeletonModuleList: React.FC<SkeletonModuleListProps> = ({ darkMode, count = 5 }) => {
  return (
    <div className="skeleton-module-list">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-module-card ${darkMode ? 'skeleton-dark' : 'skeleton-light'} education-fade-in`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {/* Timeline Line */}
          <div className="skeleton-timeline"></div>

          {/* Module Number */}
          <div className="skeleton-module-number"></div>

          {/* Status Icon */}
          <div className="skeleton-module-header">
            <div className="skeleton-module-status-icon"></div>
            <div className="skeleton-module-status-badge"></div>
          </div>

          {/* Title and Description */}
          <div className="skeleton-module-content">
            <div className="skeleton-module-title"></div>
            <div className="skeleton-module-description">
              <div className="skeleton-line skeleton-line-medium"></div>
              <div className="skeleton-line skeleton-line-short"></div>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="skeleton-module-badge"></div>

          {/* Stats */}
          <div className="skeleton-module-stats">
            <div className="skeleton-module-stat"></div>
            <div className="skeleton-module-stat"></div>
          </div>

          {/* Progress Bar */}
          <div className="skeleton-module-progress">
            <div className="skeleton-progress-bar"></div>
          </div>

          {/* Button */}
          <div className="skeleton-module-button"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonModuleList;

