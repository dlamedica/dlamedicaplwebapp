/**
 * Kontekst do zarządzania systemem gamifikacji
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../lib/apiClient';
import * as gamificationService from '../services/gamificationService';

interface GameContextType {
  // Punkty i poziom
  userPoints: gamificationService.UserPoints | null;
  pointsHistory: gamificationService.PointsHistory[];
  loading: boolean;
  
  // Funkcje
  refreshPoints: () => Promise<void>;
  addPoints: (points: number, type: string, description?: string) => Promise<void>;
  spendPoints: (points: number, description?: string) => Promise<boolean>;
  
  // Codzienne logowanie
  canClaimDailyReward: boolean;
  claimDailyReward: () => Promise<gamificationService.DailyReward | null>;
  dailyRewardsHistory: gamificationService.DailyReward[];
  
  // Gry
  canPlaySpinWheel: boolean;
  playSpinWheel: () => Promise<gamificationService.GameReward | null>;
  unclaimedRewards: gamificationService.GameReward[];
  claimGameReward: (rewardId: string) => Promise<boolean>;
  
  // Misje
  userQuests: (gamificationService.UserQuest & { quest: gamificationService.Quest })[];
  refreshQuests: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPoints, setUserPoints] = useState<gamificationService.UserPoints | null>(null);
  const [pointsHistory, setPointsHistory] = useState<gamificationService.PointsHistory[]>([]);
  const [dailyRewardsHistory, setDailyRewardsHistory] = useState<gamificationService.DailyReward[]>([]);
  const [unclaimedRewards, setUnclaimedRewards] = useState<gamificationService.GameReward[]>([]);
  const [userQuests, setUserQuests] = useState<(gamificationService.UserQuest & { quest: gamificationService.Quest })[]>([]);
  const [canClaimDailyReward, setCanClaimDailyReward] = useState(false);
  const [canPlaySpinWheel, setCanPlaySpinWheel] = useState(false);
  const [loading, setLoading] = useState(true);

  // Pobierz aktualnego użytkownika
  const getCurrentUser = useCallback(async () => {
    const { data: { user } } = await db.auth.getUser();
    return user;
  }, []);

  // Odśwież punkty użytkownika
  const refreshPoints = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setUserPoints(null);
        setLoading(false);
        return;
      }

      const points = await gamificationService.getUserPoints(user.id);
      setUserPoints(points);

      if (points) {
        // Pobierz historię punktów
        const history = await gamificationService.getPointsHistory(user.id, 20);
        setPointsHistory(history);

        // Sprawdź codzienne nagrody
        const canClaim = await gamificationService.canClaimDailyReward(user.id);
        setCanClaimDailyReward(canClaim);

        // Pobierz historię codziennych nagród
        const dailyHistory = await gamificationService.getDailyRewardsHistory(user.id, 7);
        setDailyRewardsHistory(dailyHistory);

        // Sprawdź koło fortuny
        const canPlay = await gamificationService.canPlaySpinWheel(user.id);
        setCanPlaySpinWheel(canPlay);

        // Pobierz nieodebrane nagrody
        const unclaimed = await gamificationService.getUnclaimedGameRewards(user.id);
        setUnclaimedRewards(unclaimed);
      }
    } catch (error) {
      console.error('Błąd podczas odświeżania punktów:', error);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser]);

  // Dodaj punkty
  const addPoints = useCallback(async (
    points: number,
    type: string,
    description?: string
  ) => {
    const user = await getCurrentUser();
    if (!user) return;

    const success = await gamificationService.addPoints(
      user.id,
      points,
      type,
      description
    );

    if (success) {
      await refreshPoints();
    }
  }, [getCurrentUser, refreshPoints]);

  // Wydaj punkty
  const spendPoints = useCallback(async (
    points: number,
    description?: string
  ): Promise<boolean> => {
    const user = await getCurrentUser();
    if (!user) return false;

    const success = await gamificationService.spendPoints(
      user.id,
      points,
      description
    );

    if (success) {
      await refreshPoints();
    }

    return success;
  }, [getCurrentUser, refreshPoints]);

  // Odbierz codzienną nagrodę
  const claimDailyReward = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return null;

    const reward = await gamificationService.claimDailyReward(user.id);
    
    if (reward) {
      await refreshPoints();
    }

    return reward;
  }, [getCurrentUser, refreshPoints]);

  // Graj w koło fortuny
  const playSpinWheel = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return null;

    const reward = await gamificationService.playSpinWheel(user.id);
    
    if (reward) {
      await refreshPoints();
    }

    return reward;
  }, [getCurrentUser, refreshPoints]);

  // Odbierz nagrodę z gry
  const claimGameReward = useCallback(async (rewardId: string) => {
    const success = await gamificationService.claimGameReward(rewardId);
    
    if (success) {
      await refreshPoints();
    }

    return success;
  }, [refreshPoints]);

  // Odśwież misje
  const refreshQuests = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setUserQuests([]);
        return;
      }

      const quests = await gamificationService.getUserQuests(user.id);
      setUserQuests(quests);
    } catch (error) {
      console.error('Błąd podczas odświeżania misji:', error);
    }
  }, [getCurrentUser]);

  // Inicjalizacja przy załadowaniu
  useEffect(() => {
    refreshPoints();
    refreshQuests();

    // Nasłuchuj zmian w sesji użytkownika
    const { data: { subscription } } = db.auth.onAuthStateChange(() => {
      refreshPoints();
      refreshQuests();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshPoints, refreshQuests]);

  const value: GameContextType = {
    userPoints,
    pointsHistory,
    loading,
    refreshPoints,
    addPoints,
    spendPoints,
    canClaimDailyReward,
    claimDailyReward,
    dailyRewardsHistory,
    canPlaySpinWheel,
    playSpinWheel,
    unclaimedRewards,
    claimGameReward,
    userQuests,
    refreshQuests,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

