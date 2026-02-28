export interface LanguageOption {
    id: string;
    name: string; // English Name
    nativeName: string; // Native Name
    flag: string; // Emoji
    status: 'available' | 'beta' | 'coming-soon';
    featured?: boolean;
    learners: string; // e.g. "1.2k"
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    {
        id: 'ibibio',
        name: 'Ibibio',
        nativeName: 'Ibibio',
        flag: '🇳🇬',
        status: 'available',
        featured: true,
        learners: '2.5k',
    },
    {
        id: 'hausa',
        name: 'Hausa',
        nativeName: 'Harshen Hausa',
        flag: '🇳🇬',
        status: 'available',
        learners: '12k',
    },
    {
        id: 'swahili',
        name: 'Swahili',
        nativeName: 'Kiswahili',
        flag: '🇰🇪',
        status: 'available',
        learners: '45k',
    },
    {
        id: 'yoruba',
        name: 'Yoruba',
        nativeName: 'Èdè Yorùbá',
        flag: '🇳🇬',
        status: 'available',
        learners: '8k',
    },
    {
        id: 'zulu',
        name: 'Zulu',
        nativeName: 'isiZulu',
        flag: '🇿🇦',
        status: 'beta',
        learners: '5k',
    },
    {
        id: 'shona',
        name: 'Shona',
        nativeName: 'ChiShona',
        flag: '🇿🇼',
        status: 'beta',
        learners: '3k',
    },
    {
        id: 'fula',
        name: 'Fula',
        nativeName: 'Fulfulde',
        flag: '🇸🇳',
        status: 'coming-soon',
        learners: '0',
    }
];
