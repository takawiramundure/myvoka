import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConversationStore } from '../../stores/useConversationStore';

export default function ProgressScreen() {
    // Dynamic values from global store
    const { xp, streak, levelProgress, selectedLanguage, flashcardsCompleted, recentSessions } = useConversationStore();

    // Calculate level (1 level exactly per 100 XP)
    const calculatedLevel = Math.floor(xp / 100) + 1;

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
                            <Text className="text-secondary font-bold ml-1">{streak} Days</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                            // Simple logic mapping streak to first `streak` days of the week (max 7)
                            const isCompleted = i < Math.min(streak, 7);
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

                {/* Dynamic Selected Language Skill */}
                <View className="bg-surface border border-surface-light rounded-2xl p-5 mb-8">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-text-primary font-poppins font-semibold capitalize">{selectedLanguage}</Text>
                        <Text className="text-primary font-bold">Level {calculatedLevel}</Text>
                    </View>

                    <View className="h-2 w-full bg-surface-light rounded-full overflow-hidden mb-3">
                        {/* Dynamic width from state (0 - 100) */}
                        <View className="h-full bg-primary rounded-full" style={{ width: `${levelProgress}%` }} />
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-text-secondary text-xs font-inter">Flashcards Learned: {flashcardsCompleted * 30}</Text>
                        <Text className="text-text-secondary text-xs font-inter">Grammar: 60%</Text>
                    </View>
                </View>

                {/* Session History Section */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-text-primary font-poppins font-semibold text-lg">Recent History</Text>
                    {recentSessions.length > 0 && <Text className="text-primary text-sm font-inter">View All</Text>}
                </View>

                {recentSessions.length === 0 ? (
                    <View className="bg-surface border border-surface-light rounded-2xl p-6 mb-4 items-center justify-center">
                        <Ionicons name="time-outline" size={32} color="#8B949E" className="mb-2" />
                        <Text className="text-text-secondary font-inter text-center mt-2">No recent practice sessions yet.{'\n'}Start learning to build your history!</Text>
                    </View>
                ) : (
                    recentSessions.map((session) => (
                        <View key={session.id} className="bg-surface border border-surface-light rounded-2xl p-4 mb-4 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${session.type === 'Flashcards' ? 'bg-neon-cyan/10' : 'bg-primary/10'}`}>
                                    <Ionicons
                                        name={session.type === 'Flashcards' ? 'card-outline' : 'chatbubbles'}
                                        size={18}
                                        color={session.type === 'Flashcards' ? '#00E5FF' : '#1A6B4A'}
                                    />
                                </View>
                                <View>
                                    <Text className="text-text-primary font-inter font-semibold">{session.title}</Text>
                                    <Text className="text-text-secondary text-xs">
                                        {session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.durationMin} min
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#8B949E" />
                        </View>
                    ))
                )}

                <View className="h-10" />

            </ScrollView>
        </SafeAreaView>
    );
}
