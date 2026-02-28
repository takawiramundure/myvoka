const units = [
    {
        id: 'unit_1',
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental Amharic greetings and introductions.',
        exercises: [
            { id: '1', type: 'translate', question: 'Selam', target: 'Hello', options: ['Hello', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Endemen neh?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ameseginalew', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Dehna der', target: 'Good night', options: ['Good', 'night', 'Goodbye', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '5', type: 'translate', question: 'Dehna negn', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
            { 
                id: '6', 
                type: 'match', 
                question: 'Match the greetings',
                pairs: [
                    { id: 1, source: 'Hello', target: 'Selam' },
                    { id: 2, source: 'Thank you', target: 'Ameseginalew' },
                    { id: 3, source: 'How are you?', target: 'Endemen neh?' },
                    { id: 4, source: 'Good night', target: 'Dehna der' }
                ],
                category: 'Greetings', 
                difficulty: 'Beginner' 
            },
            { id: '7', type: 'translate', question: 'Guadegna', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '8', type: 'speak', question: 'Say "Ameseginalew"', target: 'Ameseginalew', category: 'Greetings', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_2',
        title: 'Family Members',
        order: 2,
        description: 'Learn words for family in Amharic.',
        exercises: [
            { id: '1', type: 'translate', question: 'Enat', target: 'Mother', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Abat', target: 'Father', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Lij', target: 'Child', options: ['Child', 'Baby', 'Man', 'Woman', 'Boy', 'Girl'], category: 'Family', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Wendim', target: 'Brother', options: ['Brother', 'Sister', 'Parents', 'Twins', 'Friend', 'Child'], category: 'Family', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the family members',
                pairs: [
                    { id: 1, source: 'Mother', target: 'Enat' },
                    { id: 2, source: 'Father', target: 'Abat' },
                    { id: 3, source: 'Child', target: 'Lij' },
                    { id: 4, source: 'Brother', target: 'Wendim' }
                ],
                category: 'Family', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Enat"', target: 'Enat', category: 'Family', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_3',
        title: 'Numbers 1–10',
        order: 3,
        description: 'Learn how to count in Amharic.',
        exercises: [
            { id: '1', type: 'translate', question: 'And', target: 'One', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Hulet', target: 'Two', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Sost', target: 'Three', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Asir', target: 'Ten', options: ['Ten', 'Nine', 'Eight', 'Twenty'], category: 'Numbers', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the numbers',
                pairs: [
                    { id: 1, source: 'One', target: 'And' },
                    { id: 2, source: 'Two', target: 'Hulet' },
                    { id: 3, source: 'Three', target: 'Sost' },
                    { id: 4, source: 'Ten', target: 'Asir' }
                ],
                category: 'Numbers', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "And"', target: 'And', category: 'Numbers', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_4',
        title: 'Daily Phrases & Time',
        order: 4,
        description: 'Learn words for days and time.',
        exercises: [
            { id: '1', type: 'translate', question: 'Zare', target: 'Today', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Nege', target: 'Tomorrow', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Tinantna', target: 'Yesterday', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ahun', target: 'Now', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the time words',
                pairs: [
                    { id: 1, source: 'Today', target: 'Zare' },
                    { id: 2, source: 'Tomorrow', target: 'Nege' },
                    { id: 3, source: 'Yesterday', target: 'Tinantna' },
                    { id: 4, source: 'Now', target: 'Ahun' }
                ],
                category: 'Time', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Zare"', target: 'Zare', category: 'Time', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_5',
        title: 'Food & Market',
        order: 5,
        description: 'Learn how to handle food and shopping.',
        exercises: [
            { id: '1', type: 'translate', question: 'Wuha', target: 'Water', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Migib', target: 'Food', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Genzeb', target: 'Money', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Gebeya', target: 'Market', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the food and market words',
                pairs: [
                    { id: 1, source: 'Water', target: 'Wuha' },
                    { id: 2, source: 'Food', target: 'Migib' },
                    { id: 3, source: 'Money', target: 'Genzeb' },
                    { id: 4, source: 'Market', target: 'Gebeya' }
                ],
                category: 'Shopping', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Wuha"', target: 'Wuha', category: 'Food', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_6',
        title: 'Body & Health',
        order: 6,
        description: 'Learn parts of the body.',
        exercises: [
            { id: '1', type: 'translate', question: 'Ras', target: 'Head', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Ej', target: 'Hand', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ayn', target: 'Eye', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Hod', target: 'Stomach', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the body parts',
                pairs: [
                    { id: 1, source: 'Head', target: 'Ras' },
                    { id: 2, source: 'Hand', target: 'Ej' },
                    { id: 3, source: 'Eye', target: 'Ayn' },
                    { id: 4, source: 'Stomach', target: 'Hod' }
                ],
                category: 'Body', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Ras"', target: 'Ras', category: 'Body', difficulty: 'Beginner' },
        ]
    }
];

module.exports = { units };
