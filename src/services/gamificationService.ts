/**
 * Serwis do zarządzania systemem gamifikacji
 * Obsługuje punkty, poziomy, nagrody, misje i gry
 */

import { db } from '../lib/apiClient';

// ===================================
// TYPY
// ===================================

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  available_points: number;
  spent_points: number;
  level: number;
  experience: number;
  experience_to_next_level: number;
  total_purchases: number;
  total_spent: number;
  streak_days: number;
  last_checkin_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PointsHistory {
  id: string;
  user_id: string;
  points: number;
  balance_after: number;
  transaction_type: string;
  description: string | null;
  order_id: string | null;
  quest_id: string | null;
  reward_id: string | null;
  created_at: string;
}

export interface DailyReward {
  id: string;
  user_id: string;
  reward_date: string;
  reward_type: 'points' | 'discount' | 'free_product';
  reward_value: string; // JSON
  points_awarded: number;
  is_claimed: boolean;
  claimed_at: string | null;
  created_at: string;
}

export interface GameReward {
  id: string;
  user_id: string;
  game_type: 'spin_wheel' | 'scratch_card' | 'lucky_draw';
  reward_type: 'points' | 'discount_code' | 'free_product' | 'nothing';
  reward_value: string; // JSON
  discount_code: string | null;
  discount_percentage: number | null;
  points_awarded: number;
  is_claimed: boolean;
  claimed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  quest_type: string;
  target_value: number;
  target_metric: string | null;
  reward_points: number;
  reward_discount_code_id: string | null;
  quest_period: 'daily' | 'weekly' | 'monthly' | 'permanent';
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  current_progress: number;
  target_progress: number;
  is_completed: boolean;
  completed_at: string | null;
  reward_claimed: boolean;
  reward_claimed_at: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  max_uses_per_user: number;
  valid_from: string;
  valid_until: string | null;
  min_order_amount: number;
  is_active: boolean;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ===================================
// FUNKCJE POMOCNICZE
// ===================================

/**
 * Oblicza doświadczenie potrzebne na następny poziom
 */
function calculateExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Inicjalizuje punkty użytkownika jeśli nie istnieją
 */
async function ensureUserPoints(userId: string): Promise<UserPoints> {
  const { data: existing, error: fetchError } = await db
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing as UserPoints;
  }

  // Utwórz nowy rekord
  const expToNext = calculateExpForLevel(1);
  const { data: newPoints, error: insertError } = await db
    .from('user_points')
    .insert({
      user_id: userId,
      experience_to_next_level: expToNext,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Błąd podczas tworzenia punktów: ${insertError.message}`);
  }

  return newPoints as UserPoints;
}

// ===================================
// PUNKTY I POZIOMY
// ===================================



/**
 * Pobiera punkty użytkownika
 */
export async function getUserPoints(userId: string): Promise<UserPoints | null> {
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return {
        id: 'mock-points',
        user_id: userId,
        total_points: 1250,
        available_points: 850,
        spent_points: 400,
        level: 5,
        experience: 2500,
        experience_to_next_level: 5000,
        total_purchases: 3,
        total_spent: 1500,
        streak_days: 12,
        last_checkin_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserPoints;
    }

    const { data, error } = await db
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Brak rekordu - utwórz go
        return await ensureUserPoints(userId);
      }
      throw error;
    }

    return data as UserPoints;
  } catch (error) {
    console.error('Błąd podczas pobierania punktów:', error);
    return null;
  }
}

/**
 * Dodaje punkty użytkownikowi
 */
export async function addPoints(
  userId: string,
  points: number,
  transactionType: string,
  description?: string,
  orderId?: string,
  questId?: string,
  rewardId?: string
): Promise<boolean> {
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.log('🧪 Mocking addPoints success');
      return true;
    }

    // Upewnij się, że użytkownik ma rekord punktów
    const userPoints = await ensureUserPoints(userId);

    // Zaktualizuj punkty
    const newTotal = userPoints.total_points + points;
    const newAvailable = userPoints.available_points + points;

    const { error: updateError } = await db
      .from('user_points')
      .update({
        total_points: newTotal,
        available_points: newAvailable,
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Dodaj wpis do historii
    const { error: historyError } = await db
      .from('points_history')
      .insert({
        user_id: userId,
        points: points,
        balance_after: newAvailable,
        transaction_type: transactionType,
        description: description || null,
        order_id: orderId || null,
        quest_id: questId || null,
        reward_id: rewardId || null,
      });

    if (historyError) {
      console.error('Błąd podczas dodawania historii punktów:', historyError);
      // Nie rzucamy błędu, bo punkty już zostały dodane
    }

    return true;
  } catch (error) {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return true;
    }
    console.error('Błąd podczas dodawania punktów:', error);
    return false;
  }
}

/**
 * Wydaje punkty (wymiana na rabat)
 */
export async function spendPoints(
  userId: string,
  points: number,
  description?: string
): Promise<boolean> {
  try {
    const userPoints = await ensureUserPoints(userId);

    if (userPoints.available_points < points) {
      throw new Error('Niewystarczająca ilość punktów');
    }

    const newAvailable = userPoints.available_points - points;
    const newSpent = userPoints.spent_points + points;

    const { error: updateError } = await db
      .from('user_points')
      .update({
        available_points: newAvailable,
        spent_points: newSpent,
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Dodaj wpis do historii
    await db
      .from('points_history')
      .insert({
        user_id: userId,
        points: -points,
        balance_after: newAvailable,
        transaction_type: 'redeem_discount',
        description: description || null,
      });

    return true;
  } catch (error) {
    console.error('Błąd podczas wydawania punktów:', error);
    return false;
  }
}

/**
 * Dodaje doświadczenie i sprawdza awans poziomu
 */
export async function addExperience(
  userId: string,
  experience: number
): Promise<{ leveledUp: boolean; newLevel?: number }> {
  try {
    const userPoints = await ensureUserPoints(userId);

    let newExp = userPoints.experience + experience;
    let newLevel = userPoints.level;
    let leveledUp = false;

    // Sprawdź czy użytkownik awansował poziom
    while (newExp >= userPoints.experience_to_next_level) {
      newExp -= userPoints.experience_to_next_level;
      newLevel += 1;
      leveledUp = true;
    }

    const expToNext = calculateExpForLevel(newLevel);

    const { error: updateError } = await db
      .from('user_points')
      .update({
        experience: newExp,
        level: newLevel,
        experience_to_next_level: expToNext,
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Jeśli awansował, dodaj bonusowe punkty
    if (leveledUp) {
      const bonusPoints = newLevel * 50; // 50 punktów za każdy poziom
      await addPoints(
        userId,
        bonusPoints,
        'level_up',
        `Awans na poziom ${newLevel}!`
      );
    }

    return { leveledUp, newLevel: leveledUp ? newLevel : undefined };
  } catch (error) {
    console.error('Błąd podczas dodawania doświadczenia:', error);
    return { leveledUp: false };
  }
}

/**
 * Pobiera historię punktów użytkownika
 */
export async function getPointsHistory(
  userId: string,
  limit: number = 50
): Promise<PointsHistory[]> {
  try {
    const { data, error } = await db
      .from('points_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []) as PointsHistory[];
  } catch (error) {
    console.error('Błąd podczas pobierania historii punktów:', error);
    return [];
  }
}

// ===================================
// CODZIENNE LOGOWANIE
// ===================================

/**
 * Sprawdza czy użytkownik może odebrać dzisiejszą nagrodę
 */
export async function canClaimDailyReward(userId: string): Promise<boolean> {
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return true; // Always allow in mock mode
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await db
      .from('daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('reward_date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Jeśli nie ma nagrody na dziś, można ją odebrać
    return !data || !data.is_claimed;
  } catch (error) {
    console.error('Błąd podczas sprawdzania codziennej nagrody:', error);
    return false;
  }
}

/**
 * Odbiera codzienną nagrodę
 */
export async function claimDailyReward(userId: string): Promise<DailyReward | null> {
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return {
        id: 'mock-reward',
        user_id: userId,
        reward_date: new Date().toISOString().split('T')[0],
        reward_type: 'points',
        reward_value: JSON.stringify({ points: 50, streak: 12 }),
        points_awarded: 50,
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      } as DailyReward;
    }

    const today = new Date().toISOString().split('T')[0];
    const userPoints = await ensureUserPoints(userId);

    // Sprawdź czy już odebrano
    const { data: existing } = await db
      .from('daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('reward_date', today)
      .single();

    if (existing && existing.is_claimed) {
      throw new Error('Dzisiejsza nagroda została już odebrana');
    }

    // Oblicz dzień serii
    const lastCheckin = userPoints.last_checkin_date
      ? new Date(userPoints.last_checkin_date)
      : null;
    const todayDate = new Date(today);
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);

    let streakDays = userPoints.streak_days;
    const lastCheckinDate = lastCheckin ? lastCheckin.toISOString().split('T')[0] : null;
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    if (!lastCheckin || lastCheckinDate === yesterdayDate) {
      // Kontynuacja serii
      streakDays += 1;
    } else if (lastCheckinDate !== today) {
      // Przerwanie serii
      streakDays = 1;
    }

    // Oblicz nagrodę (więcej punktów za dłuższą serię)
    const basePoints = 10;
    const streakBonus = Math.min(streakDays * 5, 50); // max 50 bonusowych punktów
    const pointsAwarded = basePoints + streakBonus;

    // Utwórz nagrodę
    const rewardValue = JSON.stringify({
      points: pointsAwarded,
      streak: streakDays,
    });

    const { data: reward, error: insertError } = await db
      .from('daily_rewards')
      .upsert({
        user_id: userId,
        reward_date: today,
        reward_type: 'points',
        reward_value: rewardValue,
        points_awarded: pointsAwarded,
        is_claimed: true,
        claimed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,reward_date',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Dodaj punkty
    await addPoints(
      userId,
      pointsAwarded,
      'daily_checkin',
      `Codzienna nagroda (seria: ${streakDays} dni)`
    );

    // Zaktualizuj serię i datę ostatniego logowania
    await db
      .from('user_points')
      .update({
        streak_days: streakDays,
        last_checkin_date: today,
      })
      .eq('user_id', userId);

    // Dodaj doświadczenie
    await addExperience(userId, 10);

    return reward as DailyReward;
  } catch (error) {
    console.error('Błąd podczas odbierania codziennej nagrody:', error);
    return null;
  }
}

/**
 * Pobiera historię codziennych nagród
 */
export async function getDailyRewardsHistory(
  userId: string,
  limit: number = 30
): Promise<DailyReward[]> {
  try {
    const { data, error } = await db
      .from('daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .order('reward_date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []) as DailyReward[];
  } catch (error) {
    console.error('Błąd podczas pobierania historii codziennych nagród:', error);
    return [];
  }
}

// ===================================
// GRY (KOŁO FORTUNY, KARTY DO ZDRAPYWANIA)
// ===================================

/**
 * Sprawdza czy użytkownik może zagrać w koło fortuny
 */
export async function canPlaySpinWheel(userId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Sprawdź czy już grał dziś
    const { data, error } = await db
      .from('game_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', 'spin_wheel')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)
      .limit(1);

    if (error) throw error;

    // Można grać raz dziennie
    return !data || data.length === 0;
  } catch (error) {
    console.error('Błąd podczas sprawdzania koła fortuny:', error);
    return false;
  }
}

/**
 * Gra w koło fortuny
 */
export async function playSpinWheel(userId: string): Promise<GameReward | null> {
  try {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return {
        id: 'mock-spin',
        user_id: userId,
        game_type: 'spin_wheel',
        reward_type: 'points',
        reward_value: JSON.stringify({ points: 100 }),
        discount_code: null,
        discount_percentage: null,
        points_awarded: 100,
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        expires_at: null,
        created_at: new Date().toISOString()
      } as GameReward;
    }

    // Sprawdź czy może grać
    const canPlay = await canPlaySpinWheel(userId);
    if (!canPlay) {
      throw new Error('Możesz zagrać tylko raz dziennie');
    }

    // Nagrody możliwe do wygrania
    const rewards = [
      { type: 'points', value: 50, probability: 0.3 },
      { type: 'points', value: 100, probability: 0.2 },
      { type: 'points', value: 200, probability: 0.1 },
      { type: 'discount_code', value: 5, probability: 0.15 }, // 5% rabat
      { type: 'discount_code', value: 10, probability: 0.1 }, // 10% rabat
      { type: 'discount_code', value: 20, probability: 0.05 }, // 20% rabat
      { type: 'nothing', value: 0, probability: 0.1 },
    ];

    // Losuj nagrodę
    const random = Math.random();
    let cumulative = 0;
    let selectedReward = rewards[0];

    for (const reward of rewards) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        selectedReward = reward;
        break;
      }
    }

    // Utwórz nagrodę
    let rewardValue: any = {};
    let discountCode: string | null = null;
    let discountPercentage: number | null = null;
    let pointsAwarded = 0;

    if (selectedReward.type === 'points') {
      pointsAwarded = selectedReward.value as number;
      rewardValue = { points: pointsAwarded };
    } else if (selectedReward.type === 'discount_code') {
      discountPercentage = selectedReward.value as number;
      // Generuj unikalny kod rabatowy
      discountCode = `WHEEL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      rewardValue = { discount_percentage: discountPercentage, code: discountCode };

      // Utwórz kod rabatowy w bazie
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Ważny 7 dni

      await db
        .from('discount_codes')
        .insert({
          code: discountCode,
          discount_type: 'percentage',
          discount_value: discountPercentage,
          valid_from: new Date().toISOString(),
          valid_until: expiresAt.toISOString(),
          max_uses: 1,
          max_uses_per_user: 1,
          is_active: true,
        });
    } else {
      rewardValue = { message: 'Niestety, tym razem nic nie wygrałeś' };
    }

    // Zapisz nagrodę
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Nagroda ważna 30 dni

    const { data: gameReward, error: insertError } = await db
      .from('game_rewards')
      .insert({
        user_id: userId,
        game_type: 'spin_wheel',
        reward_type: selectedReward.type === 'points' ? 'points' : 'discount_code',
        reward_value: JSON.stringify(rewardValue),
        discount_code: discountCode,
        discount_percentage: discountPercentage,
        points_awarded: pointsAwarded,
        is_claimed: false,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Jeśli to punkty, dodaj je od razu
    if (pointsAwarded > 0) {
      await addPoints(
        userId,
        pointsAwarded,
        'spin_wheel',
        'Nagroda z koła fortuny'
      );
      // Oznacz jako odebrane
      await db
        .from('game_rewards')
        .update({ is_claimed: true, claimed_at: new Date().toISOString() })
        .eq('id', gameReward.id);
    }

    return gameReward as GameReward;
  } catch (error) {
    console.error('Błąd podczas gry w koło fortuny:', error);
    return null;
  }
}

/**
 * Odbiera nagrodę z gry
 */
export async function claimGameReward(rewardId: string): Promise<boolean> {
  try {
    const { data: reward, error: fetchError } = await db
      .from('game_rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (fetchError || !reward) {
      throw new Error('Nagroda nie została znaleziona');
    }

    if (reward.is_claimed) {
      throw new Error('Nagroda została już odebrana');
    }

    // Jeśli to punkty, dodaj je
    if (reward.reward_type === 'points' && reward.points_awarded > 0) {
      await addPoints(
        reward.user_id,
        reward.points_awarded,
        reward.game_type,
        'Nagroda z gry'
      );
    }

    // Oznacz jako odebrane
    const { error: updateError } = await db
      .from('game_rewards')
      .update({
        is_claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', rewardId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Błąd podczas odbierania nagrody z gry:', error);
    return false;
  }
}

/**
 * Pobiera nieodebrane nagrody użytkownika
 */
export async function getUnclaimedGameRewards(userId: string): Promise<GameReward[]> {
  try {
    const { data, error } = await db
      .from('game_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('is_claimed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []) as GameReward[];
  } catch (error) {
    console.error('Błąd podczas pobierania nieodebranych nagród:', error);
    return [];
  }
}

// ===================================
// MISJE
// ===================================

/**
 * Pobiera aktywne misje
 */
export async function getActiveQuests(): Promise<Quest[]> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await db
      .from('quests')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return (data || []) as Quest[];
  } catch (error) {
    console.error('Błąd podczas pobierania misji:', error);
    return [];
  }
}

/**
 * Pobiera postęp użytkownika w misjach
 */
export async function getUserQuests(userId: string): Promise<(UserQuest & { quest: Quest })[]> {
  try {
    const activeQuests = await getActiveQuests();
    const questIds = activeQuests.map((q) => q.id);

    if (questIds.length === 0) {
      return [];
    }

    const { data: userQuests, error } = await db
      .from('user_quests')
      .select('*')
      .eq('user_id', userId)
      .in('quest_id', questIds)
      .eq('is_completed', false);

    if (error) throw error;

    // Połącz z informacjami o misjach
    const result = activeQuests.map((quest) => {
      const userQuest = (userQuests || []).find((uq) => uq.quest_id === quest.id);
      return {
        ...(userQuest || {
          id: '',
          user_id: userId,
          quest_id: quest.id,
          current_progress: 0,
          target_progress: quest.target_value,
          is_completed: false,
          completed_at: null,
          reward_claimed: false,
          reward_claimed_at: null,
          period_start: null,
          period_end: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        quest,
      };
    });

    return result as (UserQuest & { quest: Quest })[];
  } catch (error) {
    console.error('Błąd podczas pobierania misji użytkownika:', error);
    return [];
  }
}

/**
 * Aktualizuje postęp w misji
 */
export async function updateQuestProgress(
  userId: string,
  questType: string,
  value: number = 1
): Promise<void> {
  try {
    const activeQuests = await getActiveQuests();
    const relevantQuests = activeQuests.filter((q) => q.quest_type === questType);

    for (const quest of relevantQuests) {
      // Pobierz lub utwórz postęp użytkownika
      const { data: existing } = await db
        .from('user_quests')
        .select('*')
        .eq('user_id', userId)
        .eq('quest_id', quest.id)
        .single();

      let currentProgress = existing?.current_progress || 0;
      const targetProgress = quest.target_value;

      // Zaktualizuj postęp
      currentProgress += value;

      if (currentProgress >= targetProgress && !existing?.is_completed) {
        // Misja ukończona
        await db
          .from('user_quests')
          .upsert({
            user_id: userId,
            quest_id: quest.id,
            current_progress: targetProgress,
            target_progress: targetProgress,
            is_completed: true,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,quest_id',
          });

        // Przyznaj nagrodę
        if (quest.reward_points > 0) {
          await addPoints(
            userId,
            quest.reward_points,
            'quest_complete',
            `Ukończono misję: ${quest.title}`,
            undefined,
            quest.id
          );
        }

        // Dodaj doświadczenie
        await addExperience(userId, 25);
      } else {
        // Zaktualizuj postęp
        await db
          .from('user_quests')
          .upsert({
            user_id: userId,
            quest_id: quest.id,
            current_progress: Math.min(currentProgress, targetProgress),
            target_progress: targetProgress,
          }, {
            onConflict: 'user_id,quest_id',
          });
      }
    }
  } catch (error) {
    console.error('Błąd podczas aktualizowania postępu w misji:', error);
  }
}

// ===================================
// INTEGRACJA Z ZAMÓWIENIAMI
// ===================================

/**
 * Przyznaje punkty za zakup
 */
export async function awardPointsForPurchase(
  userId: string,
  orderId: string,
  totalAmount: number
): Promise<void> {
  try {
    // 1 punkt za każdy 1 PLN
    const points = Math.floor(totalAmount);
    await addPoints(userId, points, 'purchase', `Punkty za zakup`, orderId);

    // Zaktualizuj statystyki
    const userPoints = await ensureUserPoints(userId);
    await db
      .from('user_points')
      .update({
        total_purchases: userPoints.total_purchases + 1,
        total_spent: parseFloat(userPoints.total_spent.toString()) + totalAmount,
      })
      .eq('user_id', userId);

    // Dodaj doświadczenie (1 exp za każde 10 PLN)
    const experience = Math.floor(totalAmount / 10);
    await addExperience(userId, experience);

    // Zaktualizuj postęp w misjach
    await updateQuestProgress(userId, 'purchase', 1);
    await updateQuestProgress(userId, 'purchase_amount', totalAmount);
  } catch (error) {
    console.error('Błąd podczas przyznawania punktów za zakup:', error);
  }
}

// ===================================
// LUCKY DRAW (WIELKIE LOSOWANIE)
// ===================================

/**
 * Pobiera liczbę losów użytkownika (1 los za każde 50 PLN zakupów)
 */
export async function getUserTickets(userId: string): Promise<number> {
  try {
    const userPoints = await ensureUserPoints(userId);
    // 1 los za każde 50 PLN
    return Math.floor(parseFloat(userPoints.total_spent.toString()) / 50);
  } catch (error) {
    console.error('Błąd podczas pobierania losów:', error);
    return 0;
  }
}

/**
 * Zapisuje użytkownika do losowania
 */
export async function enterLuckyDraw(userId: string, ticketsUsed: number): Promise<boolean> {
  try {
    const userTickets = await getUserTickets(userId);

    if (userTickets < ticketsUsed) {
      throw new Error('Niewystarczająca ilość losów');
    }

    // W rzeczywistości tutaj byłoby zapisanie do tabeli lucky_draw_entries
    // Na razie symulacja - można dodać tabelę później

    return true;
  } catch (error) {
    console.error('Błąd podczas zapisywania do losowania:', error);
    return false;
  }
}

// ===================================
// TREASURE HUNT (POLOWANIE NA SKARBY)
// ===================================

/**
 * Pobiera dostępne skarby (ukryte kody)
 */
export async function getAvailableTreasures(userId: string): Promise<any[]> {
  try {
    // W rzeczywistości z bazy danych
    // Na razie zwracamy puste - można dodać tabelę treasures później
    return [];
  } catch (error) {
    console.error('Błąd podczas pobierania skarbów:', error);
    return [];
  }
}

/**
 * Oznacza skarb jako znaleziony
 */
export async function markTreasureAsFound(
  userId: string,
  treasureId: string
): Promise<{ success: boolean; code?: string; discount?: number }> {
  try {
    // W rzeczywistości tutaj byłoby:
    // 1. Sprawdzenie czy skarb istnieje
    // 2. Sprawdzenie czy użytkownik już go znalazł
    // 3. Utworzenie kodu rabatowego
    // 4. Oznaczenie jako znaleziony

    // Symulacja
    return {
      success: true,
      code: 'TREASURE' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discount: 15,
    };
  } catch (error) {
    console.error('Błąd podczas oznaczania skarbu:', error);
    return { success: false };
  }
}

// ===================================
// LOYALTY PROGRAM (PROGRAM LOJALNOŚCIOWY)
// ===================================

/**
 * Pobiera status lojalnościowy użytkownika
 */
export async function getLoyaltyStatus(userId: string): Promise<{
  tier: string;
  progressToNext: number;
  benefits: string[];
}> {
  try {
    const userPoints = await ensureUserPoints(userId);

    const purchases = userPoints.total_purchases;
    const spent = parseFloat(userPoints.total_spent.toString());

    // Określ status
    let tier = 'bronze';
    if (purchases >= 30 && spent >= 3000) {
      tier = 'platinum';
    } else if (purchases >= 15 && spent >= 1500) {
      tier = 'gold';
    } else if (purchases >= 5 && spent >= 500) {
      tier = 'silver';
    }

    // Progress do następnego
    let nextTier = null;
    if (tier === 'bronze') nextTier = { purchases: 5, spent: 500 };
    else if (tier === 'silver') nextTier = { purchases: 15, spent: 1500 };
    else if (tier === 'gold') nextTier = { purchases: 30, spent: 3000 };

    const progressToNext = nextTier
      ? Math.min(
        100,
        ((purchases / nextTier.purchases) * 50 +
          (spent / nextTier.spent) * 50)
      )
      : 100;

    // Korzyści
    const benefits: string[] = [];
    if (tier === 'platinum') {
      benefits.push('2 punkty za każde 1 PLN', 'Dodatkowe 30% punktów', 'Osobisty konsultant');
    } else if (tier === 'gold') {
      benefits.push('1.5 punktu za każde 1 PLN', 'Dodatkowe 20% punktów', 'Ekskluzywne oferty');
    } else if (tier === 'silver') {
      benefits.push('1.2 punktu za każde 1 PLN', 'Dodatkowe 10% punktów', 'Priorytetowa obsługa');
    } else {
      benefits.push('1 punkt za każde 1 PLN', 'Dostęp do codziennych nagród');
    }

    return {
      tier,
      progressToNext,
      benefits,
    };
  } catch (error) {
    console.error('Błąd podczas pobierania statusu lojalnościowego:', error);
    return {
      tier: 'bronze',
      progressToNext: 0,
      benefits: [],
    };
  }
}

// ===================================
// PERSONALIZED OFFERS (SPERSONALIZOWANE OFERTY)
// ===================================

/**
 * Generuje spersonalizowane oferty dla użytkownika
 */
export async function generatePersonalizedOffers(userId: string): Promise<any[]> {
  try {
    const userPoints = await ensureUserPoints(userId);
    const offers: any[] = [];

    // Oferta powitalna dla nowych użytkowników
    if (userPoints.total_purchases === 0) {
      offers.push({
        id: 'welcome',
        type: 'discount',
        discount: 15,
        code: 'WELCOME15',
        reason: 'Jesteś nowym użytkownikiem',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    // Oferta dla lojalnych klientów
    if (userPoints.total_purchases >= 5) {
      offers.push({
        id: 'loyalty',
        type: 'discount',
        discount: 20,
        code: 'LOYAL20',
        reason: `Kupiłeś już ${userPoints.total_purchases} produktów`,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    }

    // Oferta dla dużych wydatków
    if (parseFloat(userPoints.total_spent.toString()) >= 1000) {
      offers.push({
        id: 'bigspender',
        type: 'discount',
        discount: 25,
        code: 'VIP25',
        reason: `Wydałeś już ${userPoints.total_spent.toFixed(2)} PLN`,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });
    }

    return offers;
  } catch (error) {
    console.error('Błąd podczas generowania spersonalizowanych ofert:', error);
    return [];
  }
}

