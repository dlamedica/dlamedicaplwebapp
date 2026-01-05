import { EnhancedDrug } from '../types/drug';

interface SubstituteSearchCriteria {
  activeSubstance: string;
  strength?: string;
  pharmaceuticalForm?: string;
  excludeDrugId: string;
}

interface DrugSubstitute {
  drug: EnhancedDrug;
  matchScore: number;
  matchReasons: string[];
}

class DrugSubstitutesService {
  /**
   * Znajdź zamienniki dla danego leku
   */
  findSubstitutes(
    drug: EnhancedDrug,
    allDrugs: EnhancedDrug[],
    options: {
      strictMatch?: boolean;
      includeGenerics?: boolean;
      includeBranded?: boolean;
    } = {}
  ): DrugSubstitute[] {
    const {
      strictMatch = false,
      includeGenerics = true,
      includeBranded = true
    } = options;

    const substitutes: DrugSubstitute[] = [];

    // Podstawowe kryteria wyszukiwania
    const searchCriteria: SubstituteSearchCriteria = {
      activeSubstance: drug.commonName || drug.activeSubstances.join(', '),
      strength: drug.strength,
      pharmaceuticalForm: drug.pharmaceuticalForm,
      excludeDrugId: drug.id
    };

    // Przeszukaj wszystkie leki
    allDrugs.forEach(candidateDrug => {
      // Pomiń ten sam lek
      if (candidateDrug.id === drug.id) return;

      // Pomiń wycofane leki
      if (candidateDrug.status === 'withdrawn') return;

      const matchReasons: string[] = [];
      let matchScore = 0;

      // Sprawdź substancję czynną
      const hasMatchingSubstance = this.checkActiveSubstanceMatch(
        drug,
        candidateDrug
      );

      if (!hasMatchingSubstance) return; // Substancja czynna musi się zgadzać

      matchReasons.push('Ta sama substancja czynna');
      matchScore += 40;

      // Sprawdź moc
      if (drug.strength && candidateDrug.strength) {
        const strengthMatch = this.checkStrengthMatch(
          drug.strength,
          candidateDrug.strength
        );

        if (strictMatch && !strengthMatch.exact) return;

        if (strengthMatch.exact) {
          matchReasons.push('Ta sama moc');
          matchScore += 30;
        } else if (strengthMatch.similar) {
          matchReasons.push('Podobna moc');
          matchScore += 15;
        }
      }

      // Sprawdź postać farmaceutyczną
      const formMatch = this.checkPharmaceuticalFormMatch(
        drug.pharmaceuticalForm,
        candidateDrug.pharmaceuticalForm
      );

      if (strictMatch && !formMatch.exact) return;

      if (formMatch.exact) {
        matchReasons.push('Ta sama postać');
        matchScore += 20;
      } else if (formMatch.compatible) {
        matchReasons.push('Kompatybilna postać');
        matchScore += 10;
      }

      // Sprawdź typ leku (generyczny vs markowy)
      const isGeneric = this.isGenericDrug(candidateDrug);
      if (!includeGenerics && isGeneric) return;
      if (!includeBranded && !isGeneric) return;

      if (isGeneric) {
        matchReasons.push('Lek generyczny');
        matchScore += 5;
      }

      // Sprawdź refundację
      if (this.hasRefundation(candidateDrug)) {
        matchReasons.push('Refundowany');
        matchScore += 5;
      }

      // Dodaj do wyników
      substitutes.push({
        drug: candidateDrug,
        matchScore,
        matchReasons
      });
    });

    // Posortuj według dopasowania
    return substitutes.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Sprawdź czy substancje czynne się zgadzają
   */
  private checkActiveSubstanceMatch(
    drug1: EnhancedDrug,
    drug2: EnhancedDrug
  ): boolean {
    // Porównaj nazwy powszechnie stosowane
    if (drug1.commonName && drug2.commonName) {
      const name1 = this.normalizeSubstanceName(drug1.commonName);
      const name2 = this.normalizeSubstanceName(drug2.commonName);
      
      if (name1 === name2) return true;
    }

    // Porównaj listy substancji czynnych
    if (drug1.activeSubstances.length > 0 && drug2.activeSubstances.length > 0) {
      const substances1 = drug1.activeSubstances.map(s => this.normalizeSubstanceName(s));
      const substances2 = drug2.activeSubstances.map(s => this.normalizeSubstanceName(s));

      // Sprawdź czy wszystkie substancje się zgadzają
      if (substances1.length === substances2.length) {
        return substances1.every(s1 => substances2.includes(s1));
      }
    }

    return false;
  }

  /**
   * Normalizuj nazwę substancji do porównań
   */
  private normalizeSubstanceName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Usuń znaki specjalne
      .replace(/\s+/g, ' ') // Normalizuj spacje
      .trim();
  }

  /**
   * Sprawdź dopasowanie mocy
   */
  private checkStrengthMatch(
    strength1: string,
    strength2: string
  ): { exact: boolean; similar: boolean } {
    // Dokładne dopasowanie
    if (strength1 === strength2) {
      return { exact: true, similar: true };
    }

    // Wyodrębnij wartości liczbowe i jednostki
    const parsed1 = this.parseStrength(strength1);
    const parsed2 = this.parseStrength(strength2);

    if (!parsed1 || !parsed2) {
      return { exact: false, similar: false };
    }

    // Sprawdź czy jednostki są kompatybilne
    const unitsCompatible = this.areUnitsCompatible(parsed1.unit, parsed2.unit);
    if (!unitsCompatible) {
      return { exact: false, similar: false };
    }

    // Przelicz na wspólną jednostkę
    const value1 = this.convertToBaseUnit(parsed1.value, parsed1.unit);
    const value2 = this.convertToBaseUnit(parsed2.value, parsed2.unit);

    // Sprawdź podobieństwo (tolerancja 20%)
    const ratio = value1 / value2;
    const similar = ratio >= 0.8 && ratio <= 1.2;

    return { exact: false, similar };
  }

  /**
   * Parsuj moc leku
   */
  private parseStrength(strength: string): { value: number; unit: string } | null {
    const match = strength.match(/^([\d.]+)\s*(\w+)$/);
    if (!match) return null;

    return {
      value: parseFloat(match[1]),
      unit: match[2].toLowerCase()
    };
  }

  /**
   * Sprawdź czy jednostki są kompatybilne
   */
  private areUnitsCompatible(unit1: string, unit2: string): boolean {
    const massUnits = ['mg', 'g', 'mcg', 'ug'];
    const volumeUnits = ['ml', 'l'];

    const unit1InMass = massUnits.includes(unit1);
    const unit2InMass = massUnits.includes(unit2);
    const unit1InVolume = volumeUnits.includes(unit1);
    const unit2InVolume = volumeUnits.includes(unit2);

    return (unit1InMass && unit2InMass) || (unit1InVolume && unit2InVolume);
  }

  /**
   * Przelicz na jednostkę bazową
   */
  private convertToBaseUnit(value: number, unit: string): number {
    switch (unit) {
      case 'g':
        return value * 1000; // do mg
      case 'mcg':
      case 'ug':
        return value / 1000; // do mg
      case 'l':
        return value * 1000; // do ml
      default:
        return value;
    }
  }

  /**
   * Sprawdź dopasowanie postaci farmaceutycznej
   */
  private checkPharmaceuticalFormMatch(
    form1: string,
    form2: string
  ): { exact: boolean; compatible: boolean } {
    const normalized1 = form1.toLowerCase();
    const normalized2 = form2.toLowerCase();

    // Dokładne dopasowanie
    if (normalized1 === normalized2) {
      return { exact: true, compatible: true };
    }

    // Grupy kompatybilnych postaci
    const compatibilityGroups = [
      ['tabletki', 'tabletki powlekane', 'tabletki dojelitowe', 'tabletki o przedłużonym uwalnianiu'],
      ['kapsułki', 'kapsułki twarde', 'kapsułki miękkie', 'kapsułki dojelitowe'],
      ['syrop', 'roztwór doustny', 'zawiesina doustna'],
      ['krople', 'krople doustne', 'krople do oczu', 'krople do uszu'],
      ['maść', 'krem', 'żel'],
      ['roztwór do wstrzykiwań', 'roztwór do infuzji', 'koncentrat do sporządzania roztworu']
    ];

    // Sprawdź kompatybilność
    for (const group of compatibilityGroups) {
      const form1InGroup = group.some(f => normalized1.includes(f));
      const form2InGroup = group.some(f => normalized2.includes(f));
      
      if (form1InGroup && form2InGroup) {
        return { exact: false, compatible: true };
      }
    }

    return { exact: false, compatible: false };
  }

  /**
   * Sprawdź czy lek jest generykiem
   */
  private isGenericDrug(drug: EnhancedDrug): boolean {
    const tradeName = drug.tradeName.toLowerCase();
    const commonName = (drug.commonName || '').toLowerCase();

    // Heurystyki dla generyków
    if (tradeName === commonName) return true;
    if (tradeName.includes(commonName)) return true;
    if (tradeName.includes('generic')) return true;
    
    // Sprawdź czy nazwa zawiera nazwę producenta (typowe dla generyków)
    const genericProducers = ['teva', 'sandoz', 'mylan', 'accord', 'zentiva'];
    return genericProducers.some(producer => tradeName.includes(producer));
  }

  /**
   * Sprawdź czy lek jest refundowany
   */
  private hasRefundation(drug: EnhancedDrug): boolean {
    return drug.packages.some(pkg => 
      pkg.refundationStatus === 'refunded' || 
      pkg.refundationStatus === 'partial'
    );
  }

  /**
   * Grupuj zamienniki według kategorii
   */
  groupSubstitutesByCategory(substitutes: DrugSubstitute[]): {
    exact: DrugSubstitute[];
    compatible: DrugSubstitute[];
    alternative: DrugSubstitute[];
  } {
    const exact: DrugSubstitute[] = [];
    const compatible: DrugSubstitute[] = [];
    const alternative: DrugSubstitute[] = [];

    substitutes.forEach(substitute => {
      if (substitute.matchScore >= 80) {
        exact.push(substitute);
      } else if (substitute.matchScore >= 60) {
        compatible.push(substitute);
      } else {
        alternative.push(substitute);
      }
    });

    return { exact, compatible, alternative };
  }
}

export const drugSubstitutesService = new DrugSubstitutesService();
export type { DrugSubstitute, SubstituteSearchCriteria };