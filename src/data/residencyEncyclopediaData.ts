// Dane encyklopedii rezydentur - wszystkie specjalizacje medyczne z miejscami, progami i pensjami

export interface SpecializationData {
  id: number;
  name: string;
  category: string; // 'A', 'B', 'C', etc. for alphabetical grouping
  places: number;
  minThreshold: number | null; // percentage
  duration: number; // years
  isDeficit: boolean;
  isSurgical: boolean;
  salary: number; // PLN
  voivodeship?: string; // for top specializations
}

export const voivodeships = [
  'Cała Polska',
  'dolnośląskie',
  'kujawsko-pomorskie', 
  'lubelskie',
  'lubuskie',
  'łódzkie',
  'małopolskie',
  'mazowieckie',
  'opolskie',
  'podkarpackie',
  'podlaskie',
  'pomorskie',
  'śląskie',
  'świętokrzyskie',
  'warmińsko-mazurskie',
  'wielkopolskie',
  'zachodniopomorskie'
];

export const sessions = [
  '2025 I',
  '2025 II', 
  '2024 II',
  '2024 I',
  '2023 II',
  '2023 I'
];

// Top specializations with most available places
export const topSpecializations = [
  {
    name: 'Medycyna rodzinna',
    places: 50,
    voivodeship: 'małopolskie',
    icon: '🏠'
  },
  {
    name: 'Medycyna rodzinna', 
    places: 50,
    voivodeship: 'mazowieckie',
    icon: '🏠'
  },
  {
    name: 'Medycyna rodzinna',
    places: 40, 
    voivodeship: 'podkarpackie',
    icon: '🏠'
  },
  {
    name: 'Medycyna rodzinna',
    places: 36,
    voivodeship: 'dolnośląskie', 
    icon: '🏠'
  },
  {
    name: 'Medycyna rodzinna',
    places: 36,
    voivodeship: 'śląskie',
    icon: '🏠'
  },
  {
    name: 'Choroby wewnętrzne',
    places: 35,
    voivodeship: 'dolnośląskie',
    icon: '👤'
  },
  {
    name: 'Choroby wewnętrzne', 
    places: 35,
    voivodeship: 'małopolskie',
    icon: '👤'
  }
];

export const specializationsData: SpecializationData[] = [
  // A
  {
    id: 1,
    name: 'Alergologia',
    category: 'A',
    places: 19,
    minThreshold: 70.05,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9737
  },
  {
    id: 2,
    name: 'Anestezjologia i intensywna terapia',
    category: 'A',
    places: 164,
    minThreshold: 58.82,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 10711
  },
  {
    id: 3,
    name: 'Angiologia',
    category: 'A',
    places: 2,
    minThreshold: 77.14,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9737
  },
  {
    id: 4,
    name: 'Audiologia i foniatria',
    category: 'A',
    places: 11,
    minThreshold: 76.19,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9737
  },

  // B
  {
    id: 5,
    name: 'Balneologia i medycyna fizykalna',
    category: 'B',
    places: 2,
    minThreshold: null,
    duration: 4,
    isDeficit: false,
    isSurgical: false,
    salary: 9737
  },

  // C
  {
    id: 6,
    name: 'Chirurgia dziecięca',
    category: 'C',
    places: 31,
    minThreshold: 67.62,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 10711
  },
  {
    id: 7,
    name: 'Chirurgia klatki piersiowej',
    category: 'C',
    places: 21,
    minThreshold: 56.19,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 9737
  },
  {
    id: 8,
    name: 'Chirurgia naczyniowa',
    category: 'C',
    places: 14,
    minThreshold: 77.7,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 9737
  },
  {
    id: 9,
    name: 'Chirurgia ogólna',
    category: 'C',
    places: 196,
    minThreshold: 60.87,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 10711
  },
  {
    id: 10,
    name: 'Chirurgia onkologiczna',
    category: 'C',
    places: 24,
    minThreshold: 72.45,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 11200
  },
  {
    id: 11,
    name: 'Chirurgia plastyczna',
    category: 'C',
    places: 8,
    minThreshold: 83.21,
    duration: 6,
    isDeficit: false,
    isSurgical: true,
    salary: 12500
  },
  {
    id: 12,
    name: 'Choroby wewnętrzne',
    category: 'C',
    places: 287,
    minThreshold: 52.34,
    duration: 6,
    isDeficit: true,
    isSurgical: false,
    salary: 9800
  },

  // D
  {
    id: 13,
    name: 'Dermatologia i wenerologia',
    category: 'D',
    places: 45,
    minThreshold: 79.12,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 10200
  },
  {
    id: 14,
    name: 'Diabetologia',
    category: 'D',
    places: 18,
    minThreshold: 68.45,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9600
  },

  // E
  {
    id: 15,
    name: 'Endokrynologia',
    category: 'E',
    places: 32,
    minThreshold: 71.23,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9850
  },

  // G
  {
    id: 16,
    name: 'Gastroenterologia',
    category: 'G',
    places: 67,
    minThreshold: 64.78,
    duration: 6,
    isDeficit: false,
    isSurgical: false,
    salary: 10100
  },
  {
    id: 17,
    name: 'Genetyka kliniczna',
    category: 'G',
    places: 4,
    minThreshold: 75.89,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9400
  },
  {
    id: 18,
    name: 'Geriatria',
    category: 'G',
    places: 28,
    minThreshold: 59.12,
    duration: 5,
    isDeficit: true,
    isSurgical: false,
    salary: 9300
  },
  {
    id: 19,
    name: 'Ginekologia i położnictwo',
    category: 'G',
    places: 156,
    minThreshold: 62.45,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 10400
  },

  // H
  {
    id: 20,
    name: 'Hematologia',
    category: 'H',
    places: 35,
    minThreshold: 73.56,
    duration: 6,
    isDeficit: false,
    isSurgical: false,
    salary: 10800
  },

  // I
  {
    id: 21,
    name: 'Immunologia kliniczna',
    category: 'I',
    places: 6,
    minThreshold: 78.34,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9900
  },
  {
    id: 22,
    name: 'Intensywna terapia',
    category: 'I',
    places: 89,
    minThreshold: 55.67,
    duration: 5,
    isDeficit: true,
    isSurgical: false,
    salary: 11500
  },

  // K
  {
    id: 23,
    name: 'Kardiologia',
    category: 'K',
    places: 142,
    minThreshold: 69.23,
    duration: 6,
    isDeficit: false,
    isSurgical: false,
    salary: 11200
  },
  {
    id: 24,
    name: 'Kardiochirurgia',
    category: 'K',
    places: 12,
    minThreshold: 81.45,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 13500
  },

  // M
  {
    id: 25,
    name: 'Medycyna nuklearna',
    category: 'M',
    places: 15,
    minThreshold: 74.12,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 10600
  },
  {
    id: 26,
    name: 'Medycyna pracy',
    category: 'M',
    places: 42,
    minThreshold: 57.89,
    duration: 4,
    isDeficit: true,
    isSurgical: false,
    salary: 8900
  },
  {
    id: 27,
    name: 'Medycyna rodzinna',
    category: 'M',
    places: 485,
    minThreshold: 45.23,
    duration: 4,
    isDeficit: true,
    isSurgical: false,
    salary: 8500
  },
  {
    id: 28,
    name: 'Medycyna sądowa',
    category: 'M',
    places: 8,
    minThreshold: 69.78,
    duration: 4,
    isDeficit: false,
    isSurgical: false,
    salary: 9200
  },
  {
    id: 29,
    name: 'Medycyna sportowa',
    category: 'M',
    places: 12,
    minThreshold: 71.56,
    duration: 4,
    isDeficit: false,
    isSurgical: false,
    salary: 9500
  },

  // N
  {
    id: 30,
    name: 'Nefrologia',
    category: 'N',
    places: 54,
    minThreshold: 66.89,
    duration: 6,
    isDeficit: false,
    isSurgical: false,
    salary: 10300
  },
  {
    id: 31,
    name: 'Neonatologia',
    category: 'N',
    places: 47,
    minThreshold: 70.45,
    duration: 6,
    isDeficit: true,
    isSurgical: false,
    salary: 10200
  },
  {
    id: 32,
    name: 'Neurochirurgia',
    category: 'N',
    places: 23,
    minThreshold: 80.67,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 13200
  },
  {
    id: 33,
    name: 'Neurologia',
    category: 'N',
    places: 98,
    minThreshold: 68.34,
    duration: 6,
    isDeficit: false,
    isSurgical: false,
    salary: 10500
  },

  // O
  {
    id: 34,
    name: 'Okulistyka',
    category: 'O',
    places: 76,
    minThreshold: 75.23,
    duration: 5,
    isDeficit: false,
    isSurgical: true,
    salary: 11800
  },
  {
    id: 35,
    name: 'Onkologia i hematologia dziecięca',
    category: 'O',
    places: 18,
    minThreshold: 76.89,
    duration: 6,
    isDeficit: true,
    isSurgical: false,
    salary: 11000
  },
  {
    id: 36,
    name: 'Ortopedia i traumatologia',
    category: 'O',
    places: 134,
    minThreshold: 72.56,
    duration: 6,
    isDeficit: true,
    isSurgical: true,
    salary: 11500
  },
  {
    id: 37,
    name: 'Otorynolaryngologia',
    category: 'O',
    places: 89,
    minThreshold: 73.45,
    duration: 5,
    isDeficit: false,
    isSurgical: true,
    salary: 10900
  },

  // P
  {
    id: 38,
    name: 'Patologia',
    category: 'P',
    places: 26,
    minThreshold: 61.23,
    duration: 5,
    isDeficit: true,
    isSurgical: false,
    salary: 9400
  },
  {
    id: 39,
    name: 'Pediatria',
    category: 'P',
    places: 198,
    minThreshold: 64.78,
    duration: 6,
    isDeficit: true,
    isSurgical: false,
    salary: 9800
  },
  {
    id: 40,
    name: 'Pneumonologia',
    category: 'P',
    places: 62,
    minThreshold: 63.45,
    duration: 6,
    isDeficit: false,
    isSurgical: false,
    salary: 9900
  },
  {
    id: 41,
    name: 'Psychiatria',
    category: 'P',
    places: 145,
    minThreshold: 56.78,
    duration: 6,
    isDeficit: true,
    isSurgical: false,
    salary: 9600
  },
  {
    id: 42,
    name: 'Psychiatria dzieci i młodzieży',
    category: 'P',
    places: 34,
    minThreshold: 65.89,
    duration: 6,
    isDeficit: true,
    isSurgical: false,
    salary: 9700
  },

  // R
  {
    id: 43,
    name: 'Radiologia i diagnostyka obrazowa',
    category: 'R',
    places: 87,
    minThreshold: 74.56,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 12200
  },
  {
    id: 44,
    name: 'Radioterapia onkologiczna',
    category: 'R',
    places: 16,
    minThreshold: 77.34,
    duration: 5,
    isDeficit: true,
    isSurgical: false,
    salary: 11800
  },
  {
    id: 45,
    name: 'Rehabilitacja medyczna',
    category: 'R',
    places: 58,
    minThreshold: 60.12,
    duration: 5,
    isDeficit: true,
    isSurgical: false,
    salary: 9300
  },
  {
    id: 46,
    name: 'Reumatologia',
    category: 'R',
    places: 29,
    minThreshold: 69.45,
    duration: 5,
    isDeficit: false,
    isSurgical: false,
    salary: 9800
  },

  // U
  {
    id: 47,
    name: 'Urologia',
    category: 'U',
    places: 72,
    minThreshold: 71.89,
    duration: 6,
    isDeficit: false,
    isSurgical: true,
    salary: 11300
  },

  // Z
  {
    id: 48,
    name: 'Zdrowie publiczne',
    category: 'Z',
    places: 22,
    minThreshold: 58.45,
    duration: 4,
    isDeficit: false,
    isSurgical: false,
    salary: 8800
  }
];

// Group specializations by first letter
export const getSpecializationsByCategory = () => {
  const grouped: Record<string, SpecializationData[]> = {};
  
  specializationsData.forEach(spec => {
    if (!grouped[spec.category]) {
      grouped[spec.category] = [];
    }
    grouped[spec.category].push(spec);
  });
  
  // Sort within each category
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return grouped;
};

// Get color for places count (for buttons)
export const getPlacesColor = (places: number): string => {
  if (places >= 200) return 'bg-purple-600 text-white';
  if (places >= 100) return 'bg-purple-500 text-white';
  if (places >= 50) return 'bg-purple-400 text-white';
  if (places >= 20) return 'bg-pink-400 text-white';
  return 'bg-pink-200 text-gray-800';
};

// Get color for threshold (for background)
export const getThresholdColor = (threshold: number | null): string => {
  if (threshold === null) return 'bg-gray-100';
  if (threshold >= 80) return 'bg-red-400 text-white';
  if (threshold >= 70) return 'bg-red-300 text-white';
  if (threshold >= 60) return 'bg-orange-200 text-gray-800';
  if (threshold >= 50) return 'bg-yellow-100 text-gray-800';
  return 'bg-green-100 text-gray-800';
};