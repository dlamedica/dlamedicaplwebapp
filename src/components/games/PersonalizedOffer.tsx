/**
 * Komponent PersonalizedOffer - Spersonalizowane Oferty
 * Oferty dostosowane do użytkownika na podstawie jego historii i preferencji
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaGift, FaTag, FaStar, FaFire, FaTimes } from 'react-icons/fa';
import UrgencyTimer from './UrgencyTimer';

interface PersonalizedOfferProps {
  darkMode?: boolean;
  compact?: boolean;
  onDismiss?: () => void;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  code?: string;
  expiresAt: Date;
  reason: string;
  icon: any;
  color: string;
}

const PersonalizedOffer: React.FC<PersonalizedOfferProps> = ({
  darkMode = false,
  compact = false,
  onDismiss,
}) => {
  const { userPoints } = useGame();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // Generuj spersonalizowane oferty na podstawie danych użytkownika
    const generatedOffers: Offer[] = [];

    if (userPoints) {
      // Oferta dla nowych użytkowników
      if (userPoints.total_purchases === 0) {
        generatedOffers.push({
          id: 'welcome',
          title: 'Witamy w sklepie!',
          description: 'Otrzymujesz specjalną ofertę powitalną',
          discount: 15,
          discountType: 'percentage',
          code: 'WELCOME15',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          reason: 'Jesteś nowym użytkownikiem',
          icon: FaGift,
          color: '#38b6ff',
        });
      }

      // Oferta dla lojalnych klientów
      if (userPoints.total_purchases >= 5) {
        generatedOffers.push({
          id: 'loyalty',
          title: 'Dziękujemy za lojalność!',
          description: 'Specjalna oferta dla naszych stałych klientów',
          discount: 20,
          discountType: 'percentage',
          code: 'LOYAL20',
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          reason: `Kupiłeś już ${userPoints.total_purchases} produktów`,
          icon: FaStar,
          color: '#f59e0b',
        });
      }

      // Oferta dla dużych wydatków
      if (parseFloat(userPoints.total_spent.toString()) >= 1000) {
        generatedOffers.push({
          id: 'bigspender',
          title: 'VIP Oferta',
          description: 'Ekskluzywna oferta dla naszych najlepszych klientów',
          discount: 25,
          discountType: 'percentage',
          code: 'VIP25',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          reason: `Wydałeś już ${userPoints.total_spent.toFixed(2)} PLN`,
          icon: FaFire,
          color: '#ef4444',
        });
      }

      // Oferta dla wysokiego poziomu
      if (userPoints.level >= 3) {
        generatedOffers.push({
          id: 'level',
          title: 'Nagroda za poziom!',
          description: `Jesteś na poziomie ${userPoints.level} - oto specjalna oferta`,
          discount: 10,
          discountType: 'percentage',
          code: `LEVEL${userPoints.level}`,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          reason: `Osiągnąłeś poziom ${userPoints.level}`,
          icon: FaTag,
          color: '#8b5cf6',
        });
      }
    }

    setOffers(generatedOffers.filter(o => !dismissed.includes(o.id)));
  }, [userPoints, dismissed]);

  const handleDismiss = (offerId: string) => {
    setDismissed([...dismissed, offerId]);
    if (onDismiss) onDismiss();
  };

  if (offers.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {offers.slice(0, 1).map((offer) => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.id}
              className={`p-3 rounded-lg border-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500'
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: offer.color + '20' }}
                >
                  <Icon className="text-lg" style={{ color: offer.color }} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {offer.title}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {offer.discount}% rabat
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => {
        const Icon = offer.icon;
        return (
          <div
            key={offer.id}
            className={`p-6 rounded-xl border-2 ${
              darkMode
                ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500'
                : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500'
            } shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: offer.color + '20' }}
                >
                  <Icon className="text-3xl" style={{ color: offer.color }} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {offer.title}
                  </h3>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {offer.description}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-lg ${
                    darkMode ? 'bg-purple-600' : 'bg-purple-500'
                  }`}>
                    <p className="text-white font-bold text-lg">
                      {offer.discount}% RABAT
                    </p>
                  </div>
                </div>
              </div>
              {onDismiss && (
                <button
                  onClick={() => handleDismiss(offer.id)}
                  className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Code */}
            {offer.code && (
              <div className={`p-4 rounded-lg mb-4 ${
                darkMode ? 'bg-gray-800 border-2 border-dashed border-purple-500' : 'bg-white border-2 border-dashed border-purple-500'
              }`}>
                <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Twój kod rabatowy:
                </p>
                <p className={`text-2xl font-mono font-bold text-center ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  {offer.code}
                </p>
              </div>
            )}

            {/* Reason */}
            <div className={`p-3 rounded-lg mb-4 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                💡 <strong>Dlaczego otrzymałeś tę ofertę?</strong><br />
                {offer.reason}
              </p>
            </div>

            {/* Timer */}
            <UrgencyTimer
              expiresAt={offer.expiresAt}
              darkMode={darkMode}
              variant="compact"
              message="Oferta ważna do:"
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonalizedOffer;

