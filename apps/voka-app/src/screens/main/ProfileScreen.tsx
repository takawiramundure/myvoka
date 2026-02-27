import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useConversationStore } from '../../stores/useConversationStore';

export default function ProfileScreen() {
    const { user } = useAuthStore();
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    // Using our gamification state for the stats overview
    const { xp, streak } = useConversationStore();

    const joinedDate = user?.metadata.creationTime
        ? new Date(user.metadata.creationTime).getFullYear()
        : '2024';

    const dummyUsername = user?.displayName ? user.displayName.replace(/\s+/g, '').toUpperCase() : 'LEARNER';

    return (
        <View className="flex-1 bg-background">

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>

                {/* --- Blue Header Section --- */}
                {/* Notice pb-20 to give room for the intersecting avatar */}
                <View className="bg-[#1CB0F6] pt-16 px-6 pb-20 rounded-b-3xl relative z-10">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-white text-2xl font-nunito font-bold">
                            {user?.displayName || 'Learner'}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')} className="p-2 -mr-2">
                            <Ionicons name="settings-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- Avatar & Handle Info --- */}
                {/* -mt-16 to pull it up over the blue header */}
                <View className="items-center z-20 -mt-16">
                    <View className="w-32 h-32 rounded-full bg-surface items-center justify-center border-4 border-background overflow-hidden relative shadow-sm">
                        {/* Placeholder for real avatar, using an icon for now */}
                        <Ionicons name="person" size={50} color="#8B949E" />
                    </View>

                    <Text className="text-text-secondary font-poppins font-semibold text-sm mt-4 tracking-wider">
                        @{dummyUsername} • JOINED {joinedDate}
                    </Text>
                </View>

                {/* --- Social Stats Row (Courses, Following, Followers) --- */}
                <View className="flex-row justify-between px-10 mt-8 mb-6">
                    <View className="items-center">
                        <View className="flex-row gap-1 mb-1">
                            {/* Mock Course Flags */}
                            <Text className="text-xl">🇳🇬</Text>
                            <Text className="text-xl">🇬🇭</Text>
                        </View>
                        <Text className="text-text-secondary font-inter text-xs font-semibold">Courses</Text>
                    </View>

                    <View className="items-center">
                        <Text className="text-text-primary font-poppins font-bold text-lg leading-tight">2</Text>
                        <Text className="text-text-secondary font-inter text-xs font-semibold">Following</Text>
                    </View>

                    <View className="items-center">
                        <Text className="text-text-primary font-poppins font-bold text-lg leading-tight">4</Text>
                        <Text className="text-text-secondary font-inter text-xs font-semibold">Followers</Text>
                    </View>
                </View>

                {/* --- Buttons Row --- */}
                <View className="px-6 flex-row gap-3 mt-2 mb-8 items-center">
                    <TouchableOpacity className="flex-1 bg-surface border-2 border-surface-light py-3 rounded-2xl items-center flex-row justify-center shadow-sm">
                        <Ionicons name="person-add" size={18} color="#1A6B4A" />
                        <Text className="text-primary font-poppins font-bold ml-2 tracking-wide uppercase">Add Friends</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-14 h-14 bg-surface border-2 border-surface-light rounded-2xl items-center justify-center shadow-sm">
                        <Ionicons name="qr-code-outline" size={22} color="#1A6B4A" />
                    </TouchableOpacity>
                </View>

                {/* --- gamification Overview --- */}
                <View className="px-6 mb-8">
                    <Text className="text-text-secondary font-poppins font-bold text-sm mb-4 tracking-widest uppercase">Overview</Text>

                    <View className="flex-row flex-wrap justify-between gap-y-4">

                        {/* Streak Stat */}
                        <View className="w-[48%] bg-surface border-2 border-surface-light rounded-2xl p-4 flex-row items-center shadow-sm">
                            <Ionicons name="flame" size={24} color="#FF9600" />
                            <View className="ml-3">
                                <Text className="text-text-primary font-poppins font-bold text-lg">{streak}</Text>
                                <Text className="text-text-secondary font-inter text-xs font-semibold">Day Streak</Text>
                            </View>
                        </View>

                        {/* Courses Stat */}
                        <View className="w-[48%] bg-surface border-2 border-surface-light rounded-2xl p-4 flex-row items-center shadow-sm">
                            <Text className="text-2xl">🇳🇬</Text>
                            <View className="ml-3">
                                <Text className="text-text-primary font-poppins font-bold text-lg">5</Text>
                                <Text className="text-text-secondary font-inter text-xs font-semibold">Lessons</Text>
                            </View>
                        </View>

                        {/* League Stat */}
                        <View className="w-[48%] bg-surface border-2 border-surface-light rounded-2xl p-4 flex-row items-center shadow-sm">
                            <Ionicons name="trophy" size={24} color="#CE82FF" />
                            <View className="ml-3">
                                <Text className="text-text-primary font-poppins font-bold text-lg">Bronze</Text>
                                <Text className="text-text-secondary font-inter text-xs font-semibold">League</Text>
                            </View>
                        </View>

                        {/* Total XP Stat */}
                        <View className="w-[48%] bg-surface border-2 border-surface-light rounded-2xl p-4 flex-row items-center shadow-sm">
                            <Ionicons name="flash" size={24} color="#FFD900" />
                            <View className="ml-3">
                                <Text className="text-text-primary font-poppins font-bold text-lg">{xp}</Text>
                                <Text className="text-text-secondary font-inter text-xs font-semibold">Total XP</Text>
                            </View>
                        </View>

                    </View>
                </View>

                <View className="h-10" />

            </ScrollView>
        </View>
    );
}
