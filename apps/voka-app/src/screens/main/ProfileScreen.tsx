import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useConversationStore } from '../../stores/useConversationStore';
import clsx from 'clsx';

const AVAILABLE_TUTORS = [
    { id: 'eOHsvebhdtt0XFeHVMQY', name: 'Mfolie', description: 'Female • Default' },
    { id: 'pNInz6obbf5AWBMyFmTF', name: 'Ekpenyong', description: 'Male' },
    { id: 'XB0fDUnXU5yW1QnLh1YJ', name: 'Imaobong', description: 'Female' },
];

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { tutorVoiceId, setTutorVoiceId } = useConversationStore();

    const joinedDate = user?.metadata.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Unknown';

    return (
        <SafeAreaView className="flex-1 bg-background pt-4">

            <View className="px-6 mb-6 flex-row items-center justify-between">
                <Text className="text-text-primary text-3xl font-nunito font-bold">Profile</Text>
                <TouchableOpacity className="p-2">
                    <Ionicons name="settings-outline" size={24} color="#8B949E" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View className="items-center mb-10">
                    <View className="w-24 h-24 rounded-full bg-surface items-center justify-center border-2 border-primary/20 mb-4 overflow-hidden">
                        <Ionicons name="person" size={40} color="#8B949E" />
                    </View>
                    <Text className="text-text-primary text-xl font-poppins font-semibold">
                        {user?.displayName || 'Learner'}
                    </Text>
                    <Text className="text-text-secondary font-inter">Joined {joinedDate}</Text>
                </View>

                {/* Settings Links */}
                <View className="bg-surface border border-surface-light rounded-2xl mb-6 overflow-hidden">

                    <TouchableOpacity
                        className="flex-row items-center justify-between p-4 border-b border-surface-light"
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="person-outline" size={20} color="#E8A020" />
                            <Text className="text-text-primary font-inter ml-3">Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B949E" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-surface-light">
                        <View className="flex-row items-center">
                            <Ionicons name="notifications-outline" size={20} color="#E8A020" />
                            <Text className="text-text-primary font-inter ml-3">Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B949E" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <Ionicons name="lock-closed-outline" size={20} color="#E8A020" />
                            <Text className="text-text-primary font-inter ml-3">Privacy & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B949E" />
                    </TouchableOpacity>

                </View>

                {/* Voice Settings */}
                <Text className="text-text-primary font-poppins font-semibold text-lg mb-4">Voice Settings</Text>
                <View className="bg-surface border border-surface-light rounded-2xl mb-6 overflow-hidden p-4">
                    <Text className="text-text-secondary font-inter text-sm mb-4">Select your preferred tutor voice for pronunciations.</Text>

                    <View className="gap-3">
                        {AVAILABLE_TUTORS.map((tutor) => {
                            const isSelected = tutorVoiceId === tutor.id;
                            return (
                                <TouchableOpacity
                                    key={tutor.id}
                                    onPress={() => setTutorVoiceId(tutor.id)}
                                    className={clsx(
                                        "flex-row items-center justify-between p-4 rounded-xl border",
                                        isSelected ? "border-primary bg-primary/10" : "border-surface-light bg-background"
                                    )}
                                >
                                    <View>
                                        <Text className={clsx("font-poppins font-semibold text-base", isSelected ? "text-primary" : "text-text-primary")}>
                                            {tutor.name}
                                        </Text>
                                        <Text className={clsx("font-inter text-sm", isSelected ? "text-primary/70" : "text-text-secondary")}>
                                            {tutor.description}
                                        </Text>
                                    </View>

                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={24} color="#1A6B4A" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Log Out Button */}
                <TouchableOpacity
                    onPress={signOut}
                    className="flex-row items-center justify-center p-4 rounded-xl bg-error/10 mb-8"
                >
                    <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
                    <Text className="text-error font-poppins font-semibold ml-2 text-base">Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>
    );
}
