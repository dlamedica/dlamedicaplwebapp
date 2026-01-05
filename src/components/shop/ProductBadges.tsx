import React from 'react';
import { FaStar, FaFire, FaTag, FaAward } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';

interface ProductBadgesProps {
  ebook: Ebook;
  darkMode: boolean;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({ ebook, darkMode }) => {
  const badges = [];

  if (ebook.isNew) {
    badges.push({
      icon: FaStar,
      text: 'NOWOŚĆ',
      color: 'bg-green-500',
      textColor: 'text-white',
    });
  }

  if (ebook.isBestseller) {
    badges.push({
      icon: FaAward,
      text: 'BESTSELLER',
      color: 'bg-orange-500',
      textColor: 'text-white',
    });
  }

  if (ebook.isOnSale && ebook.originalPrice) {
    const discount = Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100);
    badges.push({
      icon: FaTag,
      text: `-${discount}%`,
      color: 'bg-red-500',
      textColor: 'text-white',
    });
  }

  if (ebook.rating && ebook.rating >= 4.5) {
    badges.push({
      icon: FaStar,
      text: 'TOP OCENA',
      color: darkMode ? 'bg-yellow-600' : 'bg-yellow-500',
      textColor: 'text-white',
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className={`${badge.color} ${badge.textColor} px-2 py-1 rounded text-xs font-bold flex items-center gap-1`}
          >
            <Icon size={10} />
            <span>{badge.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProductBadges;

