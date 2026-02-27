const admin = require('firebase-admin');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: '../voka-app/.env' });

// Initialize only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'voka-31483', 
    });
}

const db = admin.firestore();
const storage = admin.storage();

const VOICE_ID = "eOHsvebhdtt0XFeHVMQY"; // Voice used in the app
const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;

// List of all unique Ibibio phrases from Unit 1 and 2
const ibibioPhrases = [
    "Amesiere",
    "Aba die?",
    "Sosongo",
    "Esiere",
    "Ami mmehë",
    "Abasi akpeme fi",
    "Mbuot",
    "Mesiere",
    "Ama nte",
    "Di do",
    "Ka do",
    "Ami",
    "Edi",
    "Eka",
    "Ete",
    "Eyen",
    "Eyen eka"
];

async function generateAndUploadAudio(text) {
    console.log(`Generating audio for: ${text}`);
    try {
        const response = await axios({
            method: 'post',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            data: {
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.65,
                    similarity_boost: 0.80,
                    style: 0.35,
                    use_speaker_boost: true,
                }
            },
            responseType: 'arraybuffer'
        });

        // Use a safe filename
        const safeName = text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `audio/ibibio/${safeName}.mp3`;
        
        const bucket = storage.bucket('voka-31483.firebasestorage.app');
        const file = bucket.file(fileName);
        
        await file.save(response.data, {
            metadata: { contentType: 'audio/mpeg' }
        });

        // Make it public and get URL
        await file.makePublic();
        const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        console.log(`✅ Uploaded: ${url}`);
        
        // Save to a central dictionary in Firestore
        await db.collection('content').doc('ibibio').collection('audio_dictionary').doc(safeName).set({
            text: text,
            audioUrl: url,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return url;

    } catch (error) {
        console.error(`❌ Failed to generate audio for ${text}:`, error.message);
        return null;
    }
}

async function run() {
    if (!ELEVENLABS_API_KEY) {
        console.error("Missing ElevenLabs API Key in .env");
        process.exit(1);
    }

    console.log("Starting batch audio generation...");
    for (const phrase of ibibioPhrases) {
        await generateAndUploadAudio(phrase);
    }
    console.log("✅ Finished generating and uploading all audio!");
    process.exit(0);
}

run();
