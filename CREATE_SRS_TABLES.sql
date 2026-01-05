-- ============================================================================
-- SPACED REPETITION SYSTEM (SRS) - Rozbudowa bazy danych
-- ============================================================================
-- Rozszerzenie tabeli study_progress o pełne wsparcie SRS

-- Sprawdź czy tabela już istnieje i rozbuduj ją
DO $$ 
BEGIN
  -- Jeśli tabela study_progress nie istnieje, utwórz ją
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'study_progress') THEN
    CREATE TABLE study_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      card_id UUID NOT NULL, -- Reference do flashcards table
      ease_factor FLOAT DEFAULT 2.5 NOT NULL, -- Współczynnik łatwości (1.3 - 2.5+)
      interval_days INTEGER DEFAULT 1 NOT NULL, -- Interwał w dniach
      repetitions INTEGER DEFAULT 0 NOT NULL, -- Liczba powtórek
      next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL, -- Data następnej powtórki
      last_review TIMESTAMP WITH TIME ZONE, -- Data ostatniej powtórki
      review_count INTEGER DEFAULT 0 NOT NULL, -- Całkowita liczba powtórek
      correct_count INTEGER DEFAULT 0 NOT NULL, -- Liczba poprawnych odpowiedzi
      incorrect_count INTEGER DEFAULT 0 NOT NULL, -- Liczba niepoprawnych odpowiedzi
      streak INTEGER DEFAULT 0 NOT NULL, -- Seria poprawnych odpowiedzi
      last_quality INTEGER, -- Jakość ostatniej odpowiedzi (0-5)
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, card_id)
    );
  ELSE
    -- Jeśli tabela istnieje, dodaj brakujące kolumny
    ALTER TABLE study_progress 
      ADD COLUMN IF NOT EXISTS ease_factor FLOAT DEFAULT 2.5,
      ADD COLUMN IF NOT EXISTS interval_days INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS last_review TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS incorrect_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_quality INTEGER;
  END IF;
END $$;

-- Utwórz tabelę review_history (historia powtórek)
CREATE TABLE IF NOT EXISTS review_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID NOT NULL,
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5), -- Jakość odpowiedzi (0-5)
  ease_factor_before FLOAT NOT NULL,
  ease_factor_after FLOAT NOT NULL,
  interval_before INTEGER NOT NULL,
  interval_after INTEGER NOT NULL,
  repetitions_before INTEGER NOT NULL,
  repetitions_after INTEGER NOT NULL,
  time_spent INTEGER DEFAULT 0, -- Czas w sekundach
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Utwórz tabelę srs_settings (ustawienia SRS per użytkownik)
CREATE TABLE IF NOT EXISTS srs_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  max_new_cards_per_day INTEGER DEFAULT 20,
  max_review_cards_per_day INTEGER DEFAULT 200,
  new_card_steps JSONB DEFAULT '[1, 10]'::jsonb, -- Kroki dla nowych kart (w minutach)
  graduating_interval INTEGER DEFAULT 1, -- Interwał "ukończenia" (w dniach)
  easy_interval INTEGER DEFAULT 4, -- Interwał dla "łatwe" (w dniach)
  minimum_ease_factor FLOAT DEFAULT 1.3,
  starting_ease_factor FLOAT DEFAULT 2.5,
  easy_bonus FLOAT DEFAULT 1.3, -- Bonus dla "łatwe"
  interval_modifier FLOAT DEFAULT 1.0, -- Modyfikator interwału
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_study_progress_user_id ON study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_card_id ON study_progress(card_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_next_review ON study_progress(next_review);
CREATE INDEX IF NOT EXISTS idx_study_progress_user_next_review ON study_progress(user_id, next_review);

CREATE INDEX IF NOT EXISTS idx_review_history_user_id ON review_history(user_id);
CREATE INDEX IF NOT EXISTS idx_review_history_card_id ON review_history(card_id);
CREATE INDEX IF NOT EXISTS idx_review_history_reviewed_at ON review_history(reviewed_at);

-- Enable RLS
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE srs_settings ENABLE ROW LEVEL SECURITY;

-- Policies dla study_progress
DROP POLICY IF EXISTS "Users can view own study progress" ON study_progress;
CREATE POLICY "Users can view own study progress" ON study_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own study progress" ON study_progress;
CREATE POLICY "Users can insert own study progress" ON study_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own study progress" ON study_progress;
CREATE POLICY "Users can update own study progress" ON study_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies dla review_history
DROP POLICY IF EXISTS "Users can view own review history" ON review_history;
CREATE POLICY "Users can view own review history" ON review_history
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own review history" ON review_history;
CREATE POLICY "Users can insert own review history" ON review_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies dla srs_settings
DROP POLICY IF EXISTS "Users can view own SRS settings" ON srs_settings;
CREATE POLICY "Users can view own SRS settings" ON srs_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own SRS settings" ON srs_settings;
CREATE POLICY "Users can insert own SRS settings" ON srs_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own SRS settings" ON srs_settings;
CREATE POLICY "Users can update own SRS settings" ON srs_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Funkcja do automatycznego aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla study_progress
DROP TRIGGER IF EXISTS update_study_progress_updated_at ON study_progress;
CREATE TRIGGER update_study_progress_updated_at
  BEFORE UPDATE ON study_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger dla srs_settings
DROP TRIGGER IF EXISTS update_srs_settings_updated_at ON srs_settings;
CREATE TRIGGER update_srs_settings_updated_at
  BEFORE UPDATE ON srs_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Funkcja do automatycznego tworzenia ustawień SRS przy rejestracji
CREATE OR REPLACE FUNCTION create_srs_settings_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO srs_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger (jeśli masz tabelę users w auth.users)
-- CREATE TRIGGER create_srs_settings_trigger
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_srs_settings_for_user();

-- Komentarze
COMMENT ON TABLE study_progress IS 'Postęp nauki fiszek z algorytmem SRS';
COMMENT ON TABLE review_history IS 'Historia powtórek fiszek';
COMMENT ON TABLE srs_settings IS 'Ustawienia SRS per użytkownik';

COMMENT ON COLUMN study_progress.ease_factor IS 'Współczynnik łatwości (1.3 - 2.5+)';
COMMENT ON COLUMN study_progress.interval_days IS 'Interwał do następnej powtórki w dniach';
COMMENT ON COLUMN study_progress.repetitions IS 'Liczba kolejnych poprawnych powtórek';
COMMENT ON COLUMN study_progress.next_review IS 'Data następnej powtórki';
COMMENT ON COLUMN review_history.quality IS 'Jakość odpowiedzi: 0=zapomniałem, 1=bardzo trudne, 2=trudne, 3=dobrze, 4=łatwe, 5=bardzo łatwe';

