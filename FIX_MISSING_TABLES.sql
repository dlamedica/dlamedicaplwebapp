-- ============================================
-- NAPRAWIENIE BRAKUJĄCYCH TABEL I KOLUMN
-- Data: 22 grudnia 2025
-- ============================================

-- ============================================
-- 1. DODAJ BRAKUJĄCE KOLUMNY DO user_progress
-- Kod używa: progress, completed, time_studied, quiz_completed
-- Baza ma: progress_percent, completed_at, time_spent_minutes
-- ============================================

-- Dodaj kolumnę 'progress' jako alias dla progress_percent
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'progress') THEN
        ALTER TABLE user_progress ADD COLUMN progress INTEGER DEFAULT 0;
        -- Skopiuj dane z progress_percent
        UPDATE user_progress SET progress = COALESCE(progress_percent, 0);
    END IF;
END $$;

-- Dodaj kolumnę 'completed' jako boolean
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'completed') THEN
        ALTER TABLE user_progress ADD COLUMN completed BOOLEAN DEFAULT FALSE;
        -- Ustaw completed na true gdzie completed_at nie jest null
        UPDATE user_progress SET completed = (completed_at IS NOT NULL);
    END IF;
END $$;

-- Dodaj kolumnę 'time_studied' (w minutach)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'time_studied') THEN
        ALTER TABLE user_progress ADD COLUMN time_studied INTEGER DEFAULT 0;
        -- Skopiuj dane z time_spent_minutes
        UPDATE user_progress SET time_studied = COALESCE(time_spent_minutes, 0);
    END IF;
END $$;

-- Dodaj kolumnę 'quiz_completed'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'quiz_completed') THEN
        ALTER TABLE user_progress ADD COLUMN quiz_completed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Dodaj kolumnę 'started_at'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_progress' AND column_name = 'started_at') THEN
        ALTER TABLE user_progress ADD COLUMN started_at TIMESTAMPTZ DEFAULT NOW();
        -- Skopiuj dane z created_at
        UPDATE user_progress SET started_at = COALESCE(created_at, NOW());
    END IF;
END $$;

-- Dodaj constraint UNIQUE na (user_id, module_id) jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_progress_user_id_module_id_key'
    ) THEN
        -- Najpierw usuń duplikaty
        DELETE FROM user_progress a USING user_progress b
        WHERE a.id > b.id 
        AND a.user_id = b.user_id 
        AND a.module_id = b.module_id;
        
        -- Teraz dodaj constraint (może się nie udać jeśli module_id jest NULL)
        BEGIN
            ALTER TABLE user_progress 
            ADD CONSTRAINT user_progress_user_id_module_id_key 
            UNIQUE (user_id, module_id);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add unique constraint: %', SQLERRM;
        END;
    END IF;
END $$;

-- ============================================
-- 2. STWÓRZ TABELĘ user_topic_progress
-- ============================================

CREATE TABLE IF NOT EXISTS user_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0,
    last_viewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, module_id, topic_id)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_module_id ON user_topic_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_topic_id ON user_topic_progress(topic_id);

-- ============================================
-- 3. STWÓRZ TABELĘ user_certificates
-- ============================================

CREATE TABLE IF NOT EXISTS user_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id TEXT,
    module_id TEXT,
    certificate_type VARCHAR(50) DEFAULT 'completion',
    verification_code VARCHAR(50) UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    pdf_url TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON user_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_verification_code ON user_certificates(verification_code);

-- ============================================
-- 4. STWÓRZ TABELĘ content_views
-- ============================================

CREATE TABLE IF NOT EXISTS content_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,
    time_spent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_content_views_user_id ON content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_content_id ON content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user_content ON content_views(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_viewed_at ON content_views(viewed_at DESC);

-- ============================================
-- 5. STWÓRZ TABELĘ user_notes
-- ============================================

CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,
    note TEXT NOT NULL,
    highlight TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_content_id ON user_notes(content_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON user_notes(created_at DESC);

-- ============================================
-- 6. STWÓRZ TABELĘ user_points
-- ============================================

CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    modules_completed INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    certificates_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_total_points ON user_points(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_level ON user_points(level DESC);

-- ============================================
-- 7. DODAJ BRAKUJĄCE KOLUMNY DO quiz_attempts
-- ============================================

-- Dodaj kolumnę 'quiz_id' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'quiz_id') THEN
        ALTER TABLE quiz_attempts ADD COLUMN quiz_id TEXT;
    END IF;
END $$;

-- Dodaj kolumnę 'module_id' jeśli nie istnieje (jako TEXT)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'module_id') THEN
        ALTER TABLE quiz_attempts ADD COLUMN module_id TEXT;
    END IF;
END $$;

-- Dodaj kolumnę 'answers' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'answers') THEN
        ALTER TABLE quiz_attempts ADD COLUMN answers JSONB DEFAULT '[]';
    END IF;
END $$;

-- Dodaj kolumnę 'max_score' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'max_score') THEN
        ALTER TABLE quiz_attempts ADD COLUMN max_score DECIMAL(5,2) DEFAULT 100;
    END IF;
END $$;

-- Dodaj kolumnę 'passed' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'passed') THEN
        ALTER TABLE quiz_attempts ADD COLUMN passed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Dodaj kolumnę 'time_spent' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'time_spent') THEN
        ALTER TABLE quiz_attempts ADD COLUMN time_spent INTEGER DEFAULT 0;
    END IF;
END $$;

-- Dodaj kolumnę 'score' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'score') THEN
        ALTER TABLE quiz_attempts ADD COLUMN score DECIMAL(5,2) DEFAULT 0;
    END IF;
END $$;

-- Dodaj kolumnę 'created_at' jeśli nie istnieje
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_attempts' AND column_name = 'created_at') THEN
        ALTER TABLE quiz_attempts ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Indeksy dla quiz_attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON quiz_attempts(created_at DESC);

-- ============================================
-- 8. DODAJ BRAKUJĄCE KOLUMNY DO subjects
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'icon') THEN
        ALTER TABLE subjects ADD COLUMN icon VARCHAR(50);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'category') THEN
        ALTER TABLE subjects ADD COLUMN category VARCHAR(50);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'difficulty') THEN
        ALTER TABLE subjects ADD COLUMN difficulty VARCHAR(20) DEFAULT 'medium';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'modules') THEN
        ALTER TABLE subjects ADD COLUMN modules INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'estimated_hours') THEN
        ALTER TABLE subjects ADD COLUMN estimated_hours INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'professions') THEN
        ALTER TABLE subjects ADD COLUMN professions TEXT[];
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'prerequisites') THEN
        ALTER TABLE subjects ADD COLUMN prerequisites TEXT[];
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subjects' AND column_name = 'color') THEN
        ALTER TABLE subjects ADD COLUMN color VARCHAR(20);
    END IF;
END $$;

-- ============================================
-- 9. DODAJ BRAKUJĄCE KOLUMNY DO companies
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'is_active') THEN
        ALTER TABLE companies ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'is_verified') THEN
        ALTER TABLE companies ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- ============================================
-- 10. DODAJ BRAKUJĄCE KOLUMNY DO job_offers
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_offers' AND column_name = 'company_id') THEN
        ALTER TABLE job_offers ADD COLUMN company_id UUID REFERENCES companies(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_offers' AND column_name = 'profession') THEN
        ALTER TABLE job_offers ADD COLUMN profession VARCHAR(100);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_offers' AND column_name = 'is_active') THEN
        ALTER TABLE job_offers ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- ============================================
-- 11. DODAJ BRAKUJĄCE KOLUMNY DO applications
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'created_at') THEN
        ALTER TABLE applications ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'status') THEN
        ALTER TABLE applications ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
    END IF;
END $$;

-- ============================================
-- 12. DODAJ BRAKUJĄCE KOLUMNY DO user_favorites
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_favorites' AND column_name = 'favorite_type') THEN
        ALTER TABLE user_favorites ADD COLUMN favorite_type VARCHAR(50) DEFAULT 'job_offer';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_favorites' AND column_name = 'created_at') THEN
        ALTER TABLE user_favorites ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ============================================
-- 13. DODAJ BRAKUJĄCE KOLUMNY DO events
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'type') THEN
        ALTER TABLE events ADD COLUMN type VARCHAR(50) DEFAULT 'conference';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'is_active') THEN
        ALTER TABLE events ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- ============================================
-- 14. DODAJ BRAKUJĄCE KOLUMNY DO event_participants
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'event_participants' AND column_name = 'status') THEN
        ALTER TABLE event_participants ADD COLUMN status VARCHAR(50) DEFAULT 'registered';
    END IF;
END $$;

-- ============================================
-- TRIGGER dla updated_at
-- ============================================

-- Funkcja aktualizująca updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggery
DROP TRIGGER IF EXISTS update_user_topic_progress_updated_at ON user_topic_progress;
CREATE TRIGGER update_user_topic_progress_updated_at
    BEFORE UPDATE ON user_topic_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
    BEFORE UPDATE ON user_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_points_updated_at ON user_points;
CREATE TRIGGER update_user_points_updated_at
    BEFORE UPDATE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PODSUMOWANIE
-- ============================================

SELECT 'Tabele utworzone/zaktualizowane:' as status;

SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns c 
        WHERE c.table_name = t.table_name AND c.table_schema = 'public') as columns_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('user_progress', 'user_topic_progress', 'quiz_attempts', 
                   'user_certificates', 'content_views', 'user_notes', 'user_points',
                   'subjects', 'companies', 'job_offers', 'applications', 
                   'user_favorites', 'events', 'event_participants')
ORDER BY table_name;

-- ============================================
-- KONIEC SKRYPTU
-- ============================================
