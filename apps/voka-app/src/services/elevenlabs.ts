import { Audio } from 'expo-av';
import * as FS from 'expo-file-system';
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

const getCacheUri = (text: string, voiceId: string): string => {
    const safeName = text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${FS.cacheDirectory}${voiceId}_${safeName}.mp3`;
};

// Expose a prefetch method
export const prefetchElevenLabsAudio = async (text: string, forceBackground: boolean = true): Promise<void> => {
    if (!text) return;
    const store = useConversationStore.getState();
    const voiceId = store.tutorVoiceId || "eOHsvebhdtt0XFeHVMQY";
    const cacheUri = getCacheUri(text, voiceId);

    try {
        const fileInfo = await FS.getInfoAsync(cacheUri);
        if (fileInfo.exists) return; // Already cached
        // Fetch it
        if (forceBackground) {
            // Push to queue but do not play
            audioQueue = audioQueue.then(() => fetchAndCacheOptionally(text, voiceId, cacheUri, false));
        } else {
            await fetchAndCacheOptionally(text, voiceId, cacheUri, false);
        }
    } catch (e) {
        console.warn("Prefetch failed:", e);
    }
}

const fetchAndCacheOptionally = async (text: string, voiceId: string, cacheUri: string, playAfter: boolean): Promise<void> => {
    const store = useConversationStore.getState();
    const safeName = text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const cloudUrl = `https://storage.googleapis.com/voka-31483.firebasestorage.app/audio/ibibio/${safeName}.mp3`;

    try {
        if (playAfter) store.setTutorSpeaking(true);

        let finalUri = cacheUri;

        // Ensure we don't redownload if we already have it
        const fileInfo = await FS.getInfoAsync(cacheUri);

        if (!fileInfo.exists) {
            // Try downloading from Google Cloud Storage
            const check = await fetch(cloudUrl, { method: 'HEAD' });
            if (check.ok) {
                await FS.downloadAsync(cloudUrl, cacheUri);
            } else {
                // Not in cloud, try ElevenLabs API
                if (!API_KEY) {
                    console.warn("⚠️ EXPO_PUBLIC_ELEVENLABS_API_KEY is missing!");
                    if (playAfter) store.setTutorSpeaking(false);
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
                    throw new Error(`ElevenLabs error: ${response.status} ${errorText}`);
                }

                const audioBlob = await response.blob();
                const base64Str = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64data = reader.result as string;
                        resolve(base64data.split(',')[1]);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(audioBlob);
                });

                await FS.writeAsStringAsync(cacheUri, base64Str, { encoding: FS.EncodingType.Base64 });
            }
        }

        if (playAfter) {
            await new Promise<void>(async (resolve, reject) => {
                try {
                    const { sound } = await Audio.Sound.createAsync({ uri: finalUri });
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
            });
        }
    } catch (e) {
        console.error("Fetch/Cache Audio Error:", e);
        if (playAfter) store.setTutorSpeaking(false);
    }
};

const _playAudio = async (text: string): Promise<void> => {
    const store = useConversationStore.getState();
    const voiceId = store.tutorVoiceId || "eOHsvebhdtt0XFeHVMQY";
    const cacheUri = getCacheUri(text, voiceId);

    // If already cached, play immediately without waiting in the big fetch queue
    const fileInfo = await FS.getInfoAsync(cacheUri);
    if (fileInfo.exists) {
        store.setTutorSpeaking(true);
        await new Promise<void>(async (resolve, reject) => {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri: cacheUri });
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
        });
        return;
    }

    // Otherwise, it has to be fetched
    await fetchAndCacheOptionally(text, voiceId, cacheUri, true);
};


