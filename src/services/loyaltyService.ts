/**
 * Serwis do zarządzania programem lojalnościowym
 */

import { db } from '../lib/apiClient';

export interface LoyaltyPoints {
  user_id: string;
  total_points: number;
  available_points: number;
  used_points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earned' | 'used' | 'expired';
  description: string;
  order_id?: string;
  created_at: string;
}

/**
 * Oblicza poziom lojalności na podstawie punktów
 */
export const calculateLoyaltyLevel = (totalPoints: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
  if (totalPoints >= 10000) return 'platinum';
  if (totalPoints >= 5000) return 'gold';
  if (totalPoints >= 2000) return 'silver';
  return 'bronze';
};

/**
 * Oblicza zniżkę na podstawie poziomu
 */
export const getLoyaltyDiscount = (level: 'bronze' | 'silver' | 'gold' | 'platinum'): number => {
  switch (level) {
    case 'platinum': return 15; // 15% zniżki
    case 'gold': return 10; // 10% zniżki
    case 'silver': return 5; // 5% zniżki
    case 'bronze': return 0; // Brak zniżki
  }
};

/**
 * Pobiera punkty lojalnościowe użytkownika
 */
export const getUserLoyaltyPoints = async (): Promise<LoyaltyPoints | null> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return null;

    const { data, error } = await db
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      // Utwórz nowy rekord
      const newData = {
        user_id: user.id,
        total_points: 0,
        available_points: 0,
        used_points: 0,
        level: 'bronze' as const,
      };
      
      const { data: created, error: createError } = await db
        .from('loyalty_points')
        .insert(newData)
        .select()
        .single();
        
      if (createError) throw createError;
      return created;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching loyalty points:', error);
    return null;
  }
};

/**
 * Dodaje punkty za zakup
 */
export const addPointsForPurchase = async (
  orderId: string,
  totalAmount: number
): Promise<void> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) throw new Error('Użytkownik nie jest zalogowany');

    // 1 zł = 1 punkt
    const pointsEarned = Math.floor(totalAmount);

    // Pobierz aktualne punkty
    const currentPoints = await getUserLoyaltyPoints();
    if (!currentPoints) throw new Error('Nie udało się pobrać punktów lojalnościowych');

    const newTotalPoints = currentPoints.total_points + pointsEarned;
    const newAvailablePoints = currentPoints.available_points + pointsEarned;
    const newLevel = calculateLoyaltyLevel(newTotalPoints);

    // Aktualizuj punkty
    const { error: updateError } = await db
      .from('loyalty_points')
      .update({
        total_points: newTotalPoints,
        available_points: newAvailablePoints,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // Dodaj transakcję
    const { error: transactionError } = await db
      .from('points_transactions')
      .insert({
        user_id: user.id,
        points: pointsEarned,
        type: 'earned',
        description: `Punkty za zamówienie #${orderId}`,
        order_id: orderId,
      });

    if (transactionError) throw transactionError;
  } catch (error: any) {
    console.error('Error adding loyalty points:', error);
    throw new Error(error.message || 'Nie udało się dodać punktów');
  }
};

/**
 * Używa punktów do płatności
 */
export const usePointsForPayment = async (pointsToUse: number): Promise<void> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) throw new Error('Użytkownik nie jest zalogowany');

    const currentPoints = await getUserLoyaltyPoints();
    if (!currentPoints) throw new Error('Nie udało się pobrać punktów lojalnościowych');

    if (currentPoints.available_points < pointsToUse) {
      throw new Error('Niewystarczająca liczba punktów');
    }

    const newAvailablePoints = currentPoints.available_points - pointsToUse;
    const newUsedPoints = currentPoints.used_points + pointsToUse;

    // Aktualizuj punkty
    const { error: updateError } = await db
      .from('loyalty_points')
      .update({
        available_points: newAvailablePoints,
        used_points: newUsedPoints,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // Dodaj transakcję
    const { error: transactionError } = await db
      .from('points_transactions')
      .insert({
        user_id: user.id,
        points: -pointsToUse,
        type: 'used',
        description: `Użyto ${pointsToUse} punktów do płatności`,
      });

    if (transactionError) throw transactionError;
  } catch (error: any) {
    console.error('Error using loyalty points:', error);
    throw new Error(error.message || 'Nie udało się użyć punktów');
  }
};

/**
 * Pobiera historię transakcji punktów
 */
export const getPointsHistory = async (): Promise<PointsTransaction[]> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return [];

    const { data, error } = await db
      .from('points_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching points history:', error);
    return [];
  }
};

