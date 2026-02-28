const units = [
    {
        id: 'unit_1',
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental Shona greetings and introductions.',
        exercises: [
            { id: '1', type: 'translate', question: 'Mhoro', target: 'Hello', options: ['Hello', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Wakadini?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Maita basa', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Sara zvakanaka', target: 'Goodbye', options: ['Good', 'night', 'Goodbye', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '5', type: 'translate', question: 'Ndiripo', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
            { 
                id: '6', 
                type: 'match', 
                question: 'Match the greetings',
                pairs: [
                    { id: 1, source: 'Hello', target: 'Mhoro' },
                    { id: 2, source: 'Thank you', target: 'Maita basa' },
                    { id: 3, source: 'How are you?', target: 'Wakadini?' },
                    { id: 4, source: 'Goodbye', target: 'Sara zvakanaka' }
                ],
                category: 'Greetings', 
                difficulty: 'Beginner' 
            },
            { id: '7', type: 'translate', question: 'Shamwari', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
            { id: '8', type: 'speak', question: 'Say "Mhoro"', target: 'Mhoro', category: 'Greetings', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_2',
        title: 'Family Members',
        order: 2,
        description: 'Learn words for family in Shona.',
        exercises: [
            { id: '1', type: 'translate', question: 'Amai', target: 'Mother', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Baba', target: 'Father', options: ['Mother', 'Father', 'Brother', 'Sister', 'Aunt', 'Uncle'], category: 'Family', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Mwana', target: 'Child', options: ['Child', 'Baby', 'Man', 'Woman', 'Boy', 'Girl'], category: 'Family', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Hama', target: 'Relative', options: ['Relative', 'Sister', 'Parents', 'Twins', 'Friend', 'Child'], category: 'Family', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the family members',
                pairs: [
                    { id: 1, source: 'Mother', target: 'Amai' },
                    { id: 2, source: 'Father', target: 'Baba' },
                    { id: 3, source: 'Child', target: 'Mwana' },
                    { id: 4, source: 'Relative', target: 'Hama' }
                ],
                category: 'Family', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Baba"', target: 'Baba', category: 'Family', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_3',
        title: 'Numbers 1–10',
        order: 3,
        description: 'Learn how to count in Shona.',
        exercises: [
            { id: '1', type: 'translate', question: 'Poshi', target: 'One', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Piri', target: 'Two', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Tatu', target: 'Three', options: ['One', 'Two', 'Three', 'Four', 'Five'], category: 'Numbers', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Gumi', target: 'Ten', options: ['Ten', 'Nine', 'Eight', 'Twenty'], category: 'Numbers', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the numbers',
                pairs: [
                    { id: 1, source: 'One', target: 'Poshi' },
                    { id: 2, source: 'Two', target: 'Piri' },
                    { id: 3, source: 'Three', target: 'Tatu' },
                    { id: 4, source: 'Ten', target: 'Gumi' }
                ],
                category: 'Numbers', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Poshi"', target: 'Poshi', category: 'Numbers', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_4',
        title: 'Daily Phrases & Time',
        order: 4,
        description: 'Learn words for days and time.',
        exercises: [
            { id: '1', type: 'translate', question: 'Nhasi', target: 'Today', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Mangwana', target: 'Tomorrow', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Nezuro', target: 'Yesterday', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Ikozvino', target: 'Now', options: ['Today', 'Tomorrow', 'Yesterday', 'Now'], category: 'Time', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the time words',
                pairs: [
                    { id: 1, source: 'Today', target: 'Nhasi' },
                    { id: 2, source: 'Tomorrow', target: 'Mangwana' },
                    { id: 3, source: 'Yesterday', target: 'Nezuro' },
                    { id: 4, source: 'Now', target: 'Ikozvino' }
                ],
                category: 'Time', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Nhasi"', target: 'Nhasi', category: 'Time', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_5',
        title: 'Food & Market',
        order: 5,
        description: 'Learn how to handle food and shopping.',
        exercises: [
            { id: '1', type: 'translate', question: 'Mvura', target: 'Water', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Chikafu', target: 'Food', options: ['Water', 'Food', 'Money', 'Market'], category: 'Food', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Mari', target: 'Money', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Musika', target: 'Market', options: ['Water', 'Food', 'Money', 'Market'], category: 'Shopping', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the food and market words',
                pairs: [
                    { id: 1, source: 'Water', target: 'Mvura' },
                    { id: 2, source: 'Food', target: 'Chikafu' },
                    { id: 3, source: 'Money', target: 'Mari' },
                    { id: 4, source: 'Market', target: 'Musika' }
                ],
                category: 'Shopping', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Mvura"', target: 'Mvura', category: 'Food', difficulty: 'Beginner' },
        ]
    },
    {
        id: 'unit_6',
        title: 'Body & Health',
        order: 6,
        description: 'Learn parts of the body.',
        exercises: [
            { id: '1', type: 'translate', question: 'Musoro', target: 'Head', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '2', type: 'translate', question: 'Ruoko', target: 'Hand', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '3', type: 'translate', question: 'Ziso', target: 'Eye', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { id: '4', type: 'translate', question: 'Dumbu', target: 'Stomach', options: ['Head', 'Hand', 'Eye', 'Stomach'], category: 'Body', difficulty: 'Beginner' },
            { 
                id: '5', 
                type: 'match', 
                question: 'Match the body parts',
                pairs: [
                    { id: 1, source: 'Head', target: 'Musoro' },
                    { id: 2, source: 'Hand', target: 'Ruoko' },
                    { id: 3, source: 'Eye', target: 'Ziso' },
                    { id: 4, source: 'Stomach', target: 'Dumbu' }
                ],
                category: 'Body', 
                difficulty: 'Beginner' 
            },
            { id: '6', type: 'speak', question: 'Say "Musoro"', target: 'Musoro', category: 'Body', difficulty: 'Beginner' },
        ]
    }
,
    {
        id: 'unit_7',
        title: 'Action Words 1',
        order: 7,
        description: 'New lesson generated from textbook.',
        exercises: [
            { id: '1', type: 'translate', question: "How do you say 'wash something'?", target: 'kusuka', options: ["kusuka","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '2', type: 'speak', question: 'Speak this phrase:', target: 'kusuka', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '3', type: 'translate', question: "How do you say 'give kupa scoop water out'?", target: 'kupa', options: ["kupa","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '4', type: 'speak', question: 'Speak this phrase:', target: 'kupa', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '5', type: 'translate', question: "How do you say 'graze kufara blow'?", target: 'kufura', options: ["kufura","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '6', type: 'speak', question: 'Speak this phrase:', target: 'kufura', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '7', type: 'translate', question: "How do you say 'dig kuchéra draw water'?", target: 'kuchera', options: ["kuchera","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '8', type: 'speak', question: 'Speak this phrase:', target: 'kuchera', category: 'Pronunciation', difficulty: 'Intermediate' },
        ]
    },
    {
        id: 'unit_8',
        title: 'Action Words 2',
        order: 8,
        description: 'New lesson generated from textbook.',
        exercises: [
            { id: '1', type: 'translate', question: "How do you say 'kunwa kusimba'?", target: 'kuwa', options: ["kuwa","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '2', type: 'speak', question: 'Speak this phrase:', target: 'kuwa', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '3', type: 'translate', question: "How do you say 'kuténga kuona'?", target: 'kubvunza', options: ["kubvunza","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '4', type: 'speak', question: 'Speak this phrase:', target: 'kubvunza', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '5', type: 'translate', question: "How do you say 'kuchéka kunamata'?", target: 'kusimba', options: ["kusimba","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '6', type: 'speak', question: 'Speak this phrase:', target: 'kusimba', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '7', type: 'translate', question: "How do you say 'kuténgésa'?", target: 'kutarisa', options: ["kutarisa","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '8', type: 'speak', question: 'Speak this phrase:', target: 'kutarisa', category: 'Pronunciation', difficulty: 'Intermediate' },
        ]
    },
    {
        id: 'unit_9',
        title: 'Nouns and Objects 1',
        order: 9,
        description: 'New lesson generated from textbook.',
        exercises: [
            { id: '1', type: 'translate', question: "How do you say 'knives'?", target: 'mapanga', options: ["mapanga","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '2', type: 'speak', question: 'Speak this phrase:', target: 'mapanga', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '3', type: 'translate', question: "How do you say 'this'?", target: 'iyi', options: ["iyi","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '4', type: 'speak', question: 'Speak this phrase:', target: 'iyi', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '5', type: 'translate', question: "How do you say 'mountain'?", target: 'gomo', options: ["gomo","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '6', type: 'speak', question: 'Speak this phrase:', target: 'gomo', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '7', type: 'translate', question: "How do you say 'fathers'?", target: 'vababa', options: ["vababa","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '8', type: 'speak', question: 'Speak this phrase:', target: 'vababa', category: 'Pronunciation', difficulty: 'Intermediate' },
        ]
    },
    {
        id: 'unit_10',
        title: 'Nouns and Objects 2',
        order: 10,
        description: 'New lesson generated from textbook.',
        exercises: [
            { id: '1', type: 'translate', question: "How do you say 'things'?", target: 'zvinhu', options: ["zvinhu","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '2', type: 'speak', question: 'Speak this phrase:', target: 'zvinhu', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '3', type: 'translate', question: "How do you say 'milk'?", target: 'mukaka', options: ["mukaka","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '4', type: 'speak', question: 'Speak this phrase:', target: 'mukaka', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '5', type: 'translate', question: "How do you say 'muiti'?", target: 'munda', options: ["munda","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '6', type: 'speak', question: 'Speak this phrase:', target: 'munda', category: 'Pronunciation', difficulty: 'Intermediate' },
            { id: '7', type: 'translate', question: "How do you say 'vasikana'?", target: 'miti', options: ["miti","Mhoro","Ehe","Kwete"], category: 'Grammar', difficulty: 'Intermediate' },
            { id: '8', type: 'speak', question: 'Speak this phrase:', target: 'miti', category: 'Pronunciation', difficulty: 'Intermediate' },
        ]
    },
];

module.exports = { units };
