import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ConversationScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-background px-4">
            <Text className="text-text-primary text-2xl font-nunito font-bold mb-8">Conversation Audio</Text>

            {/* Waveform Placeholder AI */}
            <View className="h-32 w-full items-center justify-center mb-12">
                <Text className="text-primary font-inter">AI Waveform...</Text>
            </View>

            {/* Mic Button Placeholder */}
            <TouchableOpacity className="w-20 h-20 rounded-full bg-secondary items-center justify-center">
                <Text className="text-3xl">🎤</Text>
            </TouchableOpacity>
        </View>
    );
}
