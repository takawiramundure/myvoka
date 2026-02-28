import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConversationStore } from '../../stores/useConversationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProgressScreen() {
    // Dynamic values from global store
    const { xp, selectedLanguage, flashcardsCompleted } = useConversationStore();
    const { user } = useAuthStore();

    // Local states connected to Firestore
    const [languageStats, setLanguageStats] = useState<{ id: string, name: string, level: number, progress: number }[]>([]);
    const [dbStreak, setDbStreak] = useState(0);
    const [dbRecentSessions, setDbRecentSessions] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllProgress = async () => {
            if (user?.uid) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(docRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setDbStreak(data.streak || 0);

                        // Map recent history from Firebase
                        if (data.recentHistory) {
                            // Firebase arrayUnion appends, so we reverse it to easily show newest first
                            const historyReversed = [...data.recentHistory].reverse().slice(0, 5);
                            setDbRecentSessions(historyReversed);
                        }

                        if (data.completedUnits) {
                            const completedMap = data.completedUnits;
                            const stats = [];

                            // Map over supported languages to find matching progress
                            for (const lang of SUPPORTED_LANGUAGES) {
                                if (completedMap[lang.id] || lang.id === selectedLanguage) {
                                    const completed = completedMap[lang.id] || [];
                                    const percentage = Math.round((completed.length / 6) * 100);
                                    const safePercentage = Math.min(percentage, 100);

                                    stats.push({
                                        id: lang.id,
                                        name: lang.name,
                                        level: Math.floor(xp / 100) + 1, // Currently XP is global, could be scoped per language later
                                        progress: safePercentage
                                    });
                                }
                            }
                            setLanguageStats(stats);
                        } else {
                            // Fallback to purely local state for the first language
                            const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];
                            setLanguageStats([{
                                id: currentLangObj.id,
                                name: currentLangObj.name,
                                level: Math.floor(xp / 100) + 1,
                                progress: 0
                            }]);
                        }
                    }
                } catch (e) {
                    console.error("Error fetching progress: ", e);
                }
            }
        };

        // Re-fetch when user or selectedLanguage changes
        fetchAllProgress();
    }, [user, selectedLanguage, xp]);

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
                            <Text className="text-secondary font-bold ml-1">{dbStreak} Days</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                            // Simple logic mapping streak to first `streak` days of the week (max 7)
                            const isCompleted = i < Math.min(dbStreak, 7);
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

                {languageStats.map((stat) => (
                    <View key={stat.id} className="bg-surface border border-surface-light rounded-2xl p-5 mb-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-text-primary font-poppins font-semibold capitalize">{stat.name}</Text>
                            <Text className="text-primary font-bold">Level {stat.level}</Text>
                        </View>

                        <View className="flex-row items-center justify-between mb-1">
                            <View className="h-2 flex-1 bg-surface-light rounded-full overflow-hidden mr-3">
                                <View className="h-full bg-primary rounded-full" style={{ width: `${stat.progress}%` }} />
                            </View>
                            <Text className="text-text-secondary text-xs font-bold w-8 text-right">{stat.progress}%</Text>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                            <Text className="text-text-secondary text-xs font-inter">Flashcards Learned: {stat.id === selectedLanguage ? flashcardsCompleted * 30 : 0}</Text>
                            <Text className="text-text-secondary text-xs font-inter">Grammar: {stat.id === selectedLanguage ? '60%' : '0%'}</Text>
                        </View>
                    </View>
                ))}

                <View className="mb-4" />

                {/* Session History Section */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-text-primary font-poppins font-semibold text-lg">Recent History</Text>
                    {dbRecentSessions.length > 0 && <Text className="text-primary text-sm font-inter">View All</Text>}
                </View>

                {dbRecentSessions.length === 0 ? (
                    <View className="bg-surface border border-surface-light rounded-2xl p-6 mb-4 items-center justify-center">
                        <Ionicons name="time-outline" size={32} color="#8B949E" className="mb-2" />
                        <Text className="text-text-secondary font-inter text-center mt-2">No history yet. In progress!{'\n'}Start learning to build your history!</Text>
                    </View>
                ) : (
                    dbRecentSessions.map((session, index) => (
                        <View key={session.id || index} className="bg-surface border border-surface-light rounded-2xl p-4 mb-4 flex-row items-center justify-between">
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
                                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.durationMin} min
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
