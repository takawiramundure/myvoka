import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/useAuthStore';
import { updateProfile, updatePassword } from 'firebase/auth';
import PasscodePad from '../../components/PasscodePad';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { user, setUser } = useAuthStore();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    // Passcode change state
    const [isChangingPin, setIsChangingPin] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
    const [pinError, setPinError] = useState<string | null>(null);

    const handleSaveProfile = async () => {
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

    const handlePinChange = (value: string) => {
        setNewPin(value);
        setPinError(null);
        if (value.length === 6) {
            setTimeout(() => setPinStep('confirm'), 150);
        }
    };

    const handleConfirmPinChange = (value: string) => {
        setConfirmPin(value);
        setPinError(null);
        if (value.length === 6) {
            setTimeout(() => handleSaveNewPin(value), 150);
        }
    };

    const handleSaveNewPin = async (confirmedPin: string) => {
        if (!user) return;
        if (confirmedPin !== newPin) {
            setPinError("Passcodes don't match. Try again.");
            setConfirmPin('');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(user, confirmedPin);
            Alert.alert('Success', 'Passcode updated successfully.');
            // Reset state
            setIsChangingPin(false);
            setNewPin('');
            setConfirmPin('');
            setPinStep('enter');
        } catch (error: any) {
            // Re-authentication might be required
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert('Authentication Required', 'Please log out and log back in to change your passcode.');
            } else {
                Alert.alert('Error', error.message || 'Failed to update passcode.');
            }
            setNewPin('');
            setConfirmPin('');
            setPinStep('enter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background pt-4">
            {/* Header */}
            <View className="px-6 mb-8 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => {
                    if (isChangingPin) {
                        setIsChangingPin(false);
                        setNewPin('');
                        setConfirmPin('');
                        setPinStep('enter');
                    } else {
                        navigation.goBack();
                    }
                }} className="p-2 -ml-2">
                    <Ionicons name={isChangingPin ? "arrow-back" : "close"} size={28} color="#8B949E" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-nunito font-bold">
                    {isChangingPin ? 'Change Passcode' : 'Edit Profile'}
                </Text>

                {isChangingPin ? (
                    <View className="w-10" /> /* Spacer for centering */
                ) : (
                    <TouchableOpacity onPress={handleSaveProfile} disabled={loading} className="p-2 -mr-2">
                        {loading ? (
                            <ActivityIndicator size="small" color="#E8A020" />
                        ) : (
                            <Text className="text-primary font-bold text-lg">Save</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {isChangingPin ? (
                // --- Passcode Change Flow ---
                <View className="flex-1 items-center justify-center -mt-20">
                    {pinStep === 'enter' ? (
                        <PasscodePad
                            value={newPin}
                            onChange={handlePinChange}
                            label="Enter new 6-digit passcode"
                        />
                    ) : (
                        <PasscodePad
                            value={confirmPin}
                            onChange={handleConfirmPinChange}
                            label="Confirm new passcode"
                            error={pinError}
                        />
                    )}
                </View>

            ) : (
                // --- Default Profile Edit Flow ---
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

                    {/* Security Section */}
                    <Text className="text-text-primary font-poppins font-semibold text-lg mt-4 mb-4">Security</Text>
                    <View className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-4"
                            onPress={() => setIsChangingPin(true)}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="keypad-outline" size={20} color="#E8A020" />
                                <Text className="text-text-primary font-inter ml-3">Change Passcode</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#8B949E" />
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}
