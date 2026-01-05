import React, { useEffect } from 'react';

interface TermsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const TermsPage: React.FC<TermsPageProps> = ({ darkMode, fontSize }) => {
  useEffect(() => {
    document.title = 'Regulamin | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Regulamin serwisu DlaMedica.pl - zasady korzystania z portalu dla medyków.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Regulamin | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Regulamin serwisu DlaMedica.pl - zasady korzystania z portalu dla medyków.');
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
            Regulamin
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
            Regulamin korzystania z serwisu DlaMedica.pl
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
                § 1. Postanowienia ogólne
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. Niniejszy regulamin określa zasady korzystania z serwisu internetowego DlaMedica.pl, 
                  zwanego dalej "Serwisem".
                </p>
                <p>
                  2. Serwis jest prowadzony przez DlaMedica.pl sp. z o.o. z siedzibą w Warszawie, 
                  ul. Medyczna 10, 00-001 Warszawa.
                </p>
                <p>
                  3. Korzystanie z Serwisu jest równoznaczne z akceptacją niniejszego regulaminu.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                § 2. Definicje
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. <strong>Serwis</strong> - serwis internetowy DlaMedica.pl dostępny pod adresem www.dlamedica.pl
                </p>
                <p>
                  2. <strong>Użytkownik</strong> - osoba fizyczna, prawna lub jednostka organizacyjna 
                  nieposiadająca osobowości prawnej, korzystająca z Serwisu
                </p>
                <p>
                  3. <strong>Konto</strong> - indywidualne konto Użytkownika w Serwisie
                </p>
                <p>
                  4. <strong>Treści</strong> - wszelkie materiały publikowane w Serwisie
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                § 3. Warunki korzystania z Serwisu
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. Korzystanie z Serwisu jest bezpłatne, chyba że w konkretnych przypadkach 
                  postanowiono inaczej.
                </p>
                <p>
                  2. Użytkownik zobowiązuje się do korzystania z Serwisu zgodnie z prawem, 
                  dobrymi obyczajami i niniejszym regulaminem.
                </p>
                <p>
                  3. Zabronione jest wykorzystywanie Serwisu do celów niezgodnych z prawem, 
                  w szczególności do naruszania praw autorskich lub innych praw własności intelektualnej.
                </p>
                <p>
                  4. Treści medyczne dostępne w Serwisie mają charakter informacyjny i edukacyjny. 
                  Nie stanowią porady medycznej ani nie zastępują konsultacji z lekarzem.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                § 4. Rejestracja konta
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. Niektóre funkcje Serwisu wymagają rejestracji konta Użytkownika.
                </p>
                <p>
                  2. Rejestracja konta jest bezpłatna i dobrowolna.
                </p>
                <p>
                  3. Użytkownik zobowiązuje się do podania prawdziwych danych podczas rejestracji.
                </p>
                <p>
                  4. Użytkownik jest odpowiedzialny za zachowanie poufności danych dostępowych 
                  do swojego konta.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                § 5. Prawa autorskie
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. Wszystkie treści publikowane w Serwisie podlegają ochronie prawnej.
                </p>
                <p>
                  2. Kopiowanie, rozpowszechnianie i wykorzystywanie treści bez zgody 
                  właściciela praw autorskich jest zabronione.
                </p>
                <p>
                  3. Dozwolone jest cytowanie fragmentów treści w celach edukacyjnych 
                  z podaniem źródła.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                § 6. Odpowiedzialność
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. Serwis nie ponosi odpowiedzialności za decyzje podjęte przez Użytkowników 
                  na podstawie informacji zawartych w Serwisie.
                </p>
                <p>
                  2. Informacje medyczne mają charakter ogólny i nie zastępują indywidualnej 
                  konsultacji medycznej.
                </p>
                <p>
                  3. Serwis dołożył wszelkich starań, aby informacje były aktualne i rzetelne, 
                  jednak nie gwarantuje ich kompletności i dokładności.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className={`${fontSizes.sectionTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                § 7. Postanowienia końcowe
              </h2>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>
                  1. Serwis zastrzega sobie prawo do zmiany regulaminu w dowolnym czasie.
                </p>
                <p>
                  2. O zmianach w regulaminie Użytkownicy zostaną poinformowani przez 
                  publikację nowej wersji na stronie Serwisu.
                </p>
                <p>
                  3. W sprawach nieuregulowanych niniejszym regulaminem stosuje się 
                  przepisy prawa polskiego.
                </p>
                <p>
                  4. Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby 
                  administratora Serwisu.
                </p>
              </div>
            </section>

            {/* Contact info */}
            <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-center">
                <h3 className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Kontakt
                </h3>
                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  W przypadku pytań dotyczących regulaminu, prosimy o kontakt:
                </p>
                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Email: kontakt@dlamedica.pl<br />
                  Telefon: +48 123 456 789
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;