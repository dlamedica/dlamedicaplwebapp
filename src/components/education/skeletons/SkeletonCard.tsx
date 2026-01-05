import React from 'react';
import './skeletonStyles.css';

interface SkeletonCardProps {
  darkMode: boolean;
  count?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ darkMode, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-card ${darkMode ? 'skeleton-dark' : 'skeleton-light'} education-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Icon Skeleton */}
          <div className="skeleton-header">
            <div className="skeleton-icon"></div>
            <div className="skeleton-title-group">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
            <div className="skeleton-badge"></div>
          </div>

          {/* Description Skeleton */}
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-line-long"></div>
            <div className="skeleton-line skeleton-line-medium"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="skeleton-stats">
            <div className="skeleton-stat-item">
              <div className="skeleton-stat-icon"></div>
              <div className="skeleton-stat-text"></div>
            </div>
            <div className="skeleton-stat-item">
              <div className="skeleton-stat-icon"></div>
              <div className="skeleton-stat-text"></div>
            </div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="skeleton-progress">
            <div className="skeleton-progress-bar"></div>
          </div>

          {/* Button Skeleton */}
          <div className="skeleton-button"></div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;

