import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
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
import { app, functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';
import * as FileSystem from 'expo-file-system/legacy';

// Helper to wait
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function RecordButton() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
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

    // Animation for the pulsing effect
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isRecording) {
            scale.value = withRepeat(
                withTiming(1.2, { duration: 800 }),
                -1,
                true
            );
        } else {
            scale.value = withSpring(1);
        }
    }, [isRecording]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    async function startRecording() {
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

                setRecording(recording);
                setRecordingState(true);
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRecordingState(false);

        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

                const uri = recording.getURI();
                console.log('Recording stopped and stored at', uri);

                if (!uri) return;

                setCurrentTranscript('Transcribing...');

                // 1. Convert audio file to Base64
                const base64Audio = await FileSystem.readAsStringAsync(uri, {
                    encoding: 'base64',
                });

                // 2. Call Firebase Cloud Function
                const analyzeAudioFn = httpsCallable(functions, 'analyzeAudio');

                // Get history for context (last 5 messages)
                const history = messages.slice(-5);

                const result: any = await analyzeAudioFn({
                    audio: base64Audio,
                    sessionPhase: sessionPhase,
                    history: history,
                    language: selectedLanguage,
                    mode: activeMode
                });

                const { userText, tutorResponse, corrections, nextPhase } = result.data as { userText: string, tutorResponse: string, corrections: any[], nextPhase?: string };

                // 3. Update UI with User Text
                addMessage({
                    id: Date.now().toString(),
                    role: 'user',
                    text: userText,
                    timestamp: new Date()
                });

                setCurrentTranscript('Correcting...');
                await delay(500);
                setCurrentTranscript('');

                // 4. Update UI with Tutor Response
                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: 'tutor',
                    text: tutorResponse,
                    timestamp: new Date(),
                    corrections: corrections && corrections.length > 0 ? corrections : undefined
                });

                // 5. Fire ElevenLabs TTS
                await playElevenLabsAudio(tutorResponse);

                // 6. Handle automatic phase transitions
                if (nextPhase) {
                    setSessionPhase(nextPhase as any);
                } else if (sessionPhase === 'greeting') {
                    setSessionPhase('quiz');
                } else if (sessionPhase === 'quiz') {
                    // Logic for quiz index (if not guided by nextPhase)
                    if (quizQuestionIndex < 2) {
                        setQuizQuestionIndex(quizQuestionIndex + 1);
                    } else {
                        setSessionPhase('conversation'); // Default to conversation after quiz
                    }
                }

            } catch (err) {
                console.error('AI Processing Error:', err);
                setCurrentTranscript('Error processing voice.');
                await delay(2000);
                setCurrentTranscript('');
            } finally {
                setRecording(null);
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
