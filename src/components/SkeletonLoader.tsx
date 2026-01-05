import React from 'react';

interface SkeletonLoaderProps {
  darkMode: boolean;
  highContrast: boolean;
  type: 'article' | 'job' | 'card' | 'list' | 'table';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  darkMode, 
  highContrast, 
  type, 
  count = 1 
}) => {
  const getSkeletonBaseClass = () => {
    return `animate-pulse ${
      highContrast
        ? 'bg-gray-300'
        : darkMode
          ? 'bg-gray-700'
          : 'bg-gray-200'
    }`;
  };

  const getContainerClass = () => {
    return `${
      highContrast
        ? 'bg-white border-2 border-black'
        : darkMode
          ? 'bg-black border border-gray-700'
          : 'bg-white border border-gray-200'
    } rounded-lg p-6 shadow-lg`;
  };

  const ArticleSkeleton = () => (
    <div className={getContainerClass()}>
      <div className="md:flex md:space-x-6">
        {/* Image skeleton */}
        <div className="md:w-1/3 mb-4 md:mb-0">
          <div className={`w-full h-48 md:h-32 rounded-lg ${getSkeletonBaseClass()}`}></div>
        </div>
        
        {/* Content skeleton */}
        <div className="md:w-2/3 space-y-4">
          {/* Title skeleton */}
          <div className={`h-6 rounded ${getSkeletonBaseClass()}`}></div>
          <div className={`h-6 w-3/4 rounded ${getSkeletonBaseClass()}`}></div>
          
          {/* Excerpt skeleton */}
          <div className="space-y-2">
            <div className={`h-4 rounded ${getSkeletonBaseClass()}`}></div>
            <div className={`h-4 rounded ${getSkeletonBaseClass()}`}></div>
            <div className={`h-4 w-2/3 rounded ${getSkeletonBaseClass()}`}></div>
          </div>
          
          {/* Date skeleton */}
          <div className={`h-3 w-24 rounded ${getSkeletonBaseClass()}`}></div>
        </div>
      </div>
    </div>
  );

  const JobSkeleton = () => (
    <div className={getContainerClass()}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className={`h-6 w-3/4 rounded mb-2 ${getSkeletonBaseClass()}`}></div>
          <div className={`h-4 w-1/2 rounded ${getSkeletonBaseClass()}`}></div>
        </div>
        <div className={`h-6 w-20 rounded ${getSkeletonBaseClass()}`}></div>
      </div>
      
      {/* Content */}
      <div className="space-y-3 mb-4">
        <div className={`h-4 rounded ${getSkeletonBaseClass()}`}></div>
        <div className={`h-4 w-5/6 rounded ${getSkeletonBaseClass()}`}></div>
      </div>
      
      {/* Tags */}
      <div className="flex space-x-2 mb-4">
        <div className={`h-6 w-16 rounded-full ${getSkeletonBaseClass()}`}></div>
        <div className={`h-6 w-20 rounded-full ${getSkeletonBaseClass()}`}></div>
        <div className={`h-6 w-14 rounded-full ${getSkeletonBaseClass()}`}></div>
      </div>
      
      {/* Button */}
      <div className={`h-10 w-full rounded-lg ${getSkeletonBaseClass()}`}></div>
    </div>
  );

  const CardSkeleton = () => (
    <div className={getContainerClass()}>
      {/* Header with icon */}
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg mr-4 ${getSkeletonBaseClass()}`}></div>
        <div className="flex-1">
          <div className={`h-5 w-3/4 rounded mb-2 ${getSkeletonBaseClass()}`}></div>
          <div className={`h-3 w-1/2 rounded ${getSkeletonBaseClass()}`}></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3 mb-4">
        <div className={`h-4 rounded ${getSkeletonBaseClass()}`}></div>
        <div className={`h-4 w-4/5 rounded ${getSkeletonBaseClass()}`}></div>
      </div>
      
      {/* Button */}
      <div className={`h-9 w-full rounded-lg ${getSkeletonBaseClass()}`}></div>
    </div>
  );

  const ListSkeleton = () => (
    <div className={getContainerClass()}>
      {/* List items */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className={`flex items-center py-3 ${index < 4 ? 'border-b border-gray-200' : ''}`}>
          <div className={`w-8 h-8 rounded-full mr-3 ${getSkeletonBaseClass()}`}></div>
          <div className="flex-1">
            <div className={`h-4 w-3/4 rounded mb-1 ${getSkeletonBaseClass()}`}></div>
            <div className={`h-3 w-1/2 rounded ${getSkeletonBaseClass()}`}></div>
          </div>
          <div className={`h-6 w-16 rounded ${getSkeletonBaseClass()}`}></div>
        </div>
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <div className={getContainerClass()}>
      {/* Table header */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-3 border-b border-gray-200">
        <div className={`h-5 rounded ${getSkeletonBaseClass()}`}></div>
        <div className={`h-5 rounded ${getSkeletonBaseClass()}`}></div>
        <div className={`h-5 rounded ${getSkeletonBaseClass()}`}></div>
      </div>
      
      {/* Table rows */}
      {[...Array(8)].map((_, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0">
          <div className={`h-4 rounded ${getSkeletonBaseClass()}`}></div>
          <div className={`h-4 rounded ${getSkeletonBaseClass()}`}></div>
          <div className={`h-4 w-3/4 rounded ${getSkeletonBaseClass()}`}></div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'article':
        return <ArticleSkeleton />;
      case 'job':
        return <JobSkeleton />;
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'table':
        return <TableSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;