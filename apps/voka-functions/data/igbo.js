const units = [
    {
        id: 'unit_1',
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental Igbo greetings and introductions.',
        exercises: [
            { id: '1', type: 'translate', question: 'Nnoo', target: 'Welcome', options: ['Welcome', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Kedu?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Daalu', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ka omesia', target: 'Goodbye', options: ['Good', 'night', 'Goodbye', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '5', type: 'translate', question: 'O di mma', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
            { 
                id: '6', 
                type: 'match', 
                question: 'Match the greetings',
                pairs: [
                    { id: 1, source: 'Welcome', target: 'Nnoo' },
                    { id: 2, source: 'Thank you', target: 'Daalu' },
                    { id: 3, source: 'How are you?', target: 'Kedu?' },
                    { id: 4, source: 'Goodbye', target: 'Ka omesia' }
                ],
                category: 'Greetings', 
                difficulty: 'Beginner' 
            },
            { id: '7', type: 'translate', question: 'Enyi', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '8', type: 'speak', question: 'Say "Nnoo"', target: 'Nnoo', category: 'Greetings', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_2',
        title: 'Family Members',
        order: 2,
        description: 'Learn words for family in Igbo.',
        exercises: [
            { id: '1', type: 'translate', question: 'Nne', target: 'Mother', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Nna', target: 'Father', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Nwa', target: 'Child', options: ['Child', 'Baby', 'Man', 'Woman', 'Boy', 'Girl'], category: 'Family', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Nwanne', target: 'Sibling', options: ['Sibling', 'Sister', 'Parents', 'Twins', 'Friend', 'Child'], category: 'Family', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the family members',
                pairs: [
                    { id: 1, source: 'Mother', target: 'Nne' },
                    { id: 2, source: 'Father', target: 'Nna' },
                    { id: 3, source: 'Child', target: 'Nwa' },
                    { id: 4, source: 'Sibling', target: 'Nwanne' }
                ],
                category: 'Family', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Nne"', target: 'Nne', category: 'Family', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_3',
        title: 'Numbers 1–10',
        order: 3,
        description: 'Learn how to count in Igbo.',
        exercises: [
            { id: '1', type: 'translate', question: 'Otu', target: 'One', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Abuo', target: 'Two', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ato', target: 'Three', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Iri', target: 'Ten', options: ['Ten', 'Nine', 'Eight', 'Twenty'], category: 'Numbers', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the numbers',
                pairs: [
                    { id: 1, source: 'One', target: 'Otu' },
                    { id: 2, source: 'Two', target: 'Abuo' },
                    { id: 3, source: 'Three', target: 'Ato' },
                    { id: 4, source: 'Ten', target: 'Iri' }
                ],
                category: 'Numbers', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Iri"', target: 'Iri', category: 'Numbers', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_4',
        title: 'Daily Phrases & Time',
        order: 4,
        description: 'Learn words for days and time.',
        exercises: [
            { id: '1', type: 'translate', question: 'Taa', target: 'Today', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Echi', target: 'Tomorrow', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Unyahu', target: 'Yesterday', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ugbu a', target: 'Now', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the time words',
                pairs: [
                    { id: 1, source: 'Today', target: 'Taa' },
                    { id: 2, source: 'Tomorrow', target: 'Echi' },
                    { id: 3, source: 'Yesterday', target: 'Unyahu' },
                    { id: 4, source: 'Now', target: 'Ugbu a' }
                ],
                category: 'Time', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Taa"', target: 'Taa', category: 'Time', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_5',
        title: 'Food & Market',
        order: 5,
        description: 'Learn how to handle food and shopping.',
        exercises: [
            { id: '1', type: 'translate', question: 'Mmiri', target: 'Water', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Nri', target: 'Food', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ego', target: 'Money', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ahia', target: 'Market', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the food and market words',
                pairs: [
                    { id: 1, source: 'Water', target: 'Mmiri' },
                    { id: 2, source: 'Food', target: 'Nri' },
                    { id: 3, source: 'Money', target: 'Ego' },
                    { id: 4, source: 'Market', target: 'Ahia' }
                ],
                category: 'Shopping', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Mmiri"', target: 'Mmiri', category: 'Food', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_6',
        title: 'Body & Health',
        order: 6,
        description: 'Learn parts of the body.',
        exercises: [
            { id: '1', type: 'translate', question: 'Isi', target: 'Head', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Aka', target: 'Hand', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Anya', target: 'Eye', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Afo', target: 'Stomach', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the body parts',
                pairs: [
                    { id: 1, source: 'Head', target: 'Isi' },
                    { id: 2, source: 'Hand', target: 'Aka' },
                    { id: 3, source: 'Eye', target: 'Anya' },
                    { id: 4, source: 'Stomach', target: 'Afo' }
                ],
                category: 'Body', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Isi"', target: 'Isi', category: 'Body', difficulty: 'Beginner' },
        ]
    }
];

module.exports = { units };
