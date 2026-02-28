const { onCall } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');
admin.initializeApp();

exports.analyzeAudio = onCall({ 
    secrets: ["OPENAI_API_KEY", "GEMINI_API_KEY"],
    timeoutSeconds: 300,
    memory: "1GiB"
}, async (request) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    // 1. Extract data
    const data = request.data;
    const base64Audio = data.audio; // base64 string of the m4a file
    const sessionPhase = data.sessionPhase || 'learning';
    const recentMessages = data.history || [];
    const language = data.language || 'ibibio';
    const mode = data.mode || 'conversation'; // 'drill' or 'conversation'

    if (!base64Audio) {
        throw new functions.https.HttpsError('invalid-argument', 'No audio data provided');
    }

    try {
        // 2. Decode base64 and save to temp file for Whisper
        const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.m4a`);
        fs.writeFileSync(tempFilePath, Buffer.from(base64Audio, 'base64'));

        // 3. Call Whisper (STT)
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: 'whisper-1',
        });
        
        const userText = transcription.text;
        
        // Clean up temp file
        fs.unlinkSync(tempFilePath);

    // 4. Construct LLM Prompt
        let systemPrompt = `You are an expert ${language} language tutor. 
The user's speech was just transcribed as: "${userText}". 

`;

        if (language.toLowerCase() === 'ibibio') {
            systemPrompt += `IBIBIO LINGUISTIC CONTEXT:
- Tone: Ibibio is tonal. Pay attention to pitch markers if provided, otherwise assume common tone.
- Syllabic Structure: Breakdown words into clear CV or CVC syllables. 
- Common Greetings: "Amesiere" (Good morning), "Mesiere" (Hello/General greeting), "Sosongo" (Thank you), "Aba die?" (How are you?).
- Cultural Note: Use polite forms when the user mentions family or elders.
`;
        } else if (language.toLowerCase() === 'hausa') {
            systemPrompt += `HAUSA LINGUISTIC CONTEXT:
- Grammar & Gender: Hausa distinguishes gender in pronouns ("Yaya kake?" for male, "Yaya kike?" for female). Default to masculine if unknown, but correct politely.
- Common Greetings: "Ina kwana" (Good morning), "Yaya dai?" or "Yaya kake/kike?" (How are you?), "Nagode" (Thank you), "Sai da safe" (Good night).
- Cultural Note: Respect for elders and traditional titles are very important in Hausa dialogue. Show warmth and politeness.
`;
        } else if (language.toLowerCase() === 'swahili') {
            systemPrompt += `SWAHILI LINGUISTIC CONTEXT:
- Grammar: Swahili uses noun classes (like M/Wa, Ki/Vi) and prefixes for subject, tense, and object within verbs (e.g. "Ni-na-ku-penda").
- Common Greetings: "Jambo" / "Hujambo" (Hello/How are you?), "Sijambo" (I am fine), "Habari yako/zenu?" (What's your news?), "Asante" (Thank you), "Karibu" (Welcome).
- Cultural Note: Swahili culture heavily emphasizes greeting rituals. It's polite to inquire about someone's day, family, and state before getting to the point.
- Syllables: Swahili is highly phonetic; every letter is pronounced clearly and syllables usually end in vowels.
`;
        } else if (language.toLowerCase() === 'yoruba') {
            systemPrompt += `YORUBA LINGUISTIC CONTEXT:
- Tone: Yoruba is highly tonal with three distinct tones: High, Mid, Low. Tone completely changes meaning (e.g. "Oko" can mean Husband or Vehicle).
- Grammar: Subject-Verb-Object (SVO) sequence. Use of honorifics makes greeting elders different than peers.
- Common Greetings: "Bawo ni?" (How are things?), "E kaaro" (Good morning - polite "E" for elders or plural), "Ese" (Thank you), "O dabo" (Goodbye).
- Cultural Note: Respect for elders is paramount. Correct users softly if they forget to use the honorific "E" prefix when addressing older or plural people.
`;
        } else if (language.toLowerCase() === 'zulu') {
            systemPrompt += `ZULU LINGUISTIC CONTEXT:
- Phonetics: Zulu features click consonants (c, q, x) and is an agglutinative language, meaning prefixes and suffixes are heavily used to form complete words.
- Grammar: Noun class system (e.g. ama-, izi-) is essential. Provide grammar corrections if user uses the wrong conchord/prefix.
- Common Greetings: "Sawubona" (Hello - singular), "Sanibonani" (Hello - plural), "Unjani?" (How are you?), "Ngiyaphila" (I am fine), "Ngiyabonga" (Thank you).
- Cultural Note: Ubuntu (humanity to others) is a core Zulu concept. Be extremely polite and encouraging. Explain clicks softly if pronunciation corrections are needed.
`;
        } else if (language.toLowerCase() === 'igbo') {
            systemPrompt += `IGBO LINGUISTIC CONTEXT:
- Tone: Igbo is a tonal language (High, Low, Downstep tones). Correct pitch is crucial to preserve meaning (e.g. "Àkwà" (bed) vs "Ákwá" (cry) vs "Àkwá" (egg)).
- Grammar: Igbo lacks gendered pronouns ("Ọ" represents he/she/it). Word order is typically Subject-Verb-Object.
- Common Greetings: "Nnọọ" (Welcome), "Kẹdụ?" (How are you?), "Ọ dị mma" (I am fine), "Daalụ" / "Imela" (Thank you), "Ka ọmesịa" (Goodbye).
- Cultural Note: Emphasize respect and hospitality which are foundational to Igbo interaction.
`;
        } else if (language.toLowerCase() === 'afrikaans') {
            systemPrompt += `AFRIKAANS LINGUISTIC CONTEXT:
- Grammar: West Germanic language with simplified grammar. No grammatical gender, and verbs are not conjugated based on the subject (e.g., "ek is", "jy is", "hy is"). Double negation is a prominent feature (e.g. "Ek kan nie Afrikaans praat nie").
- Common Greetings: "Goeiemôre" (Good morning), "Hoe gaan dit?" (How are you?), "Dankie" (Thank you), "Totsiens" (Goodbye).
- Dialects & Tone: Direct but friendly. It is very common to use loanwords from English and indigenous South African languages.
- Syllables & Pronunciation: Vowels can be long or short. The 'r' is usually rolled. 
`;
        }

        systemPrompt += `
MODE: ${mode}
${mode === 'drill' ? `
DRILL MODE FOCUS:
- Extreme focus on pronunciation and syllable accuracy.
- Break down EVERY transcribed word into clear syllables: e.g., "Amesiere" -> "A-me-sie-re", "Sosongo" -> "So-son-go".
- If the transcription contains mistakes compared to the target, identify exactly where they tripped up.
- Ask the user to repeat the word if it's not perfect.
- Do NOT engage in natural chat; focus purely on the drill.
` : `
CONVERSATION MODE FOCUS:
- Act as a friendly dialogue partner in ${language}.
- Keep the user speaking about their day, interests, or the topic at hand.
- Correct grammar/pronunciation briefly (max 1 sentence) then move on with the talk.
- Use Ibibio as much as possible, with English translations in parentheses if the user is a beginner.
`}

CORE GOALS:
1. Detect and Correct: If the user makes a mistake (Grammar, Vocabulary, or Pronunciation), you MUST provide a correction.
2. Pronunciation Drill: If the user mispronounces a word, you MUST break it down into syllables (e.g., "A-me-sie-re") in your tutorResponse and ask them to repeat it until they get it right.
3. Fluid Conversation: In "conversation" mode, act as a friendly dialogue partner. Keep the user speaking.

Return your response ONLY as a JSON object matching this schema:
{
  "tutorResponse": "string (your spoken reply to the user)",
  "corrections": [
    {
      "type": "grammar|pronunciation|vocabulary",
      "original": "string (the part of their speech that was wrong)",
      "corrected": "string (how to say it correctly)",
      "explanation": "string (short reason why - for pronunciation, provide the syllable breakdown here too)",
      "severity": "info|warning|error"
    }
  ],
  "nextPhase": "string (optional: the phase to transition to, e.g. 'learning', 'conversation', 'quiz')"
}

Context Phase: ${sessionPhase}
`;
        if (sessionPhase === 'greeting' && mode === 'conversation') {
            systemPrompt += "\nThe user is responding to your greeting. Decide if you should start a 'quiz' or go straight to 'conversation'.";
        } else if (mode === 'drill') {
            systemPrompt += "\nYou are leading a pronunciation drill. Provide the syllable breakdown and ask them to repeat.";
        } else if (sessionPhase === 'conversation') {
            systemPrompt += "\nThis is a natural conversation. Ask open-ended questions like 'How was your day?' in ${language}.";
        } else {
            systemPrompt += "\nThe user is in free-form practice. Encourage them or transition to a topic.";
        }

        // Convert history for OpenAI
        const chatHistory = recentMessages.map((msg) => ({
            role: msg.role === 'tutor' ? 'assistant' : 'user',
            content: msg.text
        }));

        // 5. Call GPT-4o
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                ...chatHistory,
                { role: "user", content: userText }
            ],
            response_format: { type: "json_object" }
        });

        const aiResponseText = completion.choices[0].message.content || '{}';
        const aiResponse = JSON.parse(aiResponseText);

        // 6. Return structured data to the App
        return {
            userText: userText,
            tutorResponse: aiResponse.tutorResponse || "I didn't quite catch that.",
            corrections: aiResponse.corrections || []
        };

    } catch (error) {
        console.error("Error analyzing audio:", error);
        throw new functions.https.HttpsError('internal', 'Failed to process audio', error.message);
    }
});
