export const mockUsers = [
    {
        email: 'admin@dlamedica.pl',
        password: 'Admin123!',
        role: 'admin',
        name: 'Administrator Systemu',
        avatar_url: 'https://ui-avatars.com/api/?name=Administrator+Systemu&background=0D8ABC&color=fff'
    },
    {
        email: 'lekarz@dlamedica.pl',
        password: 'Lekarz123!',
        role: 'doctor',
        name: 'Jan Kowalski',
        zawod: 'Lekarz',
        specialization: 'Kardiolog',
        avatar_url: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=random'
    },
    {
        email: 'student@dlamedica.pl',
        password: 'Student123!',
        role: 'student',
        name: 'Anna Nowak',
        zawod: 'Student',
        avatar_url: 'https://ui-avatars.com/api/?name=Anna+Nowak&background=random'
    },
    {
        email: 'firma@dlamedica.pl',
        password: 'Firma123!',
        role: 'company',
        name: 'MedCorp Sp. z o.o.',
        is_company: true,
        company_name: 'MedCorp Sp. z o.o.',
        avatar_url: 'https://ui-avatars.com/api/?name=MedCorp&background=random'
    },
    {
        email: 'test@dlamedica.pl',
        password: 'Test123!',
        role: 'student',
        name: 'Test Student',
        zawod: 'Student',
        avatar_url: 'https://ui-avatars.com/api/?name=Test+Student&background=random'
    },
    {
        email: 'test_doctor@dlamedica.pl',
        password: 'Test123!',
        role: 'doctor',
        name: 'Test Lekarz',
        zawod: 'Lekarz',
        specialization: 'Internista',
        avatar_url: 'https://ui-avatars.com/api/?name=Test+Lekarz&background=random'
    },
    {
        email: 'test_admin@dlamedica.pl',
        password: 'Test123!',
        role: 'admin',
        name: 'Test Admin',
        avatar_url: 'https://ui-avatars.com/api/?name=Test+Admin&background=random'
    }
];

export const getMockUser = (email: string) => {
    return mockUsers.find(user => user.email === email);
};

export const validateMockUser = (email: string, password: string) => {
    return mockUsers.find(user => user.email === email && user.password === password);
};
