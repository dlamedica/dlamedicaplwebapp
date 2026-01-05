/**
 * Strona Centrum Gier
 * Główna strona z systemem gamifikacji
 */

import React from 'react';
import GameCenter from '../games/GameCenter';

interface GameCenterPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const GameCenterPage: React.FC<GameCenterPageProps> = ({ darkMode, fontSize }) => {
  return <GameCenter darkMode={darkMode} fontSize={fontSize} />;
};

export default GameCenterPage;

