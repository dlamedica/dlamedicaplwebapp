import React, { useState, useEffect } from 'react';
import { FaSearch, FaStethoscope, FaHeart, FaBrain, FaLungs, FaEye, FaBaby, FaUserMd, FaChevronRight, FaCalculator, FaStar, FaFilter, FaTimes } from 'react-icons/fa';

interface MedicalScale {
  id: string;
  name: string;
  shortName: string;
  category: string;
  specialty: string;
  description: string;
  purpose: string;
  scoring: string;
  interpretation: string;
  ageGroup: string;
  popularity: number;
  difficulty: 'łatwa' | 'średnia' | 'trudna';
  tags: string[];
}

interface MedicalScalesPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const MedicalScalesPage: React.FC<MedicalScalesPageProps> = ({ darkMode, fontSize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');
  const [selectedSpecialty, setSelectedSpecialty] = useState('wszystkie');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('wszystkie');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedScale, setSelectedScale] = useState<MedicalScale | null>(null);

  useEffect(() => {
    document.title = 'Skale medyczne - kompendium skal oceny | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Kompletne kompendium skal medycznych z opisami, interpretacją i zastosowaniem. Skale kardiologiczne, neurologiczne, pediatryczne i więcej.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Skale medyczne - kompendium skal oceny | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Znajdź i wykorzystaj skale medyczne w praktyce klinicznej. Kompletne opisy, interpretacja wyników i wskazania do zastosowania.');
    }
  }, []);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          detailText: 'text-xs md:text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          detailText: 'text-base md:text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          detailText: 'text-sm md:text-base'
        };
    }
  };

  const fontClasses = getFontSizeClasses();

  const categories = [
    { id: 'wszystkie', name: 'Wszystkie skale', icon: FaUserMd },
    { id: 'diagnostyczne', name: 'Diagnostyczne', icon: FaStethoscope },
    { id: 'prognostyczne', name: 'Prognostyczne', icon: FaEye },
    { id: 'ocena_stanu', name: 'Ocena stanu', icon: FaHeart },
    { id: 'funkcjonalne', name: 'Funkcjonalne', icon: FaBrain },
    { id: 'bolu', name: 'Skale bólu', icon: FaCalculator }
  ];

  const specialties = [
    'wszystkie', 'kardiologia', 'neurologia', 'pediatria', 'psychiatria', 
    'intensywna', 'geriatria', 'ortopedia', 'onkologia', 'pulmonologia'
  ];

  const ageGroups = [
    'wszystkie', 'noworodki', 'niemowlęta', 'dzieci', 'dorośli', 'geriatryczni'
  ];

  const medicalScales: MedicalScale[] = [
    // KARDIOLOGIA
    {
      id: 'grace',
      name: 'GRACE Risk Score',
      shortName: 'GRACE',
      category: 'prognostyczne',
      specialty: 'kardiologia',
      description: 'Skala oceny ryzyka śmiertelności u pacjentów z ostrymi zespołami wieńcowymi.',
      purpose: 'Oszacowanie ryzyka śmierci śpitalnej i 6-miesięcznej u pacjentów z ACS',
      scoring: 'Punkty za: wiek, częstość serca, ciśnienie skurczowe, kreatynina, klasa Killipa, zatrzymanie krążenia, odchylenia ST, markery martwicy',
      interpretation: '≤108 pkt (niskie ryzyko), 109-140 pkt (średnie), >140 pkt (wysokie)',
      ageGroup: 'dorośli',
      popularity: 95,
      difficulty: 'średnia',
      tags: ['zawał serca', 'ACS', 'ryzyko', 'prognoza', 'śmiertelność']
    },
    {
      id: 'chads2',
      name: 'CHA₂DS₂-VASc Score',
      shortName: 'CHA₂DS₂-VASc',
      category: 'prognostyczne',
      specialty: 'kardiologia',
      description: 'Skala oceny ryzyka udaru u pacjentów z migotaniem przedsionków.',
      purpose: 'Określenie wskazań do antykoagulacji u pacjentów z AF',
      scoring: 'Punkty za: niewydolność serca (1), nadciśnienie (1), wiek ≥75 lat (2), cukrzyca (1), udar/TIA (2), choroba naczyniowa (1), wiek 65-74 (1), płeć żeńska (1)',
      interpretation: '0 pkt (bardzo niskie), 1 pkt (niskie), ≥2 pkt (wysokie ryzyko - wskazana antykoagulacja)',
      ageGroup: 'dorośli',
      popularity: 92,
      difficulty: 'łatwa',
      tags: ['migotanie przedsionków', 'udar', 'antykoagulacja', 'AF']
    },
    {
      id: 'nyha',
      name: 'Klasyfikacja NYHA',
      shortName: 'NYHA',
      category: 'ocena_stanu',
      specialty: 'kardiologia',
      description: 'Klasyfikacja funkcjonalna niewydolności serca według objawów.',
      purpose: 'Ocena stopnia ograniczenia funkcjonalnego w niewydolności serca',
      scoring: 'Klasa I-IV w zależności od tolerancji wysiłku i objawów',
      interpretation: 'I - bez objawów, II - objawy przy większym wysiłku, III - objawy przy małym wysiłku, IV - objawy w spoczynku',
      ageGroup: 'dorośli',
      popularity: 88,
      difficulty: 'łatwa',
      tags: ['niewydolność serca', 'wysiłek', 'duszność', 'HF']
    },

    // NEUROLOGIA
    {
      id: 'glasgow',
      name: 'Glasgow Coma Scale',
      shortName: 'GCS',
      category: 'ocena_stanu',
      specialty: 'neurologia',
      description: 'Skala oceny poziomu świadomości pacjenta.',
      purpose: 'Obiektywna ocena stanu świadomości i funkcji neurologicznych',
      scoring: 'Otwieranie oczu (1-4), odpowiedź słowna (1-5), odpowiedź ruchowa (1-6)',
      interpretation: '15 pkt (prawidłowa), 13-14 (łagodne), 9-12 (umiarkowane), ≤8 (ciężkie uszkodzenie)',
      ageGroup: 'dorośli',
      popularity: 98,
      difficulty: 'łatwa',
      tags: ['świadomość', 'uraz głowy', 'śpiączka', 'neurologia']
    },
    {
      id: 'nihss',
      name: 'National Institutes of Health Stroke Scale',
      shortName: 'NIHSS',
      category: 'diagnostyczne',
      specialty: 'neurologia',
      description: 'Skala oceny ciężkości udaru mózgu.',
      purpose: 'Szybka ocena deficytów neurologicznych w udarze',
      scoring: '15 parametrów neurologicznych, łącznie 0-42 punkty',
      interpretation: '0 pkt (brak), 1-4 (łagodny), 5-15 (umiarkowany), 16-20 (ciężki), >20 (bardzo ciężki)',
      ageGroup: 'dorośli',
      popularity: 90,
      difficulty: 'trudna',
      tags: ['udar mózgu', 'deficyty neurologiczne', 'tromboliza']
    },
    {
      id: 'mmse',
      name: 'Mini-Mental State Examination',
      shortName: 'MMSE',
      category: 'diagnostyczne',
      specialty: 'neurologia',
      description: 'Skala przesiewowa oceny funkcji poznawczych.',
      purpose: 'Wstępna ocena zaburzeń poznawczych i demencji',
      scoring: '30 punktów w 6 kategoriach: orientacja, zapamiętywanie, uwaga, przypominanie, język, konstrukcja',
      interpretation: '24-30 pkt (norma), 18-23 (łagodne), 0-17 (ciężkie zaburzenia)',
      ageGroup: 'dorośli',
      popularity: 85,
      difficulty: 'średnia',
      tags: ['demencja', 'funkcje poznawcze', 'pamięć', 'Alzheimer']
    },

    // PEDIATRIA
    {
      id: 'apgar',
      name: 'Skala Apgar',
      shortName: 'APGAR',
      category: 'ocena_stanu',
      specialty: 'pediatria',
      description: 'Ocena stanu noworodka w pierwszych minutach życia.',
      purpose: 'Szybka ocena żywotności noworodka i potrzeby resuscytacji',
      scoring: '5 parametrów po 0-2 punkty: tętno, oddech, napięcie mięśniowe, odruch, barwa skóry',
      interpretation: '8-10 pkt (dobry stan), 4-7 (średni), 0-3 (ciężki stan)',
      ageGroup: 'noworodki',
      popularity: 100,
      difficulty: 'łatwa',
      tags: ['noworodek', 'poród', 'resuscytacja', 'żywotność']
    },
    {
      id: 'pediatric-gcs',
      name: 'Pediatric Glasgow Coma Scale',
      shortName: 'Pediatric GCS',
      category: 'ocena_stanu',
      specialty: 'pediatria',
      description: 'Modyfikacja GCS dla dzieci poniżej 5 roku życia.',
      purpose: 'Ocena stanu świadomości u małych dzieci',
      scoring: 'Podobnie do GCS dla dorosłych, ale dostosowane do rozwoju dziecka',
      interpretation: 'Podobnie jak GCS: 15 (norma), 13-14 (łagodne), 9-12 (umiarkowane), ≤8 (ciężkie)',
      ageGroup: 'dzieci',
      popularity: 82,
      difficulty: 'średnia',
      tags: ['pediatria', 'świadomość', 'uraz głowy', 'dzieci']
    },

    // INTENSYWNA TERAPIA
    {
      id: 'apache-ii',
      name: 'Acute Physiology and Chronic Health Evaluation II',
      shortName: 'APACHE II',
      category: 'prognostyczne',
      specialty: 'intensywna',
      description: 'Ocena ciężkości stanu i przewidywanie śmiertelności w ICU.',
      purpose: 'Prognozowanie śmiertelności pacjentów w intensywnej terapii',
      scoring: 'Parametry fizjologiczne (0-60), wiek (0-6), choroby przewlekłe (0-5)',
      interpretation: 'Im wyższy wynik, tym większe ryzyko śmiertelności',
      ageGroup: 'dorośli',
      popularity: 75,
      difficulty: 'trudna',
      tags: ['ICU', 'śmiertelność', 'prognoza', 'intensywna terapia']
    },
    {
      id: 'sofa',
      name: 'Sequential Organ Failure Assessment',
      shortName: 'SOFA',
      category: 'prognostyczne',
      specialty: 'intensywna',
      description: 'Ocena niewydolności narządowej w sepsis.',
      purpose: 'Monitorowanie ewolucji niewydolności narządowej',
      scoring: '6 układów narządowych po 0-4 punkty każdy',
      interpretation: 'Wzrost o ≥2 punkty wskazuje na sepsę',
      ageGroup: 'dorośli',
      popularity: 88,
      difficulty: 'średnia',
      tags: ['sepsa', 'niewydolność narządowa', 'ICU', 'qSOFA']
    },

    // SKALE BÓLU
    {
      id: 'vas',
      name: 'Visual Analogue Scale',
      shortName: 'VAS',
      category: 'bolu',
      specialty: 'wszystkie',
      description: 'Wizualna skala analogowa do oceny natężenia bólu.',
      purpose: 'Subiektywna ocena natężenia bólu przez pacjenta',
      scoring: 'Linia 10 cm: 0 (brak bólu) do 10 (najsilniejszy ból)',
      interpretation: '0-3 (łagodny), 4-6 (umiarkowany), 7-10 (silny ból)',
      ageGroup: 'dorośli',
      popularity: 95,
      difficulty: 'łatwa',
      tags: ['ból', 'ocena bólu', 'analgetyki', 'VAS']
    },
    {
      id: 'flacc',
      name: 'Face, Legs, Activity, Cry, Consolability',
      shortName: 'FLACC',
      category: 'bolu',
      specialty: 'pediatria',
      description: 'Skala oceny bólu u dzieci niemówiących.',
      purpose: 'Obiektywna ocena bólu u niemowląt i małych dzieci',
      scoring: '5 kategorii po 0-2 punkty: twarz, nogi, aktywność, płacz, pocieszanie',
      interpretation: '0 (brak), 1-3 (łagodny), 4-6 (umiarkowany), 7-10 (silny ból)',
      ageGroup: 'niemowlęta',
      popularity: 78,
      difficulty: 'średnia',
      tags: ['ból pediatryczny', 'niemowlęta', 'ocena bólu', 'dzieci']
    },

    // PSYCHIATRIA
    {
      id: 'hamilton-depression',
      name: 'Hamilton Depression Rating Scale',
      shortName: 'HAM-D',
      category: 'diagnostyczne',
      specialty: 'psychiatria',
      description: 'Skala oceny ciężkości depresji.',
      purpose: 'Ocena nasilenia objawów depresyjnych',
      scoring: '17 lub 21 pozycji, większość 0-4 punkty',
      interpretation: '0-7 (norma), 8-13 (łagodna), 14-18 (umiarkowana), 19-22 (ciężka), ≥23 (bardzo ciężka)',
      ageGroup: 'dorośli',
      popularity: 70,
      difficulty: 'średnia',
      tags: ['depresja', 'psychiatria', 'nastrój', 'HAM-D']
    },

    // GERIATRIA
    {
      id: 'barthel',
      name: 'Barthel Index',
      shortName: 'Barthel',
      category: 'funkcjonalne',
      specialty: 'geriatria',
      description: 'Ocena samodzielności w czynnościach życia codziennego.',
      purpose: 'Pomiar niezależności funkcjonalnej w ADL',
      scoring: '10 kategorii: jedzenie, kąpanie, higiena, ubieranie, stolec, mocz, toaleta, przesiadanie, chodzenie, schody',
      interpretation: '0-20 (całkowita zależność), 21-60 (ciężka), 61-90 (umiarkowana), 91-99 (lekka), 100 (niezależność)',
      ageGroup: 'geriatryczni',
      popularity: 85,
      difficulty: 'średnia',
      tags: ['ADL', 'samodzielność', 'geriatria', 'rehabilitacja']
    }
  ];

  const filteredScales = medicalScales.filter(scale => {
    const matchesSearch = searchQuery === '' || 
      scale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scale.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scale.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scale.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'wszystkie' || scale.category === selectedCategory;
    const matchesSpecialty = selectedSpecialty === 'wszystkie' || scale.specialty === selectedSpecialty;
    const matchesAgeGroup = selectedAgeGroup === 'wszystkie' || scale.ageGroup === selectedAgeGroup;

    return matchesSearch && matchesCategory && matchesSpecialty && matchesAgeGroup;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('wszystkie');
    setSelectedSpecialty('wszystkie');
    setSelectedAgeGroup('wszystkie');
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : FaStethoscope;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'łatwa': return 'text-green-500';
      case 'średnia': return 'text-yellow-500';
      case 'trudna': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div 
        className="text-white py-16"
        style={{ background: 'linear-gradient(to right, #38b6ff, #2ea3e6)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className={`font-bold mb-4 ${fontClasses.title}`}>
            Skale Medyczne
          </h1>
          <p className={`max-w-3xl mx-auto mb-8 ${fontClasses.subtitle}`}>
            Kompletne kompendium skal medycznych z opisami, interpretacją i praktycznym zastosowaniem. 
            Znajdź odpowiednią skalę dla swojej specjalizacji.
          </p>
          <div className="flex justify-center items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <FaCalculator className="w-5 h-5" />
              <span className={fontClasses.detailText}>{medicalScales.length} skal medycznych</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStethoscope className="w-5 h-5" />
              <span className={fontClasses.detailText}>10+ specjalizacji</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBaby className="w-5 h-5" />
              <span className={fontClasses.detailText}>Wszystkie grupy wiekowe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Szukaj skali medycznej..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${fontClasses.cardText}`}
                style={{ borderColor: '#38b6ff' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${fontClasses.cardText} ${
                showFilters 
                  ? 'text-white' 
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={showFilters ? { backgroundColor: '#38b6ff' } : {}}
            >
              <FaFilter className="w-4 h-4" />
              Filtry
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${fontClasses.detailText} ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                  style={selectedCategory === category.id ? { backgroundColor: '#38b6ff' } : {}}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={`block mb-2 font-medium ${fontClasses.detailText}`}>Specjalizacja</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontClasses.detailText}`}
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty === 'wszystkie' ? 'Wszystkie' : specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${fontClasses.detailText}`}>Grupa wiekowa</label>
                  <select
                    value={selectedAgeGroup}
                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontClasses.detailText}`}
                  >
                    {ageGroups.map(group => (
                      <option key={group} value={group}>
                        {group === 'wszystkie' ? 'Wszystkie' : group.charAt(0).toUpperCase() + group.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className={`w-full p-2 rounded-lg transition-colors ${fontClasses.detailText} ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Wyczyść filtry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Counter */}
          <div className={`mt-4 ${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Znaleziono {filteredScales.length} z {medicalScales.length} skal
          </div>
        </div>
      </div>

      {/* Scales Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredScales.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaStethoscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`font-semibold mb-2 ${fontClasses.cardTitle}`}>Nie znaleziono skal</h3>
            <p className={fontClasses.cardText}>Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScales.map((scale) => {
              const IconComponent = getCategoryIcon(scale.category);
              return (
                <div
                  key={scale.id}
                  className={`rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedScale(scale)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: 'rgba(56, 182, 255, 0.1)' }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: '#38b6ff' }} />
                        </div>
                        <div>
                          <h3 className={`font-bold ${fontClasses.cardTitle}`}>
                            {scale.shortName}
                          </h3>
                          <p className={`${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {scale.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className={`${fontClasses.detailText} text-yellow-600`}>
                          {(scale.popularity / 10).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <h4 className={`font-semibold mb-2 ${fontClasses.cardText}`}>
                      {scale.name}
                    </h4>

                    <p className={`${fontClasses.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                      {scale.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {scale.ageGroup}
                      </span>
                      <span className={`text-xs font-medium ${getDifficultyColor(scale.difficulty)}`}>
                        {scale.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {scale.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                        {scale.tags.length > 2 && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            +{scale.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <FaChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scale Detail Modal */}
      {selectedScale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className={`font-bold ${fontClasses.cardTitle}`}>
                  {selectedScale.name}
                </h2>
                <p className={`${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedScale.shortName} • {selectedScale.specialty}
                </p>
              </div>
              <button
                onClick={() => setSelectedScale(null)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontClasses.cardText}`}>Opis</h3>
                    <p className={`${fontClasses.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedScale.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontClasses.cardText}`}>Cel zastosowania</h3>
                    <p className={`${fontClasses.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedScale.purpose}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontClasses.cardText}`}>Punktacja</h3>
                    <p className={`${fontClasses.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedScale.scoring}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontClasses.cardText}`}>Interpretacja wyników</h3>
                    <div className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
                    }`}>
                      <p className={`${fontClasses.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedScale.interpretation}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontClasses.cardText}`}>Parametry skali</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Kategoria
                        </div>
                        <div className={`${fontClasses.cardText} font-medium`}>
                          {categories.find(cat => cat.id === selectedScale.category)?.name}
                        </div>
                      </div>
                      <div>
                        <div className={`${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Grupa wiekowa
                        </div>
                        <div className={`${fontClasses.cardText} font-medium`}>
                          {selectedScale.ageGroup}
                        </div>
                      </div>
                      <div>
                        <div className={`${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Trudność
                        </div>
                        <div className={`${fontClasses.cardText} font-medium ${getDifficultyColor(selectedScale.difficulty)}`}>
                          {selectedScale.difficulty}
                        </div>
                      </div>
                      <div>
                        <div className={`${fontClasses.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Popularność
                        </div>
                        <div className={`${fontClasses.cardText} font-medium`} style={{ color: '#38b6ff' }}>
                          {(selectedScale.popularity / 10).toFixed(1)}/10
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontClasses.cardText}`}>Tagi</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScale.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full ${fontClasses.detailText}`}
                          style={{ backgroundColor: 'rgba(56, 182, 255, 0.1)', color: '#38b6ff' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <button
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors text-white ${fontClasses.cardText}`}
                    style={{ backgroundColor: '#38b6ff' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ea3e6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
                  >
                    Użyj skalę w kalkulatorze
                  </button>
                  <button
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${fontClasses.cardText} ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pobierz PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalScalesPage;