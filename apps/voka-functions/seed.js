/**
 * One-off seed script — runs with Firebase Admin SDK (bypasses security rules)
 * Usage: node seed.js
 */
const admin = require('firebase-admin');

// Initialize only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'voka-31483', // Explicitly setting this helps prevent errors
    });
}

const db = admin.firestore();

const Unit1Exercises = [
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
];

const Unit2Exercises = [
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
];

async function seed() {
    const batch = db.batch();

    // Unit 1
    const unit1Ref = db.doc('content/ibibio/units/unit_1');
    batch.set(unit1Ref, {
        title: 'Greetings & Basics',
        order: 1,
        description: 'Learn fundamental greetings and introductions.',
    });
    Unit1Exercises.forEach((ex) => {
        const exRef = db.doc(`content/ibibio/units/unit_1/exercises/${ex.id}`);
        batch.set(exRef, ex);
    });

    // Unit 2
    const unit2Ref = db.doc('content/ibibio/units/unit_2');
    batch.set(unit2Ref, {
        title: 'Family Members',
        order: 2,
        description: 'Learn how to refer to people in your family.',
    });
    Unit2Exercises.forEach((ex) => {
        const exRef = db.doc(`content/ibibio/units/unit_2/exercises/${ex.id}`);
        batch.set(exRef, ex);
    });

    await batch.commit();
    console.log('✅ Ibibio Units 1 & 2 seeded successfully to production Firestore!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
