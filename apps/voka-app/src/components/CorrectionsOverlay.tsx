import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversationStore } from '../stores/useConversationStore';
import clsx from 'clsx';

export default function CorrectionsOverlay() {
    const messages = useConversationStore((s) => s.messages);

    // Find the most recent tutor message that contains corrections
    const recentCorrections = [...messages]
        .reverse()
        .find(m => m.role === 'tutor' && m.corrections && m.corrections.length > 0)
        ?.corrections;

    if (!recentCorrections || recentCorrections.length === 0) {
        return null;
    }

    return (
        <View className="w-full bg-surface border border-surface-light rounded-2xl p-4 mt-4 shadow-lg shadow-black/20">
            <View className="flex-row items-center mb-3">
                <Ionicons name="sparkles" size={18} color="#E8A020" />
                <Text className="text-text-primary font-poppins font-semibold ml-2">Language Tips</Text>
            </View>

            <ScrollView className="max-h-40" showsVerticalScrollIndicator={false}>
                {recentCorrections.map((corr, idx) => (
                    <View key={idx} className="mb-3">

                        <View className="flex-row items-center justify-between mb-1">
                            <View className="flex-row items-center">
                                <Text className={clsx(
                                    "text-xs font-bold uppercase mr-2",
                                    corr.type === 'grammar' ? "text-primary" :
                                        corr.type === 'vocabulary' ? "text-secondary" : "text-accent"
                                )}>
                                    {corr.type}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center flex-wrap mb-1">
                            <Text className="text-error line-through mr-2 font-inter">{corr.original}</Text>
                            <Ionicons name="arrow-forward" size={14} color="#8B949E" />
                            <Text className="text-success font-inter font-bold ml-2">{corr.corrected}</Text>
                        </View>

                        <Text className="text-text-secondary text-sm font-inter">
                            {corr.explanation}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
