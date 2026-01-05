// Kierunki studiów medycznych w Polsce (alfabetycznie)
export const MEDICAL_STUDY_FIELDS = [
  { 
    value: 'dietetyka', 
    label: 'Dietetyka',
    description: 'Żywienie i terapia dietetyczna',
    icon: 'apple',
    color: '#27ae60'
  },
  { 
    value: 'farmacja', 
    label: 'Farmacja',
    description: 'Leki, farmakologia i opieka farmaceutyczna',
    icon: 'pills',
    color: '#9b59b6'
  },
  { 
    value: 'fizjoterapia', 
    label: 'Fizjoterapia',
    description: 'Rehabilitacja i terapia ruchowa',
    icon: 'dumbbell',
    color: '#2ecc71'
  },
  { 
    value: 'medycyna', 
    label: 'Medycyna',
    description: 'Kierunek lekarski - diagnostyka i leczenie',
    icon: 'stethoscope',
    color: '#3498db'
  },
  { 
    value: 'stomatologia', 
    label: 'Stomatologia',
    description: 'Stomatologia i zdrowie jamy ustnej',
    icon: 'tooth',
    color: '#f39c12'
  },
  { 
    value: 'pielegniarstwo', 
    label: 'Pielęgniarstwo',
    description: 'Opieka nad pacjentami i edukacja zdrowotna',
    icon: 'nurse',
    color: '#e74c3c'
  },
  { 
    value: 'poloznictwo', 
    label: 'Położnictwo',
    description: 'Opieka nad kobietami w ciąży i podczas porodu',
    icon: 'baby',
    color: '#e91e63'
  },
  { 
    value: 'psychologia', 
    label: 'Psychologia',
    description: 'Zdrowie psychiczne i terapia psychologiczna',
    icon: 'brain',
    color: '#34495e'
  },
  { 
    value: 'ratownictwo_medyczne', 
    label: 'Ratownictwo Medyczne',
    description: 'Pierwsza pomoc i medycyna ratunkowa',
    icon: 'ambulance',
    color: '#c0392b'
  },
  { 
    value: 'weterynaria', 
    label: 'Weterynaria',
    description: 'Medycyna zwierząt i zdrowie publiczne',
    icon: 'paw',
    color: '#27ae60'
  }
] as const;

export type MedicalStudyField = typeof MEDICAL_STUDY_FIELDS[number]['value'];