const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

/**
 * Helper do paginacji
 * @param {Array} items - tablica elementów
 * @param {number} page - numer strony (1-indexed)
 * @param {number} limit - liczba elementów na stronie
 * @returns {Object} - paginowane dane z metadanymi
 */
const paginate = (items, page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20)); // max 100
  
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalItems,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  };
};

// Sample data - in production this would come from database
const subjectsData = {
  preclinical: [
    {
      id: '1',
      name: 'Anatomia',
      description: 'Budowa ciała ludzkiego - anatomia opisowa, czynnościowa i topograficzna',
      icon: '🫀',
      difficulty: 'medium',
      modules: 15,
      estimatedHours: 120,
      professions: ['lekarz', 'pielęgniarka', 'fizjoterapeuta', 'ratownik_medyczny'],
      categories: ['opisowa', 'czynnościowa', 'topograficzna'],
      prerequisites: [],
      color: '#e74c3c'
    },
    {
      id: '2',
      name: 'Fizjologia',
      description: 'Funkcjonowanie organizmów żywych - fizjologia ogólna, układów i wysiłku',
      icon: '⚡',
      difficulty: 'hard',
      modules: 12,
      estimatedHours: 100,
      professions: ['lekarz', 'pielęgniarka', 'fizjoterapeuta'],
      categories: ['ogólna', 'układów', 'wysiłku'],
      prerequisites: ['1'], // Anatomia
      color: '#3498db'
    },
    {
      id: '3',
      name: 'Biochemia',
      description: 'Procesy chemiczne w organizmie - biochemia ogólna, kliniczna i żywienia',
      icon: '🧪',
      difficulty: 'hard',
      modules: 10,
      estimatedHours: 80,
      professions: ['lekarz', 'dietetyk', 'analityk_medyczny'],
      categories: ['ogólna', 'kliniczna', 'żywienia'],
      prerequisites: [],
      color: '#9b59b6'
    },
    {
      id: '4',
      name: 'Biofizyka',
      description: 'Zastosowanie fizyki w medycynie - podstawy biofizyki i biomechaniki',
      icon: '⚛️',
      difficulty: 'medium',
      modules: 8,
      estimatedHours: 60,
      professions: ['lekarz', 'fizjoterapeuta', 'radiolog'],
      categories: ['podstawy', 'biomechanika'],
      prerequisites: [],
      color: '#1abc9c'
    },
    {
      id: '5',
      name: 'Mikrobiologia',
      description: 'Drobnoustroje chorobotwórcze - bakterie, wirusy, grzyby i pasożyty',
      icon: '🦠',
      difficulty: 'medium',
      modules: 12,
      estimatedHours: 90,
      professions: ['lekarz', 'pielęgniarka', 'analityk_medyczny'],
      categories: ['bakterie', 'wirusy', 'grzyby', 'pasożyty'],
      prerequisites: [],
      color: '#e67e22'
    },
    {
      id: '6',
      name: 'Patomorfologia',
      description: 'Zmiany chorobowe w tkankach - histologia i patologia',
      icon: '🔬',
      difficulty: 'hard',
      modules: 14,
      estimatedHours: 110,
      professions: ['lekarz', 'analityk_medyczny'],
      categories: ['histologia', 'patologia'],
      prerequisites: ['1'], // Anatomia
      color: '#34495e'
    },
    {
      id: '7',
      name: 'Farmakologia',
      description: 'Działanie leków na organizm - farmakologia ogólna i kliniczna',
      icon: '💊',
      difficulty: 'hard',
      modules: 16,
      estimatedHours: 130,
      professions: ['lekarz', 'farmaceuta', 'pielęgniarka'],
      categories: ['ogólna', 'kliniczna'],
      prerequisites: ['2', '3'], // Fizjologia, Biochemia
      color: '#2ecc71'
    },
    {
      id: '8',
      name: 'Genetyka',
      description: 'Dziedziczność i genetyka medyczna - podstawy genetyki klinicznej',
      icon: '🧬',
      difficulty: 'medium',
      modules: 10,
      estimatedHours: 75,
      professions: ['lekarz', 'diagnosta_laboratoryjny'],
      categories: ['medyczna', 'kliniczna'],
      prerequisites: ['3'], // Biochemia
      color: '#f39c12'
    },
    {
      id: '9',
      name: 'Immunologia',
      description: 'System immunologiczny - immunologia podstawowa i kliniczna',
      icon: '🛡️',
      difficulty: 'hard',
      modules: 11,
      estimatedHours: 85,
      professions: ['lekarz', 'analityk_medyczny'],
      categories: ['podstawowa', 'kliniczna'],
      prerequisites: ['5'], // Mikrobiologia
      color: '#8e44ad'
    },
    {
      id: '10',
      name: 'Biostatystyka',
      description: 'Statystyka w medycynie - biostatystyka i epidemiologia',
      icon: '📊',
      difficulty: 'medium',
      modules: 8,
      estimatedHours: 60,
      professions: ['lekarz', 'epidemiolog'],
      categories: ['statystyka', 'epidemiologia'],
      prerequisites: [],
      color: '#95a5a6'
    }
  ],
  clinical: [
    {
      id: '11',
      name: 'Kardiologia',
      description: 'Choroby serca i układu krążenia',
      icon: '❤️',
      difficulty: 'hard',
      modules: 20,
      estimatedHours: 150,
      professions: ['lekarz', 'pielęgniarka_kardiologiczna'],
      prerequisites: ['1', '2', '7'], // Anatomia, Fizjologia, Farmakologia
      color: '#e74c3c'
    },
    {
      id: '12',
      name: 'Pulmonologia',
      description: 'Choroby układu oddechowego',
      icon: '🫁',
      difficulty: 'hard',
      modules: 15,
      estimatedHours: 120,
      professions: ['lekarz', 'fizjoterapeuta_oddechowy'],
      prerequisites: ['1', '2'],
      color: '#3498db'
    },
    {
      id: '13',
      name: 'Gastroenterologia',
      description: 'Choroby układu pokarmowego',
      icon: '🫃',
      difficulty: 'hard',
      modules: 18,
      estimatedHours: 140,
      professions: ['lekarz', 'dietetyk'],
      prerequisites: ['1', '2', '3'],
      color: '#f39c12'
    },
    {
      id: '14',
      name: 'Nefrologia',
      description: 'Choroby nerek i układu moczowego',
      icon: '🫘',
      difficulty: 'hard',
      modules: 12,
      estimatedHours: 100,
      professions: ['lekarz', 'pielęgniarka_nefrologiczna'],
      prerequisites: ['1', '2'],
      color: '#9b59b6'
    },
    {
      id: '15',
      name: 'Endokrynologia',
      description: 'Choroby gruczołów wydzielania wewnętrznego',
      icon: '🧬',
      difficulty: 'hard',
      modules: 14,
      estimatedHours: 110,
      professions: ['lekarz', 'dietetyk'],
      prerequisites: ['2', '3'],
      color: '#1abc9c'
    }
  ],
  specialized: [
    {
      id: '101',
      name: 'EKG - Elektrokardiografia',
      description: 'Interpretacja zapisów EKG - od podstaw do zaawansowanych przypadków',
      icon: '📈',
      difficulty: 'medium',
      modules: 8,
      estimatedHours: 40,
      professions: ['lekarz', 'pielęgniarka', 'ratownik_medyczny'],
      prerequisites: ['11'], // Kardiologia
      color: '#e74c3c'
    },
    {
      id: '102',
      name: 'Ultrasonografia',
      description: 'Badania USG - POCUS, brzucha, serca, położnicze',
      icon: '🔊',
      difficulty: 'hard',
      modules: 15,
      estimatedHours: 100,
      professions: ['lekarz', 'sonografista'],
      prerequisites: ['1'], // Anatomia
      color: '#3498db'
    },
    {
      id: '103',
      name: 'Radiologia',
      description: 'Interpretacja obrazów rentgenowskich, CT, MRI',
      icon: '🩻',
      difficulty: 'hard',
      modules: 20,
      estimatedHours: 120,
      professions: ['lekarz', 'radiolog'],
      prerequisites: ['1'], // Anatomia
      color: '#34495e'
    }
  ]
};

// GET /api/subjects - wszystkie przedmioty (z paginacją)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page, limit, profession } = req.query;
    
    let allSubjects = [
      ...subjectsData.preclinical,
      ...subjectsData.clinical,
      ...subjectsData.specialized
    ];

    // Filter by user's profession if provided
    if (profession) {
      allSubjects = allSubjects.filter(subject =>
        subject.professions.includes(profession)
      );
    }

    // Paginacja
    const { data, pagination } = paginate(allSubjects, page, limit);

    res.json({
      subjects: data,
      pagination,
      categories: {
        preclinical: subjectsData.preclinical.length,
        clinical: subjectsData.clinical.length,
        specialized: subjectsData.specialized.length
      },
      ...(profession && { profession })
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// GET /api/subjects/preclinical - przedmioty przedkliniczne (z paginacją)
router.get('/preclinical', authenticateToken, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { data, pagination } = paginate(subjectsData.preclinical, page, limit);
    
    res.json({
      subjects: data,
      pagination,
      category: 'preclinical'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preclinical subjects' });
  }
});

// GET /api/subjects/clinical - przedmioty kliniczne (z paginacją)
router.get('/clinical', authenticateToken, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { data, pagination } = paginate(subjectsData.clinical, page, limit);
    
    res.json({
      subjects: data,
      pagination,
      category: 'clinical'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clinical subjects' });
  }
});

// GET /api/subjects/specialized - moduły specjalistyczne (z paginacją)
router.get('/specialized', authenticateToken, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { data, pagination } = paginate(subjectsData.specialized, page, limit);
    
    res.json({
      subjects: data,
      pagination,
      category: 'specialized'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specialized subjects' });
  }
});

// GET /api/subjects/:id/modules - moduły w przedmiocie
router.get('/:id/modules', 
  authenticateToken,
  async (req, res) => {
    try {
      const subjectId = req.params.id;
      
      // Find subject in all categories
      const allSubjects = [
        ...subjectsData.preclinical,
        ...subjectsData.clinical,
        ...subjectsData.specialized
      ];
      
      const subject = allSubjects.find(s => s.id === subjectId);
      
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Generate sample modules based on subject
      const modules = generateModulesForSubject(subject);
      
      res.json({
        subject: {
          id: subject.id,
          name: subject.name,
          description: subject.description
        },
        modules,
        total: modules.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subject modules' });
    }
  }
);

// Helper function to generate modules for a subject
function generateModulesForSubject(subject) {
  const moduleTemplates = {
    '1': [ // Anatomia
      { name: 'Anatomia Układu Krążenia', description: 'Serce, naczynia krwionośne, krążenie' },
      { name: 'Anatomia Układu Oddechowego', description: 'Drogi oddechowe, płuca, opłucna' },
      { name: 'Anatomia Układu Nerwowego', description: 'Mózg, rdzeń kręgowy, nerwy obwodowe' },
      { name: 'Anatomia Układu Mięśniowo-Szkieletowego', description: 'Kości, stawy, mięśnie' },
      { name: 'Anatomia Topograficzna', description: 'Anatomia regionalna i stosowana' }
    ],
    '11': [ // Kardiologia
      { name: 'Anatomia i Fizjologia Serca', description: 'Budowa i czynność serca' },
      { name: 'Choroby Wieńcowe', description: 'Choroba niedokrwienna serca, zawał' },
      { name: 'Zaburzenia Rytmu', description: 'Arytmie serca, zaburzenia przewodzenia' },
      { name: 'Niewydolność Serca', description: 'Ostra i przewlekła niewydolność serca' },
      { name: 'Nadciśnienie Tętnicze', description: 'Pierwotne i wtórne nadciśnienie' }
    ],
    '101': [ // EKG
      { name: 'Podstawy EKG', description: 'Fizjologia, odprowadzenia, technika' },
      { name: 'Rytm Zatokowy i Zaburzenia', description: 'Rozpoznawanie rytmów serca' },
      { name: 'Bloki Przewodzenia', description: 'Bloki przedsionkowo-komorowe i śródkomorowe' },
      { name: 'Zawał Serca w EKG', description: 'STEMI, NSTEMI, lokalizacja zawału' },
      { name: 'Zaburzenia Elektrolitowe', description: 'Wpływ elektrolitów na EKG' }
    ]
  };

  const defaultModules = Array.from({ length: subject.modules }, (_, i) => ({
    name: `Moduł ${i + 1}`,
    description: `Opis modułu ${i + 1} przedmiotu ${subject.name}`
  }));

  const templates = moduleTemplates[subject.id] || defaultModules;
  
  return templates.map((template, index) => ({
    id: `${subject.id}-module-${index + 1}`,
    subjectId: subject.id,
    name: template.name,
    description: template.description,
    order: index + 1,
    estimatedHours: Math.ceil(subject.estimatedHours / subject.modules),
    difficulty: subject.difficulty,
    topics: Math.floor(Math.random() * 8) + 3, // 3-10 topics per module
    isCompleted: false,
    progress: 0
  }));
}

module.exports = router;