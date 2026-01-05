import React from 'react';
import AnimatedSection from './AnimatedSection';
import './achievementCardStyles.css';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress?: number;
  maxProgress?: number;
  unlocked?: boolean;
  unlockedAt?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  category?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  darkMode?: boolean;
  onClick?: (achievement: Achievement) => void;
  className?: string;
}

/**
 * Unikalny komponent AchievementCard dla platformy edukacyjnej
 * Wszystkie style i animacje są stworzone od podstaw
 */
const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  darkMode = false,
  onClick,
  className = ''
}) => {
  const isUnlocked = achievement.unlocked || (achievement.progress !== undefined && achievement.maxProgress !== undefined && achievement.progress >= achievement.maxProgress);

  const getRarityStyles = () => {
    const rarities = {
      common: {
        border: darkMode ? 'border-gray-600/50' : 'border-gray-300/50',
        glow: darkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(156, 163, 175, 0.1)',
        bg: darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
      },
      rare: {
        border: darkMode ? 'border-blue-500/50' : 'border-blue-300/50',
        glow: darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
        bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50/50'
      },
      epic: {
        border: darkMode ? 'border-purple-500/50' : 'border-purple-300/50',
        glow: darkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.2)',
        bg: darkMode ? 'bg-purple-900/20' : 'bg-purple-50/50'
      },
      legendary: {
        border: darkMode ? 'border-yellow-500/50' : 'border-yellow-300/50',
        glow: darkMode ? 'rgba(234, 179, 8, 0.4)' : 'rgba(234, 179, 8, 0.3)',
        bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50/50'
      }
    };
    return rarities[achievement.rarity || 'common'];
  };

  const rarityStyles = getRarityStyles();

  return (
    <AnimatedSection animation="scaleIn" delay={0}>
      <div
        onClick={() => onClick?.(achievement)}
        className={`
          achievement-card
          group relative
          rounded-2xl p-6
          border ${rarityStyles.border}
          ${rarityStyles.bg}
          ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'}
          backdrop-blur-sm
          shadow-lg
          transition-all duration-500
          ${isUnlocked ? 'achievement-unlocked' : 'achievement-locked opacity-60'}
          ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : ''}
          ${className}
        `}
        style={{
          boxShadow: isUnlocked ? `0 10px 40px ${rarityStyles.glow}` : undefined
        }}
      >
        {/* Rarity Glow Effect */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{
              background: `radial-gradient(circle at center, ${rarityStyles.glow}, transparent 70%)`
            }}
          />
        )}

        {/* Icon */}
        <div className="relative z-10 mb-4 flex justify-center">
          <div
            className={`
              w-20 h-20 rounded-2xl
              flex items-center justify-center
              ${isUnlocked ? 'achievement-icon-unlocked' : 'achievement-icon-locked'}
              transition-all duration-500
            `}
            style={{
              background: isUnlocked
                ? `linear-gradient(135deg, ${rarityStyles.glow}, transparent)`
                : darkMode
                  ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.5), rgba(17, 24, 39, 0.5))'
                  : 'linear-gradient(135deg, rgba(243, 244, 246, 0.5), rgba(229, 231, 235, 0.5))'
            }}
          >
            <div className={isUnlocked ? '' : 'grayscale opacity-50'}>
              {achievement.icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {achievement.title}
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {achievement.description}
          </p>

          {/* Progress Bar */}
          {achievement.progress !== undefined && achievement.maxProgress !== undefined && !isUnlocked && (
            <div className="mb-2">
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full achievement-progress-bar transition-all duration-500"
                  style={{
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    background: `linear-gradient(90deg, ${rarityStyles.glow}, ${rarityStyles.glow}dd)`
                  }}
                />
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {achievement.progress} / {achievement.maxProgress}
              </p>
            </div>
          )}

          {/* Unlocked Badge */}
          {isUnlocked && achievement.unlockedAt && (
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Odblokowano: {new Date(achievement.unlockedAt).toLocaleDateString('pl-PL')}
            </div>
          )}

          {/* Category Badge */}
          {achievement.category && (
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/50 text-gray-600'}`}>
                {achievement.category}
              </span>
            </div>
          )}
        </div>

        {/* Shine Effect */}
        {isUnlocked && (
          <div className="achievement-shine absolute inset-0 rounded-2xl pointer-events-none" />
        )}
      </div>
    </AnimatedSection>
  );
};

export default AchievementCard;

