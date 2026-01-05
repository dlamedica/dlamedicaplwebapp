/**
 * Serwis do zarządzania pytaniami i odpowiedziami o produkty
 */

import { db } from '../lib/apiClient';

export interface Question {
  id: string;
  ebook_id: string;
  user_id: string;
  question: string;
  answer?: string;
  answered_by?: string;
  answered_at?: string;
  helpful_count: number;
  status: 'pending' | 'answered' | 'hidden';
  created_at: string;
  updated_at: string;
  user_name?: string;
  answered_by_name?: string;
}

export interface CreateQuestionData {
  ebook_id: string;
  question: string;
}

/**
 * Pobiera pytania dla danego ebooka
 */
export const getEbookQuestions = async (ebookId: string): Promise<Question[]> => {
  try {
    const { data, error } = await db
      .from('product_questions')
      .select(`
        *,
        asker:user_id (
          full_name,
          email
        ),
        answerer:answered_by (
          full_name
        )
      `)
      .eq('ebook_id', ebookId)
      .eq('status', 'answered')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((q: any) => ({
      ...q,
      user_name: q.asker?.full_name || 'Anonimowy',
      answered_by_name: q.answerer?.full_name || 'Administrator',
    }));
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    throw new Error(error.message || 'Nie udało się pobrać pytań');
  }
};

/**
 * Tworzy nowe pytanie
 */
export const createQuestion = async (questionData: CreateQuestionData): Promise<Question> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data, error } = await db
      .from('product_questions')
      .insert({
        user_id: user.id,
        ebook_id: questionData.ebook_id,
        question: questionData.question,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating question:', error);
    throw new Error(error.message || 'Nie udało się dodać pytania');
  }
};

/**
 * Odpowiada na pytanie (tylko admin)
 */
export const answerQuestion = async (
  questionId: string,
  answer: string
): Promise<Question> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Sprawdź czy użytkownik to admin
    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && user.email !== 'admin@dlamedica.pl') {
      throw new Error('Tylko administrator może odpowiadać na pytania');
    }

    const { data, error } = await db
      .from('product_questions')
      .update({
        answer,
        answered_by: user.id,
        answered_at: new Date().toISOString(),
        status: 'answered',
        updated_at: new Date().toISOString(),
      })
      .eq('id', questionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error answering question:', error);
    throw new Error(error.message || 'Nie udało się odpowiedzieć na pytanie');
  }
};

/**
 * Oznacza odpowiedź jako pomocną
 */
export const markAnswerHelpful = async (questionId: string): Promise<void> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Sprawdź czy użytkownik już głosował
    const { data: existingVote } = await db
      .from('question_helpful_votes')
      .select('id')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single();

    if (!existingVote) {
      // Dodaj głos
      const { error: insertError } = await db
        .from('question_helpful_votes')
        .insert({
          question_id: questionId,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      // Zaktualizuj licznik
      const { data: question } = await db
        .from('product_questions')
        .select('helpful_count')
        .eq('id', questionId)
        .single();

      if (question) {
        await db
          .from('product_questions')
          .update({ helpful_count: question.helpful_count + 1 })
          .eq('id', questionId);
      }
    }
  } catch (error: any) {
    console.error('Error marking answer helpful:', error);
    throw new Error(error.message || 'Nie udało się oznaczyć odpowiedzi jako pomocnej');
  }
};

