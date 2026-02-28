import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversationStore } from '../stores/useConversationStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

export default function TopStatsBar() {
    const { streak, xp, hearts, gems, selectedLanguage } = useConversationStore();
    const currentLang = SUPPORTED_LANGUAGES.find((l: any) => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];
    const currentLevel = Math.floor(xp / 100) + 1;

    return (
        <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-surface-light">
            <View className="flex-row items-center space-x-4">
                {/* Flag / Language */}
                <View className="flex-row items-center">
                    <Text className="text-xl mr-1">{currentLang.flag}</Text>
                    <Text className="text-text-primary font-bold">{currentLevel}</Text>
                </View>

                {/* Streak */}
                <View className="flex-row items-center">
                    <Ionicons name="flame" size={20} color="#E8A020" />
                    <Text className="text-text-secondary font-bold ml-1">{streak}</Text>
                </View>

                {/* Gems */}
                <View className="flex-row items-center">
                    <Ionicons name="diamond" size={18} color="#4A90E2" />
                    <Text className="text-text-secondary font-bold ml-1">{gems}</Text>
                </View>

                {/* Hearts */}
                <View className="flex-row items-center">
                    <Ionicons name="heart" size={20} color="#FF4B4B" />
                    <Text className="text-text-secondary font-bold ml-1">{hearts}</Text>
                </View>
            </View>
        </View>
    );
}
