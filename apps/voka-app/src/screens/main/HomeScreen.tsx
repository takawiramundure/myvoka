import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../../constants/languages';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useConversationStore } from '../../stores/useConversationStore';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { setSelectedLanguage } = useConversationStore();

    const featuredLanguage = SUPPORTED_LANGUAGES.find(l => l.featured);
    const otherLanguages = SUPPORTED_LANGUAGES.filter(l => !l.featured);

    const LanguageCard = ({ lang, isLarge = false }: { lang: LanguageOption, isLarge?: boolean }) => {
        const isUnavailable = lang.status === 'coming-soon';

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                disabled={isUnavailable}
                onPress={() => {
                    setSelectedLanguage(lang.id as any);
                    navigation.navigate('Learn');
                }}
                className={clsx(
                    "bg-surface rounded-2xl border mb-3 overflow-hidden",
                    isLarge ? "p-6 border-primary" : "p-4 flex-1 m-1 border-surface-light",
                    isUnavailable ? "opacity-50" : ""
                )}
            >
                <View className="flex-row justify-between items-start mb-4">
                    <Text className={clsx("font-poppins", isLarge ? "text-5xl" : "text-3xl")}>{lang.flag}</Text>

                    {/* Status Badge */}
                    <View className={clsx(
                        "px-2 py-1 rounded-full",
                        lang.status === 'available' ? "bg-primary/20" :
                            lang.status === 'beta' ? "bg-secondary/20" : "bg-surface-light"
                    )}>
                        <Text className={clsx(
                            "text-xs font-bold",
                            lang.status === 'available' ? "text-primary" :
                                lang.status === 'beta' ? "text-secondary" : "text-text-secondary"
                        )}>
                            {lang.status === 'available' ? '✓ FULL' :
                                lang.status === 'beta' ? '🟡 BETA' : 'SOON'}
                        </Text>
                    </View>
                </View>

                <Text className={clsx("font-bold text-text-primary", isLarge ? "text-2xl font-nunito" : "text-lg font-poppins")}>
                    {lang.name}
                </Text>
                <Text className="text-text-secondary font-inter text-sm mb-2">{lang.nativeName}</Text>

                <View className="flex-row items-center mt-auto">
                    <Ionicons name="people" size={14} color="#8B949E" />
                    <Text className="text-text-secondary font-inter text-xs ml-1">{lang.learners} learners</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-4 pt-4">

                {/* Header Section */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-text-secondary font-inter text-base">Welcome back,</Text>
                        <Text className="text-text-primary text-3xl font-nunito font-bold">Learner 👋</Text>
                    </View>
                    <TouchableOpacity className="bg-surface-light p-3 rounded-full">
                        <Ionicons name="notifications-outline" size={24} color="#F0F6FC" />
                    </TouchableOpacity>
                </View>

                {/* Featured Section */}
                {featuredLanguage && (
                    <View className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <Text className="text-text-primary font-poppins font-semibold text-xl">Featured Journey</Text>
                            <View className="bg-primary/20 px-2 py-1 rounded-md ml-3">
                                <Text className="text-primary font-bold text-xs uppercase">New</Text>
                            </View>
                        </View>
                        <LanguageCard lang={featuredLanguage} isLarge={true} />
                    </View>
                )}

                {/* Explore All Section */}
                <Text className="text-text-primary font-poppins font-semibold text-xl mb-4">Explore Languages</Text>

                <View className="flex-row flex-wrap justify-between -mx-1 pb-10">
                    {otherLanguages.map(lang => (
                        <View key={lang.id} style={{ width: '50%' }}>
                            <LanguageCard lang={lang} />
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
