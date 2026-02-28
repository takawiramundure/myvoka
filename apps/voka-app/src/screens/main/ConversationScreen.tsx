import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import WaveformAnimation from '../../components/WaveformAnimation';
import RecordButton from '../../components/RecordButton';
import CorrectionsOverlay from '../../components/CorrectionsOverlay';
import { useConversationStore } from '../../stores/useConversationStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { playElevenLabsAudio } from '../../services/elevenlabs';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ConversationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { user } = useAuthStore();

    const {
        selectedLanguage,
        isTutorSpeaking,
        isRecording,
        sessionPhase,
        isFirstTime,
        userName,
        lastLesson,
        addMessage,
        setSessionPhase,
        clearSession,
        setActiveMode
    } = useConversationStore();

    const language = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);

    useEffect(() => {
        setActiveMode('conversation');
    }, []);

    useEffect(() => {
        (async () => {
            try {
                // Request microphone permissions as soon as they enter the conversation
                const permission = await Audio.requestPermissionsAsync();
                if (permission.status !== 'granted') {
                    console.warn('Microphone permission not granted');
                }

                // Configure global audio mode for the app session
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false
                });

                // --- Interactive Greeting Flow ---
                await new Promise(res => setTimeout(res, 500)); // Brief pause on entry

                if (isFirstTime) {
                    const welcomeMsg = `Hi ${userName}, let's get started with your ${language?.name} lesson! I have a quick pop quiz for you to see your level. Are you ready?`;
                    await playElevenLabsAudio(welcomeMsg);
                    addMessage({
                        id: Date.now().toString(),
                        role: 'tutor',
                        text: welcomeMsg,
                        timestamp: new Date()
                    });
                    // We wait for user to say "yes" or record an intro before going to quiz
                } else {
                    const welcomeMsg = `Welcome back! Do you want to continue with ${lastLesson}, or would you like to redo it?`;
                    await playElevenLabsAudio(welcomeMsg);
                    addMessage({
                        id: Date.now().toString(),
                        role: 'tutor',
                        text: welcomeMsg,
                        timestamp: new Date()
                    });
                }

            } catch (error) {
                console.error('Failed to initialize audio permissions:', error);
            }
        })();
    }, []);

    // Determine dynamic hint text
    let hintText = "Hold the mic to speak";
    if (isTutorSpeaking) {
        hintText = "Listening to Tutor...";
    } else if (isRecording) {
        hintText = "Listening...";
    } else if (sessionPhase === 'greeting') {
        hintText = isFirstTime ? "Hold mic to say 'Ready'" : "Hold mic to say 'Continue' or 'Redo'";
    } else if (sessionPhase === 'quiz' || sessionPhase === 'quiz_eval') {
        hintText = "Hold mic to answer quiz";
    } else if (sessionPhase === 'conversation') {
        hintText = "Hold mic to chat with Olabisi";
    }

    const handleClose = async () => {
        const { messages, selectedLanguage } = useConversationStore.getState();

        // Only save if the user interacted with the tutor
        if (messages.length > 2 && user?.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userRef);

                let newStreak = 1;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    const lastPractice = data.lastPracticeDate ? new Date(data.lastPracticeDate) : null;

                    if (lastPractice) {
                        lastPractice.setHours(0, 0, 0, 0);
                        const diffTime = Math.abs(today.getTime() - lastPractice.getTime());
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 1) {
                            newStreak = (data.streak || 0) + 1;
                        } else if (diffDays === 0) {
                            newStreak = data.streak || 1; // Already practiced today
                        } else {
                            newStreak = 1; // Streak broken
                        }
                    }
                }

                const sessionItem = {
                    id: Math.random().toString(36).substring(2, 9),
                    title: `${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} • Conversation`,
                    type: 'Conversation',
                    durationMin: Math.max(1, Math.floor(messages.length / 4)), // Roughly 1 min per 4 exchanges
                    date: new Date().toISOString()
                };

                await setDoc(userRef, {
                    streak: newStreak,
                    lastPracticeDate: new Date().toISOString(),
                    recentHistory: arrayUnion(sessionItem)
                }, { merge: true });

            } catch (err) {
                console.error("Failed to save conversation progress", err);
            }
        }

        clearSession();
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-2 mb-8 mt-2">
                <TouchableOpacity onPress={handleClose} className="p-2">
                    <Ionicons name="close" size={28} color="#8B949E" />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-text-primary font-poppins font-semibold">{language?.name || 'Language'}</Text>
                    <Text className="text-text-secondary text-xs">{language?.flag} Tutor</Text>
                </View>

                <TouchableOpacity className="p-2">
                    <Ionicons name="ellipsis-horizontal" size={24} color="#8B949E" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center justify-center px-6">

                {/* Tutor Avatar/Waveform Area */}
                <View className="mb-4 w-full h-48 items-center justify-center">
                    <WaveformAnimation isSpeaking={isTutorSpeaking} />

                    <Text className="text-text-primary text-lg font-inter text-center mt-6 h-14">
                        {hintText}
                    </Text>
                </View>

                {/* Grammar Corrections */}
                <CorrectionsOverlay />

            </View>

            {/* Input Area */}
            <View className="absolute bottom-10 w-full items-center">
                <RecordButton />
            </View>

        </SafeAreaView>
    );
}
