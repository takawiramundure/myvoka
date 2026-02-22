import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-background px-4">
            <Text className="text-text-primary text-2xl font-nunito font-bold mb-4">Voká Home</Text>
            <Text className="text-text-secondary font-inter">Featured Language: Ibibio 🇳🇬</Text>
        </View>
    );
}
