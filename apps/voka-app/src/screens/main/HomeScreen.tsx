import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../../constants/languages';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useConversationStore } from '../../stores/useConversationStore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { selectedLanguage, setSelectedLanguage, practiceGoal, flashcardsCompleted } = useConversationStore();
    const { user } = useAuthStore();

    // Default to first language if none selected
    const currentLang = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];
    const otherLanguages = SUPPORTED_LANGUAGES.filter(l => l.id !== currentLang.id);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Top Stats Bar */}
            <View className="flex-row justify-between items-center px-6 py-2">
                <View className="flex-row items-center">
                    <Ionicons name="language-outline" size={28} color="#00E5FF" />
                    <Text className="text-neon-cyan font-bold ml-1 text-lg">{currentLang.flag}</Text>
                </View>
                <View className="flex-row items-center space-x-6">
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="star-outline" size={20} color="#E8A020" />
                        <Text className="text-text-primary ml-1 font-poppins text-base">50</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="flash-outline" size={20} color="#00E5FF" />
                        <Text className="text-text-primary ml-1 font-poppins text-base">10%</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>

                {/* Greeting & Mascot */}
                <View className="flex-row items-start mb-6 w-full pr-4 mt-2">
                    {/* Mascot */}
                    <View className="w-12 h-12 mr-3 justify-end items-center">
                        <MaterialCommunityIcons name="robot-outline" size={40} color="#F0F6FC" />
                    </View>

                    {/* Speech Bubble */}
                    <View className="flex-1 bg-neon-dark border border-neon-cyan/50 rounded-2xl rounded-tl-none p-4 shadow-sm shadow-neon-cyan/20">
                        <Text className="text-neon-cyan font-inter text-sm leading-5">
                            Welcome back, {user?.displayName || 'Learner'}! Ready to continue your language journey?
                        </Text>
                    </View>
                </View>

                {/* Today's Goal Card */}
                <View className="bg-neon-dark border border-neon-border rounded-2xl p-5 mb-4 shadow-sm shadow-neon-cyan/10">
                    <Text className="text-neon-cyan font-poppins font-bold text-sm tracking-widest uppercase mb-2">
                        Today's Goal: {practiceGoal} Minutes of Practice
                    </Text>
                    <Text className="text-text-secondary font-inter text-sm leading-5 mb-6">
                        Practice key phrases, improve pronunciation, and engage in a quick dialogue
                    </Text>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Ionicons name="star-outline" size={20} color="#E8A020" />
                            <Text className="text-text-primary font-bold ml-2 text-lg">{practiceGoal}</Text>
                        </View>
                        <TouchableOpacity className="border border-neon-cyan rounded-lg py-1 px-3">
                            <Ionicons name="arrow-forward" size={20} color="#00E5FF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Current Journey Progress Card */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Learn')}
                    className="bg-neon-dark border border-neon-border rounded-2xl p-5 mb-4 flex-row justify-between items-center shadow-sm shadow-neon-cyan/10"
                >
                    <View className="flex-1 pr-4">
                        <Text className="text-neon-cyan font-poppins font-bold text-sm tracking-widest uppercase mb-4 leading-6">
                            YOU'RE {currentLang.name === 'Ibibio' ? '10%' : '0%'} THROUGH THE {currentLang.name.toUpperCase()} BEGINNER LEVEL.
                        </Text>

                        <View className="flex-row items-center mb-2">
                            <Ionicons name="flash-outline" size={16} color="#00E5FF" />
                            <Text className="text-text-primary font-bold text-sm ml-1">10%</Text>
                        </View>

                        {/* Progress Bar */}
                        <View className="w-full h-2 bg-background rounded-full overflow-hidden">
                            <View className="w-[10%] h-full bg-neon-cyan rounded-full" />
                        </View>
                    </View>

                    {/* Small Mascot */}
                    <View className="w-16 h-16 justify-center items-center">
                        <MaterialCommunityIcons name="robot" size={50} color="#F0F6FC" />
                    </View>
                </TouchableOpacity>

                {/* Action Cards Grid */}
                <View className="flex-row justify-between mb-8">
                    {/* Language Cards */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Flashcards')}
                        className="bg-neon-dark border border-neon-border rounded-2xl p-5 w-[48%] justify-between relative"
                        style={{ minHeight: 180 }}
                    >
                        {/* Completion Badge */}
                        <View className="absolute top-3 right-3 flex-row items-center bg-surface px-2 py-1 rounded-full border border-neon-cyan/50">
                            <Ionicons name="repeat" size={12} color="#00E5FF" />
                            <Text className="text-neon-cyan font-poppins font-bold text-xs ml-1">{flashcardsCompleted}</Text>
                        </View>

                        <View className="flex-1 justify-center items-center">
                            <MaterialCommunityIcons name="cards-outline" size={60} color="#00E5FF" />
                        </View>
                        <View className="items-center mt-2">
                            <Text className="text-neon-cyan font-poppins font-bold text-xs tracking-wider text-center mb-2 uppercase">Language Cards</Text>
                            <Text className="text-text-secondary font-inter text-[10px] text-center leading-3">Flip through flashcards to test and reinforce your vocabulary!</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Conversation Practice */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Conversation')}
                        className="bg-neon-dark border border-neon-border rounded-2xl p-5 w-[48%] items-center justify-between"
                        style={{ minHeight: 180 }}
                    >
                        <View className="flex-1 justify-center">
                            <MaterialCommunityIcons name="microphone-outline" size={60} color="#00E5FF" />
                        </View>
                        <View className="items-center">
                            <Text className="text-neon-cyan font-poppins font-bold text-xs tracking-wider text-center mb-2 uppercase">Conversation Practice</Text>
                            <Text className="text-text-secondary font-inter text-[10px] text-center leading-3">Sharpen your speaking skills: Engage in real-time conversations</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Explore Languages Section */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-neon-cyan font-poppins font-bold text-sm tracking-widest uppercase">Explore More Languages</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible pb-4">
                        {otherLanguages.map(lang => {
                            const isUnavailable = lang.status === 'coming-soon';

                            return (
                                <TouchableOpacity
                                    key={lang.id}
                                    activeOpacity={0.7}
                                    disabled={isUnavailable}
                                    onPress={() => {
                                        setSelectedLanguage(lang.id as any);
                                    }}
                                    className={clsx(
                                        "bg-neon-dark border border-neon-border rounded-xl p-4 mr-3 w-40",
                                        isUnavailable && "opacity-50"
                                    )}
                                >
                                    <View className="flex-row justify-between items-start mb-2">
                                        <Text className="text-4xl">{lang.flag}</Text>

                                        {/* Status Badge */}
                                        <View className={clsx(
                                            "px-2 py-1 rounded-full",
                                            lang.status === 'available' ? "bg-primary/20" :
                                                lang.status === 'beta' ? "bg-secondary/20" : "bg-surface-light"
                                        )}>
                                            <Text className={clsx(
                                                "text-[10px] font-bold",
                                                lang.status === 'available' ? "text-primary" :
                                                    lang.status === 'beta' ? "text-secondary" : "text-text-secondary"
                                            )}>
                                                {lang.status === 'available' ? '✓ FULL' :
                                                    lang.status === 'beta' ? '🟡 BETA' : 'SOON'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="font-bold text-text-primary text-base font-poppins mt-2">
                                        {lang.name}
                                    </Text>
                                    <Text className="text-text-secondary font-inter text-xs">{lang.nativeName}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>

                {/* Bottom padding for tab bar */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
