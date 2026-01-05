export interface University {
    id: number;
    name: string;
    slug: string;
    city: string;
    type: 'publiczna' | 'prywatna';
    logo: string;
    averageRating: number;
    reviewCount: number;
    description: string;
    courses: string[];
    studentCount?: number;
    tuitionFee?: number; // in PLN for private universities
    yearFounded?: number;
}

const universities: University[] = [
    {
        id: 1,
        name: 'Warszawski Uniwersytet Medyczny',
        slug: 'warszawski-uniwersytet-medyczny',
        city: 'Warszawa',
        type: 'publiczna',
        logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=WUM',
        averageRating: 4.5,
        reviewCount: 142,
        description: 'Jedna z najstarszych i najbardziej prestiżowych uczelni medycznych w Polsce.',
        courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Położnictwo', 'Ratownictwo medyczne'],
        studentCount: 8500,
        yearFounded: 1950,
        tuitionFee: 0
    },
    {
        id: 2,
        name: 'Uniwersytet Jagielloński - Collegium Medicum',
        slug: 'uniwersytet-jagiellonski-collegium-medicum',
        city: 'Kraków',
        type: 'publiczna',
        logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=UJ',
        averageRating: 4.7,
        reviewCount: 98,
        description: 'Najstarsza uczelnia w Polsce z tradycjami sięgającymi XIV wieku.',
        courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Fizjoterapia', 'Dietetyka'],
        studentCount: 6200,
        yearFounded: 1364,
        tuitionFee: 0
    },
    {
        id: 3,
        name: 'Gdański Uniwersytet Medyczny',
        slug: 'gdanski-uniwersytet-medyczny',
        city: 'Gdańsk',
        type: 'publiczna',
        logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=GUM',
        averageRating: 4.3,
        reviewCount: 76,
        description: 'Wiodąca uczelnia medyczna na północy Polski z nowoczesną bazą dydaktyczną.',
        courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Ratownictwo medyczne', 'Biotechnologia'],
        studentCount: 5400,
        yearFounded: 1945,
        tuitionFee: 0
    },
    {
        id: 4,
        name: 'Uniwersytet Medyczny w Poznaniu',
        slug: 'uniwersytet-medyczny-w-poznaniu',
        city: 'Poznań',
        type: 'publiczna',
        logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=UMP',
        averageRating: 4.4,
        reviewCount: 89,
        description: 'Dynamicznie rozwijająca się uczelnia z szeroką ofertą kształcenia w języku angielskim.',
        courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Fizjoterapia', 'Zdrowie publiczne'],
        studentCount: 7100,
        yearFounded: 1950,
        tuitionFee: 0
    }
];

export const MockUniversityService = {
    getUniversities: async (): Promise<University[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...universities]);
            }, 500);
        });
    },

    getUniversityById: async (id: number): Promise<University | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(universities.find(u => u.id === id));
            }, 300);
        });
    }
};
