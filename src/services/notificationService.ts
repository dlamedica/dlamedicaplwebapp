// Comprehensive notification system for the medical application
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type NotificationCategory = 
  | 'application'    // Job applications
  | 'job_offer'      // Job offers  
  | 'event'          // Events
  | 'profile'        // Profile updates
  | 'system'         // System notifications
  | 'admin'          // Admin notifications
  | 'education'      // Educational content
  | 'drug_database'  // Drug database updates
  | 'calculator'     // Medical calculators
  | 'shop'           // Shop orders and products
  | 'newsletter'     // Newsletter and communications
  | 'university'     // University information
  | 'favorites'      // Favorites management
  | 'security'       // Security and login
  | 'subscription'   // Premium subscriptions
  | 'achievement'    // User achievements
  | 'reminder'       // Reminders and deadlines
  | 'collaboration'  // Team collaboration
  | 'research'       // Medical research updates
  | 'certification'; // Medical certifications

export type UserType = 'admin' | 'company' | 'user';

export interface Notification {
  id: string;
  user_id: string;
  user_type: UserType;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  metadata?: {
    job_offer_id?: string;
    application_id?: string;
    event_id?: string;
    company_name?: string;
    candidate_name?: string;
    [key: string]: any;
  };
  read: boolean;
  created_at: Date;
  expires_at?: Date;
}

export interface NotificationTemplate {
  category: NotificationCategory;
  trigger: string;
  user_types: UserType[];
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private templates: NotificationTemplate[] = [
    // USER NOTIFICATIONS
    {
      category: 'application',
      trigger: 'application_submitted',
      user_types: ['user'],
      type: 'success',
      title: 'Aplikacja wysłana',
      message: 'Twoja aplikacja na stanowisko "{job_title}" została pomyślnie wysłana do {company_name}.',
      action_url: '/profile',
      action_text: 'Zobacz moje aplikacje'
    },
    {
      category: 'application',
      trigger: 'application_status_changed',
      user_types: ['user'],
      type: 'info',
      title: 'Status aplikacji zmieniony',
      message: 'Status Twojej aplikacji na stanowisko "{job_title}" został zmieniony na: {status}.',
      action_url: '/profile',
      action_text: 'Zobacz szczegóły'
    },
    {
      category: 'application',
      trigger: 'application_rated',
      user_types: ['user'],
      type: 'info',
      title: 'Aplikacja oceniona',
      message: 'Firma {company_name} oceniła Twoją aplikację na {rating}/5 gwiazdek.',
      action_url: '/profile',
      action_text: 'Zobacz ocenę'
    },
    {
      category: 'job_offer',
      trigger: 'new_job_matching',
      user_types: ['user'],
      type: 'info',
      title: 'Nowa oferta dla Ciebie',
      message: 'Pojawiła się nowa oferta pracy w Twojej specjalizacji: "{job_title}" w {company_name}.',
      action_url: '/praca',
      action_text: 'Zobacz ofertę'
    },
    {
      category: 'job_offer',
      trigger: 'favorite_job_updated',
      user_types: ['user'],
      type: 'warning',
      title: 'Oferta z ulubionych zaktualizowana',
      message: 'Oferta "{job_title}" z Twoich ulubionych została zaktualizowana.',
      action_url: '/profile',
      action_text: 'Zobacz ulubione'
    },
    {
      category: 'event',
      trigger: 'new_event_matching',
      user_types: ['user'],
      type: 'info',
      title: 'Nowe wydarzenie medyczne',
      message: 'Nowe wydarzenie w Twojej dziedzinie: "{event_title}" organizowane przez {organizer}.',
      action_url: '/wydarzenia',
      action_text: 'Zobacz wydarzenie'
    },
    {
      category: 'event',
      trigger: 'event_reminder',
      user_types: ['user'],
      type: 'warning',
      title: 'Przypomnienie o wydarzeniu',
      message: 'Wydarzenie "{event_title}" odbędzie się już za 24 godziny.',
      action_url: '/wydarzenia',
      action_text: 'Zobacz szczegóły'
    },

    // COMPANY NOTIFICATIONS
    {
      category: 'application',
      trigger: 'new_application',
      user_types: ['company'],
      type: 'info',
      title: 'Nowa aplikacja',
      message: '{candidate_name} aplikował/a na Twoją ofertę pracy "{job_title}".',
      action_url: '/profile',
      action_text: 'Zobacz aplikację'
    },
    {
      category: 'application',
      trigger: 'application_withdrawn',
      user_types: ['company'],
      type: 'warning',
      title: 'Aplikacja wycofana',
      message: '{candidate_name} wycofał/a aplikację na stanowisko "{job_title}".',
      action_url: '/profile',
      action_text: 'Zobacz aplikacje'
    },
    {
      category: 'job_offer',
      trigger: 'job_offer_approved',
      user_types: ['company'],
      type: 'success',
      title: 'Oferta pracy zaakceptowana',
      message: 'Twoja oferta pracy "{job_title}" została zaakceptowana przez administratora i jest teraz widoczna publicznie.',
      action_url: '/profile',
      action_text: 'Zobacz ofertę'
    },
    {
      category: 'job_offer',
      trigger: 'job_offer_rejected',
      user_types: ['company'],
      type: 'error',
      title: 'Oferta pracy odrzucona',
      message: 'Twoja oferta pracy "{job_title}" została odrzucona. Powód: {rejection_reason}.',
      action_url: '/profile',
      action_text: 'Zobacz szczegóły'
    },
    {
      category: 'event',
      trigger: 'event_approved',
      user_types: ['company'],
      type: 'success',
      title: 'Wydarzenie zaakceptowane',
      message: 'Twoje wydarzenie "{event_title}" zostało zaakceptowane i jest teraz widoczne publicznie.',
      action_url: '/profile',
      action_text: 'Zobacz wydarzenie'
    },
    {
      category: 'event',
      trigger: 'event_rejected',
      user_types: ['company'],
      type: 'error',
      title: 'Wydarzenie odrzucone',
      message: 'Twoje wydarzenie "{event_title}" zostało odrzucone. Powód: {rejection_reason}.',
      action_url: '/profile',
      action_text: 'Zobacz szczegóły'
    },
    {
      category: 'event',
      trigger: 'new_event_participant',
      user_types: ['company'],
      type: 'info',
      title: 'Nowy uczestnik wydarzenia',
      message: 'Nowy uczestnik zapisał się na Twoje wydarzenie "{event_title}". Łącznie: {participant_count} osób.',
      action_url: '/profile',
      action_text: 'Zobacz uczestników'
    },

    // ADMIN NOTIFICATIONS
    {
      category: 'admin',
      trigger: 'pending_job_offers',
      user_types: ['admin'],
      type: 'warning',
      title: 'Oferty oczekują na sprawdzenie',
      message: '{count} nowych ofert pracy oczekuje na Twoją akceptację.',
      action_url: '/admin',
      action_text: 'Sprawdź oferty'
    },
    {
      category: 'admin',
      trigger: 'pending_events',
      user_types: ['admin'],
      type: 'warning',
      title: 'Wydarzenia oczekują na sprawdzenie',
      message: '{count} nowych wydarzeń oczekuje na Twoją akceptację.',
      action_url: '/admin',
      action_text: 'Sprawdź wydarzenia'
    },
    {
      category: 'system',
      trigger: 'new_user_registered',
      user_types: ['admin'],
      type: 'info',
      title: 'Nowy użytkownik',
      message: 'Nowy użytkownik {user_name} ({user_type}) zarejestrował się w systemie.',
      action_url: '/admin',
      action_text: 'Zobacz użytkowników'
    },

    // EDUCATION NOTIFICATIONS
    {
      category: 'education',
      trigger: 'new_course_available',
      user_types: ['user'],
      type: 'info',
      title: 'Nowy kurs medyczny',
      message: 'Dostępny jest nowy kurs: "{course_title}" w kategorii {category}.',
      action_url: '/edukacja',
      action_text: 'Zobacz kurs'
    },
    {
      category: 'education',
      trigger: 'course_completed',
      user_types: ['user'],
      type: 'success',
      title: 'Kurs ukończony!',
      message: 'Gratulacje! Ukończyłeś kurs "{course_title}". Zdobyłeś {points} punktów.',
      action_url: '/edukacja',
      action_text: 'Zobacz certyfikat'
    },
    {
      category: 'education',
      trigger: 'quiz_result',
      user_types: ['user'],
      type: 'info',
      title: 'Wynik quizu',
      message: 'Twój wynik w quizie "{quiz_title}": {score}%. {feedback}',
      action_url: '/edukacja',
      action_text: 'Zobacz szczegóły'
    },
    {
      category: 'education',
      trigger: 'study_reminder',
      user_types: ['user'],
      type: 'warning',
      title: 'Przypomnienie o nauce',
      message: 'Nie uczylysz się już {days} dni. Kontynuuj kurs "{course_title}".',
      action_url: '/edukacja',
      action_text: 'Kontynuuj naukę'
    },

    // DRUG DATABASE NOTIFICATIONS
    {
      category: 'drug_database',
      trigger: 'new_drug_added',
      user_types: ['user', 'admin'],
      type: 'info',
      title: 'Nowy lek w bazie',
      message: 'Do bazy dodano nowy lek: {drug_name} ({active_substance}).',
      action_url: '/baza-lekow',
      action_text: 'Zobacz lek'
    },
    {
      category: 'drug_database',
      trigger: 'drug_interaction_alert',
      user_types: ['user'],
      type: 'warning',
      title: 'Ostrzeżenie o interakcji',
      message: 'Wykryto potencjalną interakcję między {drug1} a {drug2}. Sprawdź szczegóły.',
      action_url: '/baza-lekow',
      action_text: 'Zobacz ostrzeżenie'
    },
    {
      category: 'drug_database',
      trigger: 'drug_recalled',
      user_types: ['user', 'company', 'admin'],
      type: 'error',
      title: 'Wycofanie leku',
      message: 'PILNE: Lek {drug_name} ({batch_number}) został wycofany z obiegu. Powód: {reason}.',
      action_url: '/baza-lekow',
      action_text: 'Zobacz szczegóły'
    },
    {
      category: 'drug_database',
      trigger: 'drug_shortage',
      user_types: ['user', 'company'],
      type: 'warning',
      title: 'Niedobór leku',
      message: 'Zgłoszono niedobór leku {drug_name}. Przewidywany czas normalizacji: {estimated_time}.',
      action_url: '/baza-lekow',
      action_text: 'Zobacz alternatywy'
    },

    // CALCULATOR NOTIFICATIONS
    {
      category: 'calculator',
      trigger: 'new_calculator',
      user_types: ['user'],
      type: 'info',
      title: 'Nowy kalkulator medyczny',
      message: 'Dodano nowy kalkulator: "{calculator_name}" dla specjalizacji {specialization}.',
      action_url: '/kalkulatory',
      action_text: 'Wypróbuj kalkulator'
    },
    {
      category: 'calculator',
      trigger: 'calculator_updated',
      user_types: ['user'],
      type: 'info',
      title: 'Kalkulator zaktualizowany',
      message: 'Kalkulator "{calculator_name}" został zaktualizowany o nowe funkcje.',
      action_url: '/kalkulatory',
      action_text: 'Zobacz zmiany'
    },
    {
      category: 'calculator',
      trigger: 'calculation_saved',
      user_types: ['user'],
      type: 'success',
      title: 'Obliczenie zapisane',
      message: 'Twoje obliczenie "{calculation_name}" zostało zapisane w historii.',
      action_url: '/kalkulatory',
      action_text: 'Zobacz historię'
    },

    // SHOP NOTIFICATIONS
    {
      category: 'shop',
      trigger: 'order_confirmed',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Zamówienie potwierdzone',
      message: 'Twoje zamówienie #{order_id} zostało potwierdzone. Wartość: {total} PLN.',
      action_url: '/profile',
      action_text: 'Sprawdź status'
    },
    {
      category: 'shop',
      trigger: 'order_shipped',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Zamówienie wysłane',
      message: 'Zamówienie #{order_id} zostało wysłane. Numer przesyłki: {tracking_number}.',
      action_url: '/profile',
      action_text: 'Śledź przesyłkę'
    },
    {
      category: 'shop',
      trigger: 'order_delivered',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Zamówienie dostarczone',
      message: 'Zamówienie #{order_id} zostało dostarczone. Dziękujemy za zakup!',
      action_url: '/profile',
      action_text: 'Oceń produkty'
    },
    {
      category: 'shop',
      trigger: 'product_back_in_stock',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Produkt ponownie dostępny',
      message: 'Produkt "{product_name}" jest ponownie dostępny w sklepie!',
      action_url: '/sklep',
      action_text: 'Kup teraz'
    },
    {
      category: 'shop',
      trigger: 'price_drop',
      user_types: ['user', 'company'],
      type: 'warning',
      title: 'Obniżka ceny!',
      message: 'Cena produktu "{product_name}" została obniżona z {old_price} PLN na {new_price} PLN.',
      action_url: '/sklep',
      action_text: 'Zobacz ofertę'
    },

    // NEWSLETTER NOTIFICATIONS
    {
      category: 'newsletter',
      trigger: 'newsletter_subscription',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Newsletter aktywowany',
      message: 'Pomyślnie zapisałeś się na newsletter medyczny DlaMedica.',
      action_url: '/profile',
      action_text: 'Zarządzaj subskrypcjami'
    },
    {
      category: 'newsletter',
      trigger: 'weekly_medical_news',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Tygodniowe nowości medyczne',
      message: 'Dostępne są najnowsze informacje medyczne z tygodnia. {article_count} nowych artykułów.',
      action_url: '/edukacja',
      action_text: 'Czytaj nowości'
    },
    {
      category: 'newsletter',
      trigger: 'breaking_medical_news',
      user_types: ['user', 'company', 'admin'],
      type: 'warning',
      title: 'Pilne informacje medyczne',
      message: 'PILNE: {news_title}. {brief_description}',
      action_url: '/edukacja',
      action_text: 'Przeczytaj więcej'
    },

    // UNIVERSITY NOTIFICATIONS
    {
      category: 'university',
      trigger: 'new_university_added',
      user_types: ['user'],
      type: 'info',
      title: 'Nowa uczelnia w bazie',
      message: 'Dodano informacje o uczelni: {university_name} w {city}.',
      action_url: '/uczelnie',
      action_text: 'Zobacz szczegóły'
    },
    {
      category: 'university',
      trigger: 'application_deadline',
      user_types: ['user'],
      type: 'warning',
      title: 'Zbliża się termin rekrutacji',
      message: 'Rekrutacja na {university_name} kończy się za {days} dni.',
      action_url: '/uczelnie',
      action_text: 'Sprawdź wymagania'
    },
    {
      category: 'university',
      trigger: 'scholarship_available',
      user_types: ['user'],
      type: 'info',
      title: 'Dostępne stypendium',
      message: 'Nowe stypendium na {university_name}: "{scholarship_name}" do {amount} PLN.',
      action_url: '/uczelnie',
      action_text: 'Aplikuj teraz'
    },

    // FAVORITES NOTIFICATIONS
    {
      category: 'favorites',
      trigger: 'favorite_job_expiring',
      user_types: ['user'],
      type: 'warning',
      title: 'Oferta z ulubionych wygasa',
      message: 'Oferta "{job_title}" z Twoich ulubionych wygasa za {days} dni.',
      action_url: '/profile',
      action_text: 'Aplikuj teraz'
    },
    {
      category: 'favorites',
      trigger: 'favorite_event_starting',
      user_types: ['user'],
      type: 'info',
      title: 'Wydarzenie z ulubionych już jutro',
      message: 'Wydarzenie "{event_title}" z Twoich ulubionych odbędzie się jutro o {time}.',
      action_url: '/wydarzenia',
      action_text: 'Zobacz szczegóły'
    },

    // SECURITY NOTIFICATIONS
    {
      category: 'security',
      trigger: 'login_from_new_device',
      user_types: ['user', 'company', 'admin'],
      type: 'warning',
      title: 'Logowanie z nowego urządzenia',
      message: 'Wykryto logowanie z nowego urządzenia: {device} w {location}.',
      action_url: '/profile',
      action_text: 'Sprawdź aktywność'
    },
    {
      category: 'security',
      trigger: 'suspicious_activity',
      user_types: ['user', 'company', 'admin'],
      type: 'error',
      title: 'Podejrzana aktywność',
      message: 'Wykryto podejrzaną aktywność na Twoim koncie. Zmień hasło jak najszybciej.',
      action_url: '/profile',
      action_text: 'Zmień hasło'
    },
    {
      category: 'security',
      trigger: 'account_locked',
      user_types: ['user', 'company', 'admin'],
      type: 'error',
      title: 'Konto zablokowane',
      message: 'Konto zostało tymczasowo zablokowane z powodu {reason}. Skontaktuj się z pomocą.',
      action_url: '/kontakt',
      action_text: 'Skontaktuj się'
    },

    // SUBSCRIPTION NOTIFICATIONS
    {
      category: 'subscription',
      trigger: 'premium_activated',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Premium aktywowane',
      message: 'Twoja subskrypcja Premium została aktywowana. Ważna do {expiry_date}.',
      action_url: '/profile',
      action_text: 'Eksploruj funkcje'
    },
    {
      category: 'subscription',
      trigger: 'premium_expiring',
      user_types: ['user', 'company'],
      type: 'warning',
      title: 'Premium wygasa wkrótce',
      message: 'Twoja subskrypcja Premium wygasa za {days} dni. Odnów, aby nie stracić dostępu.',
      action_url: '/profile',
      action_text: 'Odnów subskrypcję'
    },
    {
      category: 'subscription',
      trigger: 'premium_expired',
      user_types: ['user', 'company'],
      type: 'error',
      title: 'Premium wygasło',
      message: 'Twoja subskrypcja Premium wygasła. Niektóre funkcje są teraz niedostępne.',
      action_url: '/profile',
      action_text: 'Odnów dostęp'
    },

    // ACHIEVEMENT NOTIFICATIONS
    {
      category: 'achievement',
      trigger: 'first_application',
      user_types: ['user'],
      type: 'success',
      title: 'Pierwsza aplikacja!',
      message: 'Gratulacje! Wysłałeś swoją pierwszą aplikację na ofertę pracy.',
      action_url: '/profile',
      action_text: 'Zobacz osiągnięcia'
    },
    {
      category: 'achievement',
      trigger: 'profile_complete',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Profil kompletny',
      message: 'Świetnie! Twój profil jest w 100% kompletny. To zwiększa Twoje szanse!',
      action_url: '/profile',
      action_text: 'Zobacz profil'
    },
    {
      category: 'achievement',
      trigger: 'active_user_streak',
      user_types: ['user'],
      type: 'success',
      title: 'Seria aktywności!',
      message: 'Jesteś aktywny już {days} dni z rzędu! Tak trzymaj!',
      action_url: '/profile',
      action_text: 'Zobacz statystyki'
    },

    // REMINDER NOTIFICATIONS
    {
      category: 'reminder',
      trigger: 'incomplete_application',
      user_types: ['user'],
      type: 'warning',
      title: 'Niedokończona aplikacja',
      message: 'Masz niedokończoną aplikację na stanowisko "{job_title}". Dokończ ją w ciągu 24h.',
      action_url: '/profile',
      action_text: 'Dokończ aplikację'
    },
    {
      category: 'reminder',
      trigger: 'profile_incomplete',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Uzupełnij profil',
      message: 'Twój profil jest w {percentage}% kompletny. Uzupełnij brakujące informacje.',
      action_url: '/profile',
      action_text: 'Uzupełnij profil'
    },
    {
      category: 'reminder',
      trigger: 'interview_tomorrow',
      user_types: ['user'],
      type: 'warning',
      title: 'Rozmowa kwalifikacyjna jutro',
      message: 'Jutro o {time} masz rozmowę w {company_name} na stanowisko "{job_title}".',
      action_url: '/profile',
      action_text: 'Zobacz szczegóły'
    },

    // COLLABORATION NOTIFICATIONS
    {
      category: 'collaboration',
      trigger: 'team_invite',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Zaproszenie do zespołu',
      message: '{sender_name} zaprosił Cię do zespołu "{team_name}" w {company_name}.',
      action_url: '/profile',
      action_text: 'Odpowiedz'
    },
    {
      category: 'collaboration',
      trigger: 'project_assignment',
      user_types: ['user'],
      type: 'info',
      title: 'Nowy projekt',
      message: 'Zostałeś przypisany do projektu "{project_name}" przez {manager_name}.',
      action_url: '/profile',
      action_text: 'Zobacz projekt'
    },
    {
      category: 'collaboration',
      trigger: 'document_shared',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Udostępniono dokument',
      message: '{sender_name} udostępnił Ci dokument: "{document_name}".',
      action_url: '/profile',
      action_text: 'Otwórz dokument'
    },

    // RESEARCH NOTIFICATIONS
    {
      category: 'research',
      trigger: 'new_study_published',
      user_types: ['user', 'company'],
      type: 'info',
      title: 'Nowe badanie naukowe',
      message: 'Opublikowano badanie: "{study_title}" w dziedzinie {field}.',
      action_url: '/edukacja',
      action_text: 'Przeczytaj badanie'
    },
    {
      category: 'research',
      trigger: 'clinical_trial_opportunity',
      user_types: ['user'],
      type: 'info',
      title: 'Możliwość uczestnictwa w badaniu',
      message: 'Pasujące badanie kliniczne: "{trial_name}". Okres: {duration}.',
      action_url: '/wydarzenia',
      action_text: 'Dowiedz się więcej'
    },
    {
      category: 'research',
      trigger: 'research_grant_available',
      user_types: ['company'],
      type: 'info',
      title: 'Dostępny grant badawczy',
      message: 'Grant "{grant_name}" na kwotę {amount} PLN. Termin aplikacji: {deadline}.',
      action_url: '/wydarzenia',
      action_text: 'Aplikuj o grant'
    },

    // CERTIFICATION NOTIFICATIONS
    {
      category: 'certification',
      trigger: 'certificate_earned',
      user_types: ['user'],
      type: 'success',
      title: 'Certyfikat zdobyty!',
      message: 'Gratulacje! Zdobyłeś certyfikat: "{certificate_name}". Ważny do {expiry_date}.',
      action_url: '/profile',
      action_text: 'Pobierz certyfikat'
    },
    {
      category: 'certification',
      trigger: 'certificate_expiring',
      user_types: ['user'],
      type: 'warning',
      title: 'Certyfikat wygasa wkrótce',
      message: 'Certyfikat "{certificate_name}" wygasa za {days} dni. Zadbaj o odnowienie.',
      action_url: '/profile',
      action_text: 'Odnów certyfikat'
    },
    {
      category: 'certification',
      trigger: 'continuing_education_required',
      user_types: ['user'],
      type: 'warning',
      title: 'Wymagane kształcenie ustawiczne',
      message: 'Potrzebujesz {hours} godzin kształcenia ustawicznego do {deadline}.',
      action_url: '/edukacja',
      action_text: 'Zobacz kursy'
    },

    // SYSTEM NOTIFICATIONS  
    {
      category: 'profile',
      trigger: 'profile_updated',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Profil zaktualizowany',
      message: 'Twój profil został pomyślnie zaktualizowany.',
      action_url: '/profile',
      action_text: 'Zobacz profil'
    },
    {
      category: 'profile',
      trigger: 'password_changed',
      user_types: ['user', 'company', 'admin'],
      type: 'success',
      title: 'Hasło zmienione',
      message: 'Twoje hasło zostało pomyślnie zmienione.',
      action_url: '/profile',
      action_text: 'Ustawienia bezpieczeństwa'
    },

    // ADVANCED SYSTEM NOTIFICATIONS
    {
      category: 'system',
      trigger: 'maintenance_scheduled',
      user_types: ['user', 'company', 'admin'],
      type: 'warning',
      title: 'Planowane prace serwisowe',
      message: 'Prace serwisowe odbędą się {date} od {start_time} do {end_time}. Serwis będzie niedostępny.',
      action_url: '/',
      action_text: 'Więcej informacji'
    },
    {
      category: 'system',
      trigger: 'new_feature_available',
      user_types: ['user', 'company', 'admin'],
      type: 'info',
      title: 'Nowa funkcja dostępna',
      message: 'Dodaliśmy nową funkcję: {feature_name}. {feature_description}',
      action_url: '/',
      action_text: 'Wypróbuj teraz'
    },
    {
      category: 'system',
      trigger: 'data_export_ready',
      user_types: ['user', 'company'],
      type: 'success',
      title: 'Eksport danych gotowy',
      message: 'Twój eksport danych jest gotowy do pobrania. Dostępny przez 7 dni.',
      action_url: '/profile',
      action_text: 'Pobierz dane'
    },

    // MEDICAL EMERGENCY NOTIFICATIONS
    {
      category: 'system',
      trigger: 'medical_emergency_alert',
      user_types: ['user', 'company', 'admin'],
      type: 'error',
      title: 'Alert medyczny',
      message: 'PILNY ALERT: {alert_message}. {instructions}',
      action_url: '/kontakt',
      action_text: 'Centrum pomocy'
    }
  ];

  // Create notification from template
  createNotification(
    trigger: string, 
    userId: string, 
    userType: UserType, 
    data: { [key: string]: any } = {}
  ): void {
    const template = this.templates.find(t => 
      t.trigger === trigger && t.user_types.includes(userType)
    );

    if (!template) {
      console.warn(`No template found for trigger: ${trigger}, userType: ${userType}`);
      return;
    }

    const notification: Notification = {
      id: this.generateId(),
      user_id: userId,
      user_type: userType,
      type: template.type,
      category: template.category,
      title: this.interpolateString(template.title, data),
      message: this.interpolateString(template.message, data),
      action_url: template.action_url,
      action_text: template.action_text,
      metadata: data,
      read: false,
      created_at: new Date(),
      expires_at: this.getExpirationDate(template.category)
    };

    this.notifications.push(notification);
    console.log(`📧 Notification created for ${userType} ${userId}:`, notification.title);
  }

  // Get notifications for specific user
  getNotificationsForUser(userId: string, userType: UserType): Notification[] {
    return this.notifications
      .filter(n => n.user_id === userId && n.user_type === userType)
      .filter(n => !n.expires_at || n.expires_at > new Date())
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  // Get unread count for user
  getUnreadCount(userId: string, userType: UserType): number {
    return this.getNotificationsForUser(userId, userType)
      .filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Mark all notifications as read for user
  markAllAsRead(userId: string, userType: UserType): void {
    this.notifications
      .filter(n => n.user_id === userId && n.user_type === userType)
      .forEach(n => n.read = true);
  }

  // Remove notification
  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  // Trigger specific notifications based on actions
  
  // Job Application Notifications
  onApplicationSubmitted(userId: string, jobData: any): void {
    this.createNotification('application_submitted', userId, 'user', jobData);
    this.createNotification('new_application', jobData.company_user_id, 'company', {
      candidate_name: jobData.candidate_name,
      job_title: jobData.job_title
    });
  }

  onApplicationStatusChanged(userId: string, applicationData: any): void {
    this.createNotification('application_status_changed', userId, 'user', applicationData);
  }

  onApplicationRated(userId: string, ratingData: any): void {
    this.createNotification('application_rated', userId, 'user', ratingData);
  }

  // Job Offer Notifications
  onJobOfferApproved(companyUserId: string, jobData: any): void {
    this.createNotification('job_offer_approved', companyUserId, 'company', jobData);
    // Notify matching users
    this.notifyUsersAboutNewJob(jobData);
  }

  onJobOfferRejected(companyUserId: string, jobData: any): void {
    this.createNotification('job_offer_rejected', companyUserId, 'company', jobData);
  }

  // Event Notifications
  onEventApproved(companyUserId: string, eventData: any): void {
    this.createNotification('event_approved', companyUserId, 'company', eventData);
    // Notify interested users
    this.notifyUsersAboutNewEvent(eventData);
  }

  onEventRejected(companyUserId: string, eventData: any): void {
    this.createNotification('event_rejected', companyUserId, 'company', eventData);
  }

  // Admin Notifications
  onNewJobOfferSubmitted(adminUserId: string): void {
    const pendingCount = 3; // This would come from actual data
    this.createNotification('pending_job_offers', adminUserId, 'admin', { count: pendingCount });
  }

  onNewEventSubmitted(adminUserId: string): void {
    const pendingCount = 2; // This would come from actual data
    this.createNotification('pending_events', adminUserId, 'admin', { count: pendingCount });
  }

  // Profile Notifications
  onProfileUpdated(userId: string, userType: UserType): void {
    this.createNotification('profile_updated', userId, userType);
  }

  onPasswordChanged(userId: string, userType: UserType): void {
    this.createNotification('password_changed', userId, userType);
  }

  // Utility methods
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private interpolateString(template: string, data: { [key: string]: any }): string {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private getExpirationDate(category: NotificationCategory): Date | undefined {
    // Some notifications expire after certain time
    const now = new Date();
    switch (category) {
      case 'system':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      case 'admin':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      default:
        return new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days
    }
  }

  private notifyUsersAboutNewJob(jobData: any): void {
    // In real app, this would query users with matching specializations
    const matchingUserIds = ['user1', 'user2']; // Mock data
    matchingUserIds.forEach(userId => {
      this.createNotification('new_job_matching', userId, 'user', jobData);
    });
  }

  private notifyUsersAboutNewEvent(eventData: any): void {
    // In real app, this would query users interested in this type of event
    const interestedUserIds = ['user1', 'user3']; // Mock data
    interestedUserIds.forEach(userId => {
      this.createNotification('new_event_matching', userId, 'user', eventData);
    });
  }

  // Initialize with some example notifications for demo
  initializeDemoNotifications(): void {
    // Admin notifications
    this.createNotification('pending_job_offers', 'admin1', 'admin', { count: 3 });
    this.createNotification('pending_events', 'admin1', 'admin', { count: 2 });
    
    // Company notifications
    this.createNotification('job_offer_approved', 'company1', 'company', { 
      job_title: 'Lekarz rodzinny' 
    });
    this.createNotification('new_application', 'company1', 'company', { 
      candidate_name: 'Dr Anna Kowalska',
      job_title: 'Pediatra'
    });
    
    // User notifications
    this.createNotification('application_submitted', 'user1', 'user', { 
      job_title: 'Radiolog',
      company_name: 'Centrum Medyczne'
    });
    this.createNotification('new_job_matching', 'user1', 'user', { 
      job_title: 'Kardiolog',
      company_name: 'Szpital Wojewódzki'
    });
  }

  // Get notification statistics
  getStatistics(): {
    total: number;
    unread: number;
    by_type: { [key in NotificationType]: number };
    by_category: { [key in NotificationCategory]: number };
  } {
    const stats = {
      total: this.notifications.length,
      unread: this.notifications.filter(n => !n.read).length,
      by_type: {
        success: 0,
        error: 0,
        warning: 0,
        info: 0
      } as { [key in NotificationType]: number },
      by_category: {
        application: 0,
        job_offer: 0,
        event: 0,
        profile: 0,
        system: 0,
        admin: 0
      } as { [key in NotificationCategory]: number }
    };

    this.notifications.forEach(n => {
      stats.by_type[n.type]++;
      stats.by_category[n.category]++;
    });

    return stats;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Initialize with demo data
notificationService.initializeDemoNotifications();