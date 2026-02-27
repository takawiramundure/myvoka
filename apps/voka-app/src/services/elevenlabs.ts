import { Audio } from 'expo-av';
import { useConversationStore } from '../stores/useConversationStore';

// In a real production app, API calls should go through a Firebase Cloud Function
// to protect the API key. We use client-side for rapid prototyping.
const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';

// Singleton queue — ensures only one TTS request runs at a time, preventing
// ElevenLabs concurrent_limit_exceeded errors and overlapping audio.
let audioQueue: Promise<void> = Promise.resolve();

export const playElevenLabsAudio = (text: string): Promise<void> => {
    audioQueue = audioQueue.then(() => _playAudio(text));
    return audioQueue;
};

const _playAudio = async (text: string): Promise<void> => {
    const store = useConversationStore.getState();
    const voiceId = store.tutorVoiceId || "eOHsvebhdtt0XFeHVMQY"; // default to Mfolie if missing

    store.setTutorSpeaking(true);

    const safeName = text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const cloudUrl = `https://storage.googleapis.com/voka-31483.firebasestorage.app/audio/ibibio/${safeName}.mp3`;

    try {
        // 1. Try to play pre-computed audio from Firebase Storage (Fast path)
        const check = await fetch(cloudUrl, { method: 'HEAD' });

        if (check.ok) {
            await new Promise<void>(async (resolve, reject) => {
                try {
                    const { sound } = await Audio.Sound.createAsync({ uri: cloudUrl });
                    sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            store.setTutorSpeaking(false);
                            sound.unloadAsync();
                            resolve();
                        }
                    });
                    await sound.playAsync();
                } catch (e) {
                    reject(e);
                }
            });
            return;
        }

        // 2. Playback pre-computed failed, attempt live TTS generation
        if (!API_KEY) {
            console.warn("⚠️ EXPO_PUBLIC_ELEVENLABS_API_KEY is missing from .env! Cannot play TTS audio.");
            store.setTutorSpeaking(false);
            return;
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': API_KEY,
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.65,
                        similarity_boost: 0.80,
                        style: 0.35,
                        use_speaker_boost: true,
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
        }

        const audioBlob = await response.blob();

        await new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64data = reader.result as string;
                    const { sound } = await Audio.Sound.createAsync({ uri: base64data });

                    sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            store.setTutorSpeaking(false);
                            sound.unloadAsync();
                            resolve();
                        }
                    });

                    await sound.playAsync();
                } catch (e) {
                    store.setTutorSpeaking(false);
                    reject(e);
                }
            };
            reader.readAsDataURL(audioBlob);
        });

    } catch (error) {
        console.error("Audio Playback Error:", error);
        store.setTutorSpeaking(false);
    }
};
