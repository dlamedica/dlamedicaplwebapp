import React, { useState, useMemo } from 'react';
import { Search, Calculator, ChevronRight, BookOpen, Heart, Brain, Stethoscope, Activity, Target, Zap, Clipboard, Baby, Thermometer, Shield, Eye, Flame, Users, TrendingUp, Filter, Star, Clock } from 'lucide-react';

interface MedicalCalculator {
  id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  usage: string;
  icon: React.ReactNode;
  color: string;
  calcFunction: string;
  condition: string;
  specialty: string;
  chiefComplaint: string;
  organSystem: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface FilterState {
  calcFunction: string;
  condition: string;
  specialty: string;
  chiefComplaint: string;
  organSystem: string;
}

const medicalCalculators: MedicalCalculator[] = [
  // ASA
  {
    id: 'asa',
    name: 'ASA',
    fullName: 'Skala ASA (American Society of Anesthesiologists)',
    category: 'A',
    description: 'Skala ASA służy do klasyfikacji stanu fizycznego pacjenta przed zabiegiem anestezjologicznym i chirurgicznym',
    usage: 'Ocena ryzyka przedoperacyjnego pacjenta',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-400 to-pink-500',
    calcFunction: 'Rokowanie',
    condition: 'Ryzyko przedoperacyjne',
    specialty: 'Anestezjologia',
    chiefComplaint: 'Ocena przedoperacyjna',
    organSystem: 'Układ sercowo-naczyniowy',
    isPopular: true
  },
  // Bristol
  {
    id: 'bristol',
    name: 'Bristol',
    fullName: 'Bristolska skala uformowania stolca',
    category: 'B',
    description: 'Standardowa skala wizualna do oceny formy i konsystencji stolca, używana w diagnostyce zaburzeń jelitowych',
    usage: 'Ocena konsystencji stolca w gastroenterologii',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-green-400 to-emerald-500',
    calcFunction: 'Diagnostyka',
    condition: 'Zaparcia',
    specialty: 'Gastroenterologia',
    chiefComplaint: 'Zaparcia',
    organSystem: 'Żołądkowo-jelitowy'
  },
  // GDS
  {
    id: 'gds',
    name: 'GDS',
    fullName: 'Geriatryczna Skala Depresji',
    category: 'G',
    description: 'Narzędzie do wstępnej oceny objawów depresyjnych u pacjentów geriatrycznych (65+)',
    usage: 'Przesiewowa ocena depresji u osób starszych',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-purple-400 to-indigo-500',
    calcFunction: 'Diagnostyka',
    condition: 'Depresja',
    specialty: 'Geriatria',
    chiefComplaint: 'Utrata pamięci',
    organSystem: 'Układ nerwowy'
  },
  // Killip-Kimball
  {
    id: 'killip',
    name: 'Killip-Kimball',
    fullName: 'Klasyfikacja Killipa-Kimball',
    category: 'K',
    description: 'Klasyfikacja niewydolności serca w ostrym zawale mięśnia sercowego według objawów klinicznych',
    usage: 'Ocena stopnia niewydolności serca w ostrym zespole wieńcowym',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600',
    calcFunction: 'Rokowanie',
    condition: 'Ostry zespół wieńcowy',
    specialty: 'Kardiologia',
    chiefComplaint: 'Ból w klatce piersiowej',
    organSystem: 'Układ sercowo-naczyniowy',
    isPopular: true
  },
  // Lown
  {
    id: 'lown',
    name: 'Lown',
    fullName: 'Klasyfikacja Lown dodatkowych skurczów komorowych',
    category: 'L',
    description: 'Klasyfikacja prognostyczna dodatkowych skurczów komorowych (VPC/VES) w arytmologii',
    usage: 'Stratyfikacja ryzyka w arytmiach komorowych',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500',
    calcFunction: 'Rokowanie',
    condition: 'Arytmia',
    specialty: 'Kardiologia',
    chiefComplaint: 'Kołatanie serca',
    organSystem: 'Układ sercowo-naczyniowy'
  },
  // TNM
  {
    id: 'tnm',
    name: 'TNM',
    fullName: 'Klasyfikacja TNM nowotworów złośliwych',
    category: 'T',
    description: 'Międzynarodowy standard opisu anatomicznego zasięgu nowotworów złośliwych',
    usage: 'Określenie stopnia zaawansowania nowotworów złośliwych',
    icon: <Target className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    calcFunction: 'Rokowanie',
    condition: 'Nowotwory',
    specialty: 'Hematologia/Onkologia',
    chiefComplaint: 'Utrata masy ciała',
    organSystem: 'Układ sercowo-naczyniowy'
  },
  // Ranson
  {
    id: 'ranson',
    name: 'Ranson',
    fullName: 'Kryteria Ransona',
    category: 'R',
    description: 'Prognostyczna ocena ciężkości ostrego zapalenia trzustki oparta na kryteriach klinicznych i laboratoryjnych',
    usage: 'Ocena ciężkości i rokowania w ostrym zapaleniu trzustki',
    icon: <Clipboard className="w-6 h-6" />,
    color: 'from-orange-500 to-yellow-600',
    calcFunction: 'Rokowanie',
    condition: 'Ostre zapalenie trzustki',
    specialty: 'Gastroenterologia',
    chiefComplaint: 'Ból brzucha',
    organSystem: 'Żołądkowo-jelitowy'
  },
  // MMSE
  {
    id: 'mmse',
    name: 'MMSE',
    fullName: 'Mini-Mental State Examination',
    category: 'M',
    description: 'Najczęściej używany test przesiewowy do oceny funkcji poznawczych i demencji',
    usage: 'Przesiewowa ocena funkcji poznawczych',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500',
    calcFunction: 'Diagnostyka',
    condition: 'Otępienie',
    specialty: 'Neurologia',
    chiefComplaint: 'Utrata pamięci',
    organSystem: 'Układ nerwowy',
    isPopular: true
  },
  // Pediatryczna GCS
  {
    id: 'pediatric-gcs',
    name: 'Pediatryczna GCS',
    fullName: 'Pediatryczna Skala Glasgow',
    category: 'P',
    description: 'Modyfikacja skali Glasgow dostosowana do możliwości rozwojowych małych dzieci (poniżej 2 lat)',
    usage: 'Ocena stanu świadomości u dzieci',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-pink-400 to-purple-500',
    calcFunction: 'Diagnostyka',
    condition: 'Zaburzenia stanu psychicznego',
    specialty: 'Pediatria',
    chiefComplaint: 'Zaburzenia stanu psychicznego',
    organSystem: 'Układ nerwowy'
  },
  // Aldreta
  {
    id: 'aldreta',
    name: 'Aldreta',
    fullName: 'Skala Aldreta',
    category: 'A',
    description: 'Ocena gotowości pacjenta do wypisu z pooperacyjnej sali wybudzeniowej po anestezji',
    usage: 'Ocena stanu pooperacyjnego pacjenta',
    icon: <Thermometer className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-500',
    calcFunction: 'Rokowanie',
    condition: 'Pooperacyjna rekonwalescencja',
    specialty: 'Anestezjologia',
    chiefComplaint: 'Ocena pooperacyjna',
    organSystem: 'Układ sercowo-naczyniowy'
  },
  // Alvarado
  {
    id: 'alvarado',
    name: 'Alvarado',
    fullName: 'Skala Alvarado',
    category: 'A',
    description: 'Ocena prawdopodobieństwa ostrego zapalenia wyrostka robaczkowego na podstawie objawów klinicznych',
    usage: 'Diagnostyka ostrego zapalenia wyrostka',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-emerald-400 to-teal-500',
    calcFunction: 'Diagnostyka',
    condition: 'Zapalenie wyrostka robaczkowego',
    specialty: 'Medycyna ratunkowa',
    chiefComplaint: 'Ból brzucha',
    organSystem: 'Układ pokarmowy',
    isPopular: true
  },
  // Apfel
  {
    id: 'apfel',
    name: 'Apfel',
    fullName: 'Skala Apfel',
    category: 'A',
    description: 'Ocena ryzyka pooperacyjnych nudności i wymiotów (PONV) na podstawie czynników ryzyka pacjenta',
    usage: 'Prewencja PONV w anestezjologii',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-indigo-400 to-purple-500',
    calcFunction: 'Rokowanie',
    condition: 'Nudności pooperacyjne',
    specialty: 'Anestezjologia',
    chiefComplaint: 'Nudności/wymioty',
    organSystem: 'Żołądkowo-jelitowy'
  },
  // Apgar
  {
    id: 'apgar',
    name: 'Apgar',
    fullName: 'Skala Apgar',
    category: 'A',
    description: 'Standardowa skala do szybkiej oceny stanu noworodka w pierwszych minutach życia po porodzie',
    usage: 'Ocena stanu klinicznego noworodka',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-pink-400 to-rose-500',
    calcFunction: 'Diagnostyka',
    condition: 'Ocena noworodka',
    specialty: 'Pediatria',
    chiefComplaint: 'Ocena noworodka',
    organSystem: 'Układ sercowo-naczyniowy',
    isPopular: true
  },
  // AVPU
  {
    id: 'avpu',
    name: 'AVPU',
    fullName: 'Skala AVPU',
    category: 'A',
    description: 'Uproszczona skala do szybkiej oceny poziomu świadomości w stanach nagłych i ratownictwie medycznym',
    usage: 'Ocena poziomu świadomości',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500',
    calcFunction: 'Diagnostyka',
    condition: 'Zaburzenia stanu psychicznego',
    specialty: 'Medycyna ratunkowa',
    chiefComplaint: 'Zaburzenia stanu psychicznego',
    organSystem: 'Układ nerwowy'
  },
  // Biäterveld
  {
    id: 'biaterveld',
    name: 'Biäterveld',
    fullName: 'Skala Biäterveld',
    category: 'B',
    description: 'Radiologiczna skala do oceny zaawansowania śródmiąższowej choroby płuc na podstawie RTG klatki piersiowej',
    usage: 'Ocena zmian śródmiąższowych płuc',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-teal-400 to-blue-500',
    calcFunction: 'Diagnostyka',
    condition: 'Choroby śródmiąższowe płuc',
    specialty: 'Pneumonologia',
    chiefComplaint: 'Duszność',
    organSystem: 'Układ oddechowy'
  },
  // Bishop
  {
    id: 'bishop',
    name: 'Bishop',
    fullName: 'Skala Bishopa',
    category: 'B',
    description: 'Ocena dojrzałości szyjki macicy i gotowości do indukcji porodu na podstawie badania ginekologicznego',
    usage: 'Kwalifikacja do indukcji porodu',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-rose-400 to-pink-500',
    calcFunction: 'Rokowanie',
    condition: 'Indukcja porodu',
    specialty: 'Ginekologia i położnictwo',
    chiefComplaint: 'Ocena porodu',
    organSystem: 'Układ rozrodczy'
  },
  // Burch-Wartofsky
  {
    id: 'burch-wartofksy',
    name: 'Burch-Wartofsky',
    fullName: 'Skala Burch-Wartofsky\'ego',
    category: 'B',
    description: 'Diagnostyka przełomu tarczycowego na podstawie objawów klinicznych i laboratoryjnych',
    usage: 'Diagnostyka przełomu tarczycowego',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-orange-400 to-red-500',
    calcFunction: 'Diagnostyka',
    condition: 'Przełom tarczycowy',
    specialty: 'Endokrynologia',
    chiefComplaint: 'Gorączka',
    organSystem: 'Układ endokrynny'
  },
  // CCS
  {
    id: 'ccs',
    name: 'CCS',
    fullName: 'Skala CCS (Canadian Cardiovascular Society)',
    category: 'C',
    description: 'Klasyfikacja nasilenia dławicy piersiowej według ograniczeń funkcjonalnych pacjenta',
    usage: 'Ocena stopnia dławicy piersiowej',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-400 to-pink-600',
    calcFunction: 'Diagnostyka',
    condition: 'Dławica piersiowa',
    specialty: 'Kardiologia',
    chiefComplaint: 'Ból w klatce piersiowej',
    organSystem: 'Układ sercowo-naczyniowy'
  },
  // CEAP
  {
    id: 'ceap',
    name: 'CEAP',
    fullName: 'Klasyfikacja CEAP',
    category: 'C',
    description: 'Międzynarodowa standardowa klasyfikacja przewlekłej choroby żył kończyn dolnych',
    usage: 'Kompleksowa ocena żylaków i niewydolności żylnej',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500',
    calcFunction: 'Diagnostyka',
    condition: 'Niewydolność żylna',
    specialty: 'Chirurgia naczyniowa',
    chiefComplaint: 'Ból nóg',
    organSystem: 'Układ sercowo-naczyniowy'
  },
  // Centor
  {
    id: 'centor',
    name: 'Centor',
    fullName: 'Skala Centora',
    category: 'C',
    description: 'Ocena prawdopodobieństwa paciorkowcowego zapalenia gardła na podstawie objawów klinicznych',
    usage: 'Diagnostyka paciorkowcowego zapalenia gardła',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-green-400 to-teal-500',
    calcFunction: 'Diagnostyka',
    condition: 'Angina paciorkowcowa',
    specialty: 'Medycyna ratunkowa',
    chiefComplaint: 'Ból gardła',
    organSystem: 'Układ immunologiczny',
    isPopular: true
  },
  // CHADS
  {
    id: 'chads',
    name: 'CHADS',
    fullName: 'Skala CHADS',
    category: 'C',
    description: 'Ocena ryzyka udaru mózgu u pacjentów z migotaniem przedsionków (poprzednik CHA₂DS₂-VASc)',
    usage: 'Ocena ryzyka udaru w migotaniu przedsionków',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-purple-400 to-indigo-500',
    calcFunction: 'Rokowanie',
    condition: 'Migotanie przedsionków',
    specialty: 'Kardiologia',
    chiefComplaint: 'Kołatanie serca',
    organSystem: 'Układ sercowo-naczyniowy',
    isPopular: true
  },
  // Child-Pugh
  {
    id: 'child-pugh',
    name: 'Child-Pugh',
    fullName: 'Skala Child-Pugha',
    category: 'C',
    description: 'Ocena funkcji wątroby i rokowania u pacjentów z marskością wątroby',
    usage: 'Ocena stopnia zaawansowania marskości wątroby',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-amber-400 to-orange-500',
    calcFunction: 'Rokowanie',
    condition: 'Marskość wątroby',
    specialty: 'Gastroenterologia',
    chiefComplaint: 'Wzdęcie brzucha',
    organSystem: 'Układ pokarmowy',
    isPopular: true
  },
  // ISS
  {
    id: 'iss',
    name: 'ISS',
    fullName: 'Injury Severity Score',
    category: 'I',
    description: 'Skala ciężkości urazów do oceny wielonarządowych obrażeń pourazowych',
    usage: 'Ocena ciężkości wielonarządowych obrażeń urazowych',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-red-400 to-orange-500',
    calcFunction: 'Rokowanie',
    condition: 'Uraz',
    specialty: 'Medycyna ratunkowa',
    chiefComplaint: 'Ocena urazu',
    organSystem: 'Układ sercowo-naczyniowy'
  },
  // Beck Depression
  {
    id: 'beck-depression',
    name: 'Beck Depression',
    fullName: 'Skala Depresji Becka (BDI)',
    category: 'B',
    description: 'Samoocena nasilenia objawów depresyjnych w ciągu ostatnich dwóch tygodni',
    usage: 'Samoocena nasilenia objawów depresyjnych',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-indigo-400 to-purple-500',
    calcFunction: 'Diagnostyka',
    condition: 'Depresja',
    specialty: 'Psychiatria',
    chiefComplaint: 'Depresja',
    organSystem: 'Układ nerwowy',
    isNew: true
  }
];

const calcFunctions = ['Diagnostyka', 'Wykluczenie', 'Rokowanie', 'Formuła', 'Leczenie', 'Algorytm', 'Ocena stanu', 'Monitorowanie'];
const conditions = [
  'Achalazja', 'Zaburzenia kwasowo-zasadowe', 'Ostry zespół wieńcowy', 'Ostre uszkodzenie nerek', 'Ostry ból',
  'Ostre zapalenie trzustki', 'Ostry zespół niewydolności oddechowej', 'Alergia', 'Zaburzenia stanu psychicznego', 'Niedokrwistość',
  'Dławica piersiowa', 'Zapalenie wyrostka robaczkowego', 'Arytmia', 'Astma', 'Migotanie przedsionków', 'Nowotwory', 'Zaparcia',
  'Otepienie', 'Depresja', 'Niewydolność serca', 'Nadciśnienie', 'Infekcja', 'Indukcja porodu',
  'Marskość wątroby', 'Ocena noworodka', 'Ryzyko przedoperacyjne', 'Nudności pooperacyjne',
  'Pooperacyjna rekonwalescencja', 'Angina paciorkowcowa', 'Przełom tarczycowy', 'Uraz', 'Niewydolność żylna'
];
const specialties = [
  'Alergologia',
  'Anestezjologia',
  'Cardiologia',
  'Chirurgia ogólna',
  'Chirurgia naczyniowa',
  'Chirurgia ortopedyczna',
  'Choroby wewnętrzne',
  'Choroby zakaźne',
  'Dermatologia',
  'Endokrynologia',
  'Gastroenterologia',
  'Geriatria',
  'Ginekologia i położnictwo',
  'Hematologia',
  'Intensywna terapia',
  'Kardiologia',
  'Laryngologia',
  'Medycyna nuklearna',
  'Medycyna pracy',
  'Medycyna ratunkowa',
  'Medycyna rodzinna',
  'Nefrologia',
  'Neonatologia',
  'Neurochirurgia',
  'Neurologia',
  'Okulistyka',
  'Onkologia',
  'Ortopedia',
  'Pediatria',
  'Pneumonologia',
  'Psychiatria',
  'Radiologia',
  'Rehabilitacja',
  'Reumatologia',
  'Urologia'
];
const chiefComplaints = [
  'Ból brzucha',
  'Ból głowy',
  'Ból w klatce piersiowej',
  'Ból pleców',
  'Ból stawów',
  'Biegunka',
  'Duszność',
  'Gorączka',
  'Kaszel',
  'Kołatanie serca',
  'Krwawienie',
  'Nudności i wymioty',
  'Omdlenia',
  'Wysypka',
  'Zawroty głowy',
  'Zmęczenie',
  'Zaburzenia świadomości',
  'Zaburzenia widzenia',
  'Zaburzenia słuchu',
  'Zaparcia',
  'Utrata masy ciała',
  'Problemy z oddychaniem',
  'Ból podczas oddawania moczu',
  'Zaburzenia pamięci',
  'Problemy ze snem'
];
const organSystems = [
  'Układ sercowo-naczyniowy',
  'Układ oddechowy',
  'Układ pokarmowy',
  'Układ moczowo-płciowy',
  'Układ nerwowy',
  'Układ mięśniowo-szkieletowy',
  'Układ endokrynny',
  'Układ immunologiczny',
  'Układ krwiotwórczy',
  'Układ rozrodczy',
  'Narząd wzroku',
  'Narząd słuchu',
  'Skóra i przydatki',
  'Układ chłonny'
];

const EnhancedCalculatorsPage: React.FC<{darkMode: boolean, fontSize: 'small' | 'medium' | 'large'}> = ({ darkMode, fontSize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('calculatorFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState<FilterState>({
    calcFunction: '',
    condition: '',
    specialty: '',
    chiefComplaint: '',
    organSystem: ''
  });

  const filteredCalculators = useMemo(() => {
    let filtered = medicalCalculators;

    // Filter by tab
    if (selectedTab === 'popular') {
      filtered = filtered.filter(calc => calc.isPopular);
    } else if (selectedTab === 'new') {
      filtered = filtered.filter(calc => calc.isNew);
    } else if (selectedTab === 'favorites') {
      filtered = filtered.filter(calc => favorites.includes(calc.id));
    }
    
    // Filter by letter
    if (selectedLetter) {
      filtered = filtered.filter(calc => 
        calc.name.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(calc =>
        calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.usage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply advanced filters
    if (filters.calcFunction) {
      filtered = filtered.filter(calc => calc.calcFunction === filters.calcFunction);
    }
    if (filters.condition) {
      filtered = filtered.filter(calc => calc.condition === filters.condition);
    }
    if (filters.specialty) {
      filtered = filtered.filter(calc => calc.specialty === filters.specialty);
    }
    if (filters.chiefComplaint) {
      filtered = filtered.filter(calc => calc.chiefComplaint === filters.chiefComplaint);
    }
    if (filters.organSystem) {
      filtered = filtered.filter(calc => calc.organSystem === filters.organSystem);
    }

    return filtered;
  }, [searchQuery, selectedTab, filters, selectedLetter, favorites]);

  const handleCalculatorClick = (calculatorId: string) => {
    window.history.pushState({}, '', `/kalkulatory/${calculatorId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const resetFilters = () => {
    setFilters({
      calcFunction: '',
      condition: '',
      specialty: '',
      chiefComplaint: '',
      organSystem: ''
    });
    setSearchQuery('');
    setSelectedLetter(null);
  };
  
  const toggleFavorite = (calculatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(calculatorId)
      ? favorites.filter(id => id !== calculatorId)
      : [...favorites, calculatorId];
    setFavorites(newFavorites);
    localStorage.setItem('calculatorFavorites', JSON.stringify(newFavorites));
  };
  
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b" style={{borderColor: 'rgba(56, 182, 255, 0.1)'}}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full" style={{backgroundColor: '#38b6ff'}}>
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold" style={{color: '#38b6ff'}}>
              Kalkulatory Medyczne
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Narzędzia kliniczne oparte na dowodach
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                style={{'--tw-ring-color': '#38b6ff'}}
                placeholder="Szukaj kalkulatorów..."
                onClick={() => setShowFilters(true)}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors`}
                style={{color: showFilters ? '#38b6ff' : '#9CA3AF'}}
              >
                <Filter className="h-5 w-5" />
                {activeFiltersCount > 0 && (
                  <span className="ml-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{backgroundColor: '#38b6ff'}}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Zaawansowane filtry</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm font-medium"
                  style={{color: '#38b6ff'}}
                >
                  Wyczyść filtry
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Calc Function Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funkcja kalkulatora
                  </label>
                  <select
                    value={filters.calcFunction}
                    onChange={(e) => setFilters({...filters, calcFunction: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#38b6ff'}}
                  >
                    <option value="">Wybierz...</option>
                    {calcFunctions.map(func => (
                      <option key={func} value={func}>{func}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stan/Choroba
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({...filters, condition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#38b6ff'}}
                  >
                    <option value="">Wybierz...</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specjalizacja
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#38b6ff'}}
                  >
                    <option value="">Wybierz...</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                {/* Chief Complaint Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Główne dolegliwości
                  </label>
                  <select
                    value={filters.chiefComplaint}
                    onChange={(e) => setFilters({...filters, chiefComplaint: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#38b6ff'}}
                  >
                    <option value="">Wybierz...</option>
                    {chiefComplaints.map(complaint => (
                      <option key={complaint} value={complaint}>{complaint}</option>
                    ))}
                  </select>
                </div>

                {/* Organ System Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Układy
                  </label>
                  <select
                    value={filters.organSystem}
                    onChange={(e) => setFilters({...filters, organSystem: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{'--tw-ring-color': '#38b6ff'}}
                  >
                    <option value="">Wybierz...</option>
                    {organSystems.map(system => (
                      <option key={system} value={system}>{system}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-xl shadow-sm bg-white p-1 border border-gray-200">
              {['all', 'popular', 'new', 'favorites', 'for-you'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    selectedTab === tab
                      ? 'text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={selectedTab === tab ? {backgroundColor: '#38b6ff'} : {}}
                >
                  {tab === 'all' && <><Calculator className="w-4 h-4" /><span>Wszystkie</span></>}
                  {tab === 'popular' && <><Star className="w-4 h-4" /><span>Popularne</span></>}
                  {tab === 'new' && <><Clock className="w-4 h-4" /><span>Nowe</span></>}
                  {tab === 'favorites' && <><Heart className="w-4 h-4" /><span>Ulubione</span></>}
                  {tab === 'for-you' && <><Users className="w-4 h-4" /><span>Dla ciebie</span></>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Alphabet Filter */}
        <div className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  selectedLetter === letter 
                    ? 'text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={selectedLetter === letter ? {backgroundColor: '#38b6ff'} : {}}
                onMouseEnter={(e) => {
                  if (selectedLetter !== letter) {
                    e.currentTarget.style.backgroundColor = 'rgba(56, 182, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLetter !== letter) {
                    e.currentTarget.style.backgroundColor = '';
                  }
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Znaleziono <span className="font-semibold" style={{color: '#38b6ff'}}>{filteredCalculators.length}</span> kalkulatorów
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map(calculator => (
            <div
              key={calculator.id}
              onClick={() => handleCalculatorClick(calculator.id)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden transform hover:-translate-y-1"
              style={{height: 'auto', minHeight: '250px'}}
            >
              {/* Card Header */}
              <div className={`h-2 bg-gradient-to-r ${calculator.color}`} />
              
              <div className="p-6">
                {/* Header with badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${calculator.color} bg-opacity-10 rounded-lg`}>
                    <div className={`bg-gradient-to-r ${calculator.color} bg-clip-text text-transparent`}>
                      {calculator.icon}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      {calculator.specialty}
                    </span>
                    {calculator.isNew && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                        NOWY
                      </span>
                    )}
                    {calculator.isPopular && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-semibold rounded-full">
                        POPULARNE
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors">
                  {calculator.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  {calculator.fullName}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4" style={{overflow: 'visible', height: 'auto', minHeight: '3rem'}}>
                  {calculator.description}
                </p>

                {/* Usage */}
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Zastosowanie:</span>
                  <p className="text-sm text-gray-700 mt-1">{calculator.usage}</p>
                </div>

                {/* Action Button with Heart */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium" style={{color: '#38b6ff'}}>
                    Otwórz kalkulator
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => toggleFavorite(calculator.id, e)}
                      className={`p-2 transition-colors ${
                        favorites.includes(calculator.id) 
                          ? 'text-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(calculator.id) ? 'fill-current' : ''}`} />
                    </button>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{color: '#38b6ff'}} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nie znaleziono kalkulatorów
            </h3>
            <p className="text-gray-500 mb-4">
              Spróbuj zmienić kryteria wyszukiwania
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-white rounded-lg transition-colors"
              style={{backgroundColor: '#38b6ff'}}
            >
              Wyczyść filtry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCalculatorsPage;