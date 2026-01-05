import React, { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaFilter,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaBriefcase,
  FaUserMd,
  FaHospital,
  FaStethoscope,
  FaFileContract,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaFire,
  FaPlus,
} from "react-icons/fa";
import {
  getJobOffers,
  createJobOffer,
} from "../../services/mockJobService";
import { JobOffer as LocalDBJobOffer, JobOfferInput } from "../../types";
import JobOfferCard from "../job-offers/JobOfferCard";
import QuickApplyModal from "../job-offers/QuickApplyModal";
import { useAuth } from "../../contexts/AuthContext";

interface JobOffer {
  id: string;
  company: string;
  position: string;
  contractType: string;
  location: string;
  category: string;
  description: string;
  postedDate: string;
  zawod_medyczny?: string;
  experience?: string;
  salary?: string;
  salaryType?: string;
  facilityType?: string;
  logo?: string;
  timeAgo?: string;
  zamow_medyczny?: boolean;
  isUrgent?: boolean;
}

interface JobFilters {
  professions: string[];
  locations: string[];
  experience: string[];
  salaryTypes: string[];
  dateRange: string;
  contractTypes: string[];
}

interface JobOffersPageProps {
  darkMode: boolean;
  fontSize: "small" | "medium" | "large";
}

// Dane dummy dla placeholderów
const dummyJobOffers: JobOffer[] = [
  {
    id: "dummy-1",
    company: "Szpital Kliniczny w Warszawie",
    position: "Lekarz internista",
    contractType: "Umowa o pracę",
    location: "Warszawa",
    category: "Lekarze",
    description: "Poszukujemy doświadczonego internisty do pracy w oddziale wewnętrznym.",
    postedDate: new Date().toISOString(),
    salary: "15 000 - 22 000 PLN",
    salaryType: "brutto/miesiąc",
    facilityType: "Szpital publiczny",
    timeAgo: "2 dni temu",
    isUrgent: true,
  },
  {
    id: "dummy-2",
    company: "Centrum Medyczne Medicover",
    position: "Pielęgniarka",
    contractType: "Umowa o pracę",
    location: "Kraków",
    category: "Pielęgniarki",
    description: "Zapraszamy do zespołu pielęgniarskiego w naszej placówce.",
    postedDate: new Date().toISOString(),
    salary: "6 500 - 8 500 PLN",
    salaryType: "brutto/miesiąc",
    facilityType: "Prywatna placówka",
    timeAgo: "1 dzień temu",
  },
  {
    id: "dummy-3",
    company: "Klinika Fizjoterapii ProMed",
    position: "Fizjoterapeuta",
    contractType: "B2B",
    location: "Wrocław",
    category: "Fizjoterapeuci",
    description: "Poszukujemy fizjoterapeuty z doświadczeniem w rehabilitacji ortopedycznej.",
    postedDate: new Date().toISOString(),
    salary: "80 - 120 PLN/h",
    salaryType: "stawka godzinowa",
    facilityType: "Prywatna placówka",
    timeAgo: "3 dni temu",
  },
  {
    id: "dummy-4",
    company: "Pogotowie Ratunkowe",
    position: "Ratownik medyczny",
    contractType: "Umowa o pracę",
    location: "Poznań",
    category: "Ratownicy",
    description: "Dołącz do zespołu ratowników medycznych.",
    postedDate: new Date().toISOString(),
    salary: "5 500 - 7 500 PLN",
    salaryType: "brutto/miesiąc",
    facilityType: "Publiczna placówka",
    timeAgo: "5 dni temu",
    isUrgent: true,
  },
  {
    id: "dummy-5",
    company: "Szpital Uniwersytecki",
    position: "Anestezjolog",
    contractType: "Kontrakt",
    location: "Gdańsk",
    category: "Lekarze",
    description: "Poszukujemy anestezjologa na blok operacyjny.",
    postedDate: new Date().toISOString(),
    salary: "250 - 350 PLN/h",
    salaryType: "stawka godzinowa",
    facilityType: "Szpital publiczny",
    timeAgo: "1 tydzień temu",
  },
  {
    id: "dummy-6",
    company: "Apteka Pod Złotym Lwem",
    position: "Farmaceuta",
    contractType: "Umowa o pracę",
    location: "Łódź",
    category: "Farmaceuci",
    description: "Poszukujemy magistra farmacji do pracy w aptece.",
    postedDate: new Date().toISOString(),
    salary: "7 000 - 9 000 PLN",
    salaryType: "brutto/miesiąc",
    facilityType: "Apteka",
    timeAgo: "4 dni temu",
  },
];

// Popularne wyszukiwania
const popularSearches = [
  { label: "Lekarz internista", count: 123, icon: FaUserMd },
  { label: "Pielęgniarka", count: 98, icon: FaStethoscope },
  { label: "Ratownik medyczny", count: 54, icon: FaHospital },
  { label: "Fizjoterapeuta", count: 41, icon: FaBriefcase },
  { label: "Anestezjolog", count: 35, icon: FaUserMd },
];

const popularLocations = [
  { label: "Warszawa", count: 210 },
  { label: "Kraków", count: 98 },
  { label: "Wrocław", count: 76 },
  { label: "Poznań", count: 65 },
  { label: "Gdańsk", count: 52 },
];

// Pracodawcy premium (dummy)
const premiumEmployers = [
  { name: "Medicover", logo: "/employers/medicover.png" },
  { name: "LUX MED", logo: "/employers/luxmed.png" },
  { name: "ENEL-MED", logo: "/employers/enelmed.png" },
  { name: "Centrum Medyczne Damiana", logo: "/employers/damian.png" },
  { name: "Szpital Kliniczny", logo: "/employers/szpital.png" },
  { name: "Polmed", logo: "/employers/polmed.png" },
];

const JobOffersPage: React.FC<JobOffersPageProps> = ({
  darkMode,
  fontSize,
}) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    professions: [],
    locations: [],
    experience: [],
    salaryTypes: [],
    dateRange: "",
    contractTypes: [],
  });

  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    company: "",
    position: "",
    location: "",
    contractType: "",
    category: "",
    description: "",
    salary: "",
    experience: "",
    email: "",
  });
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [quickApplyModalOpen, setQuickApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOffer | null>(null);

  // Mobile filters modal
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sticky filters
  const filterRef = useRef<HTMLDivElement>(null);
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  // Expanded filter sections
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  // Helper function to check if user is an employer
  const isEmployer = () => {
    if (!user) return false;
    const userType = user.user_metadata?.user_type;
    const isCompanyFromProfile = profile?.is_company;
    const isCompanyFromMetadata = user.user_metadata?.is_company;
    return userType === 'employer' || userType === 'company' || isCompanyFromProfile || isCompanyFromMetadata;
  };

  useEffect(() => {
    document.title = "Oferty pracy dla medyków | DlaMedica.pl";

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        "content",
        "Aktualne oferty pracy dla lekarzy, pielęgniarek, ratowników i innych zawodów medycznych.",
      );
    }
  }, []);

  // Sticky scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setIsFilterSticky(rect.top <= 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch job offers from local DB
  useEffect(() => {
    fetchJobOffers();
  }, []);

  const fetchJobOffers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getJobOffers();

      if (data) {
        const transformedData = data.map((job: LocalDBJobOffer) => ({
          ...job,
          zawod_medyczny: job.category,
          experience: "Specjalista",
          timeAgo: calculateTimeAgo(job.postedDate),
        }));
        setJobOffers(transformedData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load job offers");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) return "Mniej niż godzina temu";
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "godzina" : diffHours < 5 ? "godziny" : "godzin"} temu`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "dzień" : "dni"} temu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? "tydzień" : "tygodnie"} temu`;
    return `${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? "miesiąc" : "miesiące"} temu`;
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case "small":
        return {
          title: "text-2xl md:text-3xl",
          subtitle: "text-base md:text-lg",
          cardTitle: "text-lg md:text-xl",
          cardText: "text-sm md:text-base",
          filterText: "text-sm",
          buttonText: "text-sm",
          sectionTitle: "text-xl md:text-2xl",
        };
      case "large":
        return {
          title: "text-4xl md:text-5xl",
          subtitle: "text-xl md:text-2xl",
          cardTitle: "text-2xl md:text-3xl",
          cardText: "text-lg md:text-xl",
          filterText: "text-lg",
          buttonText: "text-lg",
          sectionTitle: "text-3xl md:text-4xl",
        };
      default:
        return {
          title: "text-3xl md:text-4xl",
          subtitle: "text-lg md:text-xl",
          cardTitle: "text-xl md:text-2xl",
          cardText: "text-base md:text-lg",
          filterText: "text-base",
          buttonText: "text-base",
          sectionTitle: "text-2xl md:text-3xl",
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Polish cities for autocomplete
  const polishCities = [
    "Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk",
    "Szczecin", "Bydgoszcz", "Lublin", "Białystok", "Katowice",
    "Gdynia", "Częstochowa", "Radom", "Toruń", "Kielce", "Rzeszów",
    "Gliwice", "Olsztyn", "Bielsko-Biała", "Opole", "Płock",
  ];

  // Filter options
  const professionOptions = [
    "Lekarz internista", "Pielęgniarka", "Ratownik medyczny",
    "Fizjoterapeuta", "Anestezjolog", "Kardiolog", "Farmaceuta",
    "Stomatolog", "Chirurg", "Pediatra", "Ginekolog", "Neurolog",
  ];

  const experienceOptions = ["Specjalista", "W trakcie specjalizacji", "Absolwent"];
  const contractOptions = ["Umowa o pracę", "B2B", "Kontrakt", "Umowa zlecenie"];
  const salaryTypeOptions = ["Stawka za miesiąc", "Stawka za godzinę", "% od wizyty"];
  const dateRangeOptions = ["Ostatnie 24h", "Ostatni tydzień", "Ostatni miesiąc"];

  const handleLocationInputChange = (value: string) => {
    setJobFormData((prev) => ({ ...prev, location: value }));

    if (value.length > 1) {
      const suggestions = polishCities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocationSuggestion = (city: string) => {
    setJobFormData((prev) => ({ ...prev, location: city }));
    setShowLocationSuggestions(false);
  };

  const handleJobFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newJobOffer: JobOfferInput = {
      company: jobFormData.company,
      position: jobFormData.position,
      location: jobFormData.location,
      contractType: jobFormData.contractType,
      category: jobFormData.category,
      description: jobFormData.description,
      salary: jobFormData.salary || undefined,
      zamow_medyczny: jobFormData.category === "Lekarze" || jobFormData.category === "Pielęgniarki",
    };

    const { data, error } = await createJobOffer(newJobOffer);

    if (error) {
      alert(`Błąd podczas dodawania oferty: ${error.message}`);
      return;
    }

    if (data) {
      alert("Formularz został wysłany! Oferta będzie sprawdzona przez nasz zespół.");
      setIsJobFormOpen(false);
      setJobFormData({
        company: "", position: "", location: "", contractType: "",
        category: "", description: "", salary: "", experience: "", email: "",
      });
      fetchJobOffers();
    }
  };

  const generateSlug = (position: string, location: string): string => {
    const text = `${position}-${location}`;
    return text
      .toLowerCase()
      .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
      .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
      .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
      .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  };

  const navigateToJobDetail = (job: JobOffer) => {
    const slug = generateSlug(job.position, job.location);
    window.history.pushState({}, "", `/praca/${slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Funkcja filtrowania ofert
  const getFilteredJobs = () => {
    return jobOffers.filter((job) => {
      if (filters.professions.length > 0) {
        const jobProfession = job.zawod_medyczny || job.category;
        if (!filters.professions.includes(jobProfession)) return false;
      }

      if (filters.locations.length > 0) {
        const jobLocation = job.location.toLowerCase();
        const hasMatchingLocation = filters.locations.some(location =>
          jobLocation.includes(location.toLowerCase())
        );
        if (!hasMatchingLocation) return false;
      }

      if (filters.contractTypes.length > 0 && !filters.contractTypes.includes(job.contractType)) {
        return false;
      }

      if (filters.experience.length > 0) {
        const jobExperience = job.experience || 'Specjalista';
        if (!filters.experience.includes(jobExperience)) return false;
      }

      if (filters.dateRange) {
        const postDate = new Date(job.postedDate);
        const now = new Date();
        const diffDays = Math.ceil(Math.abs(now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

        if (filters.dateRange === "Ostatnie 24h" && diffDays > 1) return false;
        if (filters.dateRange === "Ostatni tydzień" && diffDays > 7) return false;
        if (filters.dateRange === "Ostatni miesiąc" && diffDays > 30) return false;
      }

      return true;
    });
  };

  const filteredJobs = getFilteredJobs();

  const handleFilterToggle = (filterKey: keyof JobFilters, value: string) => {
    setFilters(prev => {
      if (filterKey === 'dateRange') {
        return { ...prev, dateRange: prev.dateRange === value ? '' : value };
      }
      const currentValues = prev[filterKey] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterKey]: newValues };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      professions: [], locations: [], experience: [],
      salaryTypes: [], dateRange: "", contractTypes: [],
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.professions.length + filters.locations.length +
      filters.experience.length + filters.salaryTypes.length +
      filters.contractTypes.length + (filters.dateRange ? 1 : 0)
    );
  };

  const handleQuickApply = (job: JobOffer) => {
    setSelectedJobForApply(job);
    setQuickApplyModalOpen(true);
  };

  const handleCloseQuickApplyModal = () => {
    setQuickApplyModalOpen(false);
    setSelectedJobForApply(null);
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Render filter chip component
  const FilterChip: React.FC<{ label: string; selected: boolean; onClick: () => void }> =
    ({ label, selected, onClick }) => (
      <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selected
          ? 'bg-[#38b6ff] text-black shadow-md'
          : darkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        {label}
      </button>
    );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}>
      {/* Compact Hero Section */}
      <div className={`py-6 md:py-8 ${darkMode ? "bg-black" : "bg-white"} border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`font-bold ${fontSizes.title} ${darkMode ? "text-white" : "text-gray-900"}`}>
                Oferty pracy dla medyków
              </h1>
              <p className={`mt-1 ${fontSizes.cardText} ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Znajdź wymarzoną pracę w branży medycznej
              </p>
            </div>

            {/* CTA Button - Dodaj ofertę */}
            {isEmployer() && (
              <button
                onClick={() => setIsJobFormOpen(true)}
                className={`flex items-center gap-2 px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-xl transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-lg hover:shadow-xl`}
              >
                <FaPlus className="text-sm" />
                Dodaj ofertę pracy
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Filters Section */}
        <div
          ref={filterRef}
          className={`rounded-2xl p-4 md:p-6 mb-6 transition-all duration-300 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
            } ${isFilterSticky ? 'sticky top-20 z-40 shadow-lg' : ''}`}
        >
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                }`}
            >
              <FaFilter />
              Filtry {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </button>
          </div>

          {/* Desktop Filters Grid */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaFilter className={`text-lg ${darkMode ? "text-[#38b6ff]" : "text-[#38b6ff]"}`} />
                <span className={`font-semibold ${fontSizes.filterText} ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Filtruj oferty
                </span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-1 bg-[#38b6ff] text-black rounded-full text-xs font-bold">
                    {getActiveFiltersCount()} aktywnych
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <FaTimes className="text-xs" />
                    Wyczyść filtry
                  </button>
                )}
                <button
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5]`}
                >
                  <FaSearch className="text-xs" />
                  Pokaż wyniki ({filteredJobs.length})
                </button>
              </div>
            </div>

            {/* Filters Grid 3x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Zawody medyczne */}
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <button
                  onClick={() => toggleFilterSection('professions')}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    <FaStethoscope className="text-[#38b6ff]" />
                    Zawody medyczne
                    {filters.professions.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#38b6ff] text-black rounded text-xs">
                        {filters.professions.length}
                      </span>
                    )}
                  </span>
                  {expandedFilters.professions ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {expandedFilters.professions && (
                  <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                    {professionOptions.map(opt => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={filters.professions.includes(opt)}
                        onClick={() => handleFilterToggle('professions', opt)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Lokalizacje */}
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <button
                  onClick={() => toggleFilterSection('locations')}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    <FaMapMarkerAlt className="text-[#38b6ff]" />
                    Lokalizacje
                    {filters.locations.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#38b6ff] text-black rounded text-xs">
                        {filters.locations.length}
                      </span>
                    )}
                  </span>
                  {expandedFilters.locations ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {expandedFilters.locations && (
                  <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                    {polishCities.slice(0, 12).map(city => (
                      <FilterChip
                        key={city}
                        label={city}
                        selected={filters.locations.includes(city)}
                        onClick={() => handleFilterToggle('locations', city)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Doświadczenie */}
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <button
                  onClick={() => toggleFilterSection('experience')}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    <FaBriefcase className="text-[#38b6ff]" />
                    Doświadczenie
                    {filters.experience.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#38b6ff] text-black rounded text-xs">
                        {filters.experience.length}
                      </span>
                    )}
                  </span>
                  {expandedFilters.experience ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {expandedFilters.experience && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {experienceOptions.map(opt => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={filters.experience.includes(opt)}
                        onClick={() => handleFilterToggle('experience', opt)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Data publikacji */}
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <button
                  onClick={() => toggleFilterSection('dateRange')}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    <FaCalendarAlt className="text-[#38b6ff]" />
                    Data publikacji
                    {filters.dateRange && (
                      <span className="px-1.5 py-0.5 bg-[#38b6ff] text-black rounded text-xs">1</span>
                    )}
                  </span>
                  {expandedFilters.dateRange ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {expandedFilters.dateRange && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dateRangeOptions.map(opt => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={filters.dateRange === opt}
                        onClick={() => handleFilterToggle('dateRange', opt)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Typy umów */}
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <button
                  onClick={() => toggleFilterSection('contractTypes')}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    <FaFileContract className="text-[#38b6ff]" />
                    Typy umów
                    {filters.contractTypes.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#38b6ff] text-black rounded text-xs">
                        {filters.contractTypes.length}
                      </span>
                    )}
                  </span>
                  {expandedFilters.contractTypes ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {expandedFilters.contractTypes && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {contractOptions.map(opt => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={filters.contractTypes.includes(opt)}
                        onClick={() => handleFilterToggle('contractTypes', opt)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Typ wynagrodzenia */}
              <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <button
                  onClick={() => toggleFilterSection('salaryTypes')}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    <FaMoneyBillWave className="text-[#38b6ff]" />
                    Typ wynagrodzenia
                    {filters.salaryTypes.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#38b6ff] text-black rounded text-xs">
                        {filters.salaryTypes.length}
                      </span>
                    )}
                  </span>
                  {expandedFilters.salaryTypes ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {expandedFilters.salaryTypes && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {salaryTypeOptions.map(opt => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={filters.salaryTypes.includes(opt)}
                        onClick={() => handleFilterToggle('salaryTypes', opt)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches Section */}
        <div className={`rounded-2xl p-4 md:p-6 mb-6 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-4">
            <FaFire className="text-orange-500" />
            <h2 className={`font-bold ${fontSizes.cardTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>
              Najpopularniejsze wyszukiwania
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zawody */}
            <div>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Zawody
              </h3>
              <div className="space-y-2">
                {popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterToggle('professions', item.label)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${filters.professions.includes(item.label)
                      ? 'bg-[#38b6ff]/20 border-2 border-[#38b6ff]'
                      : darkMode
                        ? 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                  >
                    <span className={`flex items-center gap-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      <item.icon className="text-[#38b6ff]" />
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {item.count} ofert
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lokalizacje */}
            <div>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Lokalizacje
              </h3>
              <div className="space-y-2">
                {popularLocations.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterToggle('locations', item.label)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${filters.locations.includes(item.label)
                      ? 'bg-[#38b6ff]/20 border-2 border-[#38b6ff]'
                      : darkMode
                        ? 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                  >
                    <span className={`flex items-center gap-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      <FaMapMarkerAlt className="text-[#38b6ff]" />
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {item.count} ofert
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Offers Results */}
        <div className="mb-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff]"></div>
              <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Ładowanie ofert pracy...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className={`text-6xl mb-4`}>⚠️</div>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>
                Wystąpił błąd
              </h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>{error}</p>
              <button
                onClick={() => fetchJobOffers()}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5]`}
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <>
              {/* No results message */}
              <div className={`text-center py-8 mb-8 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="text-5xl mb-4">💼</div>
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Brak ofert spełniających wybrane kryteria
                </h2>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                  Zmień filtry lub przejrzyj proponowane oferty poniżej
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-[#38b6ff] text-black font-medium rounded-lg hover:bg-[#2a9fe5] transition-colors"
                >
                  Wyczyść filtry
                </button>
              </div>

              {/* Suggested Jobs Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaStar className="text-yellow-500" />
                  <h2 className={`font-bold ${fontSizes.cardTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Proponowane oferty pracy
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dummyJobOffers.slice(0, 6).map((job) => (
                    <JobOfferCard
                      key={job.id}
                      id={job.id}
                      company={job.company}
                      position={job.position}
                      contractType={job.contractType}
                      location={job.location}
                      category={job.category}
                      salary={job.salary}
                      salaryType={job.salaryType}
                      facilityType={job.facilityType}
                      logo={job.logo}
                      timeAgo={job.timeAgo}
                      darkMode={darkMode}
                      fontSize={fontSize}
                      onClick={() => navigateToJobDetail(job)}
                      onQuickApply={() => handleQuickApply(job)}
                      isUrgent={job.isUrgent}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <span className="text-[#38b6ff] text-lg">💼</span>
                  <span className="font-medium">
                    Znaleziono {filteredJobs.length} {filteredJobs.length === 1 ? "ofertę" : "ofert"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <JobOfferCard
                    key={job.id}
                    id={job.id}
                    company={job.company}
                    position={job.position}
                    contractType={job.contractType}
                    location={job.location}
                    category={job.category}
                    salary={job.salary}
                    salaryType={job.salaryType}
                    facilityType={job.facilityType}
                    logo={job.logo}
                    timeAgo={job.timeAgo}
                    darkMode={darkMode}
                    fontSize={fontSize}
                    onClick={() => navigateToJobDetail(job)}
                    onQuickApply={() => handleQuickApply(job)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Premium Employers Section */}
        <div className={`rounded-2xl p-4 md:p-6 mb-6 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-4">
            <FaBuilding className="text-[#38b6ff]" />
            <h2 className={`font-bold ${fontSizes.cardTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>
              Pracodawcy premium
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {premiumEmployers.map((employer, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-center p-4 rounded-xl transition-all duration-200 cursor-pointer ${darkMode
                  ? "bg-gray-700/50 hover:bg-gray-700"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <div className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#38b6ff] to-[#0066cc] flex items-center justify-center">
                    <FaHospital className="text-white text-xl" />
                  </div>
                  <span className="text-xs font-medium">{employer.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply & For Employers Section */}
        <div className={`rounded-2xl overflow-hidden mb-8 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Jak aplikować */}
            <div className={`p-6 md:p-8 ${darkMode ? "border-b md:border-b-0 md:border-r border-gray-700" : "border-b md:border-b-0 md:border-r border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38b6ff] to-[#0066cc] flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <h2 className={`font-bold ${fontSizes.cardTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Jak aplikować?
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { step: 1, text: "Przeglądaj dostępne oferty pracy", icon: FaSearch },
                  { step: 2, text: "Wybierz ofertę odpowiadającą Twoim kwalifikacjom", icon: FaStar },
                  { step: 3, text: "Kliknij \"Aplikuj\" i wypełnij formularz", icon: FaFileContract },
                  { step: 4, text: "Poczekaj na odpowiedź od pracodawcy", icon: FaCheckCircle },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-[#38b6ff]/20" : "bg-[#38b6ff]/10"
                      }`}>
                      <span className="text-[#38b6ff] font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <item.icon className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <span className={`${fontSizes.cardText} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dla pracodawców */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FaBriefcase className="text-white text-xl" />
                </div>
                <h2 className={`font-bold ${fontSizes.cardTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Dla pracodawców
                </h2>
              </div>

              <p className={`${fontSizes.cardText} ${darkMode ? "text-gray-300" : "text-gray-600"} mb-6 leading-relaxed`}>
                Szukasz wykwalifikowanych specjalistów medycznych? Opublikuj swoją ofertę pracy i dotrzej do tysięcy profesjonalistów.
              </p>

              {!user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/register');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-xl transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
                  >
                    <FaPlus />
                    Załóż konto firmowe
                  </button>
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/login');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${fontSizes.buttonText} font-medium rounded-xl transition-all duration-200 border-2 ${darkMode
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    Masz już konto? Zaloguj się
                  </button>
                </div>
              ) : !isEmployer() ? (
                <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-yellow-900/20 border border-yellow-600' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <p className={`${fontSizes.cardText} ${darkMode ? "text-yellow-200" : "text-yellow-800"} mb-3`}>
                    Aby dodawać oferty pracy, potrzebujesz konta firmowego.
                  </p>
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/register');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="w-full px-6 py-3 bg-[#38b6ff] text-black font-semibold rounded-xl hover:bg-[#2a9fe5] transition-colors"
                  >
                    Załóż konto firmowe
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setIsJobFormOpen(true)}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-[#38b6ff] to-[#0066cc] text-white hover:opacity-90 shadow-lg`}
                  >
                    <FaPlus />
                    Dodaj ofertę pracy
                  </button>
                  <button
                    onClick={() => {
                      history.pushState({}, '', '/employer');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${fontSizes.buttonText} font-medium rounded-xl transition-all duration-200 border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff] hover:text-black`}
                  >
                    <FaArrowRight />
                    Panel pracodawcy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl ${darkMode ? "bg-gray-900" : "bg-white"
            }`}>
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-inherit">
              <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                Filtry
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Mobile filter sections */}
              {[
                { key: 'professions', label: 'Zawody medyczne', icon: FaStethoscope, options: professionOptions },
                { key: 'locations', label: 'Lokalizacje', icon: FaMapMarkerAlt, options: polishCities.slice(0, 12) },
                { key: 'experience', label: 'Doświadczenie', icon: FaBriefcase, options: experienceOptions },
                { key: 'contractTypes', label: 'Typy umów', icon: FaFileContract, options: contractOptions },
              ].map((section) => (
                <div key={section.key} className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="text-[#38b6ff]" />
                    <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {section.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {section.options.map(opt => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={(filters[section.key as keyof JobFilters] as string[]).includes(opt)}
                        onClick={() => handleFilterToggle(section.key as keyof JobFilters, opt)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`sticky bottom-0 p-4 border-t ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
              <div className="flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className={`flex-1 py-3 rounded-xl font-medium ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Wyczyść
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#38b6ff] text-black"
                >
                  Pokaż wyniki ({filteredJobs.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Form Modal */}
      {isJobFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
              }`}
          >
            <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h2 className={`${fontSizes.title} font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Dodaj ofertę pracy
                </h2>
                <button
                  onClick={() => setIsJobFormOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleJobFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Nazwa firmy *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.company}
                      onChange={(e) => setJobFormData((prev) => ({ ...prev, company: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                      placeholder="Nazwa placówki medycznej"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Stanowisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.position}
                      onChange={(e) => setJobFormData((prev) => ({ ...prev, position: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                      placeholder="np. Lekarz internista"
                    />
                  </div>

                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Lokalizacja *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.location}
                      onChange={(e) => handleLocationInputChange(e.target.value)}
                      onFocus={() => jobFormData.location.length > 1 && setShowLocationSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                      placeholder="Miasto"
                    />
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-50 ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
                        }`}>
                        {locationSuggestions.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => selectLocationSuggestion(city)}
                            className={`w-full px-4 py-2 text-left hover:bg-[#38b6ff] hover:text-black transition-colors ${darkMode ? "text-white" : "text-gray-900"
                              } first:rounded-t-xl last:rounded-b-xl`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Rodzaj umowy *
                    </label>
                    <select
                      required
                      value={jobFormData.contractType}
                      onChange={(e) => setJobFormData((prev) => ({ ...prev, contractType: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                    >
                      <option value="">Wybierz rodzaj umowy</option>
                      <option value="Umowa o pracę">Umowa o pracę</option>
                      <option value="Umowa zlecenie">Umowa zlecenie</option>
                      <option value="B2B">B2B</option>
                      <option value="Kontrakt">Kontrakt</option>
                      <option value="Praktyki/Staż">Praktyki/Staż</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Kategoria *
                    </label>
                    <select
                      required
                      value={jobFormData.category}
                      onChange={(e) => setJobFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                        }`}
                    >
                      <option value="">Wybierz kategorię</option>
                      <option value="Lekarze">Lekarze</option>
                      <option value="Pielęgniarki">Pielęgniarki</option>
                      <option value="Ratownicy">Ratownicy medyczni</option>
                      <option value="Fizjoterapeuci">Fizjoterapeuci</option>
                      <option value="Farmaceuci">Farmaceuci</option>
                      <option value="Technicy">Technicy medyczni</option>
                      <option value="Inne">Inne</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Wynagrodzenie
                    </label>
                    <input
                      type="text"
                      value={jobFormData.salary}
                      onChange={(e) => setJobFormData((prev) => ({ ...prev, salary: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                      placeholder="np. 5000-7000 PLN brutto"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Opis stanowiska *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="Opisz wymagania, zakres obowiązków i oferowane korzyści..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Email kontaktowy *
                  </label>
                  <input
                    type="email"
                    required
                    value={jobFormData.email}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="kontakt@firma.pl"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsJobFormOpen(false)}
                    className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-colors ${darkMode
                      ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 font-semibold rounded-xl bg-[#38b6ff] text-black hover:bg-[#2a9fe5] transition-colors shadow-md"
                  >
                    Wyślij ofertę
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Apply Modal */}
      {selectedJobForApply && (
        <QuickApplyModal
          isOpen={quickApplyModalOpen}
          onClose={handleCloseQuickApplyModal}
          jobOffer={{
            id: selectedJobForApply.id,
            company: selectedJobForApply.company,
            position: selectedJobForApply.position,
            location: selectedJobForApply.location
          }}
          darkMode={darkMode}
          fontSize={fontSize}
        />
      )}
    </div>
  );
};

export default JobOffersPage;
