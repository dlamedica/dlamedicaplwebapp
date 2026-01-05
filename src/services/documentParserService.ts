interface DocumentSection {
  dawkowanie: string;
  przeciwwskazania: string;
  wskazania: string;
}

interface DefaultDrugData {
  [key: string]: DocumentSection;
}

class DocumentParserService {
  // Domyślne dane dla popularnych leków
  private defaultData: DefaultDrugData = {
    'N02BE01': { // Paracetamol
      dawkowanie: 'Dorośli i dzieci powyżej 12 lat: 500-1000 mg co 4-6 godzin. Maksymalnie 4000 mg na dobę. Dzieci 6-12 lat: 250-500 mg co 4-6 godzin.',
      przeciwwskazania: 'Nadwrażliwość na paracetamol, ciężka niewydolność wątroby, nadużywanie alkoholu.',
      wskazania: 'Ból łagodny do umiarkowany różnego pochodzenia, gorączka.'
    },
    'M01AE01': { // Ibuprofen
      dawkowanie: 'Dorośli: 200-400 mg co 4-6 godzin. Maksymalnie 1200 mg na dobę. Dzieci: 20-30 mg/kg mc./dobę w 3-4 dawkach podzielonych.',
      przeciwwskazania: 'Nadwrażliwość na ibuprofen, czynna choroba wrzodowa, ciężka niewydolność serca, wątroby lub nerek.',
      wskazania: 'Stany zapalne i bólowe układu mięśniowo-szkieletowego, ból głowy, ból zębów, gorączka.'
    },
    'M01AE02': { // Naproksen
      dawkowanie: 'Dorośli: 275-550 mg co 12 godzin. Nie przekraczać 1100 mg na dobę. Przyjmować z posiłkiem.',
      przeciwwskazania: 'Nadwrażliwość na naproksen, astma aspirynowa, czynna choroba wrzodowa żołądka.',
      wskazania: 'Reumatoidalne zapalenie stawów, choroba zwyrodnieniowa stawów, ból mięśniowy, migrena.'
    },
    'J01CA04': { // Amoxicillin
      dawkowanie: 'Dorośli: 250-500 mg co 8 godzin lub 500-875 mg co 12 godzin. Dzieci: 20-40 mg/kg mc./dobę w dawkach podzielonych.',
      przeciwwskazania: 'Nadwrażliwość na amoksycylinę lub inne penicyliny, mononukleoza zakaźna.',
      wskazania: 'Zakażenia bakteryjne: górnych i dolnych dróg oddechowych, układu moczowego, skóry i tkanek miękkich.'
    },
    'A11CC05': { // Witamina D3
      dawkowanie: 'Dorośli: 800-2000 j.m. dziennie. Dzieci: 400-800 j.m. dziennie. Najlepiej z posiłkiem zawierającym tłuszcz.',
      przeciwwskazania: 'Hiperkalcemia, hiperkalciuria, kamica nerkowa wapniowa, sarkoidoza.',
      wskazania: 'Profilaktyka i leczenie niedoboru witaminy D, wspomaganie leczenia osteoporozy.'
    },
    'D03AX03': { // Dexpanthenol
      dawkowanie: 'Stosować miejscowo 1-3 razy dziennie na oczyszczoną skórę. U niemowląt po każdej zmianie pieluchy.',
      przeciwwskazania: 'Nadwrażliwość na dexpanthenol lub inne składniki preparatu.',
      wskazania: 'Regeneracja skóry, oparzenia słoneczne, odparzenia u niemowląt, drobne uszkodzenia skóry.'
    }
  };

  async parseLeaflet(drugId: string): Promise<DocumentSection> {
    try {
      // Spróbuj pobrać dokument z API
      const url = `https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${drugId}/leaflet`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return this.getDefaultData(drugId);
      }

      const text = await response.text();
      
      // Wyciągnij sekcje używając regex
      const sections = {
        dawkowanie: this.extractSection(text, 'DAWKOWANIE', 'PRZECIWWSKAZANIA') || 
                   this.extractSection(text, 'Dawkowanie', 'Przeciwwskazania') ||
                   'Informacje o dawkowaniu dostępne w ulotce leku.',
        przeciwwskazania: this.extractSection(text, 'PRZECIWWSKAZANIA', 'OSTRZEŻENIA') ||
                         this.extractSection(text, 'Przeciwwskazania', 'Ostrzeżenia') ||
                         'Informacje o przeciwwskazaniach dostępne w ulotce leku.',
        wskazania: this.extractSection(text, 'WSKAZANIA', 'DAWKOWANIE') ||
                  this.extractSection(text, 'Wskazania', 'Dawkowanie') ||
                  'Informacje o wskazaniach dostępne w ulotce leku.'
      };
      
      return sections;
    } catch (error) {
      console.warn('Nie udało się pobrać dokumentu, używam danych domyślnych:', error);
      return this.getDefaultData(drugId);
    }
  }

  private extractSection(text: string, startMarker: string, endMarker: string): string {
    try {
      const regex = new RegExp(`${startMarker}[:\\s]*([\\s\\S]*?)(?=${endMarker}|$)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1]
          .trim()
          .replace(/\s+/g, ' ')
          .substring(0, 500) + '...'; // Ogranicz długość
      }
      return '';
    } catch (error) {
      return '';
    }
  }

  private getDefaultData(drugId: string): DocumentSection {
    // Spróbuj znaleźć po dokładnym ID
    if (this.defaultData[drugId]) {
      return this.defaultData[drugId];
    }

    // Spróbuj znaleźć po kodzie ATC (pierwsze 5 znaków)
    const atcCode = drugId.substring(0, 5);
    if (this.defaultData[atcCode]) {
      return this.defaultData[atcCode];
    }

    // Jeśli nie znaleziono, zwróć ogólne informacje
    return {
      dawkowanie: 'Dawkowanie należy ustalić z lekarzem lub farmaceutą zgodnie z ulotką leku.',
      przeciwwskazania: 'Szczegółowe przeciwwskazania znajdują się w ulotce leku.',
      wskazania: 'Szczegółowe wskazania do stosowania znajdują się w ulotce leku.'
    };
  }

  // Dodaj więcej danych dla innych leków
  addDefaultData(drugId: string, data: DocumentSection): void {
    this.defaultData[drugId] = data;
  }

  // Pobierz wszystkie dostępne leki z danymi domyślnymi
  getAvailableDrugs(): string[] {
    return Object.keys(this.defaultData);
  }
}

export const documentParserService = new DocumentParserService();
export type { DocumentSection };