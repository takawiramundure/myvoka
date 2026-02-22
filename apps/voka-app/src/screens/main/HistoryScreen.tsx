import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {

    const MOCK_HISTORY = [
        { id: '1', date: 'Oct 23', lang: 'Ibibio', duration: '12 min', topics: ['Market', 'Greetings'] },
        { id: '2', date: 'Oct 21', lang: 'Ibibio', duration: '5 min', topics: ['Family'] },
        { id: '3', date: 'Oct 15', lang: 'Yoruba', duration: '20 min', topics: ['Directions', 'Food'] },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background pt-4">

            <View className="px-6 mb-6">
                <Text className="text-text-primary text-3xl font-nunito font-bold">Session History</Text>
                <Text className="text-text-secondary font-inter mt-1">Review your past conversations.</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {MOCK_HISTORY.map((session, i) => (
                    <TouchableOpacity
                        key={session.id}
                        activeOpacity={0.7}
                        className="bg-surface rounded-2xl p-4 mb-4 border border-surface-light flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center flex-1">
                            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-4">
                                <Ionicons name="chatbubbles" size={20} color="#1A6B4A" />
                            </View>

                            <View className="flex-1">
                                <Text className="text-text-primary font-poppins font-semibold text-base mb-1">
                                    {session.lang} Practice
                                </Text>
                                <View className="flex-row items-center">
                                    <View className="flex-row items-center mr-3">
                                        <Ionicons name="calendar-outline" size={14} color="#8B949E" />
                                        <Text className="text-text-secondary text-xs ml-1 font-inter">{session.date}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={14} color="#8B949E" />
                                        <Text className="text-text-secondary text-xs ml-1 font-inter">{session.duration}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Ionicons name="chevron-forward" size={20} color="#8B949E" />
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </SafeAreaView>
    );
}
