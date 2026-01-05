import { lazy } from 'react';

/**
 * Lazy-loaded komponenty stron
 * Używane do code splitting i optymalizacji wydajności
 */

// Strony główne
export const Home = lazy(() => import('./Home'));
export const ExamsPage = lazy(() => import('./ExamsPage'));

// Kalkulatory i narzędzia
export const CalculatorsPage = lazy(() => import('./EnhancedCalculatorsPage'));
export const CalculatorDetailPage = lazy(() => import('./CalculatorRouter'));
export const ICD11Page = lazy(() => import('./ICD11Page'));

// Baza leków (duże komponenty)
export const EnhancedDrugsPage = lazy(() => import('./EnhancedDrugsPage'));
export const NewDrugsPage = lazy(() => import('./NewDrugsPage'));
export const LekiPage = lazy(() => import('./LekiPage'));

// Edukacja
export const EdukacjaPage = lazy(() => import('./EdukacjaPage'));
export const PreclinicalSubjectsPage = lazy(() => import('./PreclinicalSubjectsPage'));
export const ClinicalSubjectsPage = lazy(() => import('./ClinicalSubjectsPage'));
export const SpecializedSubjectsPage = lazy(() => import('./SpecializedSubjectsPage'));

// Sklep
export const ShopPage = lazy(() => import('./ShopPage'));
export const EbookDetailPage = lazy(() => import('./EbookDetailPage'));
export const CartPage = lazy(() => import('./CartPage'));
export const CheckoutPage = lazy(() => import('./CheckoutPage'));
export const OrderHistoryPage = lazy(() => import('./OrderHistoryPage'));
export const MyEbooksPage = lazy(() => import('./MyEbooksPage'));
export const WishlistPage = lazy(() => import('./WishlistPage'));
export const ShopAdminPanel = lazy(() => import('./ShopAdminPanel'));

// Gry
export const GameCenterPage = lazy(() => import('./GameCenterPage'));

// Praca
export const JobOffersPage = lazy(() => import('./JobOffersPage'));
export const JobOfferDetailPage = lazy(() => import('./JobOfferDetailPage'));
export const AddJobOfferPage = lazy(() => import('./AddJobOfferPage'));

// Uczelnie
export const UniversitiesPage = lazy(() => import('./UniversitiesPage'));
export const UniversityDetailPage = lazy(() => import('./UniversityDetailPage'));

// Wydarzenia
export const EventsPage = lazy(() => import('./EventsPage'));
export const EventDetailPage = lazy(() => import('./EventDetailPage'));
export const AddEventPage = lazy(() => import('./AddEventPage'));

// Profil i ustawienia
export const LoginPage = lazy(() => import('./LoginPage'));
export const RegisterPage = lazy(() => import('./RegisterPage'));
export const UserProfilePanel = lazy(() => import('./UserProfilePanel'));
export const ProfilePageCompany = lazy(() => import('./ProfilePageCompany'));
export const DashboardPage = lazy(() => import('./DashboardPage'));
export const StudentDashboard = lazy(() => import('./StudentDashboard'));
export const DoctorDashboard = lazy(() => import('./DoctorDashboard'));
export const ProfileRouter = lazy(() => import('./ProfileRouter'));
export const ProfileUnified = lazy(() => import('./ProfileUnified'));
export const ProfileSimple = lazy(() => import('./ProfileSimple'));

// Admin
export const AdminPanel = lazy(() => import('./AdminPanelFunctional'));

// Pracodawca
export const EmployerDashboard = lazy(() => import('../employer/EmployerDashboard'));

// Fiszki
export const FlashcardLibrary = lazy(() => import('./FlashcardLibrary'));
export const CreateFlashcardSet = lazy(() => import('./CreateFlashcardSet'));
export const FlashcardEditor = lazy(() => import('./FlashcardEditor'));
export const StudyModeSelection = lazy(() => import('../flashcards/StudyModeSelection'));
export const SRSStatsPanel = lazy(() => import('../flashcards/SRSStatsPanel'));

// Plany nauki
export const StudyPlansLibrary = lazy(() => import('./StudyPlansLibrary'));

// Mapy i encyklopedie
export const PostgraduateInternshipMap = lazy(() => import('./PostgraduateInternshipMap'));
export const ResidencyMap = lazy(() => import('./ResidencyMap'));
export const ResidencyEncyclopedia = lazy(() => import('./ResidencyEncyclopedia'));

// Kalendarze szczepień (wszystkie)
export const VaccinationCalendar = lazy(() => import('./VaccinationCalendar'));
export const VaccinationCalendars = lazy(() => import('./VaccinationCalendars'));
export const VaccinationCalendarChildren = lazy(() => import('./VaccinationCalendarChildren'));
export const VaccinationCalendarAdults = lazy(() => import('./VaccinationCalendarAdults'));
export const VaccinationCalendarDiabetes = lazy(() => import('./VaccinationCalendarDiabetes'));
export const VaccinationCalendarKidney = lazy(() => import('./VaccinationCalendarKidney'));
export const TravelVaccinationCalendar = lazy(() => import('./TravelVaccinationCalendar'));
export const SeniorVaccinationCalendar = lazy(() => import('./SeniorVaccinationCalendar'));
export const RespiratoryVaccinationCalendar = lazy(() => import('./RespiratoryVaccinationCalendar'));
export const HepatologyVaccinationCalendar = lazy(() => import('./HepatologyVaccinationCalendar'));
export const ImmunologyVaccinationCalendar = lazy(() => import('./ImmunologyVaccinationCalendar'));
export const HealthcareWorkersVaccinationCalendar = lazy(() => import('./HealthcareWorkersVaccinationCalendar'));
export const PregnancyVaccinationCalendar = lazy(() => import('./PregnancyVaccinationCalendar'));
export const CardiologyVaccinationCalendar = lazy(() => import('./CardiologyVaccinationCalendar'));
export const AspleniVaccinationCalendar = lazy(() => import('./AspleniVaccinationCalendar'));
export const HIVVaccinationCalendar = lazy(() => import('./HIVVaccinationCalendar'));

// Inne
export const MyPatientPage = lazy(() => import('./MyPatientPage'));
export const ContactPage = lazy(() => import('./ContactPage'));
export const FAQPage = lazy(() => import('./FAQPage'));
export const TermsPage = lazy(() => import('./TermsPage'));
export const PrivacyPage = lazy(() => import('./PrivacyPage'));
export const NotFoundPage = lazy(() => import('./NotFoundPage'));
export const ProfessionSelectorPage = lazy(() => import('./ProfessionSelectorPage'));
export const DevLoginPage = lazy(() => import('./DevLoginPage'));
export const SidebarDemoPage = lazy(() => import('./SidebarDemoPage'));
export const AuthCallback = lazy(() => import('../auth/AuthCallback'));

