import { Audio } from 'expo-av';
import { useConversationStore } from '../stores/useConversationStore';

// In a real production app, API calls should go through a Firebase Cloud Function
// To protect the API key. We use client-side for rapid prototyping.
const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';

// Singleton queue to prevent concurrent requests and overlapping audio
let audioQueue: Promise<void> = Promise.resolve();

export const playElevenLabsAudio = async (text: string, voiceId: string = "eOHsvebhdtt0XFeHVMQY") => {
    // Wrap in queue
    audioQueue = audioQueue.then(async () => {
        try {
            const { setTutorSpeaking } = useConversationStore.getState();
            setTutorSpeaking(true);

            if (!API_KEY) {
                console.warn("⚠️ EXPO_PUBLIC_ELEVENLABS_API_KEY is missing from .env! Cannot play TTS audio.");
                setTutorSpeaking(false);
                return;
            }

            // Using the REST API directly for React Native compatibility
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

            // Convert the response to a blob, then create a local URI using FileReader
            // We cannot stream directly easily in RN without specific native modules 
            // so we buffer the full response for this prototype
            const audioBlob = await response.blob();

            return new Promise<void>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const base64data = reader.result as string;
                        const { sound } = await Audio.Sound.createAsync({ uri: base64data });

                        sound.setOnPlaybackStatusUpdate((status) => {
                            if (status.isLoaded && status.didJustFinish) {
                                setTutorSpeaking(false);
                                sound.unloadAsync();
                                resolve();
                            }
                        });

                        await sound.playAsync();
                    } catch (e) {
                        setTutorSpeaking(false);
                        reject(e);
                    }
                };
                reader.readAsDataURL(audioBlob);
            });

        } catch (error) {
            console.error("Audio Playback Error: ", error);
            useConversationStore.getState().setTutorSpeaking(false);
        }
    });

    return audioQueue;
};
