import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useConversationStore } from '../stores/useConversationStore';
import * as Haptics from 'expo-haptics';
import { playElevenLabsAudio } from '../services/elevenlabs';
import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';
import * as FileSystem from 'expo-file-system/legacy';

// Helper to wait
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function RecordButton() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);

    // Ref mirrors state but is synchronously readable in callbacks — prevents
    // the stale-closure race condition where stopRecording sees recording===null
    // because React hasn't flushed the state update from startRecording yet.
    // This was the root cause of the EXC_CRASH (SIGABRT) on Thread 13:
    // a dangling recording was never stopped, and the next press tried to
    // create a second concurrent recording → native iOS exception → abort.
    const recordingRef = React.useRef<Audio.Recording | null>(null);

    // Lock prevents a second recording from starting before the first is ready.
    const isStartingRef = React.useRef(false);

    const isRecording = useConversationStore((s) => s.isRecording);
    const {
        setRecording: setRecordingState,
        addMessage,
        setCurrentTranscript,
        sessionPhase,
        setSessionPhase,
        quizQuestionIndex,
        setQuizQuestionIndex,
        messages,
        activeMode,
        selectedLanguage
    } = useConversationStore();

    const scale = useSharedValue(1);

    useEffect(() => {
        if (isRecording) {
            scale.value = withRepeat(withTiming(1.2, { duration: 800 }), -1, true);
        } else {
            scale.value = withSpring(1);
        }
    }, [isRecording]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    async function startRecording() {
        // Guard: don't start if already starting or a recording already exists
        if (isStartingRef.current || recordingRef.current) return;
        isStartingRef.current = true;

        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                // Set ref BEFORE state — ref is synchronously readable,
                // state update is asynchronous (batched by React).
                recordingRef.current = recording;
                setRecording(recording);
                setRecordingState(true);
            }
        } catch (err) {
            console.error('Failed to start recording', err);
            recordingRef.current = null;
        } finally {
            isStartingRef.current = false;
        }
    }

    async function stopRecording() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRecordingState(false);

        // Read from ref (always current) — not from state (may be stale).
        const currentRecording = recordingRef.current;

        if (currentRecording) {
            // Clear ref immediately so a rapid second press won't double-stop.
            recordingRef.current = null;
            setRecording(null);

            try {
                await currentRecording.stopAndUnloadAsync();
                await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

                const uri = currentRecording.getURI();
                if (!uri) return;

                setCurrentTranscript('Transcribing...');

                const base64Audio = await FileSystem.readAsStringAsync(uri, {
                    encoding: 'base64',
                });

                const analyzeAudioFn = httpsCallable(functions, 'analyzeAudio');
                const history = messages.slice(-5);

                const result: any = await analyzeAudioFn({
                    audio: base64Audio,
                    sessionPhase,
                    history,
                    language: selectedLanguage,
                    mode: activeMode,
                });

                const { userText, tutorResponse, corrections, nextPhase } =
                    result.data as {
                        userText: string;
                        tutorResponse: string;
                        corrections: any[];
                        nextPhase?: string;
                    };

                addMessage({
                    id: Date.now().toString(),
                    role: 'user',
                    text: userText,
                    timestamp: new Date(),
                });

                setCurrentTranscript('Correcting...');
                await delay(500);
                setCurrentTranscript('');

                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: 'tutor',
                    text: tutorResponse,
                    timestamp: new Date(),
                    corrections: corrections?.length > 0 ? corrections : undefined,
                });

                await playElevenLabsAudio(tutorResponse);

                if (nextPhase) {
                    setSessionPhase(nextPhase as any);
                } else if (sessionPhase === 'greeting') {
                    setSessionPhase('quiz');
                } else if (sessionPhase === 'quiz') {
                    if (quizQuestionIndex < 2) {
                        setQuizQuestionIndex(quizQuestionIndex + 1);
                    } else {
                        setSessionPhase('conversation');
                    }
                }
            } catch (err) {
                console.error('AI Processing Error:', err);
                setCurrentTranscript('Error processing voice.');
                await delay(2000);
                setCurrentTranscript('');
            }
        }
    }

    return (
        <View className="items-center justify-center h-32 w-full">
            <Animated.View style={[animatedStyle]}>
                <TouchableOpacity
                    onPressIn={startRecording}
                    onPressOut={stopRecording}
                    activeOpacity={0.8}
                    className="w-20 h-20 rounded-full bg-secondary items-center justify-center shadow-lg shadow-secondary/50"
                >
                    <Ionicons name="mic" size={36} color="#ffffff" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
