import { db } from './db.js';

// Pobierz zestawy fiszek użytkownika
export async function getUserFlashcardSets(userId) {
  return await db.flashcardSet.findMany({
    where: { userId },
    include: {
      _count: {
        select: { cards: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
}

// Utwórz nowy zestaw fiszek
export async function createFlashcardSet(userId, data) {
  return await db.flashcardSet.create({
    data: {
      userId,
      ...data
    }
  });
}

// Pobierz fiszki z zestawu
export async function getFlashcards(setId, userId) {
  return await db.flashcard.findMany({
    where: {
      setId,
      set: { userId } // Security check
    },
    include: {
      studyProgress: {
        where: { userId }
      }
    },
    orderBy: { position: 'asc' }
  });
}

// Dodaj fiszkę do zestawu
export async function createFlashcard(setId, data) {
  return await db.flashcard.create({
    data: {
      setId,
      ...data
    }
  });
}