-- ===================================
-- TABELA RECENZJI PRODUKTÓW
-- ===================================

-- Tabela reviews (recenzje)
CREATE TABLE IF NOT EXISTS ebook_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik (tylko kupujący mogą recenzować)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Ebook
    ebook_id VARCHAR(255) NOT NULL,
    
    -- Ocena (1-5)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Treść recenzji
    title VARCHAR(200),
    comment TEXT,
    
    -- Weryfikacja zakupu
    is_verified_purchase BOOLEAN DEFAULT false,
    
    -- Status (do moderacji)
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Helpful votes
    helpful_count INTEGER DEFAULT 0,
    
    -- Unikalność: jeden użytkownik może mieć jedną recenzję na produkt
    UNIQUE(user_id, ebook_id)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_ebook_reviews_ebook_id ON ebook_reviews(ebook_id);
CREATE INDEX IF NOT EXISTS idx_ebook_reviews_user_id ON ebook_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_ebook_reviews_rating ON ebook_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_ebook_reviews_status ON ebook_reviews(status);
CREATE INDEX IF NOT EXISTS idx_ebook_reviews_created_at ON ebook_reviews(created_at DESC);

-- Tabela helpful votes (głosy "pomocne")
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Recenzja
    review_id UUID REFERENCES ebook_reviews(id) ON DELETE CASCADE NOT NULL,
    
    -- Użytkownik który głosował
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Czy pomocne (true) czy nie (false)
    is_helpful BOOLEAN NOT NULL,
    
    -- Jeden użytkownik może głosować raz na recenzję
    UNIQUE(review_id, user_id)
);

-- Indeksy dla helpful votes
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_user_id ON review_helpful_votes(user_id);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Włącz RLS dla ebook_reviews
ALTER TABLE ebook_reviews ENABLE ROW LEVEL SECURITY;

-- Wszyscy mogą czytać zatwierdzone recenzje
CREATE POLICY "Anyone can view approved reviews" ON ebook_reviews
    FOR SELECT USING (status = 'approved');

-- Użytkownicy mogą tworzyć swoje recenzje
CREATE POLICY "Users can create own reviews" ON ebook_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Użytkownicy mogą edytować swoje recenzje
CREATE POLICY "Users can update own reviews" ON ebook_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Użytkownicy mogą usuwać swoje recenzje
CREATE POLICY "Users can delete own reviews" ON ebook_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Włącz RLS dla review_helpful_votes
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Wszyscy mogą czytać głosy
CREATE POLICY "Anyone can view helpful votes" ON review_helpful_votes
    FOR SELECT USING (true);

-- Użytkownicy mogą tworzyć swoje głosy
CREATE POLICY "Users can create own helpful votes" ON review_helpful_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Użytkownicy mogą aktualizować swoje głosy
CREATE POLICY "Users can update own helpful votes" ON review_helpful_votes
    FOR UPDATE USING (auth.uid() = user_id);

-- ===================================
-- FUNKCJE POMOCNICZE
-- ===================================

-- Funkcja do automatycznego aktualizowania updated_at
CREATE TRIGGER update_ebook_reviews_updated_at
    BEFORE UPDATE ON ebook_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Funkcja do aktualizacji rating i review_count w tabeli ebooks
CREATE OR REPLACE FUNCTION update_ebook_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ebooks
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM ebook_reviews
            WHERE ebook_id = NEW.ebook_id AND status = 'approved'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM ebook_reviews
            WHERE ebook_id = NEW.ebook_id AND status = 'approved'
        )
    WHERE id = NEW.ebook_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do aktualizacji statystyk po dodaniu/zmianie recenzji
CREATE TRIGGER update_ebook_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON ebook_reviews
    FOR EACH ROW
    WHEN (NEW.status = 'approved' OR OLD.status = 'approved')
    EXECUTE FUNCTION update_ebook_rating_stats();

-- Funkcja do aktualizacji helpful_count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ebook_reviews
    SET helpful_count = (
        SELECT COUNT(*)
        FROM review_helpful_votes
        WHERE review_id = NEW.review_id AND is_helpful = true
    )
    WHERE id = NEW.review_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do aktualizacji helpful_count
CREATE TRIGGER update_helpful_count_on_vote
    AFTER INSERT OR UPDATE OR DELETE ON review_helpful_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_review_helpful_count();

