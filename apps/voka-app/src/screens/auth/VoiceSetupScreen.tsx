import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuthStore } from '../../stores/useAuthStore';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'VoiceSetup'>;
};

export default function VoiceSetupScreen({ navigation }: Props) {
    const setUser = useAuthStore((s) => s.setUser);
    const [selectedVoice, setSelectedVoice] = useState<'Eka' | 'Emem'>('Eka');

    // Mock finalizing registration and logging in
    const handleFinishSetup = () => {
        setUser({ uid: 'mock-uid-123', email: 'test@voka.ai', voice: selectedVoice } as any);
    };

    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-3xl font-nunito font-bold text-text-primary mb-2 text-center">Choose Your Tutor</Text>
            <Text className="text-text-secondary font-inter mb-8 text-center text-base">Select the voice you want to learn with.</Text>

            <View className="flex-row justify-between w-full mb-8">
                <TouchableOpacity
                    className={`flex-1 bg-surface-light border-2 rounded-2xl items-center py-8 mr-2 ${selectedVoice === 'Eka' ? 'border-primary' : 'border-transparent'}`}
                    onPress={() => setSelectedVoice('Eka')}
                >
                    <Text className="text-4xl mb-4">👩🏾</Text>
                    <Text className="text-text-primary font-poppins font-semibold">Eka</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 bg-surface-light border-2 rounded-2xl items-center py-8 ml-2 ${selectedVoice === 'Emem' ? 'border-primary' : 'border-transparent'}`}
                    onPress={() => setSelectedVoice('Emem')}
                >
                    <Text className="text-4xl mb-4">👨🏾</Text>
                    <Text className="text-text-primary font-poppins font-semibold">Emem</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="w-full bg-primary py-4 rounded-2xl items-center mb-6"
                onPress={handleFinishSetup}
            >
                <Text className="text-text-primary font-poppins font-semibold text-lg">Start Learning</Text>
            </TouchableOpacity>
        </View>
    );
}
