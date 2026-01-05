import React, { useState, useEffect } from 'react';
import { FaUsers, FaEye, FaShoppingCart } from 'react-icons/fa';

interface SocialProofBannerProps {
  productId: string;
  darkMode: boolean;
  variant?: 'purchase' | 'view';
  compact?: boolean;
}

const SocialProofBanner: React.FC<SocialProofBannerProps> = ({
  productId,
  darkMode,
  variant = 'purchase',
  compact = false,
}) => {
  const [count, setCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    // Symulacja danych - w rzeczywistości z API
    const mockNames = ['Anna K.', 'Jan M.', 'Maria W.', 'Piotr S.', 'Katarzyna L.'];
    const randomCount = Math.floor(Math.random() * 50) + 5;
    const randomNames = mockNames
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, randomCount));

    setCount(randomCount);
    setNames(randomNames);
  }, [productId]);

  if (count === 0) return null;

  const Icon = variant === 'purchase' ? FaShoppingCart : FaEye;
  const text = variant === 'purchase'
    ? `${names[0]}${names.length > 1 ? ` i ${count - 1} innych` : ''} ${count === 1 ? 'kupił' : 'kupiło'} ten produkt`
    : `${count} ${count === 1 ? 'osoba' : 'osób'} ${count === 1 ? 'przegląda' : 'przegląda'} ten produkt`;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <Icon size={12} />
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      darkMode ? 'bg-gray-700' : 'bg-blue-50'
    }`}>
      <div className={`flex items-center gap-1 ${
        darkMode ? 'text-[#38b6ff]' : 'text-blue-600'
      }`}>
        <FaUsers size={14} />
        <span className="text-xs font-semibold">{count}</span>
      </div>
      <span className={`text-xs ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {text}
      </span>
    </div>
  );
};

export default SocialProofBanner;
