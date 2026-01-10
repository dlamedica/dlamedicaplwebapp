/**
 * DeepSeek AI Service
 * Serwis do integracji z DeepSeek V3 API
 * Używany do: generowania fiszek, tłumaczeń, wyjaśnień, asystenta nauki
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface DeepSeekOptions {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

/**
 * Wysyła zapytanie do DeepSeek API
 */
async function callDeepSeek(
  messages: DeepSeekMessage[],
  options: DeepSeekOptions = {}
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY nie jest skonfigurowany');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2000,
      top_p: options.top_p ?? 0.95,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

// ===================================
// GENEROWANIE FISZEK
// ===================================

export interface GeneratedFlashcard {
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
}

/**
 * Generuje fiszki z tekstu
 */
export async function generateFlashcardsFromText(
  text: string,
  count: number = 10,
  language: string = 'pl'
): Promise<GeneratedFlashcard[]> {
  const systemPrompt = `Jesteś ekspertem od tworzenia fiszek edukacyjnych dla studentów medycyny i weterynarii.
Twoje zadanie to utworzenie ${count} fiszek na podstawie podanego tekstu.

Zasady:
1. Każda fiszka powinna testować jedno konkretne pojęcie
2. Przód (pytanie) powinien być krótki i jasny
3. Tył (odpowiedź) powinien być zwięzły, ale kompletny
4. Dodaj podpowiedź (hint) jeśli pytanie jest trudne
5. Dodaj tagi kategoryzujące fiszkę

Odpowiedz w formacie JSON:
[
  {
    "front": "pytanie",
    "back": "odpowiedź",
    "hint": "opcjonalna podpowiedź",
    "tags": ["tag1", "tag2"]
  }
]`;

  const userPrompt = `Utwórz ${count} fiszek edukacyjnych z następującego tekstu:\n\n${text}`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 3000 }
    );

    // Parsuj JSON z odpowiedzi
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Nie udało się sparsować odpowiedzi');
    }

    return JSON.parse(jsonMatch[0]) as GeneratedFlashcard[];
  } catch (error) {
    console.error('Błąd generowania fiszek:', error);
    throw error;
  }
}

/**
 * Generuje fiszki dla konkretnego tematu medycznego
 */
export async function generateFlashcardsForTopic(
  topic: string,
  difficulty: 'basic' | 'intermediate' | 'advanced' = 'intermediate',
  count: number = 10,
  profession: string = 'lekarz'
): Promise<GeneratedFlashcard[]> {
  const difficultyDesc = {
    basic: 'podstawowe pojęcia, definicje, proste fakty',
    intermediate: 'mechanizmy, procesy, relacje między pojęciami',
    advanced: 'przypadki kliniczne, diagnostyka różnicowa, złożone zagadnienia',
  };

  const systemPrompt = `Jesteś ekspertem medycznym tworzącym fiszki dla: ${profession}.
Poziom trudności: ${difficulty} (${difficultyDesc[difficulty]}).

Zasady tworzenia fiszek:
1. Używaj terminologii medycznej odpowiedniej dla ${profession}
2. Dla poziomu ${difficulty} - ${difficultyDesc[difficulty]}
3. Każda fiszka = jedno pojęcie/fakt
4. Pytania powinny być praktyczne i klinicznie istotne
5. Odpowiedzi zwięzłe, ale kompletne

Format JSON:
[{"front": "pytanie", "back": "odpowiedź", "hint": "podpowiedź", "tags": ["tag1"]}]`;

  const userPrompt = `Utwórz ${count} fiszek na temat: ${topic}`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 3000 }
    );

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Nie udało się sparsować odpowiedzi');
    }

    return JSON.parse(jsonMatch[0]) as GeneratedFlashcard[];
  } catch (error) {
    console.error('Błąd generowania fiszek:', error);
    throw error;
  }
}

// ===================================
// TŁUMACZENIA
// ===================================

/**
 * Tłumaczy tekst medyczny
 */
export async function translateMedicalText(
  text: string,
  targetLanguage: 'en' | 'uk' | 'de' = 'en',
  preserveTerminology: boolean = true
): Promise<string> {
  const languageNames = {
    en: 'angielski',
    uk: 'ukraiński',
    de: 'niemiecki',
  };

  const systemPrompt = `Jesteś profesjonalnym tłumaczem medycznym.
Tłumacz tekst na język ${languageNames[targetLanguage]}.
${preserveTerminology ? 'Zachowaj terminologię medyczną i łacińskie nazwy.' : ''}

Zasady:
1. Tłumacz precyzyjnie, zachowując znaczenie medyczne
2. Używaj poprawnej terminologii medycznej w języku docelowym
3. Nazwy własne leków, procedur - zachowaj lub podaj odpowiednik
4. Formatowanie (nagłówki, listy) - zachowaj`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Przetłumacz:\n\n${text}` },
      ],
      { temperature: 0.3, max_tokens: 4000 }
    );

    return response;
  } catch (error) {
    console.error('Błąd tłumaczenia:', error);
    throw error;
  }
}

// ===================================
// ASYSTENT NAUKI
// ===================================

export interface StudyAssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Asystent nauki - odpowiada na pytania z materiałów
 */
export async function askStudyAssistant(
  question: string,
  context?: string,
  history: StudyAssistantMessage[] = [],
  profession: string = 'student medycyny'
): Promise<string> {
  const systemPrompt = `Jesteś przyjaznym asystentem nauki dla: ${profession}.

Zasady:
1. Odpowiadaj precyzyjnie i zwięźle
2. Używaj prostego języka, ale zachowaj terminologię medyczną
3. Jeśli podano kontekst - bazuj na nim
4. Podawaj źródła i odniesienia gdy to możliwe
5. Jeśli nie jesteś pewien - powiedz to
6. Zachęcaj do dalszej nauki i zadawania pytań

${context ? `Kontekst materiału:\n${context}\n\n` : ''}`;

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: question },
  ];

  try {
    const response = await callDeepSeek(messages, {
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response;
  } catch (error) {
    console.error('Błąd asystenta:', error);
    throw error;
  }
}

// ===================================
// WYJAŚNIENIA DO QUIZÓW
// ===================================

export interface QuizExplanation {
  correct_answer_explanation: string;
  why_others_wrong: string[];
  key_concept: string;
  clinical_relevance?: string;
  memory_tip?: string;
}

/**
 * Generuje wyjaśnienie do pytania quizowego
 */
export async function generateQuizExplanation(
  question: string,
  options: string[],
  correctIndex: number,
  userAnswer?: number
): Promise<QuizExplanation> {
  const systemPrompt = `Jesteś nauczycielem medycyny wyjaśniającym odpowiedzi na pytania testowe.

Twoim zadaniem jest wytłumaczyć:
1. Dlaczego poprawna odpowiedź jest poprawna
2. Dlaczego pozostałe odpowiedzi są błędne
3. Kluczowe pojęcie do zapamiętania
4. Znaczenie kliniczne (jeśli dotyczy)
5. Tip do zapamiętania (mnemotechnika, skojarzenie)

Format JSON:
{
  "correct_answer_explanation": "szczegółowe wyjaśnienie",
  "why_others_wrong": ["wyjaśnienie dla każdej błędnej opcji"],
  "key_concept": "najważniejsze pojęcie",
  "clinical_relevance": "znaczenie w praktyce",
  "memory_tip": "trick do zapamiętania"
}`;

  const userPrompt = `Pytanie: ${question}

Odpowiedzi:
${options.map((o, i) => `${i + 1}. ${o}${i === correctIndex ? ' (POPRAWNA)' : ''}`).join('\n')}

${userAnswer !== undefined && userAnswer !== correctIndex ? `Użytkownik wybrał: ${userAnswer + 1} (błędna odpowiedź)` : ''}

Wyjaśnij to pytanie:`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 1500 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Nie udało się sparsować odpowiedzi');
    }

    return JSON.parse(jsonMatch[0]) as QuizExplanation;
  } catch (error) {
    console.error('Błąd generowania wyjaśnienia:', error);
    throw error;
  }
}

// ===================================
// GENEROWANIE PYTAŃ QUIZOWYCH
// ===================================

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

/**
 * Generuje pytania quizowe z tekstu
 */
export async function generateQuizQuestions(
  text: string,
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed'
): Promise<GeneratedQuizQuestion[]> {
  const systemPrompt = `Jesteś ekspertem od tworzenia pytań testowych dla studentów medycyny.
Poziom trudności: ${difficulty === 'mixed' ? 'różny' : difficulty}.

Zasady:
1. Pytania muszą testować zrozumienie, nie tylko pamięć
2. 4 opcje odpowiedzi, jedna poprawna
3. Dystraktory (błędne odpowiedzi) muszą być wiarygodne
4. Unikaj "wszystkie powyższe" / "żadne z powyższych"
5. Dodaj krótkie wyjaśnienie poprawnej odpowiedzi

Format JSON:
[{
  "question": "treść pytania",
  "options": ["A", "B", "C", "D"],
  "correct_index": 0,
  "explanation": "wyjaśnienie",
  "difficulty": "easy|medium|hard",
  "topic": "temat"
}]`;

  const userPrompt = `Na podstawie tego tekstu utwórz ${count} pytań testowych:\n\n${text}`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 4000 }
    );

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Nie udało się sparsować odpowiedzi');
    }

    return JSON.parse(jsonMatch[0]) as GeneratedQuizQuestion[];
  } catch (error) {
    console.error('Błąd generowania pytań:', error);
    throw error;
  }
}

// ===================================
// STRESZCZANIE ARTYKUŁÓW
// ===================================

export interface ArticleSummary {
  title_suggestion: string;
  summary: string;
  key_points: string[];
  clinical_implications?: string[];
  target_audience: string;
  reading_time_minutes: number;
}

/**
 * Streszcza artykuł medyczny
 */
export async function summarizeArticle(
  articleText: string,
  maxLength: number = 500
): Promise<ArticleSummary> {
  const systemPrompt = `Jesteś ekspertem od streszczania artykułów medycznych.

Utwórz streszczenie zawierające:
1. Sugerowany tytuł (jeśli brak)
2. Zwięzłe streszczenie (max ${maxLength} słów)
3. Kluczowe punkty (bullet points)
4. Implikacje kliniczne (jeśli dotyczy)
5. Dla jakiej grupy docelowej
6. Szacowany czas czytania oryginału

Format JSON:
{
  "title_suggestion": "tytuł",
  "summary": "streszczenie",
  "key_points": ["punkt 1", "punkt 2"],
  "clinical_implications": ["implikacja 1"],
  "target_audience": "dla kogo",
  "reading_time_minutes": 5
}`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Streść artykuł:\n\n${articleText}` },
      ],
      { temperature: 0.4, max_tokens: 2000 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Nie udało się sparsować odpowiedzi');
    }

    return JSON.parse(jsonMatch[0]) as ArticleSummary;
  } catch (error) {
    console.error('Błąd streszczania:', error);
    throw error;
  }
}

// ===================================
// ANALIZA LUKI W WIEDZY
// ===================================

export interface KnowledgeGapAnalysis {
  weak_areas: string[];
  strong_areas: string[];
  recommendations: string[];
  suggested_topics: string[];
  study_plan: {
    topic: string;
    priority: 'high' | 'medium' | 'low';
    estimated_hours: number;
  }[];
}

/**
 * Analizuje luki w wiedzy na podstawie wyników quizów
 */
export async function analyzeKnowledgeGaps(
  quizResults: Array<{
    topic: string;
    score: number;
    maxScore: number;
    wrongAnswers: string[];
  }>
): Promise<KnowledgeGapAnalysis> {
  const systemPrompt = `Jesteś doradcą edukacyjnym analizującym wyniki nauki studenta medycyny.

Na podstawie wyników quizów:
1. Zidentyfikuj słabe obszary (score < 60%)
2. Zidentyfikuj mocne strony (score > 80%)
3. Zaproponuj rekomendacje
4. Zasugeruj tematy do nauki
5. Utwórz plan nauki z priorytetami

Format JSON:
{
  "weak_areas": ["obszar 1"],
  "strong_areas": ["obszar 1"],
  "recommendations": ["rekomendacja 1"],
  "suggested_topics": ["temat 1"],
  "study_plan": [{"topic": "temat", "priority": "high", "estimated_hours": 2}]
}`;

  const userPrompt = `Wyniki quizów studenta:\n${JSON.stringify(quizResults, null, 2)}`;

  try {
    const response = await callDeepSeek(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 2000 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Nie udało się sparsować odpowiedzi');
    }

    return JSON.parse(jsonMatch[0]) as KnowledgeGapAnalysis;
  } catch (error) {
    console.error('Błąd analizy:', error);
    throw error;
  }
}

// ===================================
// EXPORT
// ===================================

export default {
  generateFlashcardsFromText,
  generateFlashcardsForTopic,
  translateMedicalText,
  askStudyAssistant,
  generateQuizExplanation,
  generateQuizQuestions,
  summarizeArticle,
  analyzeKnowledgeGaps,
};
