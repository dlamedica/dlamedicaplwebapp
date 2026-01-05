/**
 * Komponent LuckyDraw - Wielkie Losowanie
 * Użytkownicy zbierają losy za zakupy i biorą udział w cotygodniowym losowaniu
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaTicketAlt, FaGift, FaTrophy, FaCoins, FaFire } from 'react-icons/fa';
import UrgencyTimer from './UrgencyTimer';

interface LuckyDrawProps {
  darkMode?: boolean;
  onClose?: () => void;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  value: number;
  type: 'points' | 'discount' | 'product';
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ darkMode = false, onClose }) => {
  const { userPoints } = useGame();
  const [tickets, setTickets] = useState(0);
  const [entered, setEntered] = useState(false);
  const [drawDate, setDrawDate] = useState<Date | null>(null);

  // Nagrody w losowaniu
  const prizes: Prize[] = [
    {
      id: '1',
      name: '1000 punktów',
      description: 'Duża nagroda w punktach',
      icon: FaCoins,
      color: '#38b6ff',
      value: 1000,
      type: 'points',
    },
    {
      id: '2',
      name: '50% rabat',
      description: 'Ogromny rabat na następny zakup',
      icon: FaGift,
      color: '#10b981',
      value: 50,
      type: 'discount',
    },
    {
      id: '3',
      name: '500 punktów',
      description: 'Średnia nagroda w punktach',
      icon: FaCoins,
      color: '#2a9fe5',
      value: 500,
      type: 'points',
    },
    {
      id: '4',
      name: 'Darmowy ebook',
      description: 'Wybierz dowolny ebook za darmo',
      icon: FaTrophy,
      color: '#f59e0b',
      value: 0,
      type: 'product',
    },
    {
      id: '5',
      name: '200 punktów',
      description: 'Mała nagroda w punktach',
      icon: FaCoins,
      color: '#8b5cf6',
      value: 200,
      type: 'points',
    },
  ];

  // Oblicz datę następnego losowania (niedziela o 20:00)
  useEffect(() => {
    const now = new Date();
    const nextSunday = new Date(now);
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(20, 0, 0, 0);
    setDrawDate(nextSunday);
  }, []);

  // Oblicz losy na podstawie zakupów (1 los za każde 50 PLN)
  useEffect(() => {
    if (userPoints) {
      const ticketsFromPurchases = Math.floor(userPoints.total_spent / 50);
      setTickets(ticketsFromPurchases);
    }
  }, [userPoints]);

  const handleEnterDraw = () => {
    if (tickets > 0 && !entered) {
      setEntered(true);
      // W rzeczywistości tutaj byłoby zapisanie do bazy danych
    }
  };

  if (!drawDate) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`}>
      <div className={`relative w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {onClose && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrophy className="text-white text-4xl" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎰 Wielkie Losowanie
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Zbieraj losy za zakupy i wygrywaj wspaniałe nagrody!
          </p>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <UrgencyTimer
            expiresAt={drawDate}
            darkMode={darkMode}
            variant="banner"
            message="Losowanie odbędzie się za:"
          />
        </div>

        {/* Tickets Info */}
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaTicketAlt className={`text-3xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Twoje losy: {tickets}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  1 los = 50 PLN zakupów
                </p>
              </div>
            </div>
            {tickets > 0 && (
              <div className={`px-4 py-2 rounded-lg font-bold ${
                darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-yellow-400 text-gray-900'
              }`}>
                {tickets} {tickets === 1 ? 'los' : tickets < 5 ? 'losy' : 'losów'}
              </div>
            )}
          </div>
        </div>

        {/* How to get tickets */}
        {tickets === 0 && (
          <div className={`p-4 rounded-lg mb-6 ${
            darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              💡 <strong>Jak zdobyć losy?</strong><br />
              Kupuj produkty w sklepie! Za każde 50 PLN otrzymujesz 1 los. Im więcej zakupów, tym więcej szans na wygraną!
            </p>
          </div>
        )}

        {/* Prizes */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Nagrody do wygrania:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prizes.map((prize, index) => {
              const Icon = prize.icon;
              return (
                <div
                  key={prize.id}
                  className={`p-4 rounded-lg border-2 ${
                    index === 0
                      ? darkMode
                        ? 'bg-yellow-900/20 border-yellow-500'
                        : 'bg-yellow-50 border-yellow-500'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: prize.color + '20' }}
                    >
                      <Icon className="text-xl" style={{ color: prize.color }} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {index === 0 && '🏆 '}
                        {prize.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {prize.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enter Button */}
        {tickets > 0 && !entered && (
          <button
            onClick={handleEnterDraw}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              darkMode
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900'
            } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
          >
            <FaTicketAlt />
            Weź udział w losowaniu ({tickets} {tickets === 1 ? 'los' : tickets < 5 ? 'losy' : 'losów'})
          </button>
        )}

        {entered && (
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              ✅ Zapisano do losowania!
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              Wyniki zostaną ogłoszone w niedzielę o 20:00. Powodzenia!
            </p>
          </div>
        )}

        {/* Info */}
        <div className={`mt-4 p-3 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            📅 Losowanie odbywa się co tydzień w niedzielę o 20:00. Im więcej losów, tym większa szansa na wygraną!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;

