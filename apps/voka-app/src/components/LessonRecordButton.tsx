import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useConversationStore } from '../stores/useConversationStore';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface LessonRecordButtonProps {
    targetText: string;
    onResult: (isCorrect: boolean, transcription: string, aiFeedback: string | null) => void;
}

export default function LessonRecordButton({ targetText, onResult }: LessonRecordButtonProps) {
    const recordingRef = useRef<Audio.Recording | null>(null);
    const isStartingRef = useRef(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const selectedLanguage = useConversationStore((s) => s.selectedLanguage);

    const scale = useSharedValue(1);

    useEffect(() => {
        if (isRecording) {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 500 }),
                    withTiming(1, { duration: 500 })
                ),
                -1
            );
        } else {
            scale.value = withTiming(1);
        }
    }, [isRecording]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    async function startRecording() {
        if (isStartingRef.current || recordingRef.current || isProcessing) return;
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

                recordingRef.current = recording;
                setIsRecording(true);
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        } finally {
            isStartingRef.current = false;
        }
    }

    async function stopRecording() {
        if (!recordingRef.current || isProcessing) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsRecording(false);
        setIsProcessing(true);

        const currentRecording = recordingRef.current;
        recordingRef.current = null;

        try {
            await currentRecording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

            const uri = currentRecording.getURI();
            if (!uri) {
                setIsProcessing(false);
                return;
            }

            const base64Audio = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            const analyzeAudioFn = httpsCallable(functions, 'analyzeAudio');

            const result: any = await analyzeAudioFn({
                audio: base64Audio,
                sessionPhase: 'learning',
                history: [],
                language: selectedLanguage,
                mode: 'drill',
                targetText: targetText
            });

            const data = result.data;
            const transcript = data.userText || '';
            const corrections = data.corrections || [];

            // In Drill mode, if there are corrections, it's incorrect.
            const isCorrect = corrections.length === 0;
            const aiFeedback = corrections.length > 0 ? corrections[0].explanation : null;

            onResult(isCorrect, transcript, aiFeedback);

        } catch (err) {
            console.error('AI Processing Error:', err);
            onResult(false, 'Error', 'Failed to process voice.');
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <View className="items-center justify-center h-40 w-full">
            {isProcessing ? (
                <View className="items-center justify-center">
                    <ActivityIndicator size="large" color="#1A6B4A" />
                    <Text className="text-primary mt-4 font-nunito font-bold">Evaluating...</Text>
                </View>
            ) : (
                <View className="items-center justify-center">
                    <TouchableOpacity
                        onPressIn={startRecording}
                        onPressOut={stopRecording}
                        activeOpacity={0.8}
                        disabled={isProcessing}
                    >
                        <Animated.View
                            style={[animatedStyle]}
                            className={`w-28 h-28 rounded-full items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-primary'
                                } shadow-xl`}
                        >
                            <Ionicons name="mic" size={48} color="white" />
                        </Animated.View>
                    </TouchableOpacity>
                    <Text className="text-text-secondary mt-6 text-lg font-nunito">
                        {isRecording ? 'Release to Send' : 'Hold to Speak'}
                    </Text>
                </View>
            )}
        </View>
    );
}
