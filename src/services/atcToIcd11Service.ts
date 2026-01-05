interface ICD11Indication {
  code: string;
  description: string;
  category: string;
}

class ATCToICD11Service {
  private mapping: Map<string, ICD11Indication[]> = new Map();

  constructor() {
    this.initializeMapping();
  }

  private initializeMapping(): void {
    // Mapowanie ATC -> ICD-11 na podstawie wskazań terapeutycznych
    
    // N02BE - Anilidy (paracetamol)
    this.mapping.set('N02BE01', [
      { code: 'MG30.0', description: 'Ból przewlekły', category: 'Ból' },
      { code: 'MG31.0', description: 'Ból ostry', category: 'Ból' },
      { code: '1E65', description: 'Gorączka nieznanego pochodzenia', category: 'Objawy ogólne' },
      { code: '8A00', description: 'Ból głowy napięciowy', category: 'Neurologia' }
    ]);

    // M01AE - Pochodne kwasu propionowego (ibuprofen, naproksen)
    this.mapping.set('M01AE01', [ // Ibuprofen
      { code: 'MG30.0', description: 'Ból przewlekły', category: 'Ból' },
      { code: 'FA00', description: 'Reumatoidalne zapalenie stawów', category: 'Reumatologia' },
      { code: 'FA20', description: 'Choroba zwyrodnieniowa stawów', category: 'Reumatologia' },
      { code: '8A00', description: 'Ból głowy napięciowy', category: 'Neurologia' },
      { code: 'MG31.1', description: 'Ból mięśniowo-szkieletowy', category: 'Ból' }
    ]);

    this.mapping.set('M01AE02', [ // Naproksen
      { code: 'MG30.0', description: 'Ból przewlekły', category: 'Ból' },
      { code: 'FA00', description: 'Reumatoidalne zapalenie stawów', category: 'Reumatologia' },
      { code: 'FA20', description: 'Choroba zwyrodnieniowa stawów', category: 'Reumatologia' },
      { code: '8A80', description: 'Migrena', category: 'Neurologia' },
      { code: 'GA10', description: 'Dysmenorrhea', category: 'Ginekologia' }
    ]);

    // J01CA - Penicyliny o rozszerzonym spektrum
    this.mapping.set('J01CA04', [ // Amoxicillin
      { code: 'CA40.Z', description: 'Zapalenie gardła bakteryjne', category: 'Infekcje' },
      { code: 'CA20', description: 'Zapalenie zatok', category: 'Infekcje' },
      { code: 'CA22', description: 'Ostre zapalenie ucha środkowego', category: 'Infekcje' },
      { code: 'CA78.0', description: 'Zapalenie oskrzeli', category: 'Infekcje' },
      { code: 'CA80.0', description: 'Pozaszpitalne zapalenie płuc', category: 'Infekcje' }
    ]);

    // N06BA - Sympatykomimetyki działające centralnie
    this.mapping.set('N06BA04', [ // Methylphenidate
      { code: '6A05', description: 'ADHD', category: 'Psychiatria' },
      { code: '7A00.1', description: 'Narkolepsja', category: 'Neurologia' }
    ]);

    // N02BA - Kwas salicylowy i jego pochodne
    this.mapping.set('N02BA01', [ // Kwas acetylosalicylowy
      { code: 'MG30.0', description: 'Ból przewlekły', category: 'Ból' },
      { code: '1E65', description: 'Gorączka', category: 'Objawy ogólne' },
      { code: 'BA00', description: 'Zapobieganie zawałowi serca', category: 'Kardiologia' },
      { code: '8B00', description: 'Profilaktyka udaru mózgu', category: 'Neurologia' }
    ]);

    // A11CC - Witamina D
    this.mapping.set('A11CC05', [ // Cholecalciferol
      { code: '5B5Z', description: 'Niedobór witaminy D', category: 'Endokrynologia' },
      { code: 'FB83.1', description: 'Osteoporoza', category: 'Ortopedia' },
      { code: 'FB83.4', description: 'Krzywica', category: 'Pediatria' }
    ]);

    // D03AX - Inne preparaty na rany i owrzodzenia
    this.mapping.set('D03AX03', [ // Dexpanthenol
      { code: 'EE11', description: 'Zapalenie skóry', category: 'Dermatologia' },
      { code: 'NF07', description: 'Rany powierzchowne', category: 'Chirurgia' },
      { code: 'EE90', description: 'Podrażnienia skóry', category: 'Dermatologia' }
    ]);

    // Grupy ATC - mapowanie pierwszego poziomu
    this.mapping.set('A', [ // Przewód pokarmowy i metabolizm
      { code: 'DA00-DA9Z', description: 'Choroby układu pokarmowego', category: 'Gastroenterologia' },
      { code: '5A00-5D46', description: 'Zaburzenia endokrynologiczne i metaboliczne', category: 'Endokrynologia' }
    ]);

    this.mapping.set('B', [ // Krew i układ krwiotwórczy
      { code: '3A00-3C0Z', description: 'Choroby krwi', category: 'Hematologia' }
    ]);

    this.mapping.set('C', [ // Układ sercowo-naczyniowy
      { code: 'BA00-BE2Z', description: 'Choroby układu krążenia', category: 'Kardiologia' }
    ]);

    this.mapping.set('D', [ // Leki dermatologiczne
      { code: 'EA00-EM0Z', description: 'Choroby skóry', category: 'Dermatologia' }
    ]);

    this.mapping.set('G', [ // Układ moczowo-płciowy
      { code: 'GA00-GC4Z', description: 'Choroby układu moczowo-płciowego', category: 'Urologia/Ginekologia' }
    ]);

    this.mapping.set('J', [ // Leki przeciwzakaźne
      { code: '1A00-1H0Z', description: 'Choroby zakaźne', category: 'Infekcje' }
    ]);

    this.mapping.set('L', [ // Leki przeciwnowotworowe
      { code: '2A00-2F9Z', description: 'Nowotwory', category: 'Onkologia' }
    ]);

    this.mapping.set('M', [ // Układ mięśniowo-szkieletowy
      { code: 'FA00-FC0Z', description: 'Choroby układu mięśniowo-szkieletowego', category: 'Ortopedia/Reumatologia' }
    ]);

    this.mapping.set('N', [ // Układ nerwowy
      { code: '8A00-8E7Z', description: 'Choroby układu nerwowego', category: 'Neurologia' },
      { code: '6A00-6E8Z', description: 'Zaburzenia psychiczne', category: 'Psychiatria' }
    ]);

    this.mapping.set('R', [ // Układ oddechowy
      { code: 'CA00-CB7Z', description: 'Choroby układu oddechowego', category: 'Pulmonologia' }
    ]);

    this.mapping.set('S', [ // Narządy zmysłów
      { code: '9A00-9E1Z', description: 'Choroby narządów zmysłów', category: 'Okulistyka/Laryngologia' }
    ]);
  }

  getIndicationsForATC(atcCode: string): ICD11Indication[] {
    // Sprawdź dokładny kod ATC
    if (this.mapping.has(atcCode)) {
      return this.mapping.get(atcCode) || [];
    }

    // Sprawdź grupę ATC (pierwszy poziom)
    const atcGroup = atcCode.charAt(0);
    if (this.mapping.has(atcGroup)) {
      return this.mapping.get(atcGroup) || [];
    }

    // Sprawdź podgrupę (pierwsze 3 znaki)
    const atcSubgroup = atcCode.substring(0, 3);
    if (this.mapping.has(atcSubgroup)) {
      return this.mapping.get(atcSubgroup) || [];
    }

    // Sprawdź podgrupę chemiczną (pierwsze 5 znaków)
    const atcChemicalSubgroup = atcCode.substring(0, 5);
    if (this.mapping.has(atcChemicalSubgroup)) {
      return this.mapping.get(atcChemicalSubgroup) || [];
    }

    return [];
  }

  searchByIndication(icd11Code: string): string[] {
    const atcCodes: string[] = [];
    
    this.mapping.forEach((indications, atcCode) => {
      if (indications.some(ind => ind.code === icd11Code)) {
        atcCodes.push(atcCode);
      }
    });

    return atcCodes;
  }

  getIndicationCategories(): string[] {
    const categories = new Set<string>();
    
    this.mapping.forEach(indications => {
      indications.forEach(ind => categories.add(ind.category));
    });

    return Array.from(categories).sort();
  }
}

export const atcToIcd11Service = new ATCToICD11Service();
export type { ICD11Indication };