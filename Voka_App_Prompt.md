# Voká – AI Language Learning App
## Complete Build Prompt for Anti-Gravity AI Agent

---

## 🧠 ROLE & CONTEXT

You are a senior React Native engineer with deep expertise in Firebase, Vite, real-time audio processing, and AI API integrations. You are building **Voká** — a beautiful, production-grade mobile language-learning app focused primarily on African languages, starting with **Ibibio** as the flagship language. The app enables users to have natural voice conversations with an AI tutor, receive real-time grammar and pronunciation corrections, and track their progress over time.

---

## 🌍 AFRICAN LANGUAGES — SUPPORTED & AVAILABLE

Below are the African languages that current AI speech and language models support, categorized by the level of AI model support available:

### ✅ Tier 1 — Full TTS + STT Support (ElevenLabs v3 / Whisper)
| Language | Region | Notes |
|---|---|---|
| **Ibibio** ⭐ | Nigeria (Cross River / Akwa Ibom) | **FLAGSHIP — implement first.** Handle via GPT-4o conversation layer + ElevenLabs multilingual; phonetically guide pronunciation rules |
| **Hausa** | West Africa (Nigeria, Niger, Chad) | Full ElevenLabs v3 + Whisper STT support |
| **Swahili** | East Africa | High-accuracy STT; full TTS |
| **Yoruba** | Nigeria / West Africa | Moderate STT; TTS available |
| **Afrikaans** | South Africa | Full support |
| **Somali** | East Africa / Horn of Africa | Available |
| **Lingala** | Central Africa (DRC, Congo) | Available |
| **Chichewa (Nyanja)** | Malawi, Zambia, Zimbabwe | Available |

### 🟡 Tier 2 — Partial/Moderate AI Support
| Language | Region |
|---|---|
| **Igbo** | Nigeria |
| **Zulu** | South Africa |
| **Xhosa** | South Africa |
| **Amharic** | Ethiopia |
| **Shona** | Zimbabwe |
| **Wolof** | Senegal |
| **Ganda (Luganda)** | Uganda |

### ⚠️ Ibibio-Specific Implementation Notes
Ibibio is a Niger-Congo language spoken in Akwa Ibom and Cross River States, Nigeria. It is tonal with complex phonetics. Since no dedicated Ibibio TTS model exists yet, use this approach:
- **Conversation AI:** GPT-4o (or Claude API) with a system prompt that deeply embeds Ibibio grammar rules, vocabulary, and common phrases.
- **Voice Output:** ElevenLabs Eleven v3 Multilingual model with a West African-accented English or Hausa voice as the closest phonetic proxy — while displaying text in Ibibio script.
- **STT Input:** Use Whisper large-v3 or ElevenLabs STT; provide phonetic hints in the prompt pipeline.
- **Phase 2 (Future):** Integrate a fine-tuned Ibibio model when community datasets (e.g., from Common Voice or Mozilla) become available.

---

## 🎨 DESIGN SYSTEM

### Color Palette — "Voká"
```
Primary:       #1A6B4A  — Deep African Forest Green
Secondary:     #E8A020  — Warm Amber/Gold (Kente-inspired)
Accent:        #C0392B  — Vibrant Red (African sunset)
Background:    #0D1117  — Deep dark (primary screens)
Surface:       #161B22  — Card backgrounds
Surface Light: #21262D  — Input fields / elevated surfaces
Text Primary:  #F0F6FC  — Near-white
Text Secondary:#8B949E  — Muted gray
Success:       #3FB950  — Correct answer green
Warning:       #D29922  — Grammar warning
Error:         #F85149  — Pronunciation error
Wave Color:    #1A6B4A  — AI speaking waveform
Mic Color:     #E8A020  — User speaking indicator
```

### Typography
```
Display Font:  "Nunito" (rounded, warm, approachable — Google Fonts)
Heading Font:  "Poppins" (bold, clean)
Body Font:     "Inter" (readable at small sizes)
Mono Font:     "JetBrains Mono" (for language phonetics display)
```

### Visual Language
- Rounded corners (border-radius: 16px standard, 24px for cards)
- Subtle African-pattern-inspired background textures (SVG-based, not images)
- Gradient overlays using Primary + Secondary for hero sections
- Floating action buttons with shadow depth
- Dark mode only (premium feel)

---

## 🗄️ FIREBASE DATABASE SCHEMAS

### Collection: `users`
```json
{
  "uid": "string (Firebase Auth UID)",
  "displayName": "string",
  "email": "string",
  "photoURL": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "preferences": {
    "selectedLanguage": "string (e.g. 'ibibio')",
    "nativeLanguage": "string (e.g. 'english')",
    "tutorVoiceGender": "male | female",
    "tutorVoiceId": "string (ElevenLabs voice ID)",
    "dailyGoalMinutes": "number",
    "notificationsEnabled": "boolean"
  },
  "stats": {
    "currentStreak": "number",
    "longestStreak": "number",
    "lastSessionDate": "timestamp",
    "totalSessions": "number",
    "totalMinutesPracticed": "number",
    "overallImprovementScore": "number (0-100)"
  }
}
```

### Collection: `practiceSessions`
```json
{
  "sessionId": "string (auto-ID)",
  "userId": "string",
  "language": "string",
  "startedAt": "timestamp",
  "endedAt": "timestamp",
  "durationSeconds": "number",
  "topic": "string (e.g. 'greetings', 'market', 'family')",
  "messages": [
    {
      "messageId": "string",
      "role": "user | tutor",
      "text": "string",
      "audioUrl": "string | null",
      "timestamp": "timestamp",
      "corrections": [
        {
          "type": "grammar | pronunciation | vocabulary",
          "original": "string",
          "corrected": "string",
          "explanation": "string",
          "severity": "info | warning | error"
        }
      ]
    }
  ],
  "sessionScore": "number (0-100)",
  "grammarErrors": "number",
  "pronunciationErrors": "number",
  "wordsUsed": "number",
  "newWordsLearned": "array of strings"
}
```

### Collection: `progress`
```json
{
  "userId": "string",
  "language": "string",
  "weeklyData": [
    {
      "weekStart": "timestamp",
      "sessionsCount": "number",
      "minutesPracticed": "number",
      "averageScore": "number",
      "grammarImprovementDelta": "number",
      "pronunciationImprovementDelta": "number"
    }
  ],
  "vocabularyMastered": "array of strings",
  "grammarRulesMastered": "array of strings",
  "currentLevel": "beginner | elementary | intermediate | advanced",
  "improvementScore": "number (0-100)"
}
```

---

## 📱 APP ARCHITECTURE & NAVIGATION

### Tech Stack
- **Framework:** React Native (Expo SDK 51+)
- **Build Tool:** Vite (for web companion or admin dashboard)
- **Backend:** Firebase (Auth, Firestore, Storage, Functions)
- **Navigation:** React Navigation v6 (Bottom Tab + Stack)
- **State Management:** Zustand
- **Audio:** `expo-av` + `expo-speech` + custom ElevenLabs streaming
- **AI Conversation:** OpenAI GPT-4o API (or Anthropic Claude API)
- **Voice Output:** ElevenLabs API (Eleven v3 Multilingual)
- **Voice Input (STT):** ElevenLabs STT API or OpenAI Whisper API

### Screen Structure
```
App
├── Auth Stack
│   ├── WelcomeScreen
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── VoiceSetupScreen  ← Gender + voice selection before entering app
│
└── Main Tab Navigator
    ├── 🏠 HomeScreen (Dashboard + language selector)
    ├── 🎤 ConversationScreen (Voice AI tutor)
    ├── 📚 HistoryScreen (Past sessions)
    ├── 📊 ProgressScreen (Streak + improvement metrics)
    └── 👤 ProfileScreen (User settings)
```

---

## 🎙️ VOICE CONVERSATION COMPONENT

### Behavior Specification

**When the AI Tutor is speaking:**
- Show an **animated audio waveform** centered on screen — 5-7 vertical bars that animate up and down using a smooth sine wave pattern
- Bars should pulse in the Primary green color (`#1A6B4A`) with a glowing effect
- Display the AI's spoken text as a subtitle below the waveform (streaming word-by-word as audio plays)
- Show a muted microphone icon to indicate the user cannot speak yet

**When the User is speaking:**
- Show a **large, pulsing microphone icon** in the Amber/Gold color (`#E8A020`)
- The mic icon should have a radial pulse animation (rings expanding outward)
- Show a small real-time amplitude level indicator (thin bar) below the mic
- Display partial transcription text in real time as they speak

**When idle / waiting:**
- Show a soft "Press and hold to speak" prompt
- Display a subtle breathing animation on the tutor avatar

### Implementation

```javascript
// Audio Waveform Component (AI Speaking)
// Use react-native-reanimated for smooth 60fps animations
// Animate 7 bars with staggered sine wave timing offsets

// Recording Component (User Speaking)
// Use expo-av Audio.Recording
// Show real-time metering via recording.getStatusAsync()
// On release: send audio blob to ElevenLabs STT → GPT-4o → ElevenLabs TTS

// Voice Pipeline:
// 1. User audio → ElevenLabs STT API (Whisper-based) → transcript
// 2. Transcript + session history → GPT-4o with Ibibio tutor system prompt → response text + corrections JSON
// 3. Response text → ElevenLabs TTS (selected voice) → audio stream
// 4. Play audio stream while animating waveform
// 5. Save message + corrections to Firestore
```

### AI Tutor System Prompt Template (for Ibibio)
```
You are Eka, a warm, patient, and encouraging Ibibio language tutor. 
You are a native Ibibio speaker from Akwa Ibom State, Nigeria.
Your teaching style is conversational, supportive, and culturally rich.

When the user speaks or writes in Ibibio:
1. Respond naturally in Ibibio first, then provide an English translation in parentheses.
2. If there are grammar errors, gently correct them AFTER your response, formatted as JSON corrections.
3. If pronunciation guidance is needed, provide phonetic hints using IPA notation.
4. Keep conversations culturally contextual — reference Ibibio food, customs, proverbs, and daily life.
5. Celebrate progress enthusiastically but naturally — not robotically.

Respond in this JSON format:
{
  "tutorResponse": "Ibibio response text here",
  "englishTranslation": "English translation here",
  "corrections": [
    {
      "type": "grammar|pronunciation|vocabulary",
      "original": "what the user said",
      "corrected": "the correct form",
      "explanation": "brief friendly explanation",
      "severity": "info|warning|error"
    }
  ],
  "encouragement": "optional positive reinforcement message"
}
```

---

## 🔊 VOICE QUALITY — PLUGINS & RECOMMENDATIONS

### The Problem with Robotic TTS
Standard TTS APIs (Google, Apple) sound mechanical because they lack:
- Natural prosody and rhythm variation
- Emotional expression
- Breathing and micro-pauses
- Authentic African vocal characteristics

### Recommended Solution Stack for Human-Like Voice

#### Primary: **ElevenLabs API** (Best quality, recommended)
- **Model:** `eleven_multilingual_v2` or `eleven_v3` (latest, most expressive)
- **Why:** Neural voice synthesis with natural prosody, emotion, and warmth — sounds like a real person, not a robot
- **Male Voice Options:** "Adam", "Antoni", "Josh", "Fin" — or create a custom African-accented voice using Voice Cloning
- **Female Voice Options:** "Bella", "Rachel", "Elli" — or custom
- **African-Specific:** ElevenLabs supports Nigerian accent voices; use Voice Library to find "Olufunmilola" (Yoruba female) or similar for authentic West African tonality
- **API:** `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream`
- **Latency:** ~300-800ms first chunk (use streaming for real-time feel)

#### Voice Selection Screen (on First Launch / Profile)
```
Before entering the app, the user should:
1. Choose tutor gender: [Male Tutor] or [Female Tutor]
2. Hear a 5-second preview of each available voice saying a phrase in their chosen language
3. Confirm their selection (saved to user profile in Firebase)
4. This can be changed anytime in Profile → Tutor Settings

Initial voice characters:
- "Eka" (Female) — Warm, nurturing, mid-30s Nigerian female voice
- "Emem" (Male) — Calm, clear, authoritative but friendly Nigerian male voice
```

#### Voice Settings Object
```json
{
  "voiceId": "ElevenLabs voice ID string",
  "voiceGender": "male | female",
  "voiceCharacterName": "Eka | Emem",
  "stability": 0.65,
  "similarityBoost": 0.80,
  "style": 0.35,
  "useSpeakerBoost": true
}
```

#### Supporting Libraries (React Native)
```bash
# Core audio
expo-av                          # Recording + playback
expo-speech                      # Fallback TTS (offline)
react-native-reanimated          # Waveform + mic animations (60fps)
react-native-sound               # Low-latency audio playback

# Voice processing
@react-native-voice/voice        # STT fallback (on-device)

# Streaming
react-native-fetch-api           # Streaming audio chunks from ElevenLabs
```

#### ElevenLabs NPM Package
```bash
npm install elevenlabs
```
```javascript
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// Stream audio for real-time playback
const audioStream = client.textToSpeech.stream(voiceId, {
  text: tutorResponseText,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.65,
    similarity_boost: 0.80,
    style: 0.35,
    use_speaker_boost: true
  }
});
```

---

## 🔧 CORRECTIONS DISPLAY SYSTEM

### Grammar Correction Card Component
```
[!] Grammar Correction
────────────────────────
❌ You said:     "M̀fọŋ ke ọdọ ifiọk"
✅ Correct form: "M̀fọŋ ke ịfiọk ọdọ"
ℹ️ Explanation:  In Ibibio, the object typically follows the verb directly.
                 Word order: Subject → Verb → Object
```

### Pronunciation Tip Component
```
[🔊] Pronunciation Guide
────────────────────────
Word: "Ibibio"
IPA:  /ɪ.bɪ.bɪ.o/
Tip:  Each syllable has equal stress. The final "o" is open and rounded.
      [Play Example] button
```

### Color Coding
- `info` severity → Blue border, informational icon
- `warning` severity → Amber border, warning icon  
- `error` severity → Red border, error icon
- Corrections auto-dismiss after 10 seconds or on user tap

---

## 📚 SESSION HISTORY PAGE

- List of past sessions grouped by date
- Each card shows: language flag, date/time, duration, session score badge, topic tag
- Tapping a session opens a full conversation transcript
- Audio replay of tutor responses (if saved to Firebase Storage)
- Download session as PDF option
- Search/filter by language, date range, score

---

## 📊 PROGRESS DASHBOARD

### Metrics to Display
1. **Streak Counter** — Large, prominent display (current streak in days + flame emoji animation)
2. **Weekly Activity Chart** — Bar chart: minutes practiced per day this week
3. **Improvement Score** — Circular progress indicator (0-100), calculated from grammar + pronunciation error rates over time
4. **Session Score Trend** — Line chart: last 10 session scores
5. **Vocabulary Growth** — Number of new words learned this month
6. **Skill Breakdown** — Radar/spider chart: Grammar, Vocabulary, Pronunciation, Fluency, Comprehension
7. **Language Levels** — Badge/level system: Beginner → Elementary → Intermediate → Advanced → Fluent

### Libraries
```bash
react-native-gifted-charts      # Bar + line charts
react-native-svg                # Spider/radar chart
react-native-circular-progress  # Improvement score ring
```

---

## 🔐 AUTHENTICATION & USER PROFILE

### Auth Methods
- Email + Password (Firebase Auth)
- Google Sign-In (via `expo-auth-session`)
- Apple Sign-In (iOS — required for App Store)

### Onboarding Flow (New Users)
1. Welcome screen with Voká branding + African visual motifs
2. Select native language (for UI language)
3. Select learning language → **Ibibio (Featured)** shown first, then others
4. Voice setup: Choose Male (Emem) or Female (Eka) tutor → Preview both → Confirm
5. Set daily practice goal (5 / 10 / 15 / 20 minutes)
6. Optional: Set notification time for daily reminders
7. Dive into first lesson

### Profile Screen
- Avatar + display name (editable)
- Change tutor voice (male/female + preview)
- Change learning language
- Daily goal setting
- Notification preferences
- Account management (change password, delete account)
- App version + feedback link

---

## 🌐 LANGUAGE SELECTOR COMPONENT

### Main Language Selector
```
Featured: 🇳🇬 Ibibio (NEW)

African Languages:
🇳🇬 Hausa       🇰🇪 Swahili     🇳🇬 Yoruba
🇳🇬 Igbo        🇿🇦 Zulu        🇿🇦 Xhosa
🇿🇦 Afrikaans   🇪🇹 Amharic    🇸🇳 Wolof
🇨🇩 Lingala     🇲🇼 Chichewa   🇿🇼 Shona
🇺🇬 Luganda     🇸🇴 Somali

Coming Soon (grayed out):
Fula, Tigrinya, Bambara, Twi, Ewe, Igala, Tiv
```

Each language card shows:
- Country flag emoji
- Language name in English
- Language name in the language itself (e.g. "Swahili" → "Kiswahili")
- Number of active learners (social proof)
- AI support level badge: ✅ Full / 🟡 Beta / 🔜 Coming Soon

---

## ⚙️ ENVIRONMENT VARIABLES NEEDED

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# AI APIs
ELEVENLABS_API_KEY=sk_5c1c3502b67e82826de927c049f940bbb0bf91e307967593           # Voice TTS + STT
OPENAI_API_KEY=               # GPT-4o conversation (via Firebase Functions — never expose on client)
ANTHROPIC_API_KEY=            # Optional: Claude as conversation model

# Voice IDs (ElevenLabs)
ELEVENLABS_FEMALE_VOICE_ID=eOHsvebhdtt0XFeHVMQY   # "Jade" character
ELEVENLABS_MALE_VOICE_ID=YPtbPhafrxFTDAeaPP4w     # "Sekou" character
```

---

## 🛡️ SECURITY RULES

- **All AI API calls** (OpenAI, ElevenLabs TTS) must go through **Firebase Cloud Functions** — never expose API keys on the client
- Firebase Security Rules: users can only read/write their own documents (`request.auth.uid == userId`)
- Audio files stored in Firebase Storage under `/audio/{userId}/{sessionId}/`
- Rate limiting on Cloud Functions: max 50 TTS requests per user per hour

---

## 🚀 BUILD ORDER FOR ANTI-GRAVITY AGENT

Execute in this sequence:

1. **Design System** — Set up colors, fonts, theme provider, shared components (Button, Card, Badge, Avatar)
2. **Firebase Setup** — Initialize project, configure Auth + Firestore + Storage + Functions
3. **Database Schemas** — Create Firestore security rules + TypeScript interfaces for all collections
4. **Navigation Structure** — Set up React Navigation with Auth Stack + Main Tab Navigator
5. **Authentication** — Login, Register, Google Sign-In, Apple Sign-In screens
6. **Voice Setup Screen** — Gender selection + ElevenLabs voice preview + confirmation (shown during onboarding)
7. **Language Selector** — Home screen with featured Ibibio + full language grid
8. **Voice Conversation Screen** — Core feature: waveform animation + mic recording + full AI pipeline
9. **Corrections Display** — Grammar + pronunciation feedback cards with severity styling
10. **Session History** — List view + detail transcript view
11. **Progress Dashboard** — Streak, charts, improvement score, skill radar
12. **User Profile** — Edit profile, change tutor voice, language, goals
13. **Ibibio Tutor Prompt** — Fine-tune the GPT-4o system prompt with comprehensive Ibibio grammar rules, common phrases, and cultural context
14. **Testing** — Voice recording → STT → AI → TTS → playback full pipeline test on both iOS and Android

---

## 📝 ADDITIONAL NOTES FOR THE AGENT

- Use **Expo Go** for development and **EAS Build** for production builds
- All screens must support both iPhone (iOS 15+) and Android (API 26+)
- Add **haptic feedback** (`expo-haptics`) on mic button press/release for tactile confirmation
- The waveform animation must run on the **UI thread** (use `react-native-reanimated` worklets) to prevent dropped frames during audio playback
- Implement **offline mode** gracefully: cache last session, show offline banner, disable voice features with a clear message
- Use **Zustand** stores: `useAuthStore`, `useSessionStore`, `useProgressStore`, `useVoiceStore`
- All text content should be internationalizable from day one (`i18n-js` or `expo-localization`)
- Add **skeleton loaders** on all data-fetching screens for a polished feel
- The app name is **Voká** — tagline: *"Your Voice. Your Roots."*

---

*Prompt version 1.1 | Voká | Built for Anti-Gravity AI Agent | React Native + Expo + Firebase + ElevenLabs + GPT-4o*
