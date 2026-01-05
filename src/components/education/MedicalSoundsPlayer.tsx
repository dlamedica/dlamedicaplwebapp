import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  VolumeUpIcon, 
  VolumeMuteIcon, 
  HeartIcon, 
  LungsIcon,
  RedoIcon,
  CheckIcon,
  TimesIcon,
  BookmarkIcon,
  LocationIcon
} from '../icons/PlatformIcons';
import { StatsIcon as ChartLineIcon, TrophyIcon } from '../icons/CustomIcons';
import { QuestionCircleIcon } from './icons/EducationIcons';
import { RippleButton, CountUp, AnimatedSection } from './components';
import './styles/educationStyles.css';

interface MedicalSoundsPlayerProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface SoundCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  sounds: Sound[];
}

interface Sound {
  id: string;
  name: string;
  description: string;
  audioUrl?: string;
  duration?: number;
  phase?: 'inhalation' | 'exhalation' | 'both'; // Faza oddechu
  location?: string; // Lokalizacja osłuchiwania
  pathology?: string; // Patologia
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QuizQuestion {
  sound: Sound;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

const MedicalSoundsPlayer: React.FC<MedicalSoundsPlayerProps> = ({ darkMode, fontSize }) => {
  const [selectedCategory, setSelectedCategory] = useState<'heart' | 'lungs'>('heart');
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<'learn' | 'quiz' | 'compare'>('learn');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterPhase, setFilterPhase] = useState<'all' | 'inhalation' | 'exhalation' | 'both'>('all');
  const [compareSound1, setCompareSound1] = useState<Sound | null>(null);
  const [compareSound2, setCompareSound2] = useState<Sound | null>(null);
  const [stats, setStats] = useState({
    soundsPlayed: 0,
    quizAttempts: 0,
    quizBestScore: 0,
    timeSpent: 0,
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const heartSounds: Sound[] = [
    {
      id: 'heart-normal',
      name: 'Ton serca - normalny',
      description: 'Prawidłowe tony serca S1 i S2',
      duration: 10,
      difficulty: 'easy',
    },
    {
      id: 'heart-murmur-systolic',
      name: 'Szmery skurczowe',
      description: 'Szmery występujące podczas skurczu serca',
      duration: 12,
      pathology: 'Niedomykalność zastawki mitralnej, zwężenie zastawki aortalnej',
      difficulty: 'medium',
    },
    {
      id: 'heart-murmur-diastolic',
      name: 'Szmery rozkurczowe',
      description: 'Szmery występujące podczas rozkurczu serca',
      duration: 12,
      pathology: 'Zwężenie zastawki mitralnej, niedomykalność zastawki aortalnej',
      difficulty: 'medium',
    },
    {
      id: 'heart-gallop',
      name: 'Galop serca (S3, S4)',
      description: 'Dodatkowe tony serca - galop',
      duration: 10,
      pathology: 'Niewydolność serca, kardiomiopatia',
      difficulty: 'hard',
    },
    {
      id: 'heart-arrhythmia',
      name: 'Arytmia',
      description: 'Nieregularne tony serca',
      duration: 15,
      pathology: 'Migotanie przedsionków, ekstrasystole',
      difficulty: 'hard',
    },
    {
      id: 'heart-mitral-stenosis',
      name: 'Zwężenie zastawki mitralnej',
      description: 'Charakterystyczny szmer przy zwężeniu zastawki mitralnej',
      duration: 12,
      location: 'Szczyt serca (apex)',
      pathology: 'Zwężenie zastawki mitralnej',
      difficulty: 'hard',
    },
    {
      id: 'heart-aortic-stenosis',
      name: 'Zwężenie zastawki aortalnej',
      description: 'Charakterystyczny szmer przy zwężeniu zastawki aortalnej',
      duration: 12,
      location: 'Punkt Erba, prawy górny brzeg mostka',
      pathology: 'Zwężenie zastawki aortalnej',
      difficulty: 'hard',
    },
    {
      id: 'heart-mitral-regurgitation',
      name: 'Niedomykalność zastawki mitralnej',
      description: 'Szmery przy niedomykalności zastawki mitralnej',
      duration: 12,
      location: 'Szczyt serca (apex)',
      pathology: 'Niedomykalność zastawki mitralnej',
      difficulty: 'hard',
    },
  ];

  const lungSounds: Sound[] = [
    {
      id: 'lungs-normal-inhalation',
      name: 'Oddech prawidłowy - wdech',
      description: 'Prawidłowe szmery oddechowe pęcherzykowe podczas wdechu',
      duration: 8,
      phase: 'inhalation',
      location: 'Cała powierzchnia płuc',
      difficulty: 'easy',
    },
    {
      id: 'lungs-normal-exhalation',
      name: 'Oddech prawidłowy - wydech',
      description: 'Prawidłowe szmery oddechowe podczas wydechu',
      duration: 8,
      phase: 'exhalation',
      location: 'Cała powierzchnia płuc',
      difficulty: 'easy',
    },
    {
      id: 'lungs-wheezing-inhalation',
      name: 'Świsty - wdech',
      description: 'Świszczące dźwięki podczas wdechu',
      duration: 10,
      phase: 'inhalation',
      pathology: 'Astma, POChP, obrzęk płuc',
      difficulty: 'medium',
    },
    {
      id: 'lungs-wheezing-exhalation',
      name: 'Świsty - wydech',
      description: 'Świszczące dźwięki podczas wydechu (częstsze)',
      duration: 10,
      phase: 'exhalation',
      pathology: 'Astma, POChP, obrzęk płuc',
      location: 'Głównie w dolnych polach płucnych',
      difficulty: 'medium',
    },
    {
      id: 'lungs-rales-fine',
      name: 'Rzężenia drobnobańkowe - wdech',
      description: 'Drobne trzeszczenia słyszalne podczas wdechu',
      duration: 10,
      phase: 'inhalation',
      pathology: 'Zapalenie płuc, obrzęk płuc, włóknienie',
      location: 'Dolne pola płucne',
      difficulty: 'medium',
    },
    {
      id: 'lungs-rales-coarse',
      name: 'Rzężenia grubobańkowe - wdech',
      description: 'Grube trzeszczenia słyszalne podczas wdechu',
      duration: 10,
      phase: 'inhalation',
      pathology: 'Zapalenie płuc, obrzęk płuc, rozstrzenie oskrzeli',
      location: 'Dolne pola płucne',
      difficulty: 'medium',
    },
    {
      id: 'lungs-ronchi',
      name: 'Rzężenia suche (ronchi)',
      description: 'Niskie, świszczące dźwięki',
      duration: 10,
      phase: 'both',
      pathology: 'POChP, zapalenie oskrzeli, mukowiscydoza',
      location: 'Głównie w oskrzelach',
      difficulty: 'medium',
    },
    {
      id: 'lungs-stridor',
      name: 'Stridor - wdech',
      description: 'Głośny, świszczący dźwięk podczas wdechu',
      duration: 10,
      phase: 'inhalation',
      pathology: 'Zwężenie górnych dróg oddechowych, ciało obce',
      location: 'Górne drogi oddechowe',
      difficulty: 'hard',
    },
    {
      id: 'lungs-pleural-friction',
      name: 'Tarcie opłucnowe',
      description: 'Charakterystyczne tarcie przy zapaleniu opłucnej',
      duration: 10,
      phase: 'both',
      pathology: 'Zapalenie opłucnej, zawał płuca',
      location: 'Boczne powierzchnie klatki piersiowej',
      difficulty: 'hard',
    },
    {
      id: 'lungs-absent',
      name: 'Brak szmerów oddechowych',
      description: 'Osłabione lub brak szmerów oddechowych',
      duration: 8,
      phase: 'both',
      pathology: 'Odma opłucnowa, wysięk opłucnowy, niedodma',
      location: 'Obszar patologii',
      difficulty: 'hard',
    },
  ];

  const categories: SoundCategory[] = [
    {
      id: 'heart',
      name: 'Odgłosy serca',
      icon: <HeartIcon className="text-red-500" size={24} />,
      sounds: heartSounds,
    },
    {
      id: 'lungs',
      name: 'Odgłosy płuc',
      icon: <LungsIcon className="text-blue-500" size={24} />,
      sounds: lungSounds,
    },
  ];

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl',
          subtitle: 'text-base',
          text: 'text-sm',
          button: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-3xl',
          subtitle: 'text-xl',
          text: 'text-lg',
          button: 'text-lg',
        };
      default:
        return {
          title: 'text-2xl',
          subtitle: 'text-lg',
          text: 'text-base',
          button: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedSound]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('medicalSoundsStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedFavorites = localStorage.getItem('medicalSoundsFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('medicalSoundsStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('medicalSoundsFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !selectedSound) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      setStats(prev => ({ ...prev, soundsPlayed: prev.soundsPlayed + 1 }));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSoundSelect = (sound: Sound) => {
    setSelectedSound(sound);
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (audioRef.current) {
      // audioRef.current.src = sound.audioUrl || '';
      // audioRef.current.load();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = (soundId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(soundId)) {
        newFavorites.delete(soundId);
      } else {
        newFavorites.add(soundId);
      }
      return newFavorites;
    });
  };

  const startQuiz = () => {
    const allSounds = selectedCategory === 'heart' ? heartSounds : lungSounds;
    const shuffled = [...allSounds].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const questions: QuizQuestion[] = shuffled.map(sound => {
      const otherSounds = allSounds.filter(s => s.id !== sound.id);
      const wrongAnswers = [...otherSounds]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => s.name);
      
      const options = [sound.name, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        sound,
        options,
        correctAnswer: sound.name,
      };
    });
    
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedSound(questions[0].sound);
    setMode('quiz');
    setStats(prev => ({ ...prev, quizAttempts: prev.quizAttempts + 1 }));
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizCompleted) return;
    
    const question = quizQuestions[currentQuizIndex];
    const isCorrect = answer === question.correctAnswer;
    
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuizIndex] = {
      ...question,
      userAnswer: answer,
      isCorrect,
    };
    setQuizQuestions(updatedQuestions);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedSound(updatedQuestions[currentQuizIndex + 1].sound);
        setIsPlaying(false);
        setCurrentTime(0);
      } else {
        setQuizCompleted(true);
        setStats(prev => ({
          ...prev,
          quizBestScore: Math.max(prev.quizBestScore, quizScore + (isCorrect ? 1 : 0)),
        }));
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedSound(null);
    setMode('learn');
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  let filteredSounds = currentCategory?.sounds || [];
  
  if (selectedCategory === 'lungs' && filterPhase !== 'all') {
    filteredSounds = filteredSounds.filter(sound => sound.phase === filterPhase || sound.phase === 'both');
  }

  const favoriteSounds = filteredSounds.filter(s => favorites.has(s.id));

  return (
    <AnimatedSection animation="fadeIn" delay={0}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`${fontSizes.title} font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Odsłuchiwanie odgłosów medycznych
              </h1>
              <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Ucz się rozpoznawać odgłosy serca i płuc - narzędzie edukacyjne dla studentów medycyny i ratowników medycznych
              </p>
            </div>
            <div className="flex items-center gap-4">
              <RippleButton
                onClick={() => {
                  window.history.pushState({}, '', '/edukacja');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                variant="outline"
                darkMode={darkMode}
                className="px-4 py-2 rounded-lg font-medium"
              >
                ← Powrót
              </RippleButton>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-4 mb-6">
            <RippleButton
              onClick={() => setMode('learn')}
              variant={mode === 'learn' ? 'primary' : 'outline'}
              darkMode={darkMode}
              className={`px-6 py-3 rounded-lg font-semibold ${fontSizes.button}`}
            >
              <BookmarkIcon className="inline mr-2" size={18} />
              Nauka
            </RippleButton>
            <RippleButton
              onClick={() => setMode('quiz')}
              variant={mode === 'quiz' ? 'primary' : 'outline'}
              darkMode={darkMode}
              className={`px-6 py-3 rounded-lg font-semibold ${fontSizes.button}`}
            >
              <QuestionCircleIcon className="inline mr-2" size={18} />
              Quiz
            </RippleButton>
            <RippleButton
              onClick={() => setMode('compare')}
              variant={mode === 'compare' ? 'primary' : 'outline'}
              darkMode={darkMode}
              className={`px-6 py-3 rounded-lg font-semibold ${fontSizes.button}`}
            >
              <ChartLineIcon className="inline mr-2" size={18} />
              Porównanie
            </RippleButton>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id as 'heart' | 'lungs');
                  setSelectedSound(null);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#38b6ff] text-black shadow-lg'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } ${fontSizes.button}`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* Phase Filter for Lungs */}
          {selectedCategory === 'lungs' && (
            <div className="flex gap-2 mb-6">
              <span className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} self-center mr-2`}>
                Faza oddechu:
              </span>
              {(['all', 'inhalation', 'exhalation', 'both'] as const).map((phase) => (
                <button
                  key={phase}
                  onClick={() => setFilterPhase(phase)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterPhase === phase
                      ? 'bg-[#38b6ff] text-black'
                      : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {phase === 'all' ? 'Wszystkie' : phase === 'inhalation' ? 'Wdech' : phase === 'exhalation' ? 'Wydech' : 'Oba'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Mode */}
        {mode === 'quiz' && (
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 mb-6`}>
            {quizQuestions.length === 0 ? (
              <div className="text-center py-8">
                <QuestionCircleIcon className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                <h3 className={`${fontSizes.subtitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Rozpocznij quiz
                </h3>
                <p className={`${fontSizes.text} mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Odsłuchaj odgłos i wybierz prawidłową odpowiedź. Quiz składa się z 10 pytań.
                </p>
                <RippleButton
                  onClick={startQuiz}
                  variant="primary"
                  darkMode={darkMode}
                  className="px-8 py-3 rounded-lg font-semibold"
                >
                  Rozpocznij quiz
                </RippleButton>
              </div>
            ) : quizCompleted ? (
              <div className="text-center py-8">
                <TrophyIcon className={`mx-auto mb-4 text-yellow-500`} size={64} />
                <h3 className={`${fontSizes.subtitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quiz zakończony!
                </h3>
                <p className={`${fontSizes.text} mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Twój wynik: <span className="font-bold text-[#38b6ff]"><CountUp end={quizScore} duration={1000} /> / {quizQuestions.length}</span>
                </p>
                <p className={`${fontSizes.text} mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Procent poprawnych odpowiedzi: <CountUp end={Math.round((quizScore / quizQuestions.length) * 100)} duration={1500} />%
                </p>
                <div className="flex gap-4 justify-center">
                  <RippleButton
                    onClick={resetQuiz}
                    variant="primary"
                    darkMode={darkMode}
                    className="px-6 py-2 rounded-lg font-semibold"
                  >
                    <RedoIcon className="inline mr-2" size={18} />
                    Spróbuj ponownie
                  </RippleButton>
                  <button
                    onClick={() => setMode('learn')}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                  >
                    Powrót do nauki
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pytanie {currentQuizIndex + 1} z {quizQuestions.length}
                    </p>
                    <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Wynik: {quizScore} / {currentQuizIndex + 1}
                    </p>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors duration-200"
                  >
                    Anuluj quiz
                  </button>
                </div>
                <div className="mb-4">
                  <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Odsłuchaj odgłos i wybierz prawidłową odpowiedź:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                      const question = quizQuestions[currentQuizIndex];
                      const isSelected = question.userAnswer === option;
                      const isCorrect = option === question.correctAnswer;
                      const showResult = question.userAnswer !== undefined;
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(option)}
                          disabled={showResult}
                          className={`p-4 rounded-lg font-medium text-left transition-all duration-200 ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-500 text-white'
                                : isSelected
                                ? 'bg-red-500 text-white'
                                : darkMode
                                ? 'bg-gray-700 text-gray-400'
                                : 'bg-gray-200 text-gray-600'
                              : darkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          } ${fontSizes.text}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showResult && (
                              <>
                                {isCorrect && <CheckIcon className="text-white" size={16} />}
                                {isSelected && !isCorrect && <TimesIcon className="text-white" size={16} />}
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compare Mode */}
        {mode === 'compare' && (
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 mb-6`}>
            <h3 className={`${fontSizes.subtitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Porównaj dwa odgłosy
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className={`${fontSizes.text} mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Odgłos 1:
                </p>
                <select
                  value={compareSound1?.id || ''}
                  onChange={(e) => {
                    const sound = filteredSounds.find(s => s.id === e.target.value);
                    setCompareSound1(sound || null);
                  }}
                  className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                >
                  <option value="">Wybierz odgłos...</option>
                  {filteredSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>{sound.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className={`${fontSizes.text} mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Odgłos 2:
                </p>
                <select
                  value={compareSound2?.id || ''}
                  onChange={(e) => {
                    const sound = filteredSounds.find(s => s.id === e.target.value);
                    setCompareSound2(sound || null);
                  }}
                  className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                >
                  <option value="">Wybierz odgłos...</option>
                  {filteredSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>{sound.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {compareSound1 && compareSound2 && (
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {compareSound1.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {compareSound1.description}
                  </p>
                  {compareSound1.pathology && (
                    <p className={`text-sm mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Patologia: {compareSound1.pathology}
                    </p>
                  )}
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {compareSound2.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {compareSound2.description}
                  </p>
                  {compareSound2.pathology && (
                    <p className={`text-sm mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Patologia: {compareSound2.pathology}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sounds List */}
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dostępne odgłosy
              </h2>
              {favoriteSounds.length > 0 && (
                <button
                  onClick={() => {
                    const newFavorites = favoriteSounds.length === filteredSounds.filter(s => favorites.has(s.id)).length
                      ? new Set<string>()
                      : new Set(favoriteSounds.map(s => s.id));
                    setFavorites(newFavorites);
                  }}
                  className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {favoriteSounds.length === filteredSounds.filter(s => favorites.has(s.id)).length
                    ? 'Pokaż wszystkie'
                    : `Pokaż ulubione (${favoriteSounds.length})`}
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {(favoriteSounds.length > 0 && favoriteSounds.length < filteredSounds.length && 
                filteredSounds.filter(s => favorites.has(s.id)).length === favoriteSounds.length
                ? favoriteSounds
                : filteredSounds
              ).map((sound) => (
                <div
                  key={sound.id}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    selectedSound?.id === sound.id
                      ? 'bg-[#38b6ff] text-black'
                      : darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => handleSoundSelect(sound)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${fontSizes.text}`}>
                          {sound.name}
                        </h3>
                        {sound.difficulty && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            sound.difficulty === 'easy'
                              ? 'bg-green-500/20 text-green-400'
                              : sound.difficulty === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {sound.difficulty === 'easy' ? 'Łatwy' : sound.difficulty === 'medium' ? 'Średni' : 'Trudny'}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mb-1 ${
                        selectedSound?.id === sound.id ? 'text-gray-800' : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {sound.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sound.phase && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            selectedSound?.id === sound.id
                              ? 'bg-gray-800/30 text-gray-900'
                              : darkMode
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {sound.phase === 'inhalation' ? 'Wdech' : sound.phase === 'exhalation' ? 'Wydech' : 'Oba'}
                          </span>
                        )}
                        {sound.location && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            selectedSound?.id === sound.id
                              ? 'bg-gray-800/30 text-gray-900'
                              : darkMode
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            <LocationIcon size={14} className="inline-block mr-1" /> {sound.location}
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(sound.id);
                      }}
                      className={`ml-2 p-2 rounded-lg transition-colors duration-200 ${
                        favorites.has(sound.id)
                          ? 'text-yellow-500'
                          : darkMode
                          ? 'text-gray-500 hover:text-gray-400'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <BookmarkIcon size={20} className={favorites.has(sound.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player */}
          <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className={`${fontSizes.subtitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Odtwarzacz
            </h2>

            {selectedSound ? (
              <div className="space-y-6">
                {/* Sound Info */}
                <div>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizes.text}`}>
                    {selectedSound.name}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ${fontSizes.text} mb-2`}>
                    {selectedSound.description}
                  </p>
                  {selectedSound.pathology && (
                    <p className={`${darkMode ? 'text-red-400' : 'text-red-600'} text-sm mb-2`}>
                      <strong>Patologia:</strong> {selectedSound.pathology}
                    </p>
                  )}
                  {selectedSound.location && (
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      <strong>Lokalizacja:</strong> {selectedSound.location}
                    </p>
                  )}
                </div>

                {/* Audio Player */}
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#38b6ff]"
                    />
                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      disabled={!selectedSound}
                      className={`p-4 rounded-full transition-colors duration-200 ${
                        isPlaying
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {isMuted ? <VolumeMuteIcon size={18} /> : <VolumeUpIcon size={18} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#38b6ff]"
                      />
                      <span className={`text-xs w-12 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Placeholder Info */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Uwaga:</strong> Pliki audio będą dostępne wkrótce. Obecnie odtwarzacz jest gotowy do użycia - wystarczy wgrać pliki dźwiękowe w odpowiednim formacie.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {selectedCategory === 'heart' ? '❤️' : '🫁'}
                </div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ${fontSizes.text}`}>
                  Wybierz odgłos z listy, aby rozpocząć odsłuchiwanie
                </p>
              </div>
            )}

            {/* Hidden Audio Element */}
            <audio ref={audioRef} />
          </div>
        </div>

        {/* Stats */}
        <AnimatedSection animation="slideUp" delay={200}>
          <div className={`mt-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} p-6 education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizes.subtitle}`}>
            Statystyki
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Odtworzone odgłosy</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={stats.soundsPlayed} duration={1500} />
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Próby quizu</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={stats.quizAttempts} duration={1500} />
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Najlepszy wynik quizu</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.quizBestScore > 0 ? <><CountUp end={stats.quizBestScore} duration={1500} />/10</> : '-'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ulubione</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={favorites.size} duration={1000} />
              </p>
            </div>
          </div>
          </div>
        </AnimatedSection>

        {/* Educational Info */}
        <div className={`mt-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizes.subtitle}`}>
            Wskazówki edukacyjne
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizes.text}`}>
                {selectedCategory === 'heart' ? 'Odgłosy serca:' : 'Odgłosy płuc:'}
              </h4>
              <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedCategory === 'heart' ? (
                  <>
                    <li>• Słuchaj regularności rytmu</li>
                    <li>• Zwracaj uwagę na intensywność tonów</li>
                    <li>• Rozpoznawaj szmery i ich lokalizację</li>
                    <li>• Ćwicz rozróżnianie tonów S1 i S2</li>
                    <li>• Zwracaj uwagę na fazę cyklu sercowego</li>
                  </>
                ) : (
                  <>
                    <li>• Porównuj odgłosy z obu stron klatki piersiowej</li>
                    <li>• Zwracaj uwagę na fazę oddechu (wdech/wydech)</li>
                    <li>• Rozpoznawaj charakterystyczne dźwięki patologiczne</li>
                    <li>• Ćwicz lokalizację zmian osłuchowych</li>
                    <li>• Różnicuj świsty, rzężenia i tarcie opłucnowe</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizes.text}`}>
                Jak korzystać:
              </h4>
              <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• <strong>Tryb nauki:</strong> Przeglądaj i odsłuchuj wszystkie odgłosy</li>
                <li>• <strong>Tryb quiz:</strong> Sprawdź swoją wiedzę - 10 losowych pytań</li>
                <li>• <strong>Tryb porównania:</strong> Porównaj dwa odgłosy obok siebie</li>
                <li>• <strong>Filtry:</strong> Użyj filtrów fazy oddechu dla odgłosów płuc</li>
                <li>• <strong>Ulubione:</strong> Zaznacz ważne odgłosy do szybkiego dostępu</li>
                <li>• <strong>Statystyki:</strong> Śledź swój postęp w nauce</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default MedicalSoundsPlayer;
