const units = [
    {
        id: 'unit_1',
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental Hausa greetings and introductions.',
        exercises: [
            { id: '1', type: 'translate', question: 'Ina kwana', target: 'Good morning', options: ['Good', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Yaya kake?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Nagode', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Sai da safe', target: 'Good night', options: ['Good', 'night', 'morning', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '5', type: 'translate', question: 'Lafiya lau', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
            { 
                id: '6', 
                type: 'match', 
                question: 'Match the greetings',
                pairs: [
                    { id: 1, source: 'Good morning', target: 'Ina kwana' },
                    { id: 2, source: 'Thank you', target: 'Nagode' },
                    { id: 3, source: 'How are you?', target: 'Yaya kake?' },
                    { id: 4, source: 'Good night', target: 'Sai da safe' }
                ],
                category: 'Greetings', 
                difficulty: 'Beginner' 
            },
            { id: '7', type: 'translate', question: 'Aboki', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '8', type: 'speak', question: 'Say "Nagode"', target: 'Nagode', category: 'Greetings', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_2',
        title: 'Family Members',
        order: 2,
        description: 'Learn words for family in Hausa.',
        exercises: [
            { id: '1', type: 'translate', question: 'Uwa', target: 'Mother', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Uba', target: 'Father', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Yaro', target: 'Child', options: ['Child', 'Baby', 'Man', 'Woman', 'Boy', 'Girl'], category: 'Family', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Dan uwa', target: 'Brother', options: ['Brother', 'Sister', 'Parents', 'Twins', 'Friend', 'Child'], category: 'Family', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the family members',
                pairs: [
                    { id: 1, source: 'Mother', target: 'Uwa' },
                    { id: 2, source: 'Father', target: 'Uba' },
                    { id: 3, source: 'Child', target: 'Yaro' },
                    { id: 4, source: 'Brother', target: 'Dan uwa' }
                ],
                category: 'Family', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Uwa"', target: 'Uwa', category: 'Family', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_3',
        title: 'Numbers 1–10',
        order: 3,
        description: 'Learn how to count in Hausa.',
        exercises: [
            { id: '1', type: 'translate', question: 'Daya', target: 'One', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Biyu', target: 'Two', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Uku', target: 'Three', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Goma', target: 'Ten', options: ['Ten', 'Nine', 'Eight', 'Twenty'], category: 'Numbers', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the numbers',
                pairs: [
                    { id: 1, source: 'One', target: 'Daya' },
                    { id: 2, source: 'Two', target: 'Biyu' },
                    { id: 3, source: 'Three', target: 'Uku' },
                    { id: 4, source: 'Ten', target: 'Goma' }
                ],
                category: 'Numbers', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Goma"', target: 'Goma', category: 'Numbers', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_4',
        title: 'Daily Phrases & Time',
        order: 4,
        description: 'Learn words for days and time.',
        exercises: [
            { id: '1', type: 'translate', question: 'Yau', target: 'Today', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Gobe', target: 'Tomorrow', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Jiya', target: 'Yesterday', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Yanzu', target: 'Now', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the time words',
                pairs: [
                    { id: 1, source: 'Today', target: 'Yau' },
                    { id: 2, source: 'Tomorrow', target: 'Gobe' },
                    { id: 3, source: 'Yesterday', target: 'Jiya' },
                    { id: 4, source: 'Now', target: 'Yanzu' }
                ],
                category: 'Time', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Yau"', target: 'Yau', category: 'Time', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_5',
        title: 'Food & Market',
        order: 5,
        description: 'Learn how to handle food and shopping.',
        exercises: [
            { id: '1', type: 'translate', question: 'Ruwa', target: 'Water', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Abinci', target: 'Food', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Kudi', target: 'Money', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Kasuwa', target: 'Market', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the food and market words',
                pairs: [
                    { id: 1, source: 'Water', target: 'Ruwa' },
                    { id: 2, source: 'Food', target: 'Abinci' },
                    { id: 3, source: 'Money', target: 'Kudi' },
                    { id: 4, source: 'Market', target: 'Kasuwa' }
                ],
                category: 'Shopping', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Ruwa"', target: 'Ruwa', category: 'Food', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_6',
        title: 'Body & Health',
        order: 6,
        description: 'Learn parts of the body.',
        exercises: [
            { id: '1', type: 'translate', question: 'Kai', target: 'Head', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Hannu', target: 'Hand', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ido', target: 'Eye', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ciki', target: 'Stomach', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the body parts',
                pairs: [
                    { id: 1, source: 'Head', target: 'Kai' },
                    { id: 2, source: 'Hand', target: 'Hannu' },
                    { id: 3, source: 'Eye', target: 'Ido' },
                    { id: 4, source: 'Stomach', target: 'Ciki' }
                ],
                category: 'Body', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Kai"', target: 'Kai', category: 'Body', difficulty: 'Beginner' },
        ]
    }
];

module.exports = { units };
