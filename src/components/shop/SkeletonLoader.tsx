import React from 'react';

interface SkeletonLoaderProps {
  darkMode: boolean;
  type?: 'card' | 'list' | 'text' | 'image';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  darkMode, 
  type = 'card', 
  count = 1 
}) => {
  const baseClasses = `animate-pulse ${
    darkMode ? 'bg-gray-700' : 'bg-gray-200'
  }`;

  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`rounded-lg overflow-hidden shadow-md ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Image skeleton */}
            <div className={`h-64 ${baseClasses}`} />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className={`h-4 w-3/4 rounded ${baseClasses}`} />
              <div className={`h-3 w-1/2 rounded ${baseClasses}`} />
              <div className="flex items-center gap-2">
                <div className={`h-3 w-16 rounded ${baseClasses}`} />
                <div className={`h-3 w-20 rounded ${baseClasses}`} />
              </div>
              <div className={`h-6 w-24 rounded ${baseClasses}`} />
              <div className="flex gap-2">
                <div className={`h-10 flex-1 rounded ${baseClasses}`} />
                <div className={`h-10 flex-1 rounded ${baseClasses}`} />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg mb-2 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className={`h-4 w-3/4 rounded mb-2 ${baseClasses}`} />
            <div className={`h-3 w-1/2 rounded ${baseClasses}`} />
          </div>
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`h-4 rounded ${baseClasses}`}
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className={`w-full h-full rounded ${baseClasses}`} />
    );
  }

  return null;
};

export default SkeletonLoader;

