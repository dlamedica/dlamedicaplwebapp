import React from 'react';
import './skeletonStyles.css';

interface SkeletonStatsProps {
  darkMode: boolean;
  count?: number;
}

const SkeletonStats: React.FC<SkeletonStatsProps> = ({ darkMode, count = 4 }) => {
  return (
    <div className="skeleton-stats-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-stat-card ${darkMode ? 'skeleton-dark' : 'skeleton-light'} education-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="skeleton-stat-card-content">
            <div className="skeleton-stat-icon-large"></div>
            <div className="skeleton-stat-info">
              <div className="skeleton-stat-label"></div>
              <div className="skeleton-stat-value"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonStats;

