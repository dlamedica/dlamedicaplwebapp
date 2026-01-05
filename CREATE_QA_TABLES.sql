-- ===================================
-- TABELE DLA SYSTEMU PYTAN I ODPOWIEDZI
-- ===================================

-- Tabela product_questions
CREATE TABLE IF NOT EXISTS product_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    ebook_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    question TEXT NOT NULL,
    answer TEXT,
    answered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    answered_at TIMESTAMPTZ,
    
    helpful_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'hidden'))
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_product_questions_ebook_id ON product_questions(ebook_id);
CREATE INDEX IF NOT EXISTS idx_product_questions_user_id ON product_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_questions_status ON product_questions(status);
CREATE INDEX IF NOT EXISTS idx_product_questions_created_at ON product_questions(created_at DESC);

-- Tabela question_helpful_votes
CREATE TABLE IF NOT EXISTS question_helpful_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    question_id UUID REFERENCES product_questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    UNIQUE(question_id, user_id)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_question_helpful_votes_question_id ON question_helpful_votes(question_id);
CREATE INDEX IF NOT EXISTS idx_question_helpful_votes_user_id ON question_helpful_votes(user_id);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

-- Wszyscy mogą czytać odpowiedzi na pytania
CREATE POLICY "Anyone can view answered questions" ON product_questions
    FOR SELECT USING (status = 'answered');

-- Użytkownicy mogą tworzyć swoje pytania
CREATE POLICY "Users can create own questions" ON product_questions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Użytkownicy mogą edytować swoje pytania (jeśli nie są odpowiedziane)
CREATE POLICY "Users can update own questions" ON product_questions
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

ALTER TABLE question_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Wszyscy mogą czytać głosy
CREATE POLICY "Anyone can view helpful votes" ON question_helpful_votes
    FOR SELECT USING (true);

-- Użytkownicy mogą tworzyć swoje głosy
CREATE POLICY "Users can create own helpful votes" ON question_helpful_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===================================
-- FUNKCJE POMOCNICZE
-- ===================================

CREATE TRIGGER update_product_questions_updated_at
    BEFORE UPDATE ON product_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

