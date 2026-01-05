import { ATCToICD11Mapping } from '../types/drug';

/**
 * Mapowanie kodów ATC na wskazania ICD-11
 * Przykładowe mapowania dla najczęściej używanych leków
 */
export const atcToIcd11Mapping: ATCToICD11Mapping = {
  // Paracetamol - N02BE01
  'N02BE01': {
    primaryIndications: [
      { code: 'MG30.0', name: 'Ból głowy', category: 'primary' },
      { code: 'MG30.2', name: 'Migrenowy ból głowy', category: 'primary' },
      { code: 'MG30.6', name: 'Napięciowy ból głowy', category: 'primary' },
      { code: 'MG50.2', name: 'Gorączka', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'secondary' },
      { code: 'MG30.1', name: 'Inne bóle głowy', category: 'secondary' }
    ]
  },
  
  // Ibuprofen - M01AE01
  'M01AE01': {
    primaryIndications: [
      { code: 'FA25', name: 'Reumatoidalne zapalenie stawów', category: 'primary' },
      { code: 'FA20', name: 'Choroba zwyrodnieniowa stawów', category: 'primary' },
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'primary' },
      { code: 'MG30.0', name: 'Ból głowy', category: 'primary' },
      { code: 'MG50.2', name: 'Gorączka', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'FB56.0', name: 'Zapalenie mięśni', category: 'secondary' },
      { code: 'FB85.1', name: 'Dysmenorrhea', category: 'secondary' }
    ]
  },
  
  // Aspirin - N02BA01
  'N02BA01': {
    primaryIndications: [
      { code: 'BA01', name: 'Profilaktyka zakrzepicy', category: 'primary' },
      { code: 'BD10', name: 'Choroba niedokrwienna serca', category: 'primary' },
      { code: 'MG30.0', name: 'Ból głowy', category: 'primary' },
      { code: 'MG50.2', name: 'Gorączka', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'secondary' },
      { code: 'BD11', name: 'Udar mózgu - profilaktyka', category: 'secondary' }
    ]
  },
  
  // Amoxicillin - J01CA04
  'J01CA04': {
    primaryIndications: [
      { code: 'CA40.0', name: 'Zapalenie płuc bakteryjne', category: 'primary' },
      { code: 'CA21.0', name: 'Zapalenie oskrzeli bakteryjne', category: 'primary' },
      { code: 'GC08.0', name: 'Zakażenie układu moczowego', category: 'primary' },
      { code: '1C62.0', name: 'Zapalenie ucha środkowego', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'DA06.0', name: 'Zakażenia skóry i tkanek miękkich', category: 'secondary' },
      { code: '1C1Z', name: 'Zakażenia jamy ustnej', category: 'secondary' }
    ]
  },
  
  // Metformin - A10BA02
  'A10BA02': {
    primaryIndications: [
      { code: '5A11', name: 'Cukrzyca typu 2', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '5A10', name: 'Cukrzyca typu 1 (terapia skojarzona)', category: 'secondary' },
      { code: '5E64', name: 'Zespół policystycznych jajników', category: 'off-label' }
    ]
  },
  
  // Simvastatin - C10AA01
  'C10AA01': {
    primaryIndications: [
      { code: '5C80.0', name: 'Hipercholesterolemia', category: 'primary' },
      { code: '5C80.2', name: 'Dyslipidemia mieszana', category: 'primary' },
      { code: 'BD10', name: 'Profilaktyka choroby wieńcowej', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '5C80.1', name: 'Hipertriglicerydemia', category: 'secondary' }
    ]
  },
  
  // Amlodipine - C08CA01
  'C08CA01': {
    primaryIndications: [
      { code: 'BA00', name: 'Nadciśnienie tętnicze', category: 'primary' },
      { code: 'BD10.1', name: 'Stabilna choroba wieńcowa', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'BD10.0', name: 'Dławica piersiowa', category: 'secondary' }
    ]
  },
  
  // Omeprazole - A02BC01
  'A02BC01': {
    primaryIndications: [
      { code: 'DA60.0', name: 'Choroba wrzodowa żołądka', category: 'primary' },
      { code: 'DA61.0', name: 'Choroba wrzodowa dwunastnicy', category: 'primary' },
      { code: 'DA22', name: 'Choroba refluksowa przełyku', category: 'primary' },
      { code: 'DA22.0', name: 'Zapalenie przełyku', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'DA60.1', name: 'Zespół Zollingera-Ellisona', category: 'secondary' }
    ]
  },
  
  // Levothyroxine - H03AA01
  'H03AA01': {
    primaryIndications: [
      { code: '5A00.0', name: 'Niedoczynność tarczycy', category: 'primary' },
      { code: '5A03', name: 'Wole tarczycy', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '5A01.0', name: 'Zapalenie tarczycy Hashimoto', category: 'secondary' }
    ]
  },
  
  // Salbutamol - R03AC02
  'R03AC02': {
    primaryIndications: [
      { code: 'CA25.0', name: 'Astma oskrzelowa', category: 'primary' },
      { code: 'CA22', name: 'Przewlekła obturacyjna choroba płuc', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'CA21.1', name: 'Zapalenie oskrzeli z obturacją', category: 'secondary' }
    ]
  },
  
  // Diazepam - N05BA01
  'N05BA01': {
    primaryIndications: [
      { code: '6B00', name: 'Zaburzenia lękowe', category: 'primary' },
      { code: '6A41', name: 'Bezsenność', category: 'primary' },
      { code: '8A62', name: 'Drgawki', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'FB56.5', name: 'Spastyczność mięśniowa', category: 'secondary' }
    ]
  },
  
  // Furosemide - C03CA01
  'C03CA01': {
    primaryIndications: [
      { code: 'BD50', name: 'Niewydolność serca', category: 'primary' },
      { code: 'GB90.4', name: 'Obrzęki', category: 'primary' },
      { code: 'BA00', name: 'Nadciśnienie tętnicze', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'GB40.1', name: 'Przewlekła choroba nerek z obrzękami', category: 'secondary' }
    ]
  },
  
  // Warfarin - B01AA03
  'B01AA03': {
    primaryIndications: [
      { code: 'BC41', name: 'Migotanie przedsionków', category: 'primary' },
      { code: 'BD52.3', name: 'Zakrzepica żył głębokich', category: 'primary' },
      { code: 'CB03', name: 'Zatorowość płucna', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'BD10.2', name: 'Profilaktyka zakrzepicy w chorobie wieńcowej', category: 'secondary' }
    ]
  },
  
  // Morphine - N02AA01
  'N02AA01': {
    primaryIndications: [
      { code: 'MG30.4', name: 'Przewlekły ból', category: 'primary' },
      { code: 'MG30.3', name: 'Ostry ból pooperacyjny', category: 'primary' },
      { code: '2C78.Z', name: 'Ból nowotworowy', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'BD50.1', name: 'Ostry obrzęk płuc', category: 'secondary' }
    ]
  },
  
  // Insulin - A10AB01 (Human insulin)
  'A10AB01': {
    primaryIndications: [
      { code: '5A10', name: 'Cukrzyca typu 1', category: 'primary' },
      { code: '5A11', name: 'Cukrzyca typu 2', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '5A13', name: 'Cukrzyca ciążowa', category: 'secondary' }
    ]
  },

  // Naproxen - M01AE02
  'M01AE02': {
    primaryIndications: [
      { code: 'FA25', name: 'Reumatoidalne zapalenie stawów', category: 'primary' },
      { code: 'FA20', name: 'Choroba zwyrodnieniowa stawów', category: 'primary' },
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'primary' },
      { code: 'MG30.0', name: 'Ból głowy', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'FB85.1', name: 'Dysmenorrhea', category: 'secondary' },
      { code: 'MG30.2', name: 'Migrenowy ból głowy', category: 'secondary' }
    ]
  },

  // Ketoprofen - M01AE03
  'M01AE03': {
    primaryIndications: [
      { code: 'FA25', name: 'Reumatoidalne zapalenie stawów', category: 'primary' },
      { code: 'FA20', name: 'Choroba zwyrodnieniowa stawów', category: 'primary' },
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'primary' },
      { code: 'FB56.0', name: 'Zapalenie mięśni', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'MG30.0', name: 'Ból głowy', category: 'secondary' }
    ]
  },

  // Diclofenac - M01AB05
  'M01AB05': {
    primaryIndications: [
      { code: 'FA25', name: 'Reumatoidalne zapalenie stawów', category: 'primary' },
      { code: 'FA20', name: 'Choroba zwyrodnieniowa stawów', category: 'primary' },
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'primary' },
      { code: 'MG30.3', name: 'Ostry ból pooperacyjny', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'FB85.1', name: 'Dysmenorrhea', category: 'secondary' },
      { code: '9A60.00', name: 'Zapalenie spojówek', category: 'secondary' }
    ]
  },

  // Cetirizine - R06AE07
  'R06AE07': {
    primaryIndications: [
      { code: '4A85', name: 'Pokrzywka', category: 'primary' },
      { code: 'CA08.0', name: 'Alergiczny nieżyt nosa', category: 'primary' },
      { code: '9A61.1', name: 'Alergiczne zapalenie spojówek', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'EA85', name: 'Egzema alergiczna', category: 'secondary' },
      { code: '4A84', name: 'Inne reakcje alergiczne', category: 'secondary' }
    ]
  },

  // Loratadine - R06AX13
  'R06AX13': {
    primaryIndications: [
      { code: '4A85', name: 'Pokrzywka', category: 'primary' },
      { code: 'CA08.0', name: 'Alergiczny nieżyt nosa', category: 'primary' },
      { code: '9A61.1', name: 'Alergiczne zapalenie spojówek', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'EA85', name: 'Egzema alergiczna', category: 'secondary' }
    ]
  },

  // Acetylsalicylic acid (Cardio) - B01AC06
  'B01AC06': {
    primaryIndications: [
      { code: 'BD10', name: 'Choroba niedokrwienna serca', category: 'primary' },
      { code: 'BD11', name: 'Profilaktyka udaru mózgu', category: 'primary' },
      { code: 'BA01', name: 'Profilaktyka zakrzepicy', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'BD52.3', name: 'Zakrzepica żył głębokich - profilaktyka', category: 'secondary' }
    ]
  },

  // Enalapril - C09AA02
  'C09AA02': {
    primaryIndications: [
      { code: 'BA00', name: 'Nadciśnienie tętnicze', category: 'primary' },
      { code: 'BD50', name: 'Niewydolność serca', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'GB40.1', name: 'Nefropatia cukrzycowa', category: 'secondary' }
    ]
  },

  // Losartan - C09CA01
  'C09CA01': {
    primaryIndications: [
      { code: 'BA00', name: 'Nadciśnienie tętnicze', category: 'primary' },
      { code: 'BD50', name: 'Niewydolność serca', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'GB40.1', name: 'Nefropatia cukrzycowa', category: 'secondary' }
    ]
  },

  // Hydrochlorothiazide - C03AA03
  'C03AA03': {
    primaryIndications: [
      { code: 'BA00', name: 'Nadciśnienie tętnicze', category: 'primary' },
      { code: 'GB90.4', name: 'Obrzęki', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'BD50', name: 'Niewydolność serca', category: 'secondary' }
    ]
  },

  // Clopidogrel - B01AC04
  'B01AC04': {
    primaryIndications: [
      { code: 'BD10', name: 'Choroba niedokrwienna serca', category: 'primary' },
      { code: 'BD11', name: 'Profilaktyka udaru mózgu', category: 'primary' },
      { code: 'BD52.2', name: 'Miażdżyca tętnic obwodowych', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'BA01', name: 'Profilaktyka zakrzepicy', category: 'secondary' }
    ]
  },

  // Prednisone - H02AB07
  'H02AB07': {
    primaryIndications: [
      { code: '4A85', name: 'Reakcje alergiczne', category: 'primary' },
      { code: 'FA25', name: 'Reumatoidalne zapalenie stawów', category: 'primary' },
      { code: 'CA25.0', name: 'Astma oskrzelowa', category: 'primary' },
      { code: '4A40', name: 'Choroby autoimmunologiczne', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'CA22', name: 'Przewlekła obturacyjna choroba płuc', category: 'secondary' },
      { code: 'EA90', name: 'Zapalenia skóry', category: 'secondary' }
    ]
  },

  // Tramadol - N02AX02
  'N02AX02': {
    primaryIndications: [
      { code: 'MG30.4', name: 'Przewlekły ból', category: 'primary' },
      { code: 'MG30.3', name: 'Ostry ból pooperacyjny', category: 'primary' },
      { code: 'FB56.4', name: 'Ból mięśniowo-szkieletowy', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '2C78.Z', name: 'Ból nowotworowy', category: 'secondary' }
    ]
  },

  // Codeine - R05DA04
  'R05DA04': {
    primaryIndications: [
      { code: 'CA80.0', name: 'Kaszel suchy', category: 'primary' },
      { code: 'MG30.1', name: 'Łagodny do umiarkowanego ból', category: 'primary' }
    ],
    secondaryIndications: [
      { code: 'DA92', name: 'Biegunka', category: 'secondary' }
    ]
  },

  // Dexamethasone - H02AB02
  'H02AB02': {
    primaryIndications: [
      { code: '4A85', name: 'Reakcje alergiczne', category: 'primary' },
      { code: 'CA25.0', name: 'Astma oskrzelowa', category: 'primary' },
      { code: '4A40', name: 'Choroby autoimmunologiczne', category: 'primary' },
      { code: '8A62', name: 'Obrzęk mózgu', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '2C78.Z', name: 'Wspomaganie w leczeniu nowotworów', category: 'secondary' }
    ]
  },

  // Zolpidem - N05CF02
  'N05CF02': {
    primaryIndications: [
      { code: '7A00', name: 'Bezsenność', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '6B00', name: 'Zaburzenia lękowe z bezsennością', category: 'secondary' }
    ]
  },

  // Alprazolam - N05BA12
  'N05BA12': {
    primaryIndications: [
      { code: '6B00', name: 'Zaburzenia lękowe', category: 'primary' },
      { code: '6B01', name: 'Napady paniki', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '7A00', name: 'Bezsenność związana z lękiem', category: 'secondary' }
    ]
  },

  // Sertraline - N06AB06
  'N06AB06': {
    primaryIndications: [
      { code: '6A70', name: 'Depresja', category: 'primary' },
      { code: '6B00', name: 'Zaburzenia lękowe', category: 'primary' },
      { code: '6B01', name: 'Napady paniki', category: 'primary' },
      { code: '6B25', name: 'Zaburzenie obsesyjno-kompulsywne', category: 'primary' }
    ],
    secondaryIndications: [
      { code: '6B40', name: 'Zaburzenie stresu pourazowego', category: 'secondary' }
    ]
  }
};

/**
 * Funkcja pomocnicza do pobierania wskazań dla kodu ATC
 */
export const getIndicationsForATC = (atcCode: string) => {
  // Sprawdź exact match
  if (atcToIcd11Mapping[atcCode]) {
    return atcToIcd11Mapping[atcCode];
  }
  
  // Sprawdź match na podstawie krótszego kodu (np. N02BE dla N02BE01)
  for (let i = atcCode.length - 1; i >= 3; i--) {
    const shortCode = atcCode.substring(0, i);
    if (atcToIcd11Mapping[shortCode]) {
      return atcToIcd11Mapping[shortCode];
    }
  }
  
  return null;
};

/**
 * Mapowanie grup ATC Level 1 na ogólne kategorie ICD-11
 */
export const atcGroupToIcd11Categories = {
  'A': 'Choroby przewodu pokarmowego i zaburzenia metaboliczne',
  'B': 'Choroby krwi i narządów krwiotwórczych',
  'C': 'Choroby układu krążenia',
  'D': 'Choroby skóry',
  'G': 'Choroby układu moczowo-płciowego',
  'H': 'Choroby endokrynologiczne',
  'J': 'Choroby zakaźne',
  'L': 'Choroby nowotworowe',
  'M': 'Choroby układu mięśniowo-szkieletowego',
  'N': 'Choroby układu nerwowego',
  'P': 'Choroby pasożytnicze',
  'R': 'Choroby układu oddechowego',
  'S': 'Choroby narządów zmysłów',
  'V': 'Różne'
};