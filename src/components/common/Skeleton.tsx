import React, { memo } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  darkMode?: boolean;
}

/**
 * Reusable Skeleton loader component
 * Optimized with React.memo
 */
const Skeleton: React.FC<SkeletonProps> = memo(({
  width = '100%',
  height = '1rem',
  variant = 'text',
  animation = 'pulse',
  className = '',
  darkMode = false,
}) => {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  const baseStyles = `${
    darkMode ? 'bg-gray-700' : 'bg-gray-200'
  }`;

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: darkMode
      ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'
      : 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
    none: '',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`.trim();

  return (
    <div
      className={combinedClassName}
      style={{ width: widthStyle, height: heightStyle }}
      aria-label="Loading..."
      role="status"
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.variant === nextProps.variant &&
    prevProps.animation === nextProps.animation &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.className === nextProps.className
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * Skeleton for text lines
 */
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  darkMode?: boolean;
}> = memo(({ lines = 3, className = '', darkMode = false }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '80%' : '100%'}
          height="1rem"
          variant="text"
          darkMode={darkMode}
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = 'SkeletonText';

/**
 * Skeleton for card
 */
export const SkeletonCard: React.FC<{
  className?: string;
  darkMode?: boolean;
}> = memo(({ className = '', darkMode = false }) => {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      <Skeleton width="60%" height="1.5rem" variant="text" darkMode={darkMode} />
      <SkeletonText lines={3} darkMode={darkMode} />
      <div className="flex gap-2">
        <Skeleton width="80px" height="2rem" variant="rectangular" darkMode={darkMode} />
        <Skeleton width="80px" height="2rem" variant="rectangular" darkMode={darkMode} />
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export default Skeleton;

