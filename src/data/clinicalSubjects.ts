import { Subject } from '../components/subjects/SubjectCard';

// TOP 15 dla lekarza
export const doctorClinicalSubjects: Subject[] = [
  {
    id: 1001,
    name: "Kardiologia",
    modules: 20,
    difficulty: "Trudny",
    icon: "🫀",
    priority: 3,
    description: "Choroby układu krążenia i serca"
  },
  {
    id: 1002,
    name: "Pulmonologia",
    modules: 18,
    difficulty: "Trudny",
    icon: "🫁",
    priority: 3,
    description: "Choroby układu oddechowego"
  },
  {
    id: 1003,
    name: "Gastroenterologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🫃",
    priority: 3,
    description: "Choroby układu pokarmowego"
  },
  {
    id: 1004,
    name: "Neurologia",
    modules: 22,
    difficulty: "Trudny",
    icon: "🧠",
    priority: 3,
    description: "Choroby układu nerwowego"
  },
  {
    id: 1005,
    name: "Endokrynologia i diabetologia",
    modules: 15,
    difficulty: "Trudny",
    icon: "🩺",
    priority: 3,
    description: "Choroby układu hormonalnego"
  },
  {
    id: 1006,
    name: "Chirurgia ogólna",
    modules: 25,
    difficulty: "Trudny",
    icon: "🔪",
    priority: 3,
    description: "Podstawowe procedury chirurgiczne"
  },
  {
    id: 1007,
    name: "Pediatria",
    modules: 18,
    difficulty: "Trudny",
    icon: "👶",
    priority: 3,
    description: "Medycyna dzieci i młodzieży"
  },
  {
    id: 1008,
    name: "Ginekologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "👩‍⚕️",
    priority: 3,
    description: "Zdrowie kobiety"
  },
  {
    id: 1009,
    name: "Psychiatria",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧑‍⚕️",
    priority: 3,
    description: "Zaburzenia psychiczne"
  },
  {
    id: 1010,
    name: "Medycyna ratunkowa",
    modules: 20,
    difficulty: "Trudny",
    icon: "🚑",
    priority: 3,
    description: "Pierwsza pomoc i stany nagłe"
  },
  {
    id: 1011,
    name: "Radiologia i diagnostyka obrazowa",
    modules: 12,
    difficulty: "Średni",
    icon: "🩻",
    priority: 2,
    description: "Obrazowanie medyczne"
  },
  {
    id: 1012,
    name: "Dermatologia",
    modules: 10,
    difficulty: "Średni",
    icon: "🤚",
    priority: 2,
    description: "Choroby skóry"
  },
  {
    id: 1013,
    name: "Urologia",
    modules: 12,
    difficulty: "Średni",
    icon: "🫘",
    priority: 2,
    description: "Choroby układu moczowo-płciowego"
  },
  {
    id: 1014,
    name: "Ortopedia i traumatologia",
    modules: 14,
    difficulty: "Średni",
    icon: "🦴",
    priority: 2,
    description: "Choroby układu ruchu"
  },
  {
    id: 1015,
    name: "Okulistyka",
    modules: 8,
    difficulty: "Średni",
    icon: "👁️",
    priority: 2,
    description: "Choroby oczu"
  }
];

// TOP 12 dla pielęgniarek
export const nurseClinicalSubjects: Subject[] = [
  {
    id: 2001,
    name: "Pielęgniarstwo chirurgiczne",
    modules: 16,
    difficulty: "Trudny",
    icon: "⚕️",
    priority: 3,
    description: "Opieka okołooperacyjna"
  },
  {
    id: 2002,
    name: "Pielęgniarstwo internistyczne",
    modules: 15,
    difficulty: "Trudny",
    icon: "🏥",
    priority: 3,
    description: "Opieka nad chorymi internistycznymi"
  },
  {
    id: 2003,
    name: "Pielęgniarstwo intensywnej opieki",
    modules: 18,
    difficulty: "Trudny",
    icon: "🚨",
    priority: 3,
    description: "Opieka nad ciężko chorymi"
  },
  {
    id: 2004,
    name: "Pielęgniarstwo pediatryczne",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧸",
    priority: 3,
    description: "Opieka nad dziećmi"
  },
  {
    id: 2005,
    name: "Pielęgniarstwo geriatryczne",
    modules: 12,
    difficulty: "Średni",
    icon: "👴",
    priority: 3,
    description: "Opieka nad osobami starszymi"
  },
  {
    id: 2006,
    name: "Pielęgniarstwo psychiatryczne",
    modules: 10,
    difficulty: "Średni",
    icon: "🧘‍♀️",
    priority: 2,
    description: "Opieka psychiatryczna"
  },
  {
    id: 2007,
    name: "Pielęgniarstwo onkologiczne",
    modules: 12,
    difficulty: "Trudny",
    icon: "🎗️",
    priority: 2,
    description: "Opieka onkologiczna"
  },
  {
    id: 2008,
    name: "Pielęgniarstwo kardiologiczne",
    modules: 10,
    difficulty: "Średni",
    icon: "💓",
    priority: 2,
    description: "Opieka kardiologiczna"
  },
  {
    id: 2009,
    name: "Opieka paliatywna",
    modules: 8,
    difficulty: "Średni",
    icon: "🕊️",
    priority: 2,
    description: "Opieka nad umierającymi"
  },
  {
    id: 2010,
    name: "Pielęgniarstwo operacyjne",
    modules: 14,
    difficulty: "Trudny",
    icon: "🔧",
    priority: 2,
    description: "Asystowanie przy zabiegach"
  },
  {
    id: 2011,
    name: "Pielęgniarstwo ratunkowe",
    modules: 16,
    difficulty: "Trudny",
    icon: "🚑",
    priority: 3,
    description: "Pierwsza pomoc medyczna"
  },
  {
    id: 2012,
    name: "Edukacja zdrowotna",
    modules: 6,
    difficulty: "Łatwy",
    icon: "📚",
    priority: 2,
    description: "Promocja zdrowia"
  }
];

// TOP 10 dla fizjoterapeutów
export const physiotherapistClinicalSubjects: Subject[] = [
  {
    id: 3001,
    name: "Fizjoterapia neurologiczna",
    modules: 22,
    difficulty: "Trudny",
    icon: "🧠",
    priority: 3,
    description: "Rehabilitacja neurologiczna"
  },
  {
    id: 3002,
    name: "Fizjoterapia ortopedyczna",
    modules: 20,
    difficulty: "Trudny",
    icon: "🦴",
    priority: 3,
    description: "Rehabilitacja ortopedyczna"
  },
  {
    id: 3003,
    name: "Fizjoterapia kardiologiczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "❤️",
    priority: 3,
    description: "Rehabilitacja kardiologiczna"
  },
  {
    id: 3004,
    name: "Fizjoterapia pulmonologiczna",
    modules: 14,
    difficulty: "Trudny",
    icon: "🫁",
    priority: 3,
    description: "Rehabilitacja oddechowa"
  },
  {
    id: 3005,
    name: "Terapia zajęciowa",
    modules: 18,
    difficulty: "Średni",
    icon: "🎨",
    priority: 3,
    description: "Rehabilitacja przez zajęcia"
  },
  {
    id: 3006,
    name: "Rehabilitacja",
    modules: 20,
    difficulty: "Średni",
    icon: "🏃‍♂️",
    priority: 3,
    description: "Kompleksowa rehabilitacja"
  },
  {
    id: 3007,
    name: "Fizjoterapia geriatryczna",
    modules: 12,
    difficulty: "Średni",
    icon: "👵",
    priority: 2,
    description: "Fizjoterapia osób starszych"
  },
  {
    id: 3008,
    name: "Fizjoterapia pediatryczna",
    modules: 14,
    difficulty: "Średni",
    icon: "👶",
    priority: 2,
    description: "Fizjoterapia dzieci"
  },
  {
    id: 3009,
    name: "Fizjoterapia sportowa",
    modules: 10,
    difficulty: "Średni",
    icon: "⚽",
    priority: 2,
    description: "Rehabilitacja sportowa"
  },
  {
    id: 3010,
    name: "Logopedia kliniczna",
    modules: 8,
    difficulty: "Średni",
    icon: "🗣️",
    priority: 2,
    description: "Terapia zaburzeń mowy"
  }
];

// TOP 8 dla farmaceutów
export const pharmacistClinicalSubjects: Subject[] = [
  {
    id: 4001,
    name: "Farmacja szpitalna",
    modules: 18,
    difficulty: "Trudny",
    icon: "🏥",
    priority: 3,
    description: "Farmacja w szpitalu"
  },
  {
    id: 4002,
    name: "Farmakoterapia",
    modules: 20,
    difficulty: "Trudny",
    icon: "💊",
    priority: 3,
    description: "Leczenie farmakologiczne"
  },
  {
    id: 4003,
    name: "Farmakokinetyka kliniczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "📈",
    priority: 3,
    description: "Los leku w organizmie"
  },
  {
    id: 4004,
    name: "Interakcje leków",
    modules: 14,
    difficulty: "Trudny",
    icon: "⚠️",
    priority: 3,
    description: "Wzajemne oddziaływania leków"
  },
  {
    id: 4005,
    name: "Farmakogenomika",
    modules: 12,
    difficulty: "Trudny",
    icon: "🧬",
    priority: 2,
    description: "Genetyka w farmakoterapii"
  },
  {
    id: 4006,
    name: "Onkologia farmaceutyczna",
    modules: 10,
    difficulty: "Trudny",
    icon: "🎗️",
    priority: 2,
    description: "Leki przeciwnowotworowe"
  },
  {
    id: 4007,
    name: "Farmacja geriatryczna",
    modules: 8,
    difficulty: "Średni",
    icon: "👴",
    priority: 2,
    description: "Farmakoterapia osób starszych"
  },
  {
    id: 4008,
    name: "Toksykologia kliniczna",
    modules: 10,
    difficulty: "Średni",
    icon: "☠️",
    priority: 2,
    description: "Zatrucia i przeciwdziałanie"
  }
];

// TOP 6 dla dietetyków
export const dietitianClinicalSubjects: Subject[] = [
  {
    id: 5001,
    name: "Dietetyka kliniczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "🥗",
    priority: 3,
    description: "Żywienie w chorobach"
  },
  {
    id: 5002,
    name: "Żywienie w chorobach metabolicznych",
    modules: 14,
    difficulty: "Trudny",
    icon: "⚖️",
    priority: 3,
    description: "Dieta w cukrzycy, otyłości"
  },
  {
    id: 5003,
    name: "Żywienie pozajelitowe",
    modules: 12,
    difficulty: "Trudny",
    icon: "💉",
    priority: 3,
    description: "Żywienie dożylne"
  },
  {
    id: 5004,
    name: "Żywienie geriatryczne",
    modules: 8,
    difficulty: "Średni",
    icon: "👵",
    priority: 2,
    description: "Dieta osób starszych"
  },
  {
    id: 5005,
    name: "Żywienie pediatryczne",
    modules: 10,
    difficulty: "Średni",
    icon: "🍼",
    priority: 2,
    description: "Żywienie dzieci"
  },
  {
    id: 5006,
    name: "Żywienie sportowe",
    modules: 6,
    difficulty: "Łatwy",
    icon: "🏃‍♀️",
    priority: 2,
    description: "Dieta sportowców"
  }
];

// TOP 8 dla psychologów
export const psychologistClinicalSubjects: Subject[] = [
  {
    id: 6001,
    name: "Psychologia kliniczna",
    modules: 18,
    difficulty: "Trudny",
    icon: "🧠",
    priority: 3,
    description: "Diagnoza i terapia psychologiczna"
  },
  {
    id: 6002,
    name: "Psychoterapia",
    modules: 20,
    difficulty: "Trudny",
    icon: "🛋️",
    priority: 3,
    description: "Metody terapii psychologicznej"
  },
  {
    id: 6003,
    name: "Neuropsychologia kliniczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "🧠",
    priority: 3,
    description: "Funkcje poznawcze mózgu"
  },
  {
    id: 6004,
    name: "Terapia rodzin",
    modules: 12,
    difficulty: "Średni",
    icon: "👨‍👩‍👧‍👦",
    priority: 2,
    description: "Terapia systemowa rodzin"
  },
  {
    id: 6005,
    name: "Seksuologia",
    modules: 8,
    difficulty: "Średni",
    icon: "💕",
    priority: 2,
    description: "Terapia zaburzeń seksualnych"
  },
  {
    id: 6006,
    name: "Psychologia zdrowia",
    modules: 10,
    difficulty: "Średni",
    icon: "🌱",
    priority: 2,
    description: "Psychologiczne aspekty zdrowia"
  },
  {
    id: 6007,
    name: "Psychogeriatria",
    modules: 8,
    difficulty: "Średni",
    icon: "👵",
    priority: 2,
    description: "Psychologia osób starszych"
  },
  {
    id: 6008,
    name: "Psychologia dziecięca",
    modules: 12,
    difficulty: "Średni",
    icon: "🧸",
    priority: 2,
    description: "Rozwój psychiczny dzieci"
  }
];

// TOP 10 dla ratowników
export const paramedicClinicalSubjects: Subject[] = [
  {
    id: 7001,
    name: "Medycyna ratunkowa",
    modules: 22,
    difficulty: "Trudny",
    icon: "🚑",
    priority: 3,
    description: "Pierwsza pomoc medyczna"
  },
  {
    id: 7002,
    name: "Medycyna katastrof",
    modules: 18,
    difficulty: "Trudny",
    icon: "🌪️",
    priority: 3,
    description: "Medycyna w sytuacjach masowych"
  },
  {
    id: 7003,
    name: "Anestezjologia podstawowa",
    modules: 16,
    difficulty: "Trudny",
    icon: "💉",
    priority: 3,
    description: "Podstawy znieczulenia"
  },
  {
    id: 7004,
    name: "Intensywna terapia",
    modules: 20,
    difficulty: "Trudny",
    icon: "🏥",
    priority: 3,
    description: "Opieka nad krytycznie chorymi"
  },
  {
    id: 7005,
    name: "Kardiologia ratunkowa",
    modules: 14,
    difficulty: "Trudny",
    icon: "❤️‍🩹",
    priority: 3,
    description: "Nagłe stany kardiologiczne"
  },
  {
    id: 7006,
    name: "Traumatologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🩹",
    priority: 3,
    description: "Urazы i ich leczenie"
  },
  {
    id: 7007,
    name: "Toksykologia ratunkowa",
    modules: 10,
    difficulty: "Średni",
    icon: "☠️",
    priority: 2,
    description: "Zatrucia nagłe"
  },
  {
    id: 7008,
    name: "Pediatria ratunkowa",
    modules: 12,
    difficulty: "Średni",
    icon: "👶",
    priority: 2,
    description: "Stany nagłe u dzieci"
  },
  {
    id: 7009,
    name: "Psychologia ratunkowa",
    modules: 8,
    difficulty: "Łatwy",
    icon: "🧘‍♂️",
    priority: 2,
    description: "Wsparcie psychologiczne"
  },
  {
    id: 7010,
    name: "Ratownictwo wodne",
    modules: 6,
    difficulty: "Średni",
    icon: "🏊‍♂️",
    priority: 2,
    description: "Ratownictwo na wodzie"
  }
];

// Pozostałe przedmioty kliniczne (około 100 łącznie)
export const remainingClinicalSubjects: Subject[] = [
  // Pozostałe specjalizacje medyczne
  {
    id: 8001,
    name: "Nefrologia",
    modules: 14,
    difficulty: "Trudny",
    icon: "🫘",
    forProfessions: ["nefrolog", "lekarz internista"],
    description: "Choroby nerek i układu moczowego"
  },
  {
    id: 8002,
    name: "Reumatologia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🦴",
    forProfessions: ["reumatolog", "lekarz internista"],
    description: "Choroby tkanki łącznej"
  },
  {
    id: 8003,
    name: "Hematologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "🩸",
    forProfessions: ["hematolog", "onkolog"],
    description: "Choroby krwi i układu krwiotwórczego"
  },
  {
    id: 8004,
    name: "Onkologia kliniczna",
    modules: 20,
    difficulty: "Trudny",
    icon: "🎗️",
    forProfessions: ["onkolog", "radiolog"],
    description: "Leczenie nowotworów"
  },
  {
    id: 8005,
    name: "Alergologia",
    modules: 10,
    difficulty: "Średni",
    icon: "🤧",
    forProfessions: ["alergolog", "immunolog"],
    description: "Choroby alergiczne"
  },
  {
    id: 8006,
    name: "Immunologia kliniczna",
    modules: 14,
    difficulty: "Trudny",
    icon: "🛡️",
    forProfessions: ["immunolog", "alergolog"],
    description: "Zaburzenia układu odpornościowego"
  },
  {
    id: 8007,
    name: "Geriatria",
    modules: 12,
    difficulty: "Średni",
    icon: "👴",
    forProfessions: ["geriatra", "lekarz rodzinny"],
    description: "Medycyna wieku podeszłego"
  },
  {
    id: 8008,
    name: "Medycyna paliatywna",
    modules: 10,
    difficulty: "Średni",
    icon: "🕊️",
    forProfessions: ["paliatysta", "onkolog"],
    description: "Opieka nad umierającymi"
  },
  {
    id: 8009,
    name: "Choroby zakaźne",
    modules: 16,
    difficulty: "Trudny",
    icon: "🦠",
    forProfessions: ["infektolog", "epidemiolog"],
    description: "Choroby infekcyjne"
  },
  
  // Chirurgia i specjalizacje zabiegowe
  {
    id: 8010,
    name: "Chirurgia naczyniowa",
    modules: 18,
    difficulty: "Trudny",
    icon: "🫀",
    forProfessions: ["chirurg naczyniowy", "angiolog"],
    description: "Chirurgia naczyń krwionośnych"
  },
  {
    id: 8011,
    name: "Chirurgia serca",
    modules: 22,
    difficulty: "Trudny",
    icon: "❤️",
    forProfessions: ["kardiochirurg", "chirurg"],
    description: "Operacje serca"
  },
  {
    id: 8012,
    name: "Neurochirurgia",
    modules: 24,
    difficulty: "Trudny",
    icon: "🧠",
    forProfessions: ["neurochirurg", "neurolog"],
    description: "Chirurgia układu nerwowego"
  },
  {
    id: 8013,
    name: "Chirurgia plastyczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "✨",
    forProfessions: ["chirurg plastyczny", "dermatolog"],
    description: "Chirurgia estetyczna i rekonstrukcyjna"
  },
  {
    id: 8014,
    name: "Chirurgia dziecięca",
    modules: 18,
    difficulty: "Trudny",
    icon: "👶",
    forProfessions: ["chirurg dziecięcy", "pediatra"],
    description: "Chirurgia pediatryczna"
  },
  {
    id: 8015,
    name: "Chirurgia szczękowa",
    modules: 14,
    difficulty: "Trudny",
    icon: "🦷",
    forProfessions: ["chirurg szczękowy", "stomatolog"],
    description: "Chirurgia jamy ustnej"
  },
  {
    id: 8016,
    name: "Transplantologia",
    modules: 20,
    difficulty: "Trudny",
    icon: "🫁",
    forProfessions: ["transplantolog", "chirurg"],
    description: "Przeszczepy narządów"
  },
  
  // Neonatologia i pediatria
  {
    id: 8017,
    name: "Neonatologia",
    modules: 16,
    difficulty: "Trudny",
    icon: "👶",
    forProfessions: ["neonatolog", "pediatra"],
    description: "Opieka nad noworodkami"
  },
  {
    id: 8018,
    name: "Neurologia dziecięca",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧠",
    forProfessions: ["neurolog dziecięcy", "pediatra"],
    description: "Choroby neurologiczne dzieci"
  },
  {
    id: 8019,
    name: "Kardiologia dziecięca",
    modules: 12,
    difficulty: "Trudny",
    icon: "💝",
    forProfessions: ["kardiolog dziecięcy", "pediatra"],
    description: "Wady serca u dzieci"
  },
  {
    id: 8020,
    name: "Onkologia dziecięca",
    modules: 16,
    difficulty: "Trudny",
    icon: "🎗️",
    forProfessions: ["onkolog dziecięcy", "pediatra"],
    description: "Nowotwory u dzieci"
  },
  
  // Ginekologia i położnictwo
  {
    id: 8021,
    name: "Położnictwo",
    modules: 18,
    difficulty: "Trudny",
    icon: "🤰",
    forProfessions: ["położnik", "ginekolog"],
    description: "Ciąża, poród i połóg"
  },
  {
    id: 8022,
    name: "Perinatologia",
    modules: 14,
    difficulty: "Trudny",
    icon: "👶",
    forProfessions: ["perinatolog", "neonatolog"],
    description: "Opieka okołoporodowa"
  },
  {
    id: 8023,
    name: "Ginekologia onkologiczna",
    modules: 16,
    difficulty: "Trudny",
    icon: "🎗️",
    forProfessions: ["ginekolog onkolog", "onkolog"],
    description: "Nowotwory ginekologiczne"
  },
  {
    id: 8024,
    name: "Endokrynologia ginekologiczna",
    modules: 12,
    difficulty: "Trudny",
    icon: "🔄",
    forProfessions: ["ginekolog", "endokrynolog"],
    description: "Zaburzenia hormonalne kobiet"
  },
  
  // Organy zmysłów
  {
    id: 8025,
    name: "Otolaryngologia",
    modules: 14,
    difficulty: "Średni",
    icon: "👂",
    forProfessions: ["otolaryngolog", "foniatrа"],
    description: "Choroby uszu, nosa i gardła"
  },
  {
    id: 8026,
    name: "Audiologia",
    modules: 10,
    difficulty: "Średni",
    icon: "👂",
    forProfessions: ["audiolog", "otolaryngolog"],
    description: "Diagnostyka słuchu"
  },
  {
    id: 8027,
    name: "Foniatria",
    modules: 8,
    difficulty: "Średni",
    icon: "🗣️",
    forProfessions: ["foniatra", "logopeda"],
    description: "Zaburzenia głosu i mowy"
  },
  
  // Stomatologia
  {
    id: 8028,
    name: "Stomatologia zachowawcza",
    modules: 12,
    difficulty: "Średni",
    icon: "🦷",
    forProfessions: ["stomatolog", "dentysta"],
    description: "Leczenie zębów"
  },
  {
    id: 8029,
    name: "Chirurgia stomatologiczna",
    modules: 14,
    difficulty: "Trudny",
    icon: "🦷",
    forProfessions: ["chirurg stomatolog", "stomatolog"],
    description: "Zabiegi chirurgiczne jamy ustnej"
  },
  {
    id: 8030,
    name: "Protetyka stomatologiczna",
    modules: 12,
    difficulty: "Średni",
    icon: "🦷",
    forProfessions: ["protetyk", "stomatolog"],
    description: "Protezy zębowe"
  },
  {
    id: 8031,
    name: "Ortodoncja",
    modules: 16,
    difficulty: "Trudny",
    icon: "🦷",
    forProfessions: ["ortodonta", "stomatolog"],
    description: "Wady zgryzu"
  },
  {
    id: 8032,
    name: "Periodontologia",
    modules: 10,
    difficulty: "Średni",
    icon: "🦷",
    forProfessions: ["periodontolog", "stomatolog"],
    description: "Choroby przyzębia"
  },
  {
    id: 8033,
    name: "Endodoncja",
    modules: 8,
    difficulty: "Średni",
    icon: "🦷",
    forProfessions: ["endodonta", "stomatolog"],
    description: "Leczenie kanałowe"
  },
  {
    id: 8034,
    name: "Stomatologia dziecięca",
    modules: 10,
    difficulty: "Średni",
    icon: "🦷",
    forProfessions: ["stomatolog dziecięcy", "pediatra"],
    description: "Stomatologia pediatryczna"
  },
  
  // Dermatologia
  {
    id: 8035,
    name: "Wenerologia",
    modules: 8,
    difficulty: "Średni",
    icon: "💕",
    forProfessions: ["wenerolog", "dermatolog"],
    description: "Choroby przenoszone drogą płciową"
  },
  {
    id: 8036,
    name: "Dermatologia dziecięca",
    modules: 10,
    difficulty: "Średni",
    icon: "👶",
    forProfessions: ["dermatolog dziecięcy", "pediatra"],
    description: "Choroby skóry u dzieci"
  },
  {
    id: 8037,
    name: "Dermatochirurgia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🔪",
    forProfessions: ["dermatochirurg", "chirurg plastyczny"],
    description: "Chirurgia dermatologiczna"
  },
  {
    id: 8038,
    name: "Kosmetologia lecznicza",
    modules: 8,
    difficulty: "Łatwy",
    icon: "✨",
    forProfessions: ["kosmetolog", "dermatolog"],
    description: "Kosmetologia medyczna"
  },
  
  // Anestezjologia i intensywna terapia
  {
    id: 8039,
    name: "Anestezjologia",
    modules: 18,
    difficulty: "Trudny",
    icon: "💉",
    forProfessions: ["anestezjolog", "intensywista"],
    description: "Znieczulenia i monitowanie"
  },
  {
    id: 8040,
    name: "Medycyna lotnicza",
    modules: 6,
    difficulty: "Średni",
    icon: "✈️",
    forProfessions: ["lekarz lotniczy", "ratownik"],
    description: "Medycyna w lotnictwie"
  },
  
  // Diagnostyka obrazowa
  {
    id: 8041,
    name: "Medycyna nuklearna",
    modules: 14,
    difficulty: "Trudny",
    icon: "☢️",
    forProfessions: ["medyk nuklearny", "radiolog"],
    description: "Diagnostyka izotopowa"
  },
  {
    id: 8042,
    name: "Ultrasonografia",
    modules: 10,
    difficulty: "Średni",
    icon: "📡",
    forProfessions: ["sonografista", "radiolog"],
    description: "Badania USG"
  },
  {
    id: 8043,
    name: "Diagnostyka laboratoryjna",
    modules: 12,
    difficulty: "Średni",
    icon: "🧪",
    forProfessions: ["laborant", "analityk"],
    description: "Badania laboratoryjne"
  },
  {
    id: 8044,
    name: "Cytologia",
    modules: 8,
    difficulty: "Średni",
    icon: "🔬",
    forProfessions: ["cytolog", "patomorfolog"],
    description: "Badania cytologiczne"
  },
  {
    id: 8045,
    name: "Histopatologia",
    modules: 12,
    difficulty: "Trudny",
    icon: "🔬",
    forProfessions: ["patomorfolog", "onkolog"],
    description: "Badania histopatologiczne"
  },
  {
    id: 8046,
    name: "Mikrobiologia kliniczna",
    modules: 10,
    difficulty: "Średni",
    icon: "🦠",
    forProfessions: ["mikrobiolog", "laborant"],
    description: "Diagnostyka mikrobiologiczna"
  },
  
  // Medycyna weterynaryjna
  {
    id: 8047,
    name: "Choroby wewnętrzne zwierząt",
    modules: 16,
    difficulty: "Trudny",
    icon: "🐕",
    forProfessions: ["weterynarz", "internista weterynaryjny"],
    description: "Choroby wewnętrzne zwierząt"
  },
  {
    id: 8048,
    name: "Chirurgia weterynaryjna",
    modules: 18,
    difficulty: "Trudny",
    icon: "🐱",
    forProfessions: ["chirurg weterynarz", "weterynarz"],
    description: "Zabiegi chirurgiczne zwierząt"
  },
  {
    id: 8049,
    name: "Położnictwo weterynaryjne",
    modules: 12,
    difficulty: "Średni",
    icon: "🐄",
    forProfessions: ["weterynarz", "ginekolog weterynaryjny"],
    description: "Rozród zwierząt"
  },
  {
    id: 8050,
    name: "Choroby zakaźne zwierząt",
    modules: 14,
    difficulty: "Trudny",
    icon: "🦠",
    forProfessions: ["weterynarz", "epidemiolog weterynaryjny"],
    description: "Infekcje zwierzęce"
  },
  {
    id: 8051,
    name: "Farmakologia weterynaryjna",
    modules: 10,
    difficulty: "Średni",
    icon: "💊",
    forProfessions: ["farmaceuta weterynaryjny", "weterynarz"],
    description: "Leki dla zwierząt"
  },
  {
    id: 8052,
    name: "Diagnostyka weterynaryjna",
    modules: 8,
    difficulty: "Średni",
    icon: "🔬",
    forProfessions: ["diagnostyk weterynaryjny", "weterynarz"],
    description: "Diagnostyka zwierząt"
  },
  
  // Organizacja i zarządzanie
  {
    id: 8053,
    name: "Organizacja ochrony zdrowia",
    modules: 10,
    difficulty: "Średni",
    icon: "🏥",
    forProfessions: ["menedżer zdrowia", "administrator"],
    description: "Zarządzanie służbą zdrowia"
  },
  {
    id: 8054,
    name: "Jakość w ochronie zdrowia",
    modules: 8,
    difficulty: "Średni",
    icon: "⭐",
    forProfessions: ["koordynator jakości", "administrator"],
    description: "Systemy jakości w zdrowiu"
  },
  {
    id: 8055,
    name: "Ekonomika zdrowia",
    modules: 6,
    difficulty: "Łatwy",
    icon: "💰",
    forProfessions: ["ekonomista zdrowia", "administrator"],
    description: "Ekonomia w ochronie zdrowia"
  },
  {
    id: 8056,
    name: "Epidemiologia kliniczna",
    modules: 12,
    difficulty: "Trudny",
    icon: "📊",
    forProfessions: ["epidemiolog", "badacz kliniczny"],
    description: "Badania epidemiologiczne"
  },
  
  // Medycyna laboratoryjnа
  {
    id: 8057,
    name: "Analityka medyczna",
    modules: 14,
    difficulty: "Trudny",
    icon: "🧪",
    forProfessions: ["analityk medyczny", "laborant"],
    description: "Analizy laboratoryjne"
  },
  {
    id: 8058,
    name: "Chemia kliniczna",
    modules: 10,
    difficulty: "Średni",
    icon: "⚗️",
    forProfessions: ["chemik kliniczny", "laborant"],
    description: "Badania biochemiczne"
  }
];

// Wszystkie przedmioty kliniczne
export const allClinicalSubjects = [
  ...doctorClinicalSubjects,
  ...nurseClinicalSubjects.filter(s => !doctorClinicalSubjects.find(d => d.name === s.name)),
  ...physiotherapistClinicalSubjects.filter(s => !doctorClinicalSubjects.find(d => d.name === s.name) && !nurseClinicalSubjects.find(n => n.name === s.name)),
  ...pharmacistClinicalSubjects.filter(s => !doctorClinicalSubjects.find(d => d.name === s.name) && !nurseClinicalSubjects.find(n => n.name === s.name) && !physiotherapistClinicalSubjects.find(p => p.name === s.name)),
  ...dietitianClinicalSubjects.filter(s => !doctorClinicalSubjects.find(d => d.name === s.name) && !nurseClinicalSubjects.find(n => n.name === s.name) && !physiotherapistClinicalSubjects.find(p => p.name === s.name) && !pharmacistClinicalSubjects.find(f => f.name === s.name)),
  ...psychologistClinicalSubjects.filter(s => !doctorClinicalSubjects.find(d => d.name === s.name) && !nurseClinicalSubjects.find(n => n.name === s.name) && !physiotherapistClinicalSubjects.find(p => p.name === s.name) && !pharmacistClinicalSubjects.find(f => f.name === s.name) && !dietitianClinicalSubjects.find(dt => dt.name === s.name)),
  ...paramedicClinicalSubjects.filter(s => !doctorClinicalSubjects.find(d => d.name === s.name) && !nurseClinicalSubjects.find(n => n.name === s.name) && !physiotherapistClinicalSubjects.find(p => p.name === s.name) && !pharmacistClinicalSubjects.find(f => f.name === s.name) && !dietitianClinicalSubjects.find(dt => dt.name === s.name) && !psychologistClinicalSubjects.find(ps => ps.name === s.name)),
  ...remainingClinicalSubjects
];

// Funkcja do pobrania przedmiotów dla zawodu
export const getClinicalSubjectsForProfession = (profession: string): Subject[] => {
  switch(profession.toLowerCase()) {
    case 'lekarz':
      return doctorClinicalSubjects;
    case 'pielęgniarka':
    case 'pielęgniarz':
      return nurseClinicalSubjects;
    case 'fizjoterapeuta':
      return physiotherapistClinicalSubjects;
    case 'farmaceuta':
      return pharmacistClinicalSubjects;
    case 'dietetyk':
      return dietitianClinicalSubjects;
    case 'psycholog':
      return psychologistClinicalSubjects;
    case 'ratownik':
    case 'ratownik medyczny':
      return paramedicClinicalSubjects;
    default:
      return doctorClinicalSubjects;
  }
};