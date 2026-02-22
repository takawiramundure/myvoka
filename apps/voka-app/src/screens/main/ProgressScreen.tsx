import React from 'react';
import { View, Text } from 'react-native';

export default function ProgressScreen() {
    return (
        <View className="flex-1 justify-center items-center bg-background px-4">
            <Text className="text-text-primary text-2xl font-nunito font-bold mb-4">Your Progress</Text>
            <Text className="text-text-secondary font-inter text-center">Charts and streak info will go here.</Text>
        </View>
    );
}
