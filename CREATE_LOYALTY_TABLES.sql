-- ===================================
-- TABELE DLA PROGRAMU LOJALNOŚCIOWEGO
-- ===================================

-- Tabela loyalty_points
CREATE TABLE IF NOT EXISTS loyalty_points (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
    available_points INTEGER DEFAULT 0 CHECK (available_points >= 0),
    used_points INTEGER DEFAULT 0 CHECK (used_points >= 0),
    
    level VARCHAR(20) DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum'))
);

-- Tabela points_transactions
CREATE TABLE IF NOT EXISTS points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'used', 'expired')),
    description TEXT NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON points_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_transactions_type ON points_transactions(type);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą widzieć swoje punkty
CREATE POLICY "Users can view own loyalty points" ON loyalty_points
    FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą widzieć swoje transakcje
CREATE POLICY "Users can view own points transactions" ON points_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- ===================================
-- FUNKCJE POMOCNICZE
-- ===================================

CREATE TRIGGER update_loyalty_points_updated_at
    BEFORE UPDATE ON loyalty_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

