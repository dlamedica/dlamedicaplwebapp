import React, { useEffect } from 'react';

interface PrivacyPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ darkMode, fontSize }) => {
  useEffect(() => {
    document.title = 'Polityka prywatności | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Polityka prywatności serwisu DlaMedica.pl - ochrona danych osobowych użytkowników.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Polityka prywatności | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Polityka prywatności serwisu DlaMedica.pl - ochrona danych osobowych użytkowników.');
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
          sectionTitle: 'text-base md:text-lg'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          sectionTitle: 'text-xl md:text-2xl'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          sectionTitle: 'text-lg md:text-xl'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`font-bold mb-6 ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'}`}>
            Polityka prywatności
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
            Informacje o przetwarzaniu danych osobowych w serwisie DlaMedica.pl
          </p>
          
          {/* Decorative element */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className={`rounded-lg p-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="space-y-8">
            {/* Updated date */}
            <div className="text-center">
              <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ostatnia aktualizacja: 01.01.2025
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                1. Administrator danych osobowych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Administratorem Państwa danych osobowych jest DlaMedica.pl sp. z o.o. 
                  z siedzibą w Warszawie, ul. Medyczna 10, 00-001 Warszawa, 
                  wpisana do rejestru przedsiębiorców prowadzonego przez Sąd Rejonowy 
                  dla m.st. Warszawy pod numerem KRS: 0000000000.
                </p>
                <p>
                  Kontakt z administratorem: kontakt@dlamedica.pl, tel. +48 123 456 789
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                2. Podstawa prawna przetwarzania danych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Przetwarzamy Państwa dane osobowe na podstawie:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Zgody (art. 6 ust. 1 lit. a RODO) - w przypadku zapisów do newslettera</li>
                  <li>Wykonania umowy (art. 6 ust. 1 lit. b RODO) - w przypadku korzystania z usług</li>
                  <li>Prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO) - w celach marketingowych</li>
                  <li>Obowiązku prawnego (art. 6 ust. 1 lit. c RODO) - w przypadku obowiązków księgowych</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                3. Cele przetwarzania danych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Przetwarzamy dane osobowe w następujących celach:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Świadczenie usług dostępnych w serwisie</li>
                  <li>Obsługa zapytań i komunikacja z użytkownikami</li>
                  <li>Wysyłanie newslettera (za zgodą)</li>
                  <li>Prowadzenie statystyk i analiz</li>
                  <li>Zapewnienie bezpieczeństwa serwisu</li>
                  <li>Realizacja obowiązków prawnych</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                4. Rodzaje przetwarzanych danych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Przetwarzamy następujące kategorie danych osobowych:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dane identyfikacyjne (imię, nazwisko)</li>
                  <li>Dane kontaktowe (adres e-mail, numer telefonu)</li>
                  <li>Dane techniczne (adres IP, informacje o przeglądarce)</li>
                  <li>Dane dotyczące korzystania z serwisu</li>
                  <li>Pliki cookies</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                5. Okres przechowywania danych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Dane osobowe przechowujemy przez okres:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Niezbędny do realizacji celów, dla których zostały zebrane</li>
                  <li>Wymagany przepisami prawa (np. przepisy podatkowe)</li>
                  <li>Do momentu cofnięcia zgody (w przypadku przetwarzania na podstawie zgody)</li>
                  <li>Do momentu wniesienia skutecznego sprzeciwu (w przypadku prawnie uzasadnionego interesu)</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                6. Udostępnianie danych osobowych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Dane osobowe mogą być udostępniane:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Podmiotom przetwarzającym dane w naszym imieniu (np. dostawcy usług IT)</li>
                  <li>Organom państwowym na podstawie przepisów prawa</li>
                  <li>Podmiotom współpracującym w zakresie realizacji usług</li>
                </ul>
                <p>
                  Nie przekazujemy danych osobowych do krajów trzecich spoza UE.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                7. Prawa osób, których dane dotyczą
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Na podstawie RODO przysługują Państwu następujące prawa:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prawo dostępu do danych (art. 15 RODO)</li>
                  <li>Prawo do sprostowania danych (art. 16 RODO)</li>
                  <li>Prawo do usunięcia danych (art. 17 RODO)</li>
                  <li>Prawo do ograniczenia przetwarzania (art. 18 RODO)</li>
                  <li>Prawo do przenoszenia danych (art. 20 RODO)</li>
                  <li>Prawo do sprzeciwu (art. 21 RODO)</li>
                  <li>Prawo do cofnięcia zgody</li>
                  <li>Prawo do wniesienia skargi do organu nadzorczego</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                8. Pliki cookies
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Serwis wykorzystuje pliki cookies w celu:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Zapewnienia prawidłowego funkcjonowania serwisu</li>
                  <li>Dostosowania treści do preferencji użytkownika</li>
                  <li>Prowadzenia statystyk odwiedzin</li>
                  <li>Zapewnienia bezpieczeństwa</li>
                </ul>
                <p>
                  Użytkownik może zarządzać plikami cookies poprzez ustawienia przeglądarki.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                9. Bezpieczeństwo danych
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Stosujemy odpowiednie środki techniczne i organizacyjne w celu zapewnienia 
                  bezpieczeństwa przetwarzanych danych osobowych, w tym:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Szyfrowanie danych</li>
                  <li>Kontrola dostępu do danych</li>
                  <li>Regularne kopie bezpieczeństwa</li>
                  <li>Monitoring bezpieczeństwa</li>
                  <li>Szkolenia pracowników</li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                10. Zmiany w polityce prywatności
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności. 
                  O wszelkich zmianach będziemy informować poprzez publikację zaktualizowanej 
                  wersji na stronie internetowej.
                </p>
                <p>
                  Zmiany wchodzą w życie z dniem publikacji nowej wersji polityki prywatności.
                </p>
              </div>
            </section>

            {/* Contact info */}
            <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-center">
                <h3 className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Kontakt w sprawie ochrony danych
                </h3>
                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  W przypadku pytań dotyczących przetwarzania danych osobowych:
                </p>
                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Email: dane@dlamedica.pl<br />
                  Telefon: +48 123 456 789<br />
                  Adres: ul. Medyczna 10, 00-001 Warszawa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;