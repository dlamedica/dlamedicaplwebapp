// Dane specjalizacji medycznych i placówek szkoleniowych dla mapy rezydentur

export interface TrainingFacility {
  id: number;
  name: string;
  type: 'clinical' | 'non-clinical' | 'military' | 'clinic';
  voivodeship: string;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  specializations: {
    name: string;
    department: string;
    currentPositions: number;
    totalPositions: number;
  }[];
}

export const medicalSpecializations = [
  'Wszystkie specjalizacje',
  'Alergologia',
  'Anestezjologia i intensywna terapia',
  'Audiologia i foniatria',
  'Chirurgia dziecięca',
  'Chirurgia klatki piersiowej',
  'Chirurgia naczyniowa',
  'Chirurgia ogólna',
  'Chirurgia onkologiczna',
  'Chirurgia plastyczna',
  'Dermatologia i wenerologia',
  'Diabetologia',
  'Endokrynologia',
  'Gastroenterologia',
  'Genetyka kliniczna',
  'Geriatria',
  'Ginekologia i położnictwo',
  'Hematologia',
  'Immunologia kliniczna',
  'Kardiologia',
  'Kardiochirurgia',
  'Medycyna nuklearna',
  'Medycyna pracy',
  'Medycyna rodzinna',
  'Medycyna sądowa',
  'Medycyna sportowa',
  'Nefrologia',
  'Neonatologia',
  'Neurochirurgia',
  'Neurologia',
  'Okulistyka',
  'Onkologia i hematologia dziecięca',
  'Ortopedia i traumatologia',
  'Otorynolaryngologia',
  'Patologia',
  'Pediatria',
  'Pneumonologia',
  'Psychiatria',
  'Psychiatria dzieci i młodzieży',
  'Radiologia i diagnostyka obrazowa',
  'Radioterapia onkologiczna',
  'Reumatologia',
  'Urologia'
];

export const voivodeships = [
  { value: 'dolnoslaskie', label: 'dolnośląskie' },
  { value: 'kujawsko-pomorskie', label: 'kujawsko-pomorskie' },
  { value: 'lubelskie', label: 'lubelskie' },
  { value: 'lubuskie', label: 'lubuskie' },
  { value: 'lodzkie', label: 'łódzkie' },
  { value: 'malopolskie', label: 'małopolskie' },
  { value: 'mazowieckie', label: 'mazowieckie' },
  { value: 'opolskie', label: 'opolskie' },
  { value: 'podkarpackie', label: 'podkarpackie' },
  { value: 'podlaskie', label: 'podlaskie' },
  { value: 'pomorskie', label: 'pomorskie' },
  { value: 'slaskie', label: 'śląskie' },
  { value: 'swietokrzyskie', label: 'świętokrzyskie' },
  { value: 'warminsko-mazurskie', label: 'warmińsko-mazurskie' },
  { value: 'wielkopolskie', label: 'wielkopolskie' },
  { value: 'zachodniopomorskie', label: 'zachodniopomorskie' }
];

export const trainingFacilities: TrainingFacility[] = [
  {
    id: 1,
    name: '"ALL-MED" Specjalistyczna Opieka Medyczna. Medyczny Instytut Badawczy Marek Jutel',
    type: 'clinic',
    voivodeship: 'dolnoslaskie',
    city: 'Wrocław',
    address: 'ul. Sportowa 2',
    coordinates: { lat: 51.1079, lng: 17.0385 },
    rating: 0,
    reviewsCount: 0,
    specializations: [
      {
        name: 'Alergologia',
        department: 'Ośrodek Stacjonarnej Diagnostyki i Leczenia Alergii',
        currentPositions: 0,
        totalPositions: 2
      }
    ]
  },
  {
    id: 2,
    name: '"Centrum Medyczne" Spółka z ograniczoną odpowiedzialnością',
    type: 'clinic',
    voivodeship: 'pomorskie',
    city: 'Pruszcz Gdański',
    address: 'ul. Wojska Polskiego 11',
    coordinates: { lat: 54.2547, lng: 18.6319 },
    rating: 0,
    reviewsCount: 0,
    specializations: [
      {
        name: 'Medycyna rodzinna',
        department: 'Poradnia lekarza POZ',
        currentPositions: 0,
        totalPositions: 3
      }
    ]
  },
  {
    id: 3,
    name: '"Darmed" Sp. z o.o.',
    type: 'clinic',
    voivodeship: 'lodzkie',
    city: 'Łódź',
    address: 'ul. Piotrkowska 120',
    coordinates: { lat: 51.7592, lng: 19.4560 },
    rating: 0,
    reviewsCount: 0,
    specializations: [
      {
        name: 'Medycyna rodzinna',
        department: 'Poradnia Lekarza POZ',
        currentPositions: 0,
        totalPositions: 1
      }
    ]
  },
  {
    id: 4,
    name: '"Marvit" Spółka cywilna Maryla Waszczuk, Andrzej Waszczuk',
    type: 'clinic',
    voivodeship: 'mazowieckie',
    city: 'Kobyłka',
    address: 'ul. Warszawska 45',
    coordinates: { lat: 52.3340, lng: 21.2050 },
    rating: 0,
    reviewsCount: 0,
    specializations: [
      {
        name: 'Medycyna rodzinna',
        department: 'Poradnia Medycyny Rodzinnej',
        currentPositions: 0,
        totalPositions: 2
      }
    ]
  },
  {
    id: 5,
    name: '10 Wojskowy Szpital Kliniczny z Polikliniką - Samodzielny Publiczny Zakład Opieki Zdrowotnej w Bydgoszczy',
    type: 'military',
    voivodeship: 'kujawsko-pomorskie',
    city: 'Bydgoszcz',
    address: 'ul. Powstańców Warszawy 5',
    coordinates: { lat: 53.1235, lng: 18.0084 },
    rating: 3.8,
    reviewsCount: 12,
    specializations: [
      {
        name: 'Kardiologia',
        department: 'Oddział Kardiologii',
        currentPositions: 2,
        totalPositions: 4
      },
      {
        name: 'Chirurgia ogólna',
        department: 'Oddział Chirurgii Ogólnej',
        currentPositions: 1,
        totalPositions: 3
      },
      {
        name: 'Anestezjologia i intensywna terapia',
        department: 'Oddział Anestezjologii',
        currentPositions: 0,
        totalPositions: 2
      }
    ]
  },
  {
    id: 6,
    name: 'Akademickie Centrum Kliniczne',
    type: 'clinical',
    voivodeship: 'pomorskie',
    city: 'Gdańsk',
    address: 'ul. Dębinki 7',
    coordinates: { lat: 54.3520, lng: 18.6466 },
    rating: 4.2,
    reviewsCount: 28,
    specializations: [
      {
        name: 'Kardiologia',
        department: 'Klinika Kardiologii i Elektroterapii Serca',
        currentPositions: 3,
        totalPositions: 6
      },
      {
        name: 'Chirurgia naczyniowa',
        department: 'Klinika Chirurgii Naczyniowej',
        currentPositions: 1,
        totalPositions: 4
      },
      {
        name: 'Neurologia',
        department: 'Klinika Neurologii',
        currentPositions: 2,
        totalPositions: 5
      }
    ]
  },
  {
    id: 7,
    name: 'Centrum Medyczne Żelazna',
    type: 'clinic',
    voivodeship: 'mazowieckie',
    city: 'Warszawa',
    address: 'ul. Żelazna 90',
    coordinates: { lat: 52.2297, lng: 20.9965 },
    rating: 3.9,
    reviewsCount: 15,
    specializations: [
      {
        name: 'Medycyna rodzinna',
        department: 'Poradnia Medycyny Rodzinnej',
        currentPositions: 1,
        totalPositions: 4
      },
      {
        name: 'Pediatria',
        department: 'Poradnia Pediatryczna',
        currentPositions: 0,
        totalPositions: 2
      }
    ]
  },
  {
    id: 8,
    name: 'Szpital Kliniczny Przemienienia Pańskiego',
    type: 'clinical',
    voivodeship: 'wielkopolskie',
    city: 'Poznań',
    address: 'ul. Długa 1/2',
    coordinates: { lat: 52.4064, lng: 16.9252 },
    rating: 4.1,
    reviewsCount: 22,
    specializations: [
      {
        name: 'Kardiologia',
        department: 'Oddział Kardiologii',
        currentPositions: 2,
        totalPositions: 5
      },
      {
        name: 'Gastroenterologia',
        department: 'Oddział Gastroenterologii',
        currentPositions: 1,
        totalPositions: 3
      },
      {
        name: 'Neurologia',
        department: 'Oddział Neurologii',
        currentPositions: 0,
        totalPositions: 4
      }
    ]
  },
  {
    id: 9,
    name: 'Centralny Szpital Kliniczny MSWiA w Warszawie',
    type: 'clinical',
    voivodeship: 'mazowieckie',
    city: 'Warszawa',
    address: 'ul. Wołoska 137',
    coordinates: { lat: 52.1802, lng: 20.9880 },
    rating: 3.7,
    reviewsCount: 19,
    specializations: [
      {
        name: 'Chirurgia ogólna',
        department: 'Klinika Chirurgii Ogólnej',
        currentPositions: 3,
        totalPositions: 6
      },
      {
        name: 'Urologia',
        department: 'Klinika Urologii',
        currentPositions: 1,
        totalPositions: 3
      },
      {
        name: 'Ortopedia i traumatologia',
        department: 'Klinika Ortopedii',
        currentPositions: 2,
        totalPositions: 4
      }
    ]
  },
  {
    id: 10,
    name: 'Wojewódzki Szpital Specjalistyczny we Wrocławiu',
    type: 'non-clinical',
    voivodeship: 'dolnoslaskie',
    city: 'Wrocław',
    address: 'ul. Kamieńskiego 73a',
    coordinates: { lat: 51.0945, lng: 17.0195 },
    rating: 3.5,
    reviewsCount: 8,
    specializations: [
      {
        name: 'Ginekologia i położnictwo',
        department: 'Oddział Ginekologiczno-Położniczy',
        currentPositions: 1,
        totalPositions: 5
      },
      {
        name: 'Pediatria',
        department: 'Oddział Pediatryczny',
        currentPositions: 2,
        totalPositions: 4
      }
    ]
  },
  {
    id: 11,
    name: 'Szpital Uniwersytecki w Krakowie',
    type: 'clinical',
    voivodeship: 'malopolskie',
    city: 'Kraków',
    address: 'ul. Jakubowskiego 2',
    coordinates: { lat: 50.0647, lng: 19.9450 },
    rating: 4.3,
    reviewsCount: 31,
    specializations: [
      {
        name: 'Neurochirurgia',
        department: 'Klinika Neurochirurgii',
        currentPositions: 1,
        totalPositions: 3
      },
      {
        name: 'Kardiochirurgia',
        department: 'Klinika Kardiochirurgii',
        currentPositions: 0,
        totalPositions: 2
      },
      {
        name: 'Onkologia i hematologia dziecięca',
        department: 'Klinika Onkologii Dziecięcej',
        currentPositions: 1,
        totalPositions: 4
      }
    ]
  },
  {
    id: 12,
    name: 'Szpital Kliniczny im. Heliodora Święcickiego',
    type: 'clinical',
    voivodeship: 'wielkopolskie',
    city: 'Poznań',
    address: 'ul. Przybyszewskiego 49',
    coordinates: { lat: 52.4190, lng: 16.9010 },
    rating: 4.0,
    reviewsCount: 25,
    specializations: [
      {
        name: 'Dermatologia i wenerologia',
        department: 'Klinika Dermatologii',
        currentPositions: 2,
        totalPositions: 4
      },
      {
        name: 'Endokrynologia',
        department: 'Klinika Endokrynologii',
        currentPositions: 1,
        totalPositions: 3
      }
    ]
  },
  {
    id: 13,
    name: 'Szpital Specjalistyczny w Białymstoku',
    type: 'non-clinical',
    voivodeship: 'podlaskie',
    city: 'Białystok',
    address: 'ul. Skłodowskiej-Curie 26',
    coordinates: { lat: 53.1325, lng: 23.1688 },
    rating: 3.6,
    reviewsCount: 11,
    specializations: [
      {
        name: 'Psychiatria',
        department: 'Oddział Psychiatryczny',
        currentPositions: 0,
        totalPositions: 3
      },
      {
        name: 'Neurologia',
        department: 'Oddział Neurologiczny',
        currentPositions: 1,
        totalPositions: 2
      }
    ]
  },
  {
    id: 14,
    name: 'Centrum Onkologii w Lublinie',
    type: 'non-clinical',
    voivodeship: 'lubelskie',
    city: 'Lublin',
    address: 'ul. Jaczewskiego 7',
    coordinates: { lat: 51.2465, lng: 22.5684 },
    rating: 4.5,
    reviewsCount: 18,
    specializations: [
      {
        name: 'Chirurgia onkologiczna',
        department: 'Oddział Chirurgii Onkologicznej',
        currentPositions: 1,
        totalPositions: 4
      },
      {
        name: 'Radioterapia onkologiczna',
        department: 'Zakład Radioterapii',
        currentPositions: 0,
        totalPositions: 2
      }
    ]
  },
  {
    id: 15,
    name: 'Śląskie Centrum Chorób Serca w Zabrzu',
    type: 'clinical',
    voivodeship: 'slaskie',
    city: 'Zabrze',
    address: 'ul. Marii Curie-Skłodowskiej 9',
    coordinates: { lat: 50.3249, lng: 18.7854 },
    rating: 4.7,
    reviewsCount: 42,
    specializations: [
      {
        name: 'Kardiochirurgia',
        department: 'Klinika Kardiochirurgii',
        currentPositions: 2,
        totalPositions: 5
      },
      {
        name: 'Kardiologia',
        department: 'Klinika Kardiologii',
        currentPositions: 3,
        totalPositions: 7
      }
    ]
  },
  {
    id: 16,
    name: 'Szpital Wojewódzki w Kielcach',
    type: 'non-clinical',
    voivodeship: 'swietokrzyskie',
    city: 'Kielce',
    address: 'ul. Grunwaldzka 45',
    coordinates: { lat: 50.8661, lng: 20.6286 },
    rating: 3.4,
    reviewsCount: 9,
    specializations: [
      {
        name: 'Diabetologia',
        department: 'Poradnia Diabetologiczna',
        currentPositions: 0,
        totalPositions: 2
      },
      {
        name: 'Nefrologia',
        department: 'Oddział Nefrologii',
        currentPositions: 1,
        totalPositions: 3
      }
    ]
  },
  {
    id: 17,
    name: 'Centrum Medyczne Kopernik w Łodzi',
    type: 'clinic',
    voivodeship: 'lodzkie',
    city: 'Łódź',
    address: 'ul. Pabianicka 62',
    coordinates: { lat: 51.7592, lng: 19.4560 },
    rating: 3.8,
    reviewsCount: 14,
    specializations: [
      {
        name: 'Okulistyka',
        department: 'Poradnia Okulistyczna',
        currentPositions: 1,
        totalPositions: 2
      },
      {
        name: 'Otorynolaryngologia',
        department: 'Poradnia Laryngologiczna',
        currentPositions: 0,
        totalPositions: 3
      }
    ]
  },
  {
    id: 18,
    name: 'Szpital Morski im. PCK w Gdyni',
    type: 'non-clinical',
    voivodeship: 'pomorskie',
    city: 'Gdynia',
    address: 'ul. Powstania Styczniowego 1',
    coordinates: { lat: 54.5189, lng: 18.5305 },
    rating: 3.9,
    reviewsCount: 16,
    specializations: [
      {
        name: 'Pneumonologia',
        department: 'Oddział Pneumonologii',
        currentPositions: 1,
        totalPositions: 3
      },
      {
        name: 'Medycyna pracy',
        department: 'Poradnia Medycyny Pracy',
        currentPositions: 0,
        totalPositions: 2
      }
    ]
  },
  {
    id: 19,
    name: 'Szpital Wojewódzki w Opolu',
    type: 'non-clinical',
    voivodeship: 'opolskie',
    city: 'Opole',
    address: 'al. Witosa 26',
    coordinates: { lat: 50.6751, lng: 17.9213 },
    rating: 3.2,
    reviewsCount: 7,
    specializations: [
      {
        name: 'Reumatologia',
        department: 'Poradnia Reumatologiczna',
        currentPositions: 0,
        totalPositions: 2
      },
      {
        name: 'Geriatria',
        department: 'Oddział Geriatryczny',
        currentPositions: 1,
        totalPositions: 3
      }
    ]
  },
  {
    id: 20,
    name: 'Uniwersytecki Szpital Kliniczny w Olsztynie',
    type: 'clinical',
    voivodeship: 'warminsko-mazurskie',
    city: 'Olsztyn',
    address: 'ul. Warszawska 30',
    coordinates: { lat: 53.7784, lng: 20.4801 },
    rating: 4.1,
    reviewsCount: 20,
    specializations: [
      {
        name: 'Chirurgia plastyczna',
        department: 'Klinika Chirurgii Plastycznej',
        currentPositions: 0,
        totalPositions: 2
      },
      {
        name: 'Audiologia i foniatria',
        department: 'Klinika Audiologii',
        currentPositions: 1,
        totalPositions: 2
      }
    ]
  }
];