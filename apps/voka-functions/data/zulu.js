const units = [
    {
        id: 'unit_1',
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental Zulu greetings and introductions.',
        exercises: [
            { id: '1', type: 'translate', question: 'Sawubona', target: 'Hello', options: ['Hello', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Unjani?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ngiyabonga', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Hamba kahle', target: 'Goodbye', options: ['Good', 'night', 'Goodbye', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '5', type: 'translate', question: 'Ngiyaphila', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
            { 
                id: '6', 
                type: 'match', 
                question: 'Match the greetings',
                pairs: [
                    { id: 1, source: 'Hello', target: 'Sawubona' },
                    { id: 2, source: 'Thank you', target: 'Ngiyabonga' },
                    { id: 3, source: 'How are you?', target: 'Unjani?' },
                    { id: 4, source: 'Goodbye', target: 'Hamba kahle' }
                ],
                category: 'Greetings', 
                difficulty: 'Beginner' 
            },
            { id: '7', type: 'translate', question: 'Umngane', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '8', type: 'speak', question: 'Say "Sawubona"', target: 'Sawubona', category: 'Greetings', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_2',
        title: 'Family Members',
        order: 2,
        description: 'Learn words for family in Zulu.',
        exercises: [
            { id: '1', type: 'translate', question: 'Umama', target: 'Mother', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Ubaba', target: 'Father', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ingane', target: 'Child', options: ['Child', 'Baby', 'Man', 'Woman', 'Boy', 'Girl'], category: 'Family', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Indodana', target: 'Son', options: ['Son', 'Sister', 'Parents', 'Twins', 'Friend', 'Child'], category: 'Family', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the family members',
                pairs: [
                    { id: 1, source: 'Mother', target: 'Umama' },
                    { id: 2, source: 'Father', target: 'Ubaba' },
                    { id: 3, source: 'Child', target: 'Ingane' },
                    { id: 4, source: 'Son', target: 'Indodana' }
                ],
                category: 'Family', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Umama"', target: 'Umama', category: 'Family', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_3',
        title: 'Numbers 1–10',
        order: 3,
        description: 'Learn how to count in Zulu.',
        exercises: [
            { id: '1', type: 'translate', question: 'Kunye', target: 'One', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Kubili', target: 'Two', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Kutathu', target: 'Three', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ishumi', target: 'Ten', options: ['Ten', 'Nine', 'Eight', 'Twenty'], category: 'Numbers', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the numbers',
                pairs: [
                    { id: 1, source: 'One', target: 'Kunye' },
                    { id: 2, source: 'Two', target: 'Kubili' },
                    { id: 3, source: 'Three', target: 'Kutathu' },
                    { id: 4, source: 'Ten', target: 'Ishumi' }
                ],
                category: 'Numbers', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Ishumi"', target: 'Ishumi', category: 'Numbers', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_4',
        title: 'Daily Phrases & Time',
        order: 4,
        description: 'Learn words for days and time.',
        exercises: [
            { id: '1', type: 'translate', question: 'Namuhla', target: 'Today', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Kusasa', target: 'Tomorrow', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Izolo', target: 'Yesterday', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Manje', target: 'Now', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the time words',
                pairs: [
                    { id: 1, source: 'Today', target: 'Namuhla' },
                    { id: 2, source: 'Tomorrow', target: 'Kusasa' },
                    { id: 3, source: 'Yesterday', target: 'Izolo' },
                    { id: 4, source: 'Now', target: 'Manje' }
                ],
                category: 'Time', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Manje"', target: 'Manje', category: 'Time', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_5',
        title: 'Food & Market',
        order: 5,
        description: 'Learn how to handle food and shopping.',
        exercises: [
            { id: '1', type: 'translate', question: 'Amanzi', target: 'Water', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Ukudla', target: 'Food', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Imali', target: 'Money', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Imakethe', target: 'Market', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the food and market words',
                pairs: [
                    { id: 1, source: 'Water', target: 'Amanzi' },
                    { id: 2, source: 'Food', target: 'Ukudla' },
                    { id: 3, source: 'Money', target: 'Imali' },
                    { id: 4, source: 'Market', target: 'Imakethe' }
                ],
                category: 'Shopping', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Amanzi"', target: 'Amanzi', category: 'Food', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_6',
        title: 'Body & Health',
        order: 6,
        description: 'Learn parts of the body.',
        exercises: [
            { id: '1', type: 'translate', question: 'Ikhanda', target: 'Head', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Isandla', target: 'Hand', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Iso', target: 'Eye', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Isisu', target: 'Stomach', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the body parts',
                pairs: [
                    { id: 1, source: 'Head', target: 'Ikhanda' },
                    { id: 2, source: 'Hand', target: 'Isandla' },
                    { id: 3, source: 'Eye', target: 'Iso' },
                    { id: 4, source: 'Stomach', target: 'Isisu' }
                ],
                category: 'Body', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Ikhanda"', target: 'Ikhanda', category: 'Body', difficulty: 'Beginner' },
        ]
    }
];

module.exports = { units };
