import React from 'react';
import { FaClock } from 'react-icons/fa';

interface RecentlyViewedBadgeProps {
  darkMode: boolean;
  viewedAt: Date;
}

const RecentlyViewedBadge: React.FC<RecentlyViewedBadgeProps> = ({ darkMode, viewedAt }) => {
  const getTimeAgo = () => {
    const now = new Date();
    const diff = now.getTime() - viewedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Właśnie teraz';
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minutę' : 'minut'} temu`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'godzinę' : 'godzin'} temu`;
    return `${days} ${days === 1 ? 'dzień' : 'dni'} temu`;
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
      darkMode
        ? 'bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-500'
        : 'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      <FaClock size={10} />
      <span>{getTimeAgo()}</span>
    </div>
  );
};

export default RecentlyViewedBadge;

