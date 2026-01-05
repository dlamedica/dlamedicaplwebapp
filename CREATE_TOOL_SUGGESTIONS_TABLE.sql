-- ===================================
-- TABELA PROPOZYCJI NARZĘDZI
-- ===================================

CREATE TABLE IF NOT EXISTS tool_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Treść propozycji
    description TEXT NOT NULL,
    
    -- Informacje o użytkowniku
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    
    -- Status propozycji
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected', 'implemented')),
    
    -- Komentarze admina
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    
    -- Walidacja długości opisu
    CONSTRAINT min_description_length CHECK (char_length(trim(description)) >= 50)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_tool_suggestions_status ON tool_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_tool_suggestions_created_at ON tool_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_suggestions_user_id ON tool_suggestions(user_id) WHERE user_id IS NOT NULL;

-- RLS (Row Level Security)
ALTER TABLE tool_suggestions ENABLE ROW LEVEL SECURITY;

-- Polityki RLS
-- Użytkownicy mogą dodawać propozycje
CREATE POLICY "Users can insert tool suggestions" ON tool_suggestions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Użytkownicy mogą przeglądać swoje własne propozycje
CREATE POLICY "Users can view own suggestions" ON tool_suggestions
    FOR SELECT USING (auth.uid() = user_id);

-- Admini mogą przeglądać wszystkie propozycje
CREATE POLICY "Admins can view all suggestions" ON tool_suggestions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users_profiles
            WHERE id = auth.uid() AND (role = 'admin' OR email = 'admin@dlamedica.pl')
        )
    );

-- Admini mogą aktualizować propozycje
CREATE POLICY "Admins can update suggestions" ON tool_suggestions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users_profiles
            WHERE id = auth.uid() AND (role = 'admin' OR email = 'admin@dlamedica.pl')
        )
    );

-- Funkcja do automatycznego ustawiania updated_at
CREATE OR REPLACE FUNCTION update_tool_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla updated_at
CREATE TRIGGER update_tool_suggestions_updated_at
    BEFORE UPDATE ON tool_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_tool_suggestions_updated_at();

