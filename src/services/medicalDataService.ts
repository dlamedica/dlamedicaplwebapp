interface MedicalData {
  wskazania: string[];
  przeciwwskazania: string[];
  dawkowanie: {
    dorośli: string;
    dzieci?: string;
    osobyStarsze?: string;
    uwagi?: string;
  };
  ostrzeżenia: string[];
  interakcje?: string[];
}

interface ATCMedicalData {
  [atcCode: string]: MedicalData;
}

class MedicalDataService {
  private medicalData: ATCMedicalData = {
    'N02BE01': { // Paracetamol
      wskazania: [
        'Łagodny do umiarkowanego ból (ból głowy, ból zębów, bóle mięśniowe)',
        'Gorączka (w tym gorączka u dzieci)',
        'Ból pooperacyjny (jako część terapii wielolekowej)',
        'Ból przy przeziębieniu i grypie',
        'Ból związany z dysmenoreą'
      ],
      przeciwwskazania: [
        'Nadwrażliwość na paracetamol lub którąkolwiek substancję pomocniczą',
        'Ciężka niewydolność wątroby (Child-Pugh klasa C)',
        'Aktywna choroba wątroby',
        'Nadużywanie alkoholu (ryzyko hepatotoksyczności)'
      ],
      dawkowanie: {
        dorośli: '500-1000 mg co 4-6 godzin, maksymalnie 4000 mg/dobę',
        dzieci: 'Dzieci >12 lat: jak dorośli. Dzieci 6-12 lat: 250-500 mg co 4-6h',
        osobyStarsze: 'Bez konieczności modyfikacji dawki przy prawidłowej funkcji wątroby',
        uwagi: 'Nie przekraczać maksymalnej dawki dobowej. Odstęp między dawkami min. 4h'
      },
      ostrzeżenia: [
        'Ryzyko ciężkiego uszkodzenia wątroby przy przedawkowaniu',
        'Ostrożność u pacjentów z chorobami wątroby',
        'Może maskować objawy poważnych infekcji',
        'Uważać na inne leki zawierające paracetamol'
      ],
      interakcje: [
        'Warfaryna - zwiększone ryzyko krwawienia',
        'Alkohol - zwiększone ryzyko hepatotoksyczności',
        'Karbamazepina, fenytoina - zmniejszone działanie paracetamolu'
      ]
    },

    'M01AE01': { // Ibuprofen
      wskazania: [
        'Łagodny do umiarkowanego ból (ból głowy, ból zębów, bóle mięśniowe)',
        'Stany zapalne stawów (reumatoidalne zapalenie stawów, choroba zwyrodnieniowa)',
        'Gorączka u dorosłych i dzieci >6 miesięcy',
        'Dysmenorrhea (bolesne miesiączki)',
        'Ból pooperacyjny i pourazowy'
      ],
      przeciwwskazania: [
        'Nadwrażliwość na ibuprofen, aspirynę lub inne NLPZ',
        'Czynne owrzodzenie żołądka lub dwunastnicy',
        'Ciężka niewydolność serca, wątroby lub nerek',
        'Ostatni trymestr ciąży',
        'Historia krwawień lub perforacji GI związanych z NLPZ'
      ],
      dawkowanie: {
        dorośli: '200-400 mg co 4-6 godzin, maksymalnie 1200 mg/dobę (bez recepty)',
        dzieci: 'Dzieci >6 m-cy: 5-10 mg/kg mc. co 6-8h, maks. 30 mg/kg mc./dobę',
        osobyStarsze: 'Rozpocząć od najmniejszej skutecznej dawki',
        uwagi: 'Przyjmować z jedzeniem aby zmniejszyć ryzyko podrażnień GI'
      },
      ostrzeżenia: [
        'Zwiększone ryzyko zawału serca i udaru mózgu',
        'Ryzyko krwawień z przewodu pokarmowego',
        'Może pogorszyć funkcję nerek',
        'Ostrożność u pacjentów z astmą'
      ],
      interakcje: [
        'Warfaryna - zwiększone ryzyko krwawienia',
        'ACE-inhibitory - zmniejszone działanie hipotensyjne',
        'Metotreksat - zwiększona toksyczność',
        'Lit - zwiększone stężenie litu'
      ]
    },

    'J01CA04': { // Amoksycylina
      wskazania: [
        'Zakażenia dróg oddechowych (zapalenie oskrzeli, płuc)',
        'Zakażenia dróg moczowych',
        'Zakażenia skóry i tkanek miękkich',
        'Zakażenia jamy ustnej (w tym ropnie zębowe)',
        'Eradykacja Helicobacter pylori (w skojarzeniu z innymi lekami)'
      ],
      przeciwwskazania: [
        'Nadwrażliwość na amoksycylinę, penicyliny lub beta-laktamy',
        'Mononukleoza zakaźna (ryzyko wysypki)',
        'Ostra białaczka limfatyczna'
      ],
      dawkowanie: {
        dorośli: '250-500 mg co 8 godzin lub 500-875 mg co 12 godzin',
        dzieci: '20-40 mg/kg mc./dobę podzielone na 2-3 dawki',
        uwagi: 'Można przyjmować niezależnie od posiłków. Kontynuować 2-3 dni po ustąpieniu objawów'
      },
      ostrzeżenia: [
        'Ryzyko zapalenia jelita grubego związanego z C. difficile',
        'Możliwość rozwoju nadwrażliwości typu I',
        'Może zmniejszyć skuteczność doustnych środków antykoncepcyjnych'
      ],
      interakcje: [
        'Allopurynol - zwiększone ryzyko wysypki skórnej',
        'Metotreksat - zwiększona toksyczność metotreksatu',
        'Doustne antykoncepcyjne - zmniejszona skuteczność'
      ]
    },

    'M05BA08': { // Kwas zoledronowy (Zoledronic acid)
      wskazania: [
        'Zapobieganie powikłaniom kostnym u dorosłych pacjentów z zaawansowanymi nowotworami z zajęciem kości',
        'Leczenie hiperkalcemii wywołanej nowotworem',
        'Leczenie osteoporozy u kobiet po menopauzie oraz u mężczyzn ze zwiększonym ryzykiem złamań',
        'Leczenie osteoporozy związanej ze stosowaniem glikokortykosteroidów',
        'Leczenie choroby Pageta kości'
      ],
      przeciwwskazania: [
        'Nadwrażliwość na kwas zoledronowy lub inne bisfosfoniany',
        'Ciężkie zaburzenia czynności nerek (klirens kreatyniny < 35 ml/min)',
        'Ciąża i okres karmienia piersią',
        'Niekorygowana hipokalcemia'
      ],
      dawkowanie: {
        dorośli: 'Osteoporoza: 5 mg we wlewie dożylnym raz na rok. Nowotwory: 4 mg co 3-4 tygodnie',
        dzieci: 'Nie ustalono bezpieczeństwa stosowania u dzieci',
        osobyStarsze: 'Bez konieczności dostosowania dawki przy prawidłowej czynności nerek',
        uwagi: 'Wlew dożylny trwający nie krócej niż 15 minut. Zapewnić odpowiednie nawodnienie pacjenta'
      },
      ostrzeżenia: [
        'Monitorować funkcję nerek przed każdym podaniem',
        'Ryzyko martwicy kości szczęki - konsultacja stomatologiczna przed leczeniem',
        'Możliwe objawy grypopodobne po pierwszym podaniu',
        'Konieczna suplementacja wapnia i witaminy D',
        'Ryzyko hipokalcemii - kontrolować poziom wapnia'
      ],
      interakcje: [
        'Aminoglikozydy - nasilenie działania obniżającego poziom wapnia',
        'Leki nefrotoksyczne - zwiększone ryzyko zaburzeń czynności nerek',
        'Talidomid - zwiększone ryzyko uszkodzenia nerek u pacjentów ze szpiczakiem'
      ]
    },

    'C09AA02': { // Enalapril
      wskazania: [
        'Nadciśnienie tętnicze',
        'Niewydolność serca',
        'Zapobieganie progresji nefropatii u pacjentów z cukrzycą',
        'Asymptomatyczna dysfunkcja lewej komory'
      ],
      przeciwwskazania: [
        'Nadwrażliwość na enalapril lub inne ACE-inhibitory',
        'Obrzęk naczynioruchowy w wywiadzie',
        'Dwustronne zwężenie tętnic nerkowych',
        'Ciąża i karmienie piersią'
      ],
      dawkowanie: {
        dorośli: 'Nadciśnienie: 5-10 mg 1-2x/dobę. Niewydolność serca: 2,5 mg 2x/dobę początkowo',
        osobyStarsze: 'Rozpocząć od mniejszych dawek (2,5 mg 1-2x/dobę)',
        uwagi: 'Monitorować ciśnienie krwi i funkcję nerek. Zwiększać dawkę stopniowo'
      },
      ostrzeżenia: [
        'Ryzyko obrzęku naczynioruchowego',
        'Hiperkaliemia, szczególnie przy niewydolności nerek',
        'Spadek ciśnienia po pierwszej dawce',
        'Pogorszenie funkcji nerek u niektórych pacjentów'
      ],
      interakcje: [
        'Diuretyki oszczędzające potas - ryzyko hiperkaliemii',
        'NLPZ - zmniejszone działanie hipotensyjne',
        'Lit - zwiększone stężenie litu'
      ]
    },

    'C07AB07': { // Bisoprolol
      wskazania: [
        'Nadciśnienie tętnicze',
        'Przewlekła niewydolność serca ze zmniejszoną frakcją wyrzutową',
        'Choroba wieńcowa (profilaktyka wtórna po zawale serca)'
      ],
      przeciwwskazania: [
        'Niewydolność serca w stanie dekompensacji',
        'Szok kardiogenny',
        'Blok AV II i III stopnia',
        'Ciężka astma oskrzelowa lub POChP',
        'Ciężka hipotonia'
      ],
      dawkowanie: {
        dorośli: 'Nadciśnienie: 5 mg 1x/dobę. Niewydolność serca: 1,25 mg 1x/dobę początkowo',
        osobyStarsze: 'Bez konieczności modyfikacji dawki',
        uwagi: 'Nie przerywać nagłe leczenia. Zwiększać dawkę stopniowo co 1-2 tygodnie'
      },
      ostrzeżenia: [
        'Nie przerywać nagłe (ryzyko zespołu odstawienia)',
        'Może maskować objawy hipoglikemii u diabetyków',
        'Ostrożność u pacjentów z POChP',
        'Może nasilić objawy choroby naczyń obwodowych'
      ]
    },

    'A02BC01': { // Omeprazol
      wskazania: [
        'Choroba wrzodowa żołądka i dwunastnicy',
        'Choroba refluksowa przełyku (GERD)',
        'Eradykacja Helicobacter pylori (w skojarzeniu z antybiotykami)',
        'Zespół Zollingera-Ellisona',
        'Profilaktyka wrzodów wywołanych przez NLPZ'
      ],
      przeciwwskazania: [
        'Nadwrażliwość na omeprazol lub inne inhibitory pompy protonowej',
        'Jednoczesne stosowanie z nelfinavirem'
      ],
      dawkowanie: {
        dorośli: 'GERD: 20 mg 1x/dobę. Wrzody: 20-40 mg 1x/dobę przez 4-8 tygodni',
        uwagi: 'Przyjmować na czczo, 30-60 minut przed jedzeniem. Kapsułki połykać w całości'
      },
      ostrzeżenia: [
        'Długotrwałe stosowanie może zwiększać ryzyko złamań',
        'Może zmniejszać wchłanianie witaminy B12 i magnezu',
        'Ryzyko zakażeń Clostridium difficile',
        'Możliwe interakcje z wieloma lekami'
      ],
      interakcje: [
        'Warfaryna - zwiększenie INR',
        'Klopidogrel - zmniejszenie działania przeciwpłytkowego',
        'Digoksyna - zwiększone wchłanianie digoksyny'
      ]
    }
  };

  /**
   * Pobierz dane medyczne dla danego kodu ATC
   */
  getMedicalDataByATC(atcCode: string): MedicalData | null {
    return this.medicalData[atcCode] || null;
  }

  /**
   * Sprawdź czy mamy dane medyczne dla danego kodu ATC
   */
  hasMedicalData(atcCode: string): boolean {
    return atcCode in this.medicalData;
  }

  /**
   * Pobierz wszystkie dostępne kody ATC z danymi medycznymi
   */
  getAvailableATCCodes(): string[] {
    return Object.keys(this.medicalData);
  }

  /**
   * Wyszukaj dane medyczne na podstawie nazwy substancji czynnej
   */
  searchByActiveSubstance(substanceName: string): { atcCode: string; data: MedicalData } | null {
    const normalized = substanceName.toLowerCase().trim();
    
    // Mapowanie nazw substancji na kody ATC
    const substanceToATC: { [key: string]: string } = {
      'paracetamol': 'N02BE01',
      'acetaminophen': 'N02BE01',
      'ibuprofen': 'M01AE01',
      'amoxicillin': 'J01CA04',
      'amoksycylina': 'J01CA04',
      'enalapril': 'C09AA02',
      'bisoprolol': 'C07AB07',
      'omeprazol': 'A02BC01',
      'omeprazole': 'A02BC01',
      'zoledronic acid': 'M05BA08',
      'kwas zoledronowy': 'M05BA08',
      'acidum zoledronicum': 'M05BA08'
    };

    const atcCode = substanceToATC[normalized];
    if (atcCode && this.medicalData[atcCode]) {
      return {
        atcCode,
        data: this.medicalData[atcCode]
      };
    }

    return null;
  }
}

export const medicalDataService = new MedicalDataService();
export type { MedicalData };