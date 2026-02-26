import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background pt-4">
            <View className="px-6 mb-6">
                <Text className="text-text-primary text-3xl font-nunito font-bold">Progress</Text>
                <Text className="text-text-secondary font-inter mt-1">Track your learning journey.</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

                {/* Weekly Streak Card */}
                <View className="bg-surface border border-surface-light rounded-2xl p-6 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-primary font-poppins font-semibold text-lg">Weekly Streak</Text>
                        <View className="flex-row items-center bg-secondary/10 px-3 py-1 rounded-full">
                            <Ionicons name="flame" size={16} color="#E8A020" />
                            <Text className="text-secondary font-bold ml-1">4 Days</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                            const isCompleted = i < 4; // Mock first 4 days completed
                            return (
                                <View key={i} className="items-center">
                                    <View className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${isCompleted ? 'bg-primary' : 'bg-surface-light'}`}>
                                        {isCompleted ? (
                                            <Ionicons name="checkmark" size={16} color="#ffffff" />
                                        ) : (
                                            <Text className="text-text-secondary font-inter text-xs">{day}</Text>
                                        )}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>

                {/* Proficiency Levels */}
                <Text className="text-text-primary font-poppins font-semibold text-lg mb-4">Proficiency</Text>

                {/* Ibibio Mock Skill */}
                <View className="bg-surface border border-surface-light rounded-2xl p-5 mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-text-primary font-poppins font-semibold">Ibibio</Text>
                        <Text className="text-primary font-bold">Level 2</Text>
                    </View>

                    <View className="h-2 w-full bg-surface-light rounded-full overflow-hidden mb-3">
                        <View className="h-full bg-primary w-2/3 rounded-full" />
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-text-secondary text-xs font-inter">Vocab: 45 words</Text>
                        <Text className="text-text-secondary text-xs font-inter">Grammar: 60%</Text>
                    </View>
                </View>

                {/* Yoruba Mock Skill */}
                <View className="bg-surface border border-surface-light rounded-2xl p-5 mb-8">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-text-primary font-poppins font-semibold">Yoruba</Text>
                        <Text className="text-primary font-bold">Level 1</Text>
                    </View>

                    <View className="h-2 w-full bg-surface-light rounded-full overflow-hidden mb-3">
                        <View className="h-full bg-primary w-1/4 rounded-full" />
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-text-secondary text-xs font-inter">Vocab: 12 words</Text>
                        <Text className="text-text-secondary text-xs font-inter">Grammar: 15%</Text>
                    </View>
                </View>

                {/* Session History Section */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-text-primary font-poppins font-semibold text-lg">Recent History</Text>
                    <Text className="text-primary text-sm font-inter">View All</Text>
                </View>

                {[
                    { id: '1', date: 'Oct 23', lang: 'Ibibio', duration: '12 min' },
                    { id: '2', date: 'Oct 21', lang: 'Ibibio', duration: '5 min' },
                    { id: '3', date: 'Oct 15', lang: 'Yoruba', duration: '20 min' },
                ].map((session) => (
                    <View key={session.id} className="bg-surface border border-surface-light rounded-2xl p-4 mb-4 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                                <Ionicons name="chatbubbles" size={18} color="#1A6B4A" />
                            </View>
                            <View>
                                <Text className="text-text-primary font-inter font-semibold">{session.lang} Practice</Text>
                                <Text className="text-text-secondary text-xs">{session.date} • {session.duration}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#8B949E" />
                    </View>
                ))}

                <View className="h-10" />

            </ScrollView>
        </SafeAreaView>
    );
}
