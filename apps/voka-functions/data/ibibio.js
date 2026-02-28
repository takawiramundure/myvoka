const units = [
    {
        id: 'unit_1',
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental greetings and introductions.',
        exercises: [
            { id: '1', type: 'translate', question: 'Amesiere', target: 'Good morning', options: ['Good', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Aba die?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Sosongo', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Esiere', target: 'Good night', options: ['Good', 'night', 'morning', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '5', type: 'translate', question: 'Ami mmehë', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
            { 
                id: '6', 
                type: 'match', 
                question: 'Match the greetings',
                pairs: [
                    { id: 1, source: 'Good morning', target: 'Amesiere' },
                    { id: 2, source: 'Thank you', target: 'Sosongo' },
                    { id: 3, source: 'How are you?', target: 'Aba die?' },
                    { id: 4, source: 'Good night', target: 'Esiere' }
                ],
                category: 'Greetings', 
                difficulty: 'Beginner' 
            },
            { id: '7', type: 'translate', question: 'Abasi akpeme fi', target: 'God protect you', options: ['God', 'protect', 'you', 'bless', 'save', 'keep'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '8', type: 'translate', question: 'Mbuot', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '12', type: 'speak', question: 'Say "Sosongo"', target: 'Sosongo', category: 'Greetings', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_2',
        title: 'Family Members',
        order: 2,
        description: 'Learn how to refer to people in your family.',
        exercises: [
            { id: '1', type: 'translate', question: 'Eka', target: 'Mother', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Ete', target: 'Father', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Eyen', target: 'Child', options: ['Child', 'Baby', 'Man', 'Woman', 'Boy', 'Girl'], category: 'Family', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Eyen eka', target: 'Sibling', options: ['Sibling', 'Cousin', 'Parents', 'Twins', 'Friend', 'Child'], category: 'Family', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the family members',
                pairs: [
                    { id: 1, source: 'Mother', target: 'Eka' },
                    { id: 2, source: 'Father', target: 'Ete' },
                    { id: 3, source: 'Child', target: 'Eyen' },
                    { id: 4, source: 'Sibling', target: 'Eyen eka' }
                ],
                category: 'Family', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Eka"', target: 'Eka', category: 'Family', difficulty: 'Beginner' },
        ]
    }
    // Units 3-6 can be added later as needed
];

module.exports = { units };
