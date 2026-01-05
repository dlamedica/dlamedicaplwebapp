export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  category: EbookCategory;
  tags: string[];
  pages: number;
  language: string;
  format: 'PDF' | 'EPUB' | 'MOBI';
  fileSize: string;
  publicationDate: string;
  isbn?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  downloadUrl?: string;
  previewPages?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EbookCategory = 
  | 'anatomia'
  | 'fizjologia'
  | 'patologia'
  | 'farmakologia'
  | 'chirurgia'
  | 'interna'
  | 'pediatria'
  | 'ginekologia'
  | 'neurologia'
  | 'kardiologia'
  | 'pulmonologia'
  | 'gastroenterologia'
  | 'nefrologia'
  | 'endokrynologia'
  | 'hematologia'
  | 'onkologia'
  | 'psychiatria'
  | 'dermatologia'
  | 'okulistyka'
  | 'laryngologia'
  | 'ortopedia'
  | 'urologia'
  | 'anestezjologia'
  | 'medycyna_ratunkowa'
  | 'medycyna_rodzinna'
  | 'medycyna_pracy'
  | 'medycyna_sportowa'
  | 'geriatria'
  | 'medycyna_tropikalna'
  | 'epidemiologia'
  | 'bioetyka'
  | 'prawo_medyczne'
  | 'historia_medycyny'
  | 'inny';

export interface EbookCategoryInfo {
  id: EbookCategory;
  name: string;
  iconKey: string; // Key to get icon from CategoryIcons
  description: string;
}

export const EBOOK_CATEGORIES: Record<EbookCategory, EbookCategoryInfo> = {
  anatomia: { id: 'anatomia', name: 'Anatomia', iconKey: 'anatomia', description: 'Struktura i budowa organizmu' },
  fizjologia: { id: 'fizjologia', name: 'Fizjologia', iconKey: 'fizjologia', description: 'Funkcje organizmu' },
  patologia: { id: 'patologia', name: 'Patologia', iconKey: 'patologia', description: 'Choroby i ich przyczyny' },
  farmakologia: { id: 'farmakologia', name: 'Farmakologia', iconKey: 'farmakologia', description: 'Leki i ich działanie' },
  chirurgia: { id: 'chirurgia', name: 'Chirurgia', iconKey: 'chirurgia', description: 'Zabiegi chirurgiczne' },
  interna: { id: 'interna', name: 'Medycyna wewnętrzna', iconKey: 'interna', description: 'Choroby wewnętrzne' },
  pediatria: { id: 'pediatria', name: 'Pediatria', iconKey: 'pediatria', description: 'Medycyna dziecięca' },
  ginekologia: { id: 'ginekologia', name: 'Ginekologia', iconKey: 'ginekologia', description: 'Zdrowie kobiet' },
  neurologia: { id: 'neurologia', name: 'Neurologia', iconKey: 'neurologia', description: 'Choroby układu nerwowego' },
  kardiologia: { id: 'kardiologia', name: 'Kardiologia', iconKey: 'kardiologia', description: 'Choroby serca' },
  pulmonologia: { id: 'pulmonologia', name: 'Pulmonologia', iconKey: 'pulmonologia', description: 'Choroby płuc' },
  gastroenterologia: { id: 'gastroenterologia', name: 'Gastroenterologia', iconKey: 'gastroenterologia', description: 'Choroby układu pokarmowego' },
  nefrologia: { id: 'nefrologia', name: 'Nefrologia', iconKey: 'nefrologia', description: 'Choroby nerek' },
  endokrynologia: { id: 'endokrynologia', name: 'Endokrynologia', iconKey: 'endokrynologia', description: 'Choroby hormonalne' },
  hematologia: { id: 'hematologia', name: 'Hematologia', iconKey: 'hematologia', description: 'Choroby krwi' },
  onkologia: { id: 'onkologia', name: 'Onkologia', iconKey: 'onkologia', description: 'Choroby nowotworowe' },
  psychiatria: { id: 'psychiatria', name: 'Psychiatria', iconKey: 'psychiatria', description: 'Choroby psychiczne' },
  dermatologia: { id: 'dermatologia', name: 'Dermatologia', iconKey: 'dermatologia', description: 'Choroby skóry' },
  okulistyka: { id: 'okulistyka', name: 'Okulistyka', iconKey: 'okulistyka', description: 'Choroby oczu' },
  laryngologia: { id: 'laryngologia', name: 'Laryngologia', iconKey: 'laryngologia', description: 'Choroby uszu, nosa i gardła' },
  ortopedia: { id: 'ortopedia', name: 'Ortopedia', iconKey: 'ortopedia', description: 'Choroby układu ruchu' },
  urologia: { id: 'urologia', name: 'Urologia', iconKey: 'urologia', description: 'Choroby układu moczowego' },
  anestezjologia: { id: 'anestezjologia', name: 'Anestezjologia', iconKey: 'anestezjologia', description: 'Znieczulenie i intensywna terapia' },
  medycyna_ratunkowa: { id: 'medycyna_ratunkowa', name: 'Medycyna ratunkowa', iconKey: 'medycyna_ratunkowa', description: 'Pomoc doraźna' },
  medycyna_rodzinna: { id: 'medycyna_rodzinna', name: 'Medycyna rodzinna', iconKey: 'medycyna_rodzinna', description: 'Medycyna ogólna' },
  medycyna_pracy: { id: 'medycyna_pracy', name: 'Medycyna pracy', iconKey: 'medycyna_pracy', description: 'Zdrowie w pracy' },
  medycyna_sportowa: { id: 'medycyna_sportowa', name: 'Medycyna sportowa', iconKey: 'medycyna_sportowa', description: 'Medycyna aktywności fizycznej' },
  geriatria: { id: 'geriatria', name: 'Geriatria', iconKey: 'geriatria', description: 'Medycyna wieku podeszłego' },
  medycyna_tropikalna: { id: 'medycyna_tropikalna', name: 'Medycyna tropikalna', iconKey: 'medycyna_tropikalna', description: 'Choroby tropikalne' },
  epidemiologia: { id: 'epidemiologia', name: 'Epidemiologia', iconKey: 'epidemiologia', description: 'Rozprzestrzenianie się chorób' },
  bioetyka: { id: 'bioetyka', name: 'Bioetyka', iconKey: 'bioetyka', description: 'Etyka w medycynie' },
  prawo_medyczne: { id: 'prawo_medyczne', name: 'Prawo medyczne', iconKey: 'prawo_medyczne', description: 'Aspekty prawne medycyny' },
  historia_medycyny: { id: 'historia_medycyny', name: 'Historia medycyny', iconKey: 'historia_medycyny', description: 'Dzieje medycyny' },
  inny: { id: 'inny', name: 'Inne', iconKey: 'inny', description: 'Inne dziedziny' },
};

