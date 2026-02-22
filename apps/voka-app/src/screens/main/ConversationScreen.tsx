import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import WaveformAnimation from '../../components/WaveformAnimation';
import RecordButton from '../../components/RecordButton';
import { useConversationStore } from '../../stores/useConversationStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

export default function ConversationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const languageId = route.params?.languageId || 'ibibio';

    const language = SUPPORTED_LANGUAGES.find(l => l.id === languageId);
    const isTutorSpeaking = useConversationStore((s) => s.isTutorSpeaking);
    const isRecording = useConversationStore((s) => s.isRecording);

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-2 mb-8 mt-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
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
                <View className="mb-12 w-full h-48 items-center justify-center">
                    <WaveformAnimation isSpeaking={isTutorSpeaking} />

                    <Text className="text-text-primary text-lg font-inter text-center mt-6 h-14">
                        {isTutorSpeaking
                            ? "Nsido? (What is it?)"
                            : isRecording
                                ? "Listening..."
                                : "Hold the mic to speak"
                        }
                    </Text>
                </View>

            </View>

            {/* Input Area */}
            <View className="absolute bottom-10 w-full items-center">
                <RecordButton />
            </View>

        </SafeAreaView>
    );
}
