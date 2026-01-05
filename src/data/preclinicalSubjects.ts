import { Subject } from '../components/subjects/SubjectCard';

// TOP 10 dla lekarza
export const doctorSubjects: Subject[] = [
  {
    id: 1,
    name: "Anatomia człowieka",
    modules: 18,
    difficulty: "Średni",
    icon: "🦴",
    priority: 3,
    description: "Podstawowa wiedza o budowie ciała człowieka"
  },
  {
    id: 2, 
    name: "Fizjologia człowieka",
    modules: 15,
    difficulty: "Średni", 
    icon: "⚡",
    priority: 3,
    description: "Funkcjonowanie układów organizmu"
  },
  {
    id: 3,
    name: "Patofizjologia", 
    modules: 12,
    difficulty: "Trudny",
    icon: "🔬",
    priority: 3,
    description: "Mechanizmy powstawania chorób"
  },
  {
    id: 4,
    name: "Farmakologia kliniczna",
    modules: 14,
    difficulty: "Trudny",
    icon: "💊", 
    priority: 3,
    description: "Działanie leków w organizmie"
  },
  {
    id: 5,
    name: "Biochemia",
    modules: 10,
    difficulty: "Trudny",
    icon: "🧪",
    priority: 3,
    description: "Procesy chemiczne w organizmie"
  },
  {
    id: 6,
    name: "Mikrobiologia i parazytologia", 
    modules: 13,
    difficulty: "Średni",
    icon: "🦠",
    priority: 3,
    description: "Drobnoustroje chorobotwórcze"
  },
  {
    id: 7,
    name: "Patomorfologia",
    modules: 11,
    difficulty: "Trudny", 
    icon: "🔍",
    priority: 3,
    description: "Zmiany morfologiczne w chorobach"
  },
  {
    id: 8,
    name: "Immunologia",
    modules: 9,
    difficulty: "Średni",
    icon: "🛡️",
    priority: 2,
    description: "System odpornościowy organizmu"
  },
  {
    id: 9,
    name: "Genetyka medyczna",
    modules: 8,
    difficulty: "Trudny",
    icon: "🧬", 
    priority: 2,
    description: "Podstawy genetyki w medycynie"
  },
  {
    id: 10,
    name: "Histologia i embriologia",
    modules: 12,
    difficulty: "Średni",
    icon: "🔬",
    priority: 2,
    description: "Budowa tkanek i rozwój zarodkowy"
  }
];

// TOP 10 dla pielęgniarki
export const nurseSubjects: Subject[] = [
  {
    id: 1,
    name: "Anatomia człowieka",
    modules: 15,
    difficulty: "Średni",
    icon: "🦴",
    priority: 3,
    description: "Budowa ciała dla potrzeb pielęgniarstwa"
  },
  {
    id: 2,
    name: "Fizjologia człowieka", 
    modules: 12,
    difficulty: "Średni",
    icon: "⚡",
    priority: 3,
    description: "Funkcje organizmu w praktyce pielęgniarskiej"
  },
  {
    id: 3,
    name: "Farmakologia ogólna",
    modules: 14,
    difficulty: "Średni",
    icon: "💊",
    priority: 3, 
    description: "Podstawy farmakologii dla pielęgniarek"
  },
  {
    id: 4,
    name: "Mikrobiologia",
    modules: 10,
    difficulty: "Średni",
    icon: "🦠",
    priority: 3,
    description: "Drobnoustroje w praktyce szpitalnej"
  },
  {
    id: 5,
    name: "Podstawy medycyny",
    modules: 11,
    difficulty: "Łatwy", 
    icon: "🩺",
    priority: 3,
    description: "Fundamenty wiedzy medycznej"
  },
  {
    id: 6,
    name: "Higiena i epidemiologia",
    modules: 8,
    difficulty: "Łatwy",
    icon: "🧼",
    priority: 3,
    description: "Kontrola zakażeń szpitalnych"
  },
  {
    id: 7,
    name: "Pierwsza pomoc",
    modules: 6,
    difficulty: "Łatwy",
    icon: "🚑", 
    priority: 3,
    description: "Postępowanie w stanach nagłych"
  },
  {
    id: 8,
    name: "Biochemia",
    modules: 9,
    difficulty: "Średni",
    icon: "🧪",
    priority: 2,
    description: "Podstawy biochemii klinicznej"
  },
  {
    id: 9,
    name: "Etyka medyczna",
    modules: 5,
    difficulty: "Łatwy",
    icon: "⚖️",
    priority: 2, 
    description: "Zasady etyczne w pielęgniarstwie"
  },
  {
    id: 10,
    name: "Psychologia ogólna",
    modules: 7,
    difficulty: "Łatwy",
    icon: "🧠",
    priority: 2,
    description: "Komunikacja z pacjentem"
  }
];

// TOP 10 dla fizjoterapeuty
export const physiotherapistSubjects: Subject[] = [
  {
    id: 1,
    name: "Anatomia funkcjonalna",
    modules: 20,
    difficulty: "Trudny",
    icon: "🦴",
    priority: 3,
    description: "Anatomia w aspekcie ruchu"
  },
  {
    id: 2,
    name: "Kinezjologia", 
    modules: 18,
    difficulty: "Trudny",
    icon: "🏃‍♂️",
    priority: 3,
    description: "Nauka o ruchu człowieka"
  },
  {
    id: 3,
    name: "Biomechanika",
    modules: 16,
    difficulty: "Trudny", 
    icon: "⚙️",
    priority: 3,
    description: "Mechanika ruchu biologicznego"
  },
  {
    id: 4,
    name: "Fizjologia wysiłku",
    modules: 14,
    difficulty: "Średni",
    icon: "💪",
    priority: 3,
    description: "Adaptacje organizmu do wysiłku"
  },
  {
    id: 5,
    name: "Neuroanatomia",
    modules: 15,
    difficulty: "Trudny",
    icon: "🧠",
    priority: 3,
    description: "Budowa układu nerwowego"
  },
  {
    id: 6,
    name: "Patofizjologia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🔬",
    priority: 3,
    description: "Mechanizmy zaburzeń ruchu"
  },
  {
    id: 7,
    name: "Metodyka fizjoterapii",
    modules: 16,
    difficulty: "Średni",
    icon: "📋",
    priority: 3,
    description: "Techniki i metody terapeutyczne"
  },
  {
    id: 8,
    name: "Psychologia rehabilitacji",
    modules: 8,
    difficulty: "Łatwy",
    icon: "🧠",
    priority: 2,
    description: "Aspekty psychologiczne rehabilitacji"
  },
  {
    id: 9,
    name: "Fizjologia człowieka",
    modules: 12,
    difficulty: "Średni",
    icon: "⚡",
    priority: 2,
    description: "Funkcje organizmu w kontekście ruchu"
  },
  {
    id: 10,
    name: "Biochemia",
    modules: 8,
    difficulty: "Średni",
    icon: "🧪",
    priority: 2,
    description: "Procesy biochemiczne w wysiłku"
  }
];

// TOP 10 dla farmaceuty
export const pharmacistSubjects: Subject[] = [
  {
    id: 1,
    name: "Farmakologia ogólna",
    modules: 22,
    difficulty: "Trudny",
    icon: "💊",
    priority: 3,
    description: "Podstawy działania leków"
  },
  {
    id: 2,
    name: "Farmakognozja",
    modules: 20,
    difficulty: "Trudny", 
    icon: "🌿",
    priority: 3,
    description: "Surowce roślinne i zwierzęce"
  },
  {
    id: 3,
    name: "Chemia farmaceutyczna",
    modules: 18,
    difficulty: "Trudny",
    icon: "🧪",
    priority: 3,
    description: "Synteza i analiza substancji leczniczych"
  },
  {
    id: 4,
    name: "Technologia postaci leku",
    modules: 16,
    difficulty: "Trudny",
    icon: "⚗️",
    priority: 3,
    description: "Wytwarzanie form leków"
  },
  {
    id: 5,
    name: "Biochemia",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧬",
    priority: 3,
    description: "Procesy biochemiczne organizmu"
  },
  {
    id: 6,
    name: "Mikrobiologia farmaceutyczna",
    modules: 12,
    difficulty: "Średni",
    icon: "🦠",
    priority: 3,
    description: "Mikrobiologia w produkcji leków"
  },
  {
    id: 7,
    name: "Farmakokinetyka",
    modules: 10,
    difficulty: "Trudny",
    icon: "📈",
    priority: 3,
    description: "Los leku w organizmie"
  },
  {
    id: 8,
    name: "Toksykologia",
    modules: 9,
    difficulty: "Średni",
    icon: "☠️",
    priority: 2,
    description: "Działania niepożądane substancji"
  },
  {
    id: 9,
    name: "Fizjologia człowieka",
    modules: 10,
    difficulty: "Średni",
    icon: "⚡",
    priority: 2,
    description: "Funkcje organizmu dla farmaceuty"
  },
  {
    id: 10,
    name: "Prawo farmaceutyczne",
    modules: 6,
    difficulty: "Łatwy",
    icon: "⚖️",
    priority: 2,
    description: "Regulacje prawne w farmacji"
  }
];

// Pozostałe 65 przedmiotów
export const remainingSubjects: Subject[] = [
  {
    id: 11,
    name: "Akustyka medyczna",
    modules: 6,
    difficulty: "Średni",
    icon: "🔊", 
    forProfessions: ["audiolog", "protetyk słuchu"],
    description: "Podstawy akustyki w medycynie"
  },
  {
    id: 12, 
    name: "Analityka medyczna",
    modules: 12,
    difficulty: "Trudny",
    icon: "📊",
    forProfessions: ["analityk medyczny", "laborant"],
    description: "Techniki analizy laboratoryjnej"
  },
  {
    id: 13,
    name: "Anatomia patologiczna",
    modules: 10,
    difficulty: "Trudny",
    icon: "🔍",
    forProfessions: ["patolog", "lekarz"],
    description: "Zmiany anatomiczne w chorobach"
  },
  {
    id: 14,
    name: "Andrologia",
    modules: 8,
    difficulty: "Średni",
    icon: "♂️",
    forProfessions: ["urolog", "androlog"],
    description: "Fizjologia i patologia męska"
  },
  {
    id: 15,
    name: "Anestezjologia podstawowa",
    modules: 14,
    difficulty: "Trudny",
    icon: "💉",
    forProfessions: ["anestezjolog", "pielęgniarka anestezjologiczna"],
    description: "Podstawy znieczulenia"
  },
  {
    id: 16,
    name: "Antropologia medyczna",
    modules: 6,
    difficulty: "Łatwy",
    icon: "👤",
    forProfessions: ["lekarz", "antropolog"],
    description: "Człowiek w kontekście medycznym"
  },
  {
    id: 17,
    name: "Audiologia",
    modules: 10,
    difficulty: "Średni",
    icon: "👂",
    forProfessions: ["audiolog", "laryngolog"],
    description: "Diagnostyka słuchu"
  },
  {
    id: 18,
    name: "Bakteriologia",
    modules: 12,
    difficulty: "Średni",
    icon: "🦠",
    forProfessions: ["mikrobiolog", "laborant"],
    description: "Nauka o bakteriach"
  },
  {
    id: 19,
    name: "Balneologia",
    modules: 6,
    difficulty: "Łatwy",
    icon: "💧",
    forProfessions: ["fizjoterapeuta", "rehabilitant"],
    description: "Lecznictwo uzdrowiskowe"
  },
  {
    id: 20,
    name: "Biocybernetyka",
    modules: 8,
    difficulty: "Trudny",
    icon: "🤖",
    forProfessions: ["inżynier biomedyczny", "informatyk medyczny"],
    description: "Sterowanie w systemach biologicznych"
  },
  {
    id: 21,
    name: "Bioetyka",
    modules: 5,
    difficulty: "Łatwy",
    icon: "⚖️",
    forProfessions: ["lekarz", "pielęgniarka", "położna"],
    description: "Etyka w naukach biomedycznych"
  },
  {
    id: 22,
    name: "Biofizyka",
    modules: 10,
    difficulty: "Trudny",
    icon: "⚛️",
    forProfessions: ["fizyk medyczny", "radiolog"],
    description: "Fizyka procesów biologicznych"
  },
  {
    id: 23,
    name: "Bioinformatyka",
    modules: 12,
    difficulty: "Trudny",
    icon: "💻",
    forProfessions: ["bioinformatyk", "genetyk"],
    description: "Informatyka w biologii"
  },
  {
    id: 24,
    name: "Biologia molekularna",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧬",
    forProfessions: ["biolog molekularny", "genetyk"],
    description: "Procesy molekularne życia"
  },
  {
    id: 25,
    name: "Biomateriały",
    modules: 8,
    difficulty: "Średni",
    icon: "🔧",
    forProfessions: ["inżynier biomedyczny", "stomatolog"],
    description: "Materiały w medycynie"
  },
  {
    id: 26,
    name: "Biostatystyka",
    modules: 10,
    difficulty: "Średni",
    icon: "📊",
    forProfessions: ["epidemiolog", "badacz kliniczny"],
    description: "Statystyka w medycynie"
  },
  {
    id: 27,
    name: "Biotechnologia medyczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "🧫",
    forProfessions: ["biotechnolog", "farmaceuta"],
    description: "Technologie biologiczne w medycynie"
  },
  {
    id: 28,
    name: "Chirurgia podstawowa",
    modules: 18,
    difficulty: "Trudny",
    icon: "🔪",
    forProfessions: ["chirurg", "pielęgniarka zabiegowa"],
    description: "Podstawy technik chirurgicznych"
  },
  {
    id: 29,
    name: "Choroby zakaźne",
    modules: 14,
    difficulty: "Średni",
    icon: "🦠",
    forProfessions: ["epidemiolog", "higienista"],
    description: "Epidemiologia chorób zakaźnych"
  },
  {
    id: 30,
    name: "Cytologia",
    modules: 10,
    difficulty: "Średni",
    icon: "🔬",
    forProfessions: ["cytotechnolog", "patomorfolog"],
    description: "Badanie komórek"
  },
  {
    id: 31,
    name: "Dermatologia podstawowa",
    modules: 12,
    difficulty: "Średni",
    icon: "🤚",
    forProfessions: ["dermatolog", "kosmetolog"],
    description: "Choroby skóry"
  },
  {
    id: 32,
    name: "Dietetyka",
    modules: 10,
    difficulty: "Łatwy",
    icon: "🥗",
    forProfessions: ["dietetyk", "technolog żywności"],
    description: "Żywienie w zdrowiu i chorobie"
  },
  {
    id: 33,
    name: "Elektrofizjologia",
    modules: 8,
    difficulty: "Trudny",
    icon: "⚡",
    forProfessions: ["kardiolog", "neurofizjolog"],
    description: "Elektryczność w organizmie"
  },
  {
    id: 34,
    name: "Embriologia",
    modules: 8,
    difficulty: "Średni",
    icon: "👶",
    forProfessions: ["ginekolog", "genetyk"],
    description: "Rozwój zarodkowy"
  },
  {
    id: 35,
    name: "Endokrynologia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🔄",
    forProfessions: ["endokrynolog", "diabetolog"],
    description: "Układ hormonalny"
  },
  {
    id: 36,
    name: "Epidemiologia",
    modules: 10,
    difficulty: "Średni",
    icon: "📈",
    forProfessions: ["epidemiolog", "specjalista zdrowia publicznego"],
    description: "Rozprzestrzenianie się chorób"
  },
  {
    id: 37,
    name: "Ergonomia",
    modules: 6,
    difficulty: "Łatwy",
    icon: "🪑",
    forProfessions: ["fizjoterapeuta", "terapeuta zajęciowy"],
    description: "Przystosowanie pracy do człowieka"
  },
  {
    id: 38,
    name: "Farmacja kliniczna",
    modules: 14,
    difficulty: "Trudny",
    icon: "💊",
    forProfessions: ["farmaceuta kliniczny", "farmaceuta szpitalny"],
    description: "Optymalizacja farmakoterapii"
  },
  {
    id: 39,
    name: "Fitoterapia",
    modules: 8,
    difficulty: "Łatwy",
    icon: "🌿",
    forProfessions: ["fitoterapeuta", "farmaceuta"],
    description: "Leczenie roślinami"
  },
  {
    id: 40,
    name: "Fizyka medyczna",
    modules: 12,
    difficulty: "Trudny",
    icon: "⚛️",
    forProfessions: ["fizyk medyczny", "radiolog"],
    description: "Fizyka w diagnostyce i terapii"
  },
  {
    id: 41,
    name: "Fizjoterapia",
    modules: 16,
    difficulty: "Średni",
    icon: "🏃",
    forProfessions: ["fizjoterapeuta", "rehabilitant"],
    description: "Leczenie ruchem"
  },
  {
    id: 42,
    name: "Gastroenterologia",
    modules: 14,
    difficulty: "Trudny",
    icon: "🫃",
    forProfessions: ["gastroenterolog", "dietetyk"],
    description: "Układ pokarmowy"
  },
  {
    id: 43,
    name: "Geriatria",
    modules: 10,
    difficulty: "Średni",
    icon: "👴",
    forProfessions: ["geriatra", "pielęgniarka geriatryczna"],
    description: "Medycyna wieku podeszłego"
  },
  {
    id: 44,
    name: "Ginekologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "♀️",
    forProfessions: ["ginekolog", "położna"],
    description: "Zdrowie kobiety"
  },
  {
    id: 45,
    name: "Hematologia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🩸",
    forProfessions: ["hematolog", "laborant"],
    description: "Choroby krwi"
  },
  {
    id: 46,
    name: "Hepatologia",
    modules: 10,
    difficulty: "Trudny",
    icon: "🫘",
    forProfessions: ["hepatolog", "gastroenterolog"],
    description: "Choroby wątroby"
  },
  {
    id: 47,
    name: "Higiena",
    modules: 6,
    difficulty: "Łatwy",
    icon: "🧼",
    forProfessions: ["higienista", "epidemiolog"],
    description: "Zapobieganie chorobom"
  },
  {
    id: 48,
    name: "Immunologia kliniczna",
    modules: 12,
    difficulty: "Trudny",
    icon: "🛡️",
    forProfessions: ["immunolog", "alergolog"],
    description: "Choroby układu odpornościowego"
  },
  {
    id: 49,
    name: "Intensywna terapia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🚨",
    forProfessions: ["intensywista", "pielęgniarka OIOM"],
    description: "Opieka nad ciężko chorymi"
  },
  {
    id: 50,
    name: "Kardiologia",
    modules: 18,
    difficulty: "Trudny",
    icon: "❤️",
    forProfessions: ["kardiolog", "kardiochirurg"],
    description: "Choroby serca"
  },
  {
    id: 51,
    name: "Logopedia",
    modules: 10,
    difficulty: "Średni",
    icon: "🗣️",
    forProfessions: ["logopeda", "neurologopeda"],
    description: "Zaburzenia mowy"
  },
  {
    id: 52,
    name: "Medycyna katastrof",
    modules: 8,
    difficulty: "Średni",
    icon: "🚑",
    forProfessions: ["ratownik medyczny", "lekarz ratunkowy"],
    description: "Pomoc w sytuacjach masowych"
  },
  {
    id: 53,
    name: "Medycyna nuklearna",
    modules: 12,
    difficulty: "Trudny",
    icon: "☢️",
    forProfessions: ["specjalista medycyny nuklearnej", "fizyk medyczny"],
    description: "Izotopy w diagnostyce"
  },
  {
    id: 54,
    name: "Medycyna pracy",
    modules: 10,
    difficulty: "Średni",
    icon: "🏭",
    forProfessions: ["lekarz medycyny pracy", "higienista pracy"],
    description: "Zdrowie pracowników"
  },
  {
    id: 55,
    name: "Medycyna ratunkowa",
    modules: 14,
    difficulty: "Trudny",
    icon: "🚨",
    forProfessions: ["ratownik medyczny", "lekarz SOR"],
    description: "Pomoc w stanach nagłych"
  },
  {
    id: 56,
    name: "Medycyna rodzinna",
    modules: 16,
    difficulty: "Średni",
    icon: "👨‍👩‍👧‍👦",
    forProfessions: ["lekarz rodzinny", "pielęgniarka POZ"],
    description: "Podstawowa opieka zdrowotna"
  },
  {
    id: 57,
    name: "Medycyna sądowa",
    modules: 10,
    difficulty: "Średni",
    icon: "⚖️",
    forProfessions: ["lekarz sądowy", "kryminalistyk"],
    description: "Medycyna w prawie"
  },
  {
    id: 58,
    name: "Medycyna sportowa",
    modules: 12,
    difficulty: "Średni",
    icon: "🏃",
    forProfessions: ["lekarz sportowy", "fizjoterapeuta sportowy"],
    description: "Zdrowie sportowców"
  },
  {
    id: 59,
    name: "Medycyna tropikalna",
    modules: 10,
    difficulty: "Średni",
    icon: "🌴",
    forProfessions: ["lekarz chorób tropikalnych", "epidemiolog"],
    description: "Choroby stref tropikalnych"
  },
  {
    id: 60,
    name: "Nefrologia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🫘",
    forProfessions: ["nefrolog", "pielęgniarka dializacyjna"],
    description: "Choroby nerek"
  },
  {
    id: 61,
    name: "Neonatologia",
    modules: 14,
    difficulty: "Trudny",
    icon: "👶",
    forProfessions: ["neonatolog", "pielęgniarka neonatologiczna"],
    description: "Opieka nad noworodkami"
  },
  {
    id: 62,
    name: "Neurochirurgia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🧠",
    forProfessions: ["neurochirurg", "pielęgniarka neurochirurgiczna"],
    description: "Chirurgia układu nerwowego"
  },
  {
    id: 63,
    name: "Neurologia",
    modules: 18,
    difficulty: "Trudny",
    icon: "🧠",
    forProfessions: ["neurolog", "neurofizjoterapeuta"],
    description: "Choroby układu nerwowego"
  },
  {
    id: 64,
    name: "Okulistyka",
    modules: 12,
    difficulty: "Średni",
    icon: "👁️",
    forProfessions: ["okulista", "ortoptystka"],
    description: "Choroby oczu"
  },
  {
    id: 65,
    name: "Onkologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🎗️",
    forProfessions: ["onkolog", "pielęgniarka onkologiczna"],
    description: "Choroby nowotworowe"
  },
  {
    id: 66,
    name: "Ortodoncja",
    modules: 14,
    difficulty: "Trudny",
    icon: "🦷",
    forProfessions: ["ortodonta", "higienistka stomatologiczna"],
    description: "Wady zgryzu"
  },
  {
    id: 67,
    name: "Ortopedia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🦴",
    forProfessions: ["ortopeda", "fizjoterapeuta"],
    description: "Choroby układu ruchu"
  },
  {
    id: 68,
    name: "Otolaryngologia",
    modules: 14,
    difficulty: "Średni",
    icon: "👂",
    forProfessions: ["laryngolog", "audiolog"],
    description: "Choroby uszu, nosa i gardła"
  },
  {
    id: 69,
    name: "Pediatria",
    modules: 18,
    difficulty: "Trudny",
    icon: "👶",
    forProfessions: ["pediatra", "pielęgniarka pediatryczna"],
    description: "Choroby dzieci"
  },
  {
    id: 70,
    name: "Położnictwo",
    modules: 16,
    difficulty: "Trudny",
    icon: "🤰",
    forProfessions: ["położnik", "położna"],
    description: "Ciąża i poród"
  },
  {
    id: 71,
    name: "Psychiatria",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧠",
    forProfessions: ["psychiatra", "psychoterapeuta"],
    description: "Zaburzenia psychiczne"
  },
  {
    id: 72,
    name: "Pulmonologia",
    modules: 14,
    difficulty: "Trudny",
    icon: "🫁",
    forProfessions: ["pulmonolog", "fizjoterapeuta oddechowy"],
    description: "Choroby płuc"
  },
  {
    id: 73,
    name: "Radiologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🩻",
    forProfessions: ["radiolog", "technik radiologii"],
    description: "Diagnostyka obrazowa"
  },
  {
    id: 74,
    name: "Weterynaria podstawowa",
    modules: 12,
    difficulty: "Średni",
    icon: "🐕",
    forProfessions: ["weterynarz", "technik weterynarii"],
    description: "Medycyna zwierząt"
  },
  {
    id: 75,
    name: "Żywienie zwierząt", 
    modules: 8,
    difficulty: "Średni",
    icon: "🐄",
    forProfessions: ["weterynarz", "zootechnik"],
    description: "Podstawy żywienia zwierząt gospodarskich"
  }
];

// Wszystkie przedmioty
export const allSubjects = [
  ...doctorSubjects,
  ...nurseSubjects.filter(s => !doctorSubjects.find(d => d.name === s.name)),
  ...physiotherapistSubjects.filter(s => !doctorSubjects.find(d => d.name === s.name) && !nurseSubjects.find(n => n.name === s.name)),
  ...pharmacistSubjects.filter(s => !doctorSubjects.find(d => d.name === s.name) && !nurseSubjects.find(n => n.name === s.name) && !physiotherapistSubjects.find(p => p.name === s.name)),
  ...remainingSubjects
];

// Funkcja do pobrania przedmiotów dla zawodu
export const getSubjectsForProfession = (profession: string): Subject[] => {
  switch(profession.toLowerCase()) {
    case 'lekarz':
      return doctorSubjects;
    case 'pielęgniarka':
    case 'pielęgniarz':
      return nurseSubjects;
    case 'fizjoterapeuta':
      return physiotherapistSubjects;
    case 'farmaceuta':
      return pharmacistSubjects;
    default:
      return doctorSubjects;
  }
};