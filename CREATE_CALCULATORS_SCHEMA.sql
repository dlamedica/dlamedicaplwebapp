-- Medical Calculators System Schema for DlaMedica
-- Drop existing tables if they exist
DROP TABLE IF EXISTS calculator_results CASCADE;
DROP TABLE IF EXISTS medical_calculators CASCADE;
DROP TABLE IF EXISTS calculator_categories CASCADE;

-- Calculator Categories Table
CREATE TABLE calculator_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT '#38b6ff',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medical Calculators Table
CREATE TABLE medical_calculators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    category_id UUID REFERENCES calculator_categories(id) ON DELETE SET NULL,
    
    -- Form fields stored as JSONB
    form_fields JSONB NOT NULL DEFAULT '[]',
    
    -- Calculation logic stored as JSONB
    calculation_config JSONB NOT NULL DEFAULT '{}',
    
    -- Results interpretation
    results_config JSONB NOT NULL DEFAULT '{}',
    
    -- Additional content
    evidence TEXT[],
    next_steps TEXT[],
    references TEXT[],
    creator_insights TEXT,
    
    -- Meta information
    tags TEXT[],
    specialty VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    
    -- Statistics
    usage_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Flags
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Calculator Results Table (for logged users)
CREATE TABLE calculator_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    calculator_id UUID REFERENCES medical_calculators(id) ON DELETE CASCADE,
    
    -- Form input data
    input_data JSONB NOT NULL DEFAULT '{}',
    
    -- Calculated results
    results JSONB NOT NULL DEFAULT '{}',
    
    -- Meta
    calculation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    
    -- Constraints
    UNIQUE(user_id, calculator_id, calculation_time)
);

-- Indexes for performance
CREATE INDEX idx_medical_calculators_slug ON medical_calculators(slug);
CREATE INDEX idx_medical_calculators_category_id ON medical_calculators(category_id);
CREATE INDEX idx_medical_calculators_specialty ON medical_calculators(specialty);
CREATE INDEX idx_medical_calculators_active ON medical_calculators(is_active) WHERE is_active = true;
CREATE INDEX idx_medical_calculators_featured ON medical_calculators(is_featured) WHERE is_featured = true;
CREATE INDEX idx_medical_calculators_tags ON medical_calculators USING GIN(tags);
CREATE INDEX idx_medical_calculators_form_fields ON medical_calculators USING GIN(form_fields);

CREATE INDEX idx_calculator_results_user_id ON calculator_results(user_id);
CREATE INDEX idx_calculator_results_calculator_id ON calculator_results(calculator_id);
CREATE INDEX idx_calculator_results_time ON calculator_results(calculation_time DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calculator_categories_updated_at BEFORE UPDATE ON calculator_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_calculators_updated_at BEFORE UPDATE ON medical_calculators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO calculator_categories (name, display_name, description, icon, sort_order) VALUES
('popular', 'Popular', 'Most commonly used calculators', 'star', 1),
('newest', 'Newest', 'Recently added calculators', 'clock', 2),
('favorites', 'Favorites', 'Your saved calculators', 'heart', 3),
('cardiology', 'Cardiology', 'Heart and cardiovascular calculators', 'heart', 4),
('emergency', 'Emergency Medicine', 'Critical care and emergency calculators', 'ambulance', 5),
('nephrology', 'Nephrology', 'Kidney and renal calculators', 'kidney', 6),
('neurology', 'Neurology', 'Brain and nervous system calculators', 'brain', 7),
('oncology', 'Oncology', 'Cancer and tumor calculators', 'ribbon', 8),
('pulmonology', 'Pulmonology', 'Lung and respiratory calculators', 'lungs', 9),
('rheumatology', 'Rheumatology', 'Joint and autoimmune calculators', 'bone', 10),
('guidelines', 'Guidelines', 'Evidence-based clinical guidelines', 'book', 11),
('all', 'All', 'All available calculators', 'calculator', 12);

-- Insert sample calculators
INSERT INTO medical_calculators (
    slug, 
    title, 
    description, 
    instructions,
    category_id,
    form_fields,
    calculation_config,
    results_config,
    evidence,
    next_steps,
    tags,
    specialty,
    is_featured,
    is_active,
    published_at
) VALUES 
(
    'pmr-eular-acr-2012',
    '2012 EULAR/ACR Classification Criteria for Polymyalgia Rheumatica',
    'Classifies polymyalgia rheumatica by expert consensus recommendations.',
    'This tool should only be used in patients who: are ≥50 years of age, present with bilateral shoulder pain, and who have an abnormal ESR and/or CRP.',
    (SELECT id FROM calculator_categories WHERE name = 'rheumatology'),
    '[
        {
            "id": "morning_stiffness",
            "label": "Morning stiffness duration",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "gte_45", "label": "≥45 minutes", "points": 2},
                {"value": "lt_45", "label": "<45 minutes", "points": 0}
            ]
        },
        {
            "id": "hip_pain",
            "label": "Hip pain or limited range of motion",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "present", "label": "Present", "points": 1},
                {"value": "absent", "label": "Absent", "points": 0}
            ]
        },
        {
            "id": "rf_acpa",
            "label": "Rheumatoid factor (RF) or ACPA antibodies",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "negative", "label": "Negative", "points": 0},
                {"value": "positive", "label": "Positive", "points": -2}
            ]
        },
        {
            "id": "other_joint_pain",
            "label": "Other joint pain",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "absent", "label": "Absent", "points": 0},
                {"value": "present", "label": "Present", "points": -1}
            ]
        },
        {
            "id": "ultrasound_one",
            "label": "At least one shoulder with subdeltoid bursitis and/or biceps tenosynovitis and/or glenohumeral synovitis (optional)",
            "type": "radio",
            "required": false,
            "options": [
                {"value": "no", "label": "No", "points": 0},
                {"value": "yes", "label": "Yes", "points": 1}
            ]
        },
        {
            "id": "ultrasound_both",
            "label": "Both shoulders with subdeltoid bursitis, biceps tenosynovitis or glenohumeral synovitis (optional)",
            "type": "radio",
            "required": false,
            "options": [
                {"value": "no", "label": "No", "points": 0},
                {"value": "yes", "label": "Yes", "points": 1}
            ]
        }
    ]',
    '{
        "type": "sum_points",
        "min_score": -3,
        "max_score": 6
    }',
    '{
        "interpretations": [
            {
                "condition": "score >= 4",
                "result": "Meets EULAR/ACR criteria for PMR",
                "color": "green",
                "severity": "positive"
            },
            {
                "condition": "score < 4",
                "result": "Does not meet EULAR/ACR criteria for PMR",
                "color": "red",
                "severity": "negative"
            }
        ]
    }',
    ARRAY[
        'Dasgupta B, Cimmino MA, Kremers HM, et al. 2012 Provisional classification criteria for polymyalgia rheumatica: a European League Against Rheumatism/American College of Rheumatology collaborative initiative. Arthritis Rheum. 2012;64(4):943-54.',
        'The classification criteria were developed through expert consensus and validation studies.',
        'Sensitivity: 68.3%, Specificity: 78.1% for the classification criteria.'
    ],
    ARRAY[
        'If criteria are met, consider PMR diagnosis in appropriate clinical context',
        'Start corticosteroid treatment (prednisolone 15-20mg daily)',
        'Monitor for treatment response (significant improvement within 72 hours)',
        'Rule out giant cell arteritis and malignancy',
        'Consider rheumatology referral for complex cases'
    ],
    ARRAY['PMR', 'polymyalgia', 'rheumatica', 'EULAR', 'ACR', 'classification'],
    'Rheumatology',
    true,
    true,
    CURRENT_TIMESTAMP
),
(
    'rcc-leibovich-2018',
    '2018 Leibovich Model for Renal Cell Carcinoma (RCC)',
    'Predicts progression-free and cancer-specific survival in patients with renal cell carcinoma (RCC).',
    'For use in patients with clear cell renal cell carcinoma who have undergone nephrectomy.',
    (SELECT id FROM calculator_categories WHERE name = 'oncology'),
    '[
        {
            "id": "t_stage",
            "label": "T stage",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "T1a", "label": "T1a", "points": 0},
                {"value": "T1b", "label": "T1b", "points": 2},
                {"value": "T2", "label": "T2", "points": 3},
                {"value": "T3a", "label": "T3a", "points": 4},
                {"value": "T3b", "label": "T3b", "points": 4},
                {"value": "T3c", "label": "T3c", "points": 4},
                {"value": "T4", "label": "T4", "points": 6}
            ]
        },
        {
            "id": "n_stage",
            "label": "N stage",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "N0", "label": "N0", "points": 0},
                {"value": "N1", "label": "N1", "points": 2},
                {"value": "N2", "label": "N2", "points": 2}
            ]
        },
        {
            "id": "tumor_size",
            "label": "Tumor size",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "lt_10", "label": "<10 cm", "points": 0},
                {"value": "gte_10", "label": "≥10 cm", "points": 1}
            ]
        },
        {
            "id": "nuclear_grade",
            "label": "Nuclear grade",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "1", "label": "Grade 1", "points": 0},
                {"value": "2", "label": "Grade 2", "points": 0},
                {"value": "3", "label": "Grade 3", "points": 1},
                {"value": "4", "label": "Grade 4", "points": 3}
            ]
        },
        {
            "id": "tumor_necrosis",
            "label": "Tumor necrosis",
            "type": "radio",
            "required": true,
            "options": [
                {"value": "absent", "label": "Absent", "points": 0},
                {"value": "present", "label": "Present", "points": 1}
            ]
        }
    ]',
    '{
        "type": "sum_points",
        "min_score": 0,
        "max_score": 17
    }',
    '{
        "interpretations": [
            {
                "condition": "score >= 0 && score <= 2",
                "result": "Low risk",
                "description": "Excellent prognosis with very low risk of progression",
                "color": "green",
                "severity": "low"
            },
            {
                "condition": "score >= 3 && score <= 5",
                "result": "Intermediate risk", 
                "description": "Moderate risk of progression, requires regular surveillance",
                "color": "yellow",
                "severity": "moderate"
            },
            {
                "condition": "score >= 6",
                "result": "High risk",
                "description": "Significant risk of progression, consider adjuvant therapy",
                "color": "red",
                "severity": "high"
            }
        ]
    }',
    ARRAY[
        'Leibovich BC, Blute ML, Cheville JC, et al. Prediction of progression after radical nephrectomy for patients with clear cell renal cell carcinoma: a stratification tool for prospective clinical trials. Cancer. 2003;97(7):1663-71.',
        'Updated model validated in multiple cohorts with good discrimination.',
        'C-index: 0.82 for cancer-specific survival prediction.'
    ],
    ARRAY[
        'Low risk: Consider active surveillance protocols',
        'Intermediate risk: Regular imaging surveillance every 6 months',
        'High risk: Consider adjuvant therapy trials and close monitoring',
        'All patients: Annual comprehensive metabolic panel and chest imaging',
        'Consider oncology referral for high-risk patients'
    ],
    ARRAY['RCC', 'renal', 'cancer', 'carcinoma', 'Leibovich', 'survival'],
    'Oncology',
    true,
    true,
    CURRENT_TIMESTAMP
);

-- Update usage counts for sample data
UPDATE medical_calculators SET usage_count = 1250 WHERE slug = 'pmr-eular-acr-2012';
UPDATE medical_calculators SET usage_count = 980 WHERE slug = 'rcc-leibovich-2018';

-- Grant permissions (adjust based on your RLS policies)
-- ALTER TABLE calculator_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE medical_calculators ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE calculator_results ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (uncomment and modify as needed)
-- CREATE POLICY "Calculator categories are viewable by everyone" ON calculator_categories FOR SELECT USING (is_active = true);
-- CREATE POLICY "Medical calculators are viewable by everyone" ON medical_calculators FOR SELECT USING (is_active = true);
-- CREATE POLICY "Users can view their own results" ON calculator_results FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert their own results" ON calculator_results FOR INSERT WITH CHECK (auth.uid() = user_id);