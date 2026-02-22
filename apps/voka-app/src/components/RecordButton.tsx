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
import { useConversationStore } from '../../stores/useConversationStore';
import * as Haptics from 'expo-haptics';
import { playElevenLabsAudio } from '../../services/elevenlabs';

// Helper to wait
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function RecordButton() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const isRecording = useConversationStore((s) => s.isRecording);
    const { setRecording: setRecordingState, addMessage, setCurrentTranscript } = useConversationStore((s) => s);

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
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

            const uri = recording.getURI();
            console.log('Recording stopped and stored at', uri);

            // Simulate Processing Pipeline
            setCurrentTranscript('Processing audio...');
            await delay(1000); // Fake STT Delay

            addMessage({
                id: Date.now().toString(),
                role: 'user',
                text: 'Nso idi emi?', // "What is this?" in Ibibio
                timestamp: new Date()
            });

            setCurrentTranscript('Thinking...');
            await delay(1000); // Fake GPT Delay
            setCurrentTranscript('');

            const tutorResponse = "Emi edi ewa. (This is a dog.) Good attempt!";

            addMessage({
                id: (Date.now() + 1).toString(),
                role: 'tutor',
                text: tutorResponse,
                timestamp: new Date(),
                corrections: [] // Mock empty corrections
            });

            // Fire ElevenLabs TTS
            await playElevenLabsAudio(tutorResponse);

            setRecording(null);
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
