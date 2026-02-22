import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ProfileScreen() {
    const signOut = useAuthStore((s) => s.signOut);

    return (
        <View className="flex-1 justify-center items-center bg-background px-6">
            <Text className="text-text-primary text-2xl font-nunito font-bold mb-12">Profile Settings</Text>

            <TouchableOpacity
                className="w-full bg-surface-light border border-error py-4 rounded-2xl items-center"
                onPress={signOut}
            >
                <Text className="text-error font-poppins font-semibold text-lg">Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}
