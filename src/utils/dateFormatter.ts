export const formatPublishedDate = (dateString: string): string => {
  const publishedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - publishedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 1) {
      return 'Przed chwilą';
    }
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minutę' : diffInMinutes < 5 ? 'minuty' : 'minut'} temu`;
  }

  if (diffInHours < 24) {
    if (diffInHours === 1) {
      return '1 godzinę temu';
    } else if (diffInHours < 5) {
      return `${diffInHours} godziny temu`;
    } else {
      return `${diffInHours} godzin temu`;
    }
  }

  // Format as DD.MM.YYYY for dates older than 24 hours
  const day = publishedDate.getDate().toString().padStart(2, '0');
  const month = (publishedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = publishedDate.getFullYear();
  
  return `${day}.${month}.${year}`;
};

import React from 'react';

export const useAutoRefreshTime = (refreshInterval: number = 3600000) => {
  const [, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);
};