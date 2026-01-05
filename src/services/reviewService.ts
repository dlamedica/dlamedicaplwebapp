/**
 * Serwis do zarządzania recenzjami produktów
 */

import { db } from '../lib/apiClient';

export interface Review {
  id: string;
  user_id: string;
  ebook_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export interface CreateReviewData {
  ebook_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface HelpfulVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

/**
 * Pobiera recenzje dla danego ebooka
 */
export const getEbookReviews = async (ebookId: string): Promise<Review[]> => {
  try {
    const { data, error } = await db
      .from('ebook_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .eq('ebook_id', ebookId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((review: any) => ({
      ...review,
      user_name: review.profiles?.full_name || 'Anonimowy',
      user_email: review.profiles?.email,
    }));
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    throw new Error(error.message || 'Nie udało się pobrać recenzji');
  }
};

/**
 * Pobiera recenzję użytkownika dla danego ebooka
 */
export const getUserReview = async (ebookId: string): Promise<Review | null> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return null;

    const { data, error } = await db
      .from('ebook_reviews')
      .select('*')
      .eq('ebook_id', ebookId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching user review:', error);
    return null;
  }
};

/**
 * Sprawdza czy użytkownik kupił dany ebook
 */
export const checkIfUserPurchased = async (ebookId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return false;

    const { data, error } = await db
      .from('user_purchases')
      .select('id')
      .eq('ebook_id', ebookId)
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error: any) {
    console.error('Error checking purchase:', error);
    return false;
  }
};

/**
 * Tworzy nową recenzję
 */
export const createReview = async (reviewData: CreateReviewData): Promise<Review> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Sprawdź czy użytkownik już ma recenzję dla tego produktu
    const existingReview = await getUserReview(reviewData.ebook_id);
    if (existingReview) {
      throw new Error('Masz już recenzję dla tego produktu');
    }

    // Sprawdź czy użytkownik kupił produkt
    const hasPurchased = await checkIfUserPurchased(reviewData.ebook_id);

    const { data, error } = await db
      .from('ebook_reviews')
      .insert({
        user_id: user.id,
        ebook_id: reviewData.ebook_id,
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment || null,
        is_verified_purchase: hasPurchased,
        status: hasPurchased ? 'approved' : 'pending', // Automatyczna akceptacja dla zweryfikowanych zakupów
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating review:', error);
    throw new Error(error.message || 'Nie udało się dodać recenzji');
  }
};

/**
 * Aktualizuje recenzję użytkownika
 */
export const updateReview = async (
  reviewId: string,
  reviewData: Partial<CreateReviewData>
): Promise<Review> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data, error } = await db
      .from('ebook_reviews')
      .update({
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating review:', error);
    throw new Error(error.message || 'Nie udało się zaktualizować recenzji');
  }
};

/**
 * Usuwa recenzję użytkownika
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { error } = await db
      .from('ebook_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting review:', error);
    throw new Error(error.message || 'Nie udało się usunąć recenzji');
  }
};

/**
 * Dodaje głos "pomocne" do recenzji
 */
export const voteHelpful = async (
  reviewId: string,
  isHelpful: boolean
): Promise<void> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Sprawdź czy użytkownik już głosował
    const { data: existingVote } = await db
      .from('review_helpful_votes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (existingVote) {
      // Aktualizuj istniejący głos
      const { error } = await db
        .from('review_helpful_votes')
        .update({ is_helpful: isHelpful })
        .eq('id', existingVote.id);

      if (error) throw error;
    } else {
      // Utwórz nowy głos
      const { error } = await db
        .from('review_helpful_votes')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          is_helpful: isHelpful,
        });

      if (error) throw error;
    }
  } catch (error: any) {
    console.error('Error voting helpful:', error);
    throw new Error(error.message || 'Nie udało się zagłosować');
  }
};

/**
 * Pobiera głos użytkownika dla recenzji
 */
export const getUserVote = async (reviewId: string): Promise<HelpfulVote | null> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return null;

    const { data, error } = await db
      .from('review_helpful_votes')
      .select('*')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching user vote:', error);
    return null;
  }
};

