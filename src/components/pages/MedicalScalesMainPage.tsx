import React, { useState, useMemo } from 'react';
import { Search, Calculator, ChevronRight, BookOpen, Heart, Brain, Stethoscope, Activity, Target, Zap, Clipboard, Baby, Thermometer, Shield, Eye, Flame, Users, TrendingUp } from 'lucide-react';

interface MedicalScale {
  id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  usage: string;
  icon: React.ReactNode;
  color: string;
}

const medicalScales: MedicalScale[] = [
  {
    id: 'asa',
    name: 'ASA',
    fullName: 'Skala ASA (American Society of Anesthesiologists)',
    category: 'A',
    description: 'Skala ASA służy do klasyfikacji stanu fizycznego pacjenta przed zabiegiem anestezjologicznym i chirurgicznym',
    usage: 'Ocena ryzyka przedoperacyjnego pacjenta',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-400 to-pink-500'
  },
  {
    id: 'bristol',
    name: 'Bristol',
    fullName: 'Bristolska skala uformowania stolca',
    category: 'B',
    description: 'Standardowa skala wizualna do oceny formy i konsystencji stolca, używana w diagnostyce zaburzeń jelitowych',
    usage: 'Ocena konsystencji stolca w gastroenterologii',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'gds',
    name: 'GDS',
    fullName: 'Geriatryczna Skala Depresji',
    category: 'G',
    description: 'Narzędzie do wstępnej oceny objawów depresyjnych u pacjentów geriatrycznych (65+)',
    usage: 'Przesiewowa ocena depresji u osób starszych',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'killip',
    name: 'Killip-Kimball',
    fullName: 'Klasyfikacja Killipa-Kimball',
    category: 'K',
    description: 'Klasyfikacja niewydolności serca w ostrym zawale mięśnia sercowego według objawów klinicznych',
    usage: 'Ocena stopnia niewydolności serca w ostrym zespole wieńcowym',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'lown',
    name: 'Lown',
    fullName: 'Klasyfikacja Lown dodatkowych skurczów komorowych',
    category: 'L',
    description: 'Klasyfikacja prognostyczna dodatkowych skurczów komorowych (VPC/VES) w arytmologii',
    usage: 'Stratyfikacja ryzyka w arytmiach komorowych',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'tnm',
    name: 'TNM',
    fullName: 'Klasyfikacja TNM nowotworów złośliwych',
    category: 'T',
    description: 'Międzynarodowy standard opisu anatomicznego zasięgu nowotworów złośliwych',
    usage: 'Określenie stopnia zaawansowania nowotworów złośliwych',
    icon: <Target className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'ranson',
    name: 'Ranson',
    fullName: 'Kryteria Ransona',
    category: 'R',
    description: 'Prognostyczna ocena ciężkości ostrego zapalenia trzustki oparta na kryteriach klinicznych i laboratoryjnych',
    usage: 'Ocena ciężkości i rokowania w ostrym zapaleniu trzustki',
    icon: <Clipboard className="w-6 h-6" />,
    color: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'mmse',
    name: 'MMSE',
    fullName: 'Mini-Mental State Examination',
    category: 'M',
    description: 'Najczęściej używany test przesiewowy do oceny funkcji poznawczych i demencji',
    usage: 'Przesiewowa ocena funkcji poznawczych',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'pediatric-gcs',
    name: 'Pediatryczna GCS',
    fullName: 'Pediatryczna Skala Glasgow',
    category: 'P',
    description: 'Modyfikacja skali Glasgow dostosowana do możliwości rozwojowych małych dzieci (poniżej 2 lat)',
    usage: 'Ocena stanu świadomości u dzieci',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-pink-400 to-purple-500'
  },
  {
    id: 'aldreta',
    name: 'Aldreta',
    fullName: 'Skala Aldreta',
    category: 'A',
    description: 'Ocena gotowości pacjenta do wypisu z pooperacyjnej sali wybudzeniowej po anestezji',
    usage: 'Ocena stanu pooperacyjnego pacjenta',
    icon: <Thermometer className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'alvarado',
    name: 'Alvarado',
    fullName: 'Skala Alvarado',
    category: 'A',
    description: 'Ocena prawdopodobieństwa ostrego zapalenia wyrostka robaczkowego na podstawie objawów klinicznych',
    usage: 'Diagnostyka ostrego zapalenia wyrostka',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'apfel',
    name: 'Apfel',
    fullName: 'Skala Apfel',
    category: 'A',
    description: 'Ocena ryzyka pooperacyjnych nudności i wymiotów (PONV) na podstawie czynników ryzyka pacjenta',
    usage: 'Prewencja PONV w anestezjologii',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-indigo-400 to-purple-500'
  },
  {
    id: 'apgar',
    name: 'Apgar',
    fullName: 'Skala Apgar',
    category: 'A',
    description: 'Standardowa skala do szybkiej oceny stanu noworodka w pierwszych minutach życia po porodzie',
    usage: 'Ocena stanu klinicznego noworodka',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 'avpu',
    name: 'AVPU',
    fullName: 'Skala AVPU',
    category: 'A',
    description: 'Uproszczona skala do szybkiej oceny poziomu świadomości w stanach nagłych i ratownictwie medycznym',
    usage: 'Ocena poziomu świadomości',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'biaterveld',
    name: 'Biäterveld',
    fullName: 'Skala Biäterveld',
    category: 'B',
    description: 'Radiologiczna skala do oceny zaawansowania śródmiąższowej choroby płuc na podstawie RTG klatki piersiowej',
    usage: 'Ocena zmian śródmiąższowych płuc',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-teal-400 to-blue-500'
  },
  {
    id: 'bishop',
    name: 'Bishop',
    fullName: 'Skala Bishopa',
    category: 'B',
    description: 'Ocena dojrzałości szyjki macicy i gotowości do indukcji porodu na podstawie badania ginekologicznego',
    usage: 'Kwalifikacja do indukcji porodu',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-rose-400 to-pink-500'
  },
  {
    id: 'burch-wartofksy',
    name: 'Burch-Wartofsky',
    fullName: 'Skala Burch-Wartofsky\'ego',
    category: 'B',
    description: 'Diagnostyka przełomu tarczycowego na podstawie objawów klinicznych i laboratoryjnych',
    usage: 'Diagnostyka przełomu tarczycowego',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'ccs',
    name: 'CCS',
    fullName: 'Skala CCS (Canadian Cardiovascular Society)',
    category: 'C',
    description: 'Klasyfikacja nasilenia dławicy piersiowej według ograniczeń funkcjonalnych pacjenta',
    usage: 'Ocena stopnia dławicy piersiowej',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-400 to-pink-600'
  },
  {
    id: 'ceap',
    name: 'CEAP',
    fullName: 'Klasyfikacja CEAP',
    category: 'C',
    description: 'Międzynarodowa standardowa klasyfikacja przewlekłej choroby żył kończyn dolnych',
    usage: 'Kompleksowa ocena żylaków i niewydolności żylnej',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'centor',
    name: 'Centor',
    fullName: 'Skala Centora',
    category: 'C',
    description: 'Ocena prawdopodobieństwa paciorkowcowego zapalenia gardła na podstawie objawów klinicznych',
    usage: 'Diagnostyka paciorkowcowego zapalenia gardła',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-green-400 to-teal-500'
  },
  {
    id: 'chads',
    name: 'CHADS',
    fullName: 'Skala CHADS',
    category: 'C',
    description: 'Ocena ryzyka udaru mózgu u pacjentów z migotaniem przedsionków (poprzednik CHA₂DS₂-VASc)',
    usage: 'Ocena ryzyka udaru w migotaniu przedsionków',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'child-pugh',
    name: 'Child-Pugh',
    fullName: 'Skala Child-Pugha',
    category: 'C',
    description: 'Ocena funkcji wątroby i rokowania u pacjentów z marskością wątroby',
    usage: 'Ocena stopnia zaawansowania marskości wątroby',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'iss',
    name: 'ISS',
    fullName: 'Injury Severity Score',
    category: 'I',
    description: 'Skala ciężkości urazów do oceny wielonarządowych obrażeń pourazowych',
    usage: 'Ocena ciężkości wielonarządowych obrażeń urazowych',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-red-400 to-orange-500'
  },
  {
    id: 'beck-depression',
    name: 'Beck Depression',
    fullName: 'Skala Depresji Becka (BDI)',
    category: 'B',
    description: 'Samoocena nasilenia objawów depresyjnych w ciągu ostatnich dwóch tygodni',
    usage: 'Samoocena nasilenia objawów depresyjnych',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-indigo-400 to-purple-500'
  }
];

const categories = ['A', 'B', 'C', 'G', 'I', 'K', 'L', 'M', 'P', 'R', 'S', 'T', 'W'];

const MedicalScalesMainPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredScales = useMemo(() => {
    let filtered = medicalScales;

    if (searchQuery) {
      filtered = filtered.filter(scale =>
        scale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scale.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scale.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(scale => scale.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleScaleClick = (scaleId: string) => {
    window.history.pushState({}, '', `/skale-medyczne/${scaleId}`);
    // Trigger popstate event to update the App component
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Skale medyczne
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Kolekcja najważniejszych skal i kalkulatorów medycznych
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
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Wyszukaj skalę medyczną..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-xl shadow-sm bg-white p-1 border border-gray-200">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedCategory === ''
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Wszystkie
              </button>
              {categories.map(category => {
                const hasScales = medicalScales.some(scale => scale.category === category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    disabled={!hasScales}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : hasScales
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Dostępne skale</p>
                <p className="text-2xl font-bold text-gray-900">{medicalScales.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Kategorie</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(cat => medicalScales.some(scale => scale.category === cat)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Specjalizacje</p>
                <p className="text-2xl font-bold text-gray-900">12+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScales.map(scale => (
            <div
              key={scale.id}
              onClick={() => handleScaleClick(scale.id)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className={`h-2 bg-gradient-to-r ${scale.color}`} />
              
              <div className="p-6">
                {/* Icon and Category */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${scale.color} bg-opacity-10 rounded-lg`}>
                    <div className={`bg-gradient-to-r ${scale.color} bg-clip-text text-transparent`}>
                      {scale.icon}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    Kategoria {scale.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {scale.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  {scale.fullName}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {scale.description}
                </p>

                {/* Usage */}
                <div className="mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Zastosowanie:</span>
                  <p className="text-sm text-gray-700 mt-1">{scale.usage}</p>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Otwórz kalkulator
                  </span>
                  <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredScales.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nie znaleziono skal
            </h3>
            <p className="text-gray-500">
              Spróbuj zmienić kryteria wyszukiwania
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalScalesMainPage;