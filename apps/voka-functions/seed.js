/**
 * One-off seed script — runs with Firebase Admin SDK (bypasses security rules)
 * Usage: node seed.js
 */
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'voka-31483',
});

const db = admin.firestore();

const IbibioExercises = [
    { id: '1', type: 'translate', question: 'Amesiere', target: 'Good morning', options: ['Good', 'morning', 'night', 'How', 'are', 'you'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '2', type: 'translate', question: 'Aba die?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '3', type: 'translate', question: 'Sosongo', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '4', type: 'translate', question: 'Esiere', target: 'Good night', options: ['Good', 'night', 'morning', 'Sleep', 'well', 'bye'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '5', type: 'translate', question: 'Ami mmehë', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '6', type: 'match', question: 'A-me-sie-re', target: 'Good-mor-ning', options: ['A', 'me', 'sie', 're', 'Good', 'mor', 'ning'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '7', type: 'translate', question: 'Abasi akpeme fi', target: 'God protect you', options: ['God', 'protect', 'you', 'bless', 'save', 'keep'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '8', type: 'translate', question: 'Mbuot', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '9', type: 'translate', question: 'Hello', target: 'Mesiere', options: ['Mesiere', 'Amesiere', 'Esiere', 'Sosongo', 'Mbuot', 'Di do'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '10', type: 'translate', question: 'Sweet', target: 'Ama nte', options: ['Ama nte', 'Daba daba', 'Sosongo', 'Mbuot', 'Esiere', 'Di do'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '11', type: 'translate', question: 'Come', target: 'Di do', options: ['Di do', 'Sosongo', 'Aba die', 'Ka do', 'Ami', 'Edi'], category: 'Greetings', difficulty: 'Beginner' },
    { id: '12', type: 'speak', question: 'Say "Sosongo"', target: 'Sosongo', category: 'Greetings', difficulty: 'Beginner' },
    { id: '13', type: 'translate', question: 'Ami edi Learner', target: 'I am Learner', options: ['I', 'am', 'Learner', 'He', 'is', 'Teacher'], category: 'Greetings', difficulty: 'Beginner' },
];

async function seed() {
    const batch = db.batch();

    const unitRef = db.doc('content/ibibio/units/unit_1');
    batch.set(unitRef, {
        title: 'Ibibio Basics 1',
        order: 1,
        description: 'Learn fundamental greetings and introductions.',
    });

    IbibioExercises.forEach((ex) => {
        const exRef = db.doc(`content/ibibio/units/unit_1/exercises/${ex.id}`);
        batch.set(exRef, ex);
    });

    await batch.commit();
    console.log('✅ Ibibio Unit 1 seeded successfully to production Firestore!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
