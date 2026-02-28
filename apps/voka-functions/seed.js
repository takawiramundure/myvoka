/**
 * Usage: node seed.js --language hausa
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Parse argument
const args = process.argv.slice(2);
const langArgIndex = args.indexOf('--language');
if (langArgIndex === -1 || !args[langArgIndex + 1]) {
    console.error('❌ Please specify a language, e.g.: node seed.js --language hausa');
    process.exit(1);
}

const language = args[langArgIndex + 1].toLowerCase();
const dataFilePath = path.join(__dirname, 'data', `${language}.js`);

if (!fs.existsSync(dataFilePath)) {
    console.error(`❌ Data file for language '${language}' not found at: ${dataFilePath}`);
    process.exit(1);
}

const { units } = require(dataFilePath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'voka-31483', 
    });
}

const db = admin.firestore();

async function seed() {
    const batch = db.batch();

    units.forEach((unit) => {
        // Unit document
        const unitRef = db.doc(`content/${language}/units/${unit.id}`);
        batch.set(unitRef, {
            title: unit.title,
            order: unit.order,
            description: unit.description,
        });

        // Exercises collection inside the unit
        unit.exercises.forEach((ex) => {
            const exRef = db.doc(`content/${language}/units/${unit.id}/exercises/${ex.id}`);
            batch.set(exRef, ex);
        });
    });

    await batch.commit();
    console.log(`✅ ${language.charAt(0).toUpperCase() + language.slice(1)} Units seeded successfully to production Firestore!`);
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
