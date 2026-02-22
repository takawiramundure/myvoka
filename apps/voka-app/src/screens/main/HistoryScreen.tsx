import React from 'react';
import { View, Text } from 'react-native';

export default function HistoryScreen() {
    return (
        <View className="flex-1 justify-center items-center bg-background px-4">
            <Text className="text-text-primary text-2xl font-nunito font-bold mb-4">Session History</Text>
            <Text className="text-text-secondary font-inter">Past conversations will appear here.</Text>
        </View>
    );
}
