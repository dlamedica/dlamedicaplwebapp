// Example data service for demo purposes
// In a real application, this data would come from the database

export interface JobOffer {
  id: string;
  position: string;
  company: string;
  location: string;
  salary_range: string;
  employment_type: string;
  experience_level: string;
  description: string;
  requirements: string[] | string;
  benefits: string[] | string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'archived';
  created_at: Date;
  expires_at: Date;
  can_extend: boolean;
  rejection_reason?: string;
  admin_comment?: string;
  extension_count?: number;
  archived_at?: Date;
}

export interface Event {
  id: string;
  title: string;
  type: 'webinar' | 'conference';
  organizer: string;
  date: Date;
  location?: string;
  online_url?: string;
  description: string;
  max_participants: number;
  current_participants: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'archived';
  created_at: Date;
  can_extend: boolean;
  rejection_reason?: string;
  admin_comment?: string;
  program?: string;
  speakers?: string;
  archived_at?: Date;
}

export interface Application {
  id: string;
  job_offer_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  cv_url?: string;
  cover_letter?: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  rating?: number;
  notes?: string;
  applied_at: Date;
  updated_at: Date;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'job' | 'event';
  added_at: Date;
}

export interface UserApplication {
  id: string;
  user_id: string;
  job_offer_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  cv_url?: string;
  cover_letter?: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  applied_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'individual' | 'company';
  company_name?: string;
  registration_date: Date;
  status: 'active' | 'suspended' | 'banned';
  last_login?: Date;
  verified: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'job_added' | 'event_added' | 'user_registered' | 'application_submitted' | 'job_approved' | 'event_approved';
  description: string;
  timestamp: Date;
  user?: string;
  item_id?: string;
}

class ExampleDataService {
  private users: User[] = [
    { id: 'user1', email: 'jan.kowalski@gmail.com', name: 'Jan Kowalski', type: 'individual', registration_date: new Date('2024-01-10'), status: 'active', last_login: new Date('2024-01-26'), verified: true },
    { id: 'user2', email: 'anna.nowak@gmail.com', name: 'Anna Nowak', type: 'individual', registration_date: new Date('2024-01-12'), status: 'active', last_login: new Date('2024-01-25'), verified: true },
    { id: 'user3', email: 'piotr.wisniewski@gmail.com', name: 'Piotr Wiśniewski', type: 'individual', registration_date: new Date('2024-01-15'), status: 'suspended', verified: false },
    { id: 'company1', email: 'kontakt@medicover.pl', name: 'Medicover', type: 'company', company_name: 'Medicover Sp. z o.o.', registration_date: new Date('2023-12-01'), status: 'active', last_login: new Date('2024-01-26'), verified: true },
    { id: 'company2', email: 'hr@luxmed.pl', name: 'LuxMed', type: 'company', company_name: 'LuxMed Sp. z o.o.', registration_date: new Date('2023-12-15'), status: 'active', last_login: new Date('2024-01-24'), verified: true },
    { id: 'company3', email: 'rekrutacja@szpital-uck.pl', name: 'UCK Kraków', type: 'company', company_name: 'Uniwersyteckie Centrum Kliniczne', registration_date: new Date('2024-01-02'), status: 'active', last_login: new Date('2024-01-26'), verified: true },
    { id: 'user4', email: 'maria.dabrowska@gmail.com', name: 'Maria Dąbrowska', type: 'individual', registration_date: new Date('2024-01-20'), status: 'active', last_login: new Date('2024-01-26'), verified: true },
    { id: 'user5', email: 'tomasz.lewandowski@gmail.com', name: 'Tomasz Lewandowski', type: 'individual', registration_date: new Date('2024-01-26'), status: 'active', verified: false },
    { id: 'user6', email: 'karolina.wojcik@gmail.com', name: 'Karolina Wójcik', type: 'individual', registration_date: new Date('2024-01-26'), status: 'active', verified: false }
  ];

  private recentActivities: RecentActivity[] = [
    { id: '1', type: 'job_added', description: 'Nowa oferta pracy: Lekarz internista od Medicover', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), user: 'Medicover', item_id: '4' },
    { id: '2', type: 'event_added', description: 'Nowe wydarzenie: Konferencja Neurochirurgiczna 2025 od UCK Kraków', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), user: 'UCK Kraków', item_id: '4' },
    { id: '3', type: 'user_registered', description: 'Nowa rejestracja: karolina.wojcik@gmail.com', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), user: 'Karolina Wójcik' },
    { id: '4', type: 'user_registered', description: 'Nowa rejestracja: tomasz.lewandowski@gmail.com', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), user: 'Tomasz Lewandowski' },
    { id: '5', type: 'application_submitted', description: 'Nowa aplikacja na stanowisko: Pediatra', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), item_id: '2' },
    { id: '6', type: 'job_approved', description: 'Zaakceptowano ofertę: Kardiolog', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), user: 'Admin', item_id: '5' },
    { id: '7', type: 'event_approved', description: 'Zaakceptowano wydarzenie: Webinar AI w Diagnostyce', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), user: 'Admin', item_id: '2' }
  ];

  private jobOffers: JobOffer[] = [
    {
      id: '1',
      position: 'Lekarz rodzinny',
      company: 'Centrum Medyczne Warszawa',
      location: 'Warszawa',
      salary_range: '8000 - 12000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Średni',
      description: 'Poszukujemy doświadczonego lekarza rodzinnego do pracy w nowoczesnym centrum medycznym.',
      requirements: 'Ukończone studia medyczne, Specjalizacja z medycyny rodzinnej, Min. 3 lata doświadczenia, Prawo wykonywania zawodu',
      benefits: 'Konkurencyjne wynagrodzenie, Prywatna opieka medyczna, Szkolenia i rozwój zawodowy, Elastyczne godziny pracy',
      status: 'approved',
      created_at: new Date('2024-01-15'),
      expires_at: new Date('2024-04-25'), // 100 days from created_at
      can_extend: true,
      extension_count: 0
    },
    {
      id: '2',
      position: 'Pediatra',
      company: 'Szpital Dziecięcy',
      location: 'Kraków',
      salary_range: '9000 - 14000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Starszy',
      description: 'Szukamy pediatry do oddziału pediatrii w szpitalu dziecięcym.',
      requirements: 'Specjalizacja z pediatrii, Min. 5 lat doświadczenia, Umiejętność pracy w zespole, Komunikatywność',
      benefits: 'Wysokie wynagrodzenie, Stabilne zatrudnienie, Możliwość rozwoju, Pakiet socjalny',
      status: 'pending',
      created_at: new Date('2024-01-18'),
      expires_at: new Date('2024-04-28'), // 100 days from created_at
      can_extend: true,
      extension_count: 0
    },
    {
      id: '3',
      position: 'Radiolog',
      company: 'Prywatna Klinika Diagnostyczna',
      location: 'Gdańsk',
      salary_range: '12000 - 18000 PLN',
      employment_type: 'Kontrakt B2B',
      experience_level: 'Starszy',
      description: 'Poszukujemy radiologa do interpretacji badań obrazowych.',
      requirements: 'Specjalizacja z radiologii, Doświadczenie w CT/MRI, Znajomość nowoczesnych technologii, Prawo wykonywania zawodu',
      benefits: 'Wysokie wynagrodzenie, Nowoczesny sprzęt, Elastyczne godziny, Możliwość pracy zdalnej',
      status: 'rejected',
      created_at: new Date('2024-01-10'),
      expires_at: new Date('2024-04-20'), // 100 days from created_at
      can_extend: true,
      extension_count: 0,
      rejection_reason: 'Niepełna dokumentacja'
    },
    {
      id: '4',
      position: 'Lekarz internista',
      company: 'Medicover',
      location: 'Warszawa',
      salary_range: '10000 - 15000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Średni',
      description: 'Poszukujemy internisty do naszej kliniki w Warszawie.',
      requirements: 'Specjalizacja z interny, Min. 2 lata doświadczenia, Komunikatywność',
      benefits: 'Prywatna opieka medyczna, Karta multisport, Szkolenia',
      status: 'pending',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-01'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '5',
      position: 'Pielęgniarka oddziałowa',
      company: 'Szpital Bródnowski',
      location: 'Kraków',
      salary_range: '6000 - 8000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Starszy',
      description: 'Szukamy doświadczonej pielęgniarki oddziałowej.',
      requirements: 'Licencjat pielęgniarstwa, Min. 5 lat doświadczenia, Umiejętności organizacyjne',
      benefits: 'Stabilne zatrudnienie, Dodatki funkcyjne, Szkolenia',
      status: 'pending',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-02'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '6',
      position: 'Fizjoterapeuta',
      company: 'Rehasport',
      location: 'Gdańsk',
      salary_range: '5000 - 7000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Junior',
      description: 'Poszukujemy fizjoterapeuty do naszego centrum rehabilitacji.',
      requirements: 'Wykształcenie kierunkowe, Prawo wykonywania zawodu, Chęć rozwoju',
      benefits: 'Przyjazna atmosfera, Możliwość rozwoju, Nowoczesny sprzęt',
      status: 'approved',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      expires_at: new Date('2024-04-30'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '7',
      position: 'Dentysta',
      company: 'Klinika Uśmiechu',
      location: 'Wrocław',
      salary_range: '12000 - 20000 PLN',
      employment_type: 'Kontrakt B2B',
      experience_level: 'Średni',
      description: 'Szukamy dentysty do prywatnej kliniki stomatologicznej.',
      requirements: 'Specjalizacja stomatologiczna, Min. 3 lata doświadczenia, Obsługa pacjenta',
      benefits: 'Wysokie wynagrodzenie, Elastyczne godziny, Nowoczesny gabinet',
      status: 'pending',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-05'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '8',
      position: 'Anestezjolog',
      company: 'Szpital Wojewódzki',
      location: 'Poznań',
      salary_range: '15000 - 22000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Starszy',
      description: 'Poszukujemy anestezjologa do pracy na bloku operacyjnym.',
      requirements: 'Specjalizacja z anestezjologii, Min. 5 lat doświadczenia, Dyspozycyjność',
      benefits: 'Wysokie wynagrodzenie, Dodatki dyżurowe, Rozwój zawodowy',
      status: 'pending',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-06'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '9',
      position: 'Psycholog kliniczny',
      company: 'Centrum Zdrowia Psychicznego',
      location: 'Łódź',
      salary_range: '6000 - 9000 PLN',
      employment_type: 'Umowa zlecenie',
      experience_level: 'Średni',
      description: 'Szukamy psychologa klinicznego do pracy z pacjentami.',
      requirements: 'Wykształcenie psychologiczne, Certyfikat psychologa klinicznego, Empatia',
      benefits: 'Elastyczne godziny, Superwizje, Szkolenia',
      status: 'pending',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-07'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '10',
      position: 'Neurolog',
      company: 'Prywatna Praktyka Neurologiczna',
      location: 'Lublin',
      salary_range: '13000 - 18000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Starszy',
      description: 'Poszukujemy neurologa do współpracy.',
      requirements: 'Specjalizacja z neurologii, Doświadczenie w diagnostyce, Znajomość EEG',
      benefits: 'Wysokie wynagrodzenie, Prywatny gabinet, Elastyczny grafik',
      status: 'pending',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-08'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '11',
      position: 'Ortopeda',
      company: 'Klinika Ortopedyczna Sport-Med',
      location: 'Katowice',
      salary_range: '14000 - 20000 PLN',
      employment_type: 'Kontrakt B2B',
      experience_level: 'Starszy',
      description: 'Szukamy ortopedy specjalizującego się w urazach sportowych.',
      requirements: 'Specjalizacja z ortopedii, Doświadczenie w medycynie sportowej, Operacje artroskopowe',
      benefits: 'Praca z profesjonalnymi sportowcami, Nowoczesny sprzęt, Wysokie wynagrodzenie',
      status: 'pending',
      created_at: new Date(Date.now() - 7 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-09'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '12',
      position: 'Ginekolog',
      company: 'Centrum Medyczne Femina',
      location: 'Białystok',
      salary_range: '11000 - 16000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Średni',
      description: 'Poszukujemy ginekologa do naszej kliniki.',
      requirements: 'Specjalizacja z ginekologii, USG ginekologiczne, Min. 3 lata doświadczenia',
      benefits: 'Nowoczesna klinika, Przyjazny zespół, Szkolenia',
      status: 'pending',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-10'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '13',
      position: 'Kardiolog',
      company: 'Szpital Kardiologiczny',
      location: 'Zabrze',
      salary_range: '13000 - 19000 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Starszy',
      description: 'Szukamy kardiologa do oddziału kardiologii inwazyjnej.',
      requirements: 'Specjalizacja z kardiologii, Doświadczenie w kardiologii inwazyjnej, Echokardiografia',
      benefits: 'Prestiżowe miejsce pracy, Rozwój naukowy, Wysokie wynagrodzenie',
      status: 'pending',
      created_at: new Date(Date.now() - 9 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-11'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '14',
      position: 'Farmaceuta',
      company: 'Apteka Zdrowit',
      location: 'Rzeszów',
      salary_range: '5500 - 7500 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Junior',
      description: 'Poszukujemy farmaceuty do apteki sieciowej.',
      requirements: 'Wykształcenie farmaceutyczne, Prawo wykonywania zawodu, Obsługa klienta',
      benefits: 'Stabilne zatrudnienie, System premiowy, Szkolenia produktowe',
      status: 'pending',
      created_at: new Date(Date.now() - 10 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-12'),
      can_extend: true,
      extension_count: 0
    },
    {
      id: '15',
      position: 'Ratownik medyczny',
      company: 'Pogotowie Ratunkowe',
      location: 'Szczecin',
      salary_range: '4500 - 6500 PLN',
      employment_type: 'Pełny etat',
      experience_level: 'Junior',
      description: 'Szukamy ratownika medycznego do zespołu wyjazdowego.',
      requirements: 'Wykształcenie ratownictwo medyczne, Prawo jazdy kat. B, Dyspozycyjność',
      benefits: 'Dodatki za dyżury, Stabilne zatrudnienie, Mundur',
      status: 'pending',
      created_at: new Date(Date.now() - 11 * 60 * 60 * 1000),
      expires_at: new Date('2024-05-13'),
      can_extend: true,
      extension_count: 0
    }
  ];

  private events: Event[] = [
    {
      id: '1',
      title: 'Konferencja Kardiologiczna 2024',
      type: 'conference',
      organizer: 'Polskie Towarzystwo Kardiologiczne',
      date: new Date('2024-03-15'),
      location: 'Hotel Marriott, Warszawa',
      description: 'Najnowsze osiągnięcia w kardiologii interwencyjnej.',
      max_participants: 200,
      current_participants: 156,
      status: 'approved',
      created_at: new Date('2024-01-20'),
      can_extend: false, // Events cannot be extended
      program: '9:00-10:00 - Rejestracja i kawa powitalna, 10:00-11:30 - Nowe techniki angioplastyki, 11:45-13:00 - Dyskusja panelowa',
      speakers: 'Prof. dr hab. Jan Kowalski (Kierownik Kliniki Kardiologii), Dr Anna Nowak (Specjalista kardiolog interwencyjny)'
    },
    {
      id: '2',
      title: 'Webinar: AI w Diagnostyce Medycznej',
      type: 'webinar',
      organizer: 'TechMed Solutions',
      date: new Date('2024-02-28'),
      online_url: 'https://webinar.techmed.pl/ai-diagnostyka',
      description: 'Jak sztuczna inteligencja rewolucjonizuje diagnostykę medyczną.',
      max_participants: 500,
      current_participants: 342,
      status: 'approved',
      created_at: new Date('2024-01-25'),
      can_extend: false, // Events cannot be extended
      program: '18:00-18:15 - Wprowadzenie do AI w medycynie, 18:15-19:00 - Prezentacja nowych rozwiązań, 19:00-19:30 - Sesja Q&A',
      speakers: 'Dr Piotr Tech (CEO TechMed Solutions), Mgr Anna AI (Ekspert ds. sztucznej inteligencji)'
    },
    {
      id: '3',
      title: 'Szkolenie z Ultrasonografii',
      type: 'conference',
      organizer: 'Akademia Medyczna Wrocław',
      date: new Date('2024-04-10'),
      location: 'Wrocław, ul. Medyczna 12',
      description: 'Praktyczne szkolenie z ultrasonografii punktowej.',
      max_participants: 30,
      current_participants: 18,
      status: 'pending',
      created_at: new Date('2024-01-22'),
      can_extend: false, // Events cannot be extended
      program: '9:00-10:30 - Podstawy ultrasonografii, 10:45-12:00 - Ćwiczenia praktyczne, 13:00-15:00 - Zaawansowane techniki',
      speakers: 'Prof. dr hab. Maria Ultrason (Klinika Radiologii), Dr Piotr USG (Specjalista ultrasonografii)'
    },
    {
      id: '4',
      title: 'Konferencja Neurochirurgiczna 2025',
      type: 'conference',
      organizer: 'UCK Kraków',
      date: new Date('2024-05-20'),
      location: 'Kraków, ul. Kopernika 50',
      description: 'Międzynarodowa konferencja poświęcona nowościom w neurochirurgii.',
      max_participants: 300,
      current_participants: 125,
      status: 'pending',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
      can_extend: false,
      program: 'Dzień 1: Neurochirurgia onkologiczna, Dzień 2: Chirurgia kręgosłupa',
      speakers: 'Prof. John Smith (Harvard Medical School), Prof. Anna Kowalska (UJ)'
    },
    {
      id: '5',
      title: 'Webinar: Nowoczesne metody rehabilitacji',
      type: 'webinar',
      organizer: 'FizjoMed',
      date: new Date('2024-03-10'),
      online_url: 'https://webinar.fizjomed.pl/rehabilitacja',
      description: 'Poznaj najnowsze trendy w rehabilitacji pourazowej.',
      max_participants: 100,
      current_participants: 67,
      status: 'pending',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      can_extend: false,
      program: '17:00-18:30 - Prezentacja metod, 18:30-19:00 - Q&A',
      speakers: 'Mgr Tomasz Rehab (FizjoMed)'
    },
    {
      id: '6',
      title: 'Sympozjum Diabetologiczne',
      type: 'conference',
      organizer: 'Polskie Towarzystwo Diabetologiczne',
      date: new Date('2024-04-05'),
      location: 'Warszawa, Hotel Marriott',
      description: 'Coroczne sympozjum poświęcone leczeniu cukrzycy.',
      max_participants: 250,
      current_participants: 189,
      status: 'pending',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      can_extend: false,
      program: 'Sesja I: Nowe leki, Sesja II: Powikłania cukrzycy, Sesja III: Edukacja pacjenta',
      speakers: 'Prof. dr hab. Marek Cukrzycki (PTD)'
    },
    {
      id: '7',
      title: 'Warsztaty USG w Położnictwie',
      type: 'conference',
      organizer: 'Centrum Szkoleniowe USG',
      date: new Date('2024-03-25'),
      location: 'Poznań, ul. Medyczna 5',
      description: 'Praktyczne warsztaty ultrasonografii w położnictwie.',
      max_participants: 20,
      current_participants: 15,
      status: 'pending',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
      can_extend: false,
      program: 'Badania I trymestru, Badania II trymestru, Przypadki kliniczne',
      speakers: 'Dr hab. Maria USG (Klinika Położnictwa)'
    },
    {
      id: '8',
      title: 'E-learning: Podstawy EKG',
      type: 'webinar',
      organizer: 'MedEdu Online',
      date: new Date('2024-03-15'),
      online_url: 'https://mededu.pl/ekg-podstawy',
      description: 'Kurs online dla początkujących - interpretacja EKG.',
      max_participants: 200,
      current_participants: 145,
      status: 'pending',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
      can_extend: false,
      program: 'Moduł 1: Teoria, Moduł 2: Praktyka, Moduł 3: Test',
      speakers: 'Dr Piotr Elektro (Kardiolog)'
    }
  ];

  private applications: Application[] = [
    {
      id: '1',
      job_offer_id: '1',
      candidate_name: 'Dr Anna Kowalska',
      candidate_email: 'anna.kowalska@email.com',
      candidate_phone: '+48 123 456 789',
      cv_url: '/cv/anna_kowalska.pdf',
      cover_letter: 'Jestem doświadczonym lekarzem rodzinnym z pasją do kompleksowej opieki nad pacjentami...',
      status: 'reviewed',
      rating: 4,
      notes: 'Bardzo doświadczona kandydatka, świetne referencje',
      applied_at: new Date('2024-01-16'),
      updated_at: new Date('2024-01-18')
    },
    {
      id: '2',
      job_offer_id: '1',
      candidate_name: 'Dr Piotr Nowak',
      candidate_email: 'piotr.nowak@email.com',
      candidate_phone: '+48 987 654 321',
      cv_url: '/cv/piotr_nowak.pdf',
      cover_letter: 'Mam 5 lat doświadczenia w medycynie rodzinnej...',
      status: 'interview',
      rating: 5,
      notes: 'Idealny kandydat, zapraszamy na rozmowę',
      applied_at: new Date('2024-01-17'),
      updated_at: new Date('2024-01-19')
    },
    {
      id: '3',
      job_offer_id: '2',
      candidate_name: 'Dr Maria Wiśniewska',
      candidate_email: 'maria.wisniewska@email.com',
      candidate_phone: '+48 555 777 999',
      status: 'pending',
      applied_at: new Date('2024-01-19'),
      updated_at: new Date('2024-01-19')
    }
  ];

  private userApplications: UserApplication[] = [
    {
      id: '1',
      user_id: 'user1',
      job_offer_id: '1',
      candidate_name: 'Jan Kowalski',
      candidate_email: 'jan.kowalski@email.com',
      candidate_phone: '+48 123 456 789',
      cv_url: '/cv/jan_kowalski.pdf',
      cover_letter: 'Aplikuję na stanowisko lekarza rodzinnego...',
      status: 'pending',
      applied_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20')
    },
    {
      id: '2',
      user_id: 'user1',
      job_offer_id: '2',
      candidate_name: 'Jan Kowalski',
      candidate_email: 'jan.kowalski@email.com',
      candidate_phone: '+48 123 456 789',
      status: 'reviewed',
      applied_at: new Date('2024-01-18'),
      updated_at: new Date('2024-01-21')
    }
  ];

  private userFavorites: UserFavorite[] = [
    {
      id: '1',
      user_id: 'user1',
      item_id: '1',
      item_type: 'job',
      added_at: new Date('2024-01-15')
    },
    {
      id: '2',
      user_id: 'user1',
      item_id: '1',
      item_type: 'event',
      added_at: new Date('2024-01-20')
    }
  ];

  // Job Offers
  getJobOffers(): JobOffer[] {
    return [...this.jobOffers];
  }

  getJobOfferById(id: string): JobOffer | undefined {
    return this.jobOffers.find(job => job.id === id);
  }

  approveJobOffer(id: string, adminComment?: string): void {
    const job = this.jobOffers.find(j => j.id === id);
    if (job) {
      job.status = 'approved';
      if (adminComment) {
        job.admin_comment = adminComment;
      }
      // Auto-archive after 7 days (simulate)
      setTimeout(() => {
        if (job.status === 'approved') {
          job.status = 'archived';
          job.archived_at = new Date();
        }
      }, 7 * 24 * 60 * 60 * 1000);
    }
  }

  rejectJobOffer(id: string, reason: string, adminComment?: string): void {
    const job = this.jobOffers.find(j => j.id === id);
    if (job) {
      job.status = 'rejected';
      job.rejection_reason = reason;
      if (adminComment) {
        job.admin_comment = adminComment;
      }
    }
  }

  // Events
  getEvents(): Event[] {
    return [...this.events];
  }

  getEventById(id: string): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  approveEvent(id: string, adminComment?: string): void {
    const event = this.events.find(e => e.id === id);
    if (event) {
      event.status = 'approved';
      if (adminComment) {
        event.admin_comment = adminComment;
      }
      // Auto-archive after event date
      if (event.date < new Date()) {
        setTimeout(() => {
          if (event.status === 'approved') {
            event.status = 'archived';
            event.archived_at = new Date();
          }
        }, 24 * 60 * 60 * 1000);
      }
    }
  }

  rejectEvent(id: string, reason: string, adminComment?: string): void {
    const event = this.events.find(e => e.id === id);
    if (event) {
      event.status = 'rejected';
      event.rejection_reason = reason;
      if (adminComment) {
        event.admin_comment = adminComment;
      }
    }
  }

  // Applications
  getApplications(): Application[] {
    return [...this.applications];
  }

  getApplicationsByJobId(jobId: string): Application[] {
    return this.applications.filter(app => app.job_offer_id === jobId);
  }

  updateApplicationStatus(id: string, status: Application['status'], notes?: string): void {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.updated_at = new Date();
      if (notes) {
        app.notes = notes;
      }
    }
  }

  rateApplication(id: string, rating: number): void {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.rating = rating;
      app.updated_at = new Date();
    }
  }

  // User Applications
  getUserApplications(userId: string): UserApplication[] {
    return this.userApplications.filter(app => app.user_id === userId);
  }

  addUserApplication(application: Omit<UserApplication, 'id' | 'applied_at' | 'updated_at'>): void {
    const newApp: UserApplication = {
      ...application,
      id: (this.userApplications.length + 1).toString(),
      applied_at: new Date(),
      updated_at: new Date()
    };
    this.userApplications.push(newApp);
  }

  // User Favorites
  getUserFavorites(userId: string): UserFavorite[] {
    return this.userFavorites.filter(fav => fav.user_id === userId);
  }

  addToFavorites(userId: string, itemId: string, itemType: 'job' | 'event'): void {
    const existing = this.userFavorites.find(
      fav => fav.user_id === userId && fav.item_id === itemId && fav.item_type === itemType
    );
    
    if (!existing) {
      this.userFavorites.push({
        id: (this.userFavorites.length + 1).toString(),
        user_id: userId,
        item_id: itemId,
        item_type: itemType,
        added_at: new Date()
      });
    }
  }

  removeFromFavorites(userId: string, itemId: string, itemType: 'job' | 'event'): void {
    this.userFavorites = this.userFavorites.filter(
      fav => !(fav.user_id === userId && fav.item_id === itemId && fav.item_type === itemType)
    );
  }

  // Extension and expiry management
  extendJobOffer(id: string, daysToExtend: number = 100): boolean {
    const job = this.jobOffers.find(j => j.id === id);
    if (job && job.can_extend && job.status === 'approved') {
      const newExpiryDate = new Date(job.expires_at);
      newExpiryDate.setDate(newExpiryDate.getDate() + daysToExtend);
      job.expires_at = newExpiryDate;
      job.extension_count = (job.extension_count || 0) + 1;
      return true;
    }
    return false;
  }

  checkExpiredItems(): { expiredJobs: JobOffer[], expiredEvents: Event[] } {
    const now = new Date();
    const expiredJobs = this.jobOffers.filter(j => 
      j.status === 'approved' && j.expires_at < now
    );
    const expiredEvents = this.events.filter(e => 
      e.status === 'approved' && e.date < now
    );
    
    // Mark as expired
    expiredJobs.forEach(job => job.status = 'expired');
    expiredEvents.forEach(event => event.status = 'expired');
    
    return { expiredJobs, expiredEvents };
  }

  getExpiringItems(daysAhead: number = 7): { expiringJobs: JobOffer[], upcomingEvents: Event[] } {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    const expiringJobs = this.jobOffers.filter(j => 
      j.status === 'approved' && j.expires_at <= futureDate && j.expires_at > new Date()
    );
    const upcomingEvents = this.events.filter(e => 
      e.status === 'approved' && e.date <= futureDate && e.date > new Date()
    );
    
    return { expiringJobs, upcomingEvents };
  }

  // Get Users
  getUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  suspendUser(id: string): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = 'suspended';
    }
  }

  activateUser(id: string): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = 'active';
    }
  }

  banUser(id: string): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = 'banned';
    }
  }

  verifyUser(id: string): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.verified = true;
    }
  }

  // Get Recent Activities
  getRecentActivities(limit: number = 10): RecentActivity[] {
    return this.recentActivities.slice(0, limit);
  }

  addActivity(activity: Omit<RecentActivity, 'id'>): void {
    const newActivity: RecentActivity = {
      ...activity,
      id: (this.recentActivities.length + 1).toString()
    };
    this.recentActivities.unshift(newActivity);
  }

  // Statistics for admin panel
  getStatistics() {
    const now = new Date();
    
    const totalJobOffers = this.jobOffers.length;
    const approvedJobOffers = this.jobOffers.filter(j => j.status === 'approved').length;
    const pendingJobOffers = this.jobOffers.filter(j => j.status === 'pending').length;
    const rejectedJobOffers = this.jobOffers.filter(j => j.status === 'rejected').length;
    const expiredJobOffers = this.jobOffers.filter(j => j.status === 'expired').length;
    const expiringJobOffers = this.jobOffers.filter(j => 
      j.status === 'approved' && j.expires_at <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) && j.expires_at > now
    ).length;

    const totalEvents = this.events.length;
    const approvedEvents = this.events.filter(e => e.status === 'approved').length;
    const pendingEvents = this.events.filter(e => e.status === 'pending').length;
    const rejectedEvents = this.events.filter(e => e.status === 'rejected').length;
    const expiredEvents = this.events.filter(e => e.status === 'expired').length;
    const upcomingEvents = this.events.filter(e => 
      e.status === 'approved' && e.date <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) && e.date > now
    ).length;

    const totalApplications = this.applications.length;
    const pendingApplications = this.applications.filter(a => a.status === 'pending').length;
    const reviewedApplications = this.applications.filter(a => a.status === 'reviewed').length;

    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.status === 'active').length;
    const companyUsers = this.users.filter(u => u.type === 'company').length;
    const individualUsers = this.users.filter(u => u.type === 'individual').length;
    const verifiedUsers = this.users.filter(u => u.verified).length;
    const todayUsers = this.users.filter(u => {
      const today = new Date();
      return u.registration_date.toDateString() === today.toDateString();
    }).length;

    return {
      jobOffers: {
        total: totalJobOffers,
        approved: approvedJobOffers,
        pending: pendingJobOffers,
        rejected: rejectedJobOffers,
        expired: expiredJobOffers,
        expiring: expiringJobOffers
      },
      events: {
        total: totalEvents,
        approved: approvedEvents,
        pending: pendingEvents,
        rejected: rejectedEvents,
        expired: expiredEvents,
        upcoming: upcomingEvents
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        reviewed: reviewedApplications
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        companies: companyUsers,
        individuals: individualUsers,
        verified: verifiedUsers,
        todayRegistrations: todayUsers
      }
    };
  }

  // Status History for Admin Panel
  getStatusHistory(itemId: string) {
    // Mock status history data
    const histories: Record<string, Array<{
      status: 'pending' | 'approved' | 'rejected';
      timestamp: Date;
      admin?: string;
      reason?: string;
      notes?: string;
    }>> = {
      '1': [
        {
          status: 'pending',
          timestamp: new Date('2024-01-15T10:30:00'),
          admin: 'System',
          notes: 'Oferta utworzona przez Centrum Medyczne Warszawa'
        },
        {
          status: 'approved',
          timestamp: new Date('2024-01-16T14:20:00'),
          admin: 'Admin Jan Kowalski',
          notes: 'Oferta spełnia wszystkie wymagania, zaakceptowana'
        }
      ],
      '2': [
        {
          status: 'pending',
          timestamp: new Date('2024-01-18T09:15:00'),
          admin: 'System',
          notes: 'Oferta utworzona przez Szpital Dziecięcy'
        }
      ],
      '3': [
        {
          status: 'pending',
          timestamp: new Date('2024-01-10T11:45:00'),
          admin: 'System',
          notes: 'Oferta utworzona przez Prywatna Klinika Diagnostyczna'
        },
        {
          status: 'rejected',
          timestamp: new Date('2024-01-12T16:30:00'),
          admin: 'Admin Anna Nowak',
          reason: 'Niepełna dokumentacja',
          notes: 'Brak wymaganych certyfikatów i szczegółowego opisu stanowiska'
        }
      ]
    };

    return histories[itemId] || [];
  }

  // Get pending items (for main admin view)
  getPendingJobOffers(): JobOffer[] {
    return this.jobOffers.filter(job => job.status === 'pending');
  }

  getPendingEvents(): Event[] {
    return this.events.filter(event => event.status === 'pending');
  }

  // Get approved items (for archive view)
  getApprovedJobOffers(): JobOffer[] {
    return this.jobOffers.filter(job => job.status === 'approved' || job.status === 'archived');
  }

  getApprovedEvents(): Event[] {
    return this.events.filter(event => event.status === 'approved' || event.status === 'archived');
  }

  // Archive approved items manually
  archiveJobOffer(id: string): void {
    const job = this.jobOffers.find(j => j.id === id);
    if (job && job.status === 'approved') {
      job.status = 'archived';
      job.archived_at = new Date();
    }
  }

  archiveEvent(id: string): void {
    const event = this.events.find(e => e.id === id);
    if (event && event.status === 'approved') {
      event.status = 'archived';
      event.archived_at = new Date();
    }
  }

  // Restore from archive
  restoreJobOffer(id: string): void {
    const job = this.jobOffers.find(j => j.id === id);
    if (job && job.status === 'archived') {
      job.status = 'approved';
      job.archived_at = undefined;
    }
  }

  restoreEvent(id: string): void {
    const event = this.events.find(e => e.id === id);
    if (event && event.status === 'archived') {
      event.status = 'approved';
      event.archived_at = undefined;
    }
  }
}

export const exampleDataService = new ExampleDataService();