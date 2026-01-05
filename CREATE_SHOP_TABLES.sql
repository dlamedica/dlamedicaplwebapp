-- ===================================
-- TABELE DLA SKLEPU E-BOOKÓW
-- ===================================

-- 1. TABELA ORDERS (zamówienia)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Status zamówienia
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
    
    -- Płatność
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    currency VARCHAR(3) DEFAULT 'PLN',
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'transfer', 'blik', 'other')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Adres dostawy/faktury
    shipping_address JSONB,
    
    -- Indeksy
    CONSTRAINT valid_total_amount CHECK (total_amount > 0)
);

-- Indeksy dla orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 2. TABELA ORDER_ITEMS (pozycje zamówienia)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Zamówienie
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    
    -- Produkt (ebook)
    ebook_id VARCHAR(255) NOT NULL,
    ebook_title VARCHAR(500) NOT NULL,
    ebook_author VARCHAR(255) NOT NULL,
    
    -- Cena i ilość
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    
    -- Indeksy
    CONSTRAINT valid_price CHECK (price > 0),
    CONSTRAINT valid_quantity CHECK (quantity > 0)
);

-- Indeksy dla order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_ebook_id ON order_items(ebook_id);

-- 3. TABELA USER_PURCHASES (zakupione ebooki użytkownika)
CREATE TABLE IF NOT EXISTS user_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Ebook
    ebook_id VARCHAR(255) NOT NULL,
    
    -- Zamówienie (opcjonalne, dla historii)
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Link do pobrania
    download_url TEXT,
    
    -- Indeksy
    UNIQUE(user_id, ebook_id, order_id)
);

-- Indeksy dla user_purchases
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_ebook_id ON user_purchases(ebook_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_order_id ON user_purchases(order_id);

-- 4. TABELA EBOOKS (produkty w sklepie) - jeśli jeszcze nie istnieje
CREATE TABLE IF NOT EXISTS ebooks (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Podstawowe informacje
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Cena
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2),
    
    -- Kategoria
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    
    -- Szczegóły
    pages INTEGER,
    language VARCHAR(50) DEFAULT 'Polski',
    format VARCHAR(10) CHECK (format IN ('PDF', 'EPUB', 'MOBI')),
    file_size VARCHAR(50),
    publication_date DATE,
    isbn VARCHAR(50),
    
    -- Obrazy
    cover_image TEXT,
    
    -- Oceny
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    
    -- Flagi
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    
    -- Link do pobrania
    download_url TEXT,
    preview_pages INTEGER,
    
    -- Status
    is_available BOOLEAN DEFAULT true,
    
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

-- Indeksy dla ebooks
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_is_available ON ebooks(is_available);
CREATE INDEX IF NOT EXISTS idx_ebooks_is_bestseller ON ebooks(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_ebooks_is_new ON ebooks(is_new);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Włącz RLS dla orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą widzieć tylko swoje zamówienia
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Użytkownicy mogą tworzyć swoje zamówienia
CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Włącz RLS dla order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą widzieć pozycje swoich zamówień
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Włącz RLS dla user_purchases
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą widzieć tylko swoje zakupy
CREATE POLICY "Users can view own purchases" ON user_purchases
    FOR SELECT USING (auth.uid() = user_id);

-- Użytkownicy mogą tworzyć swoje zakupy (przez system)
CREATE POLICY "Users can create own purchases" ON user_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Włącz RLS dla ebooks (publiczne, ale można ograniczyć)
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;

-- Wszyscy mogą czytać dostępne ebooki
CREATE POLICY "Anyone can view available ebooks" ON ebooks
    FOR SELECT USING (is_available = true);

-- ===================================
-- FUNKCJE POMOCNICZE
-- ===================================

-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger dla ebooks
CREATE TRIGGER update_ebooks_updated_at
    BEFORE UPDATE ON ebooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

