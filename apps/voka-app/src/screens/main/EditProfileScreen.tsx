import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/useAuthStore';
import { updateProfile } from 'firebase/auth';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { user, setUser } = useAuthStore();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        const trimmedName = displayName.trim();
        if (!trimmedName) {
            Alert.alert('Invalid Name', 'Please enter a valid display name.');
            return;
        }

        setLoading(true);
        try {
            await updateProfile(user, {
                displayName: trimmedName
            });
            // Update the local zustand store so the UI updates instantly
            setUser({ ...user, displayName: trimmedName } as any);
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background pt-4">
            {/* Header */}
            <View className="px-6 mb-8 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="close" size={28} color="#8B949E" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-nunito font-bold">Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading} className="p-2 -mr-2">
                    {loading ? (
                        <ActivityIndicator size="small" color="#E8A020" />
                    ) : (
                        <Text className="text-primary font-bold text-lg">Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                className="flex-1 px-6"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Profile Avatar Placeholder */}
                <View className="items-center mb-8 mt-4">
                    <View className="w-24 h-24 rounded-full bg-surface items-center justify-center border-2 border-primary/20 mb-4 overflow-hidden relative">
                        <Ionicons name="person" size={40} color="#8B949E" />
                    </View>
                    <Text className="text-text-secondary text-sm font-inter">Photo uploads coming soon</Text>
                </View>

                {/* Form Fields */}
                <View className="mb-6">
                    <Text className="text-text-secondary font-inter mb-2 ml-1">Display Name</Text>
                    <TextInput
                        className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary text-lg"
                        placeholder="Enter your name"
                        placeholderTextColor="#8B949E"
                        value={displayName}
                        onChangeText={setDisplayName}
                        autoCapitalize="words"
                        autoCorrect={false}
                        autoFocus
                    />
                </View>

                <View className="mb-6 opacity-50">
                    <Text className="text-text-secondary font-inter mb-2 ml-1">Email Address</Text>
                    <TextInput
                        className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-secondary text-lg"
                        value={user?.email || ''}
                        editable={false}
                    />
                    <Text className="text-text-secondary mt-2 text-xs text-center">Email cannot be changed currently.</Text>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
