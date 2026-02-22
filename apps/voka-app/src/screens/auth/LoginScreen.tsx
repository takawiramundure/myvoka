import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuthStore } from '../../stores/useAuthStore';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
    const setUser = useAuthStore((s) => s.setUser);

    // Mock login for now
    const handleLogin = () => {
        setUser({ uid: 'mock-uid-123', email: 'test@voka.ai' } as any);
    };

    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-3xl font-nunito font-bold text-text-primary mb-8">Welcome Back</Text>

            {/* Mocking inputs */}
            <View className="w-full h-14 bg-surface-light rounded-2xl mb-4" />
            <View className="w-full h-14 bg-surface-light rounded-2xl mb-8" />

            <TouchableOpacity
                className="w-full bg-secondary py-4 rounded-2xl items-center mb-6"
                onPress={handleLogin}
            >
                <Text className="text-background font-poppins font-semibold text-lg">Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-text-secondary font-inter">Back</Text>
            </TouchableOpacity>
        </View>
    );
}
