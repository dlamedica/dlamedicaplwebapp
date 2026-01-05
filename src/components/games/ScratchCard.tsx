/**
 * Komponent kart do zdrapywania
 * Użytkownik zdrapuje kartę po zakupie powyżej określonej kwoty
 */

import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaGift, FaCoins, FaTicketAlt } from 'react-icons/fa';

interface ScratchCardProps {
  darkMode?: boolean;
  orderAmount?: number; // Kwota zamówienia, która odblokowała kartę
  onClose?: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ darkMode = false, orderAmount, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState<any>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  // Nagrody możliwe do wygrania
  const possibleRewards = [
    { type: 'points', value: 50, label: '50 punktów', icon: FaCoins, color: '#38b6ff' },
    { type: 'points', value: 100, label: '100 punktów', icon: FaCoins, color: '#2a9fe5' },
    { type: 'points', value: 200, label: '200 punktów', icon: FaCoins, color: '#1e7fc7' },
    { type: 'discount', value: 10, label: '10% rabat', icon: FaTicketAlt, color: '#10b981' },
    { type: 'discount', value: 20, label: '20% rabat', icon: FaTicketAlt, color: '#059669' },
  ];

  // Losuj nagrodę
  const selectedReward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ustaw rozmiar canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Rysuj warstwę do zdrapywania (srebrna)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dodaj tekst "ZDRAP MNIE"
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ZDRAP MNIE', canvas.width / 2, canvas.height / 2);

    // Dodaj wzór
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratch(e);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratchTouch(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratchTouch(e);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Usuń obszar wokół kursora
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Sprawdź ile zostało zdrapane
    checkScratchProgress();
  };

  const scratchTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pobierz dane obrazu
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Policz przezroczyste piksele
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    const percentage = (transparentPixels / totalPixels) * 100;
    setScratchPercentage(percentage);

    // Jeśli zdrapano więcej niż 50%, pokaż nagrodę
    if (percentage > 50 && !revealed) {
      setRevealed(true);
      setReward(selectedReward);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`}>
      <div className={`relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-4">
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Karta do zdrapywania
          </h2>
          {orderAmount && (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Dzięki zakupowi za {orderAmount.toFixed(2)} PLN!
            </p>
          )}
        </div>

        {/* Karta */}
        <div className="relative mb-4">
          <div className={`relative w-full h-64 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {/* Nagroda pod warstwą */}
            {revealed && reward && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <reward.icon className={`text-6xl mx-auto mb-2`} style={{ color: reward.color }} />
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {reward.label}
                  </p>
                </div>
              </div>
            )}

            {/* Warstwa do zdrapywania */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ display: revealed ? 'none' : 'block' }}
            />
          </div>

          {/* Postęp zdrapywania */}
          {!revealed && (
            <div className="mt-2">
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] rounded-full transition-all duration-300"
                  style={{ width: `${scratchPercentage}%` }}
                ></div>
              </div>
              <p className={`text-xs text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Zdrap {50 - Math.floor(scratchPercentage)}% więcej, aby zobaczyć nagrodę!
              </p>
            </div>
          )}
        </div>

        {/* Instrukcja */}
        {!revealed && (
          <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              💡 Przesuń palcem lub myszką po karcie, aby ją zdrapać
            </p>
          </div>
        )}

        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5]'
              : 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5]'
          }`}
        >
          {revealed ? 'Zamknij' : 'Anuluj'}
        </button>
      </div>
    </div>
  );
};

export default ScratchCard;

