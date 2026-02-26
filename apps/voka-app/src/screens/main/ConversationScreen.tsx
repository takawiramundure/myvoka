import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import WaveformAnimation from '../../components/WaveformAnimation';
import RecordButton from '../../components/RecordButton';
import CorrectionsOverlay from '../../components/CorrectionsOverlay';
import { useConversationStore } from '../../stores/useConversationStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { playElevenLabsAudio } from '../../services/elevenlabs';

export default function ConversationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

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

    const handleClose = () => {
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
