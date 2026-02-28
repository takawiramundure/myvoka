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
