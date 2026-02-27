import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../../services/firebase';
import PasscodePad from '../../components/PasscodePad';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

type Step = 'email' | 'set-pin' | 'confirm-pin';

export default function RegisterScreen({ navigation }: Props) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [pinError, setPinError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEmailNext = () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Invalid email', 'Please enter a valid email address.');
            return;
        }
        setStep('set-pin');
    };

    // Auto-advance when 6 digits entered
    const handlePinChange = (value: string) => {
        setPin(value);
        setPinError(null);
        if (value.length === 6) {
            setTimeout(() => setStep('confirm-pin'), 150);
        }
    };

    const handleConfirmPinChange = (value: string) => {
        setConfirmPin(value);
        setPinError(null);
        if (value.length === 6) {
            setTimeout(() => handleRegister(value), 150);
        }
    };

    const handleRegister = async (confirmedPin: string) => {
        if (confirmedPin !== pin) {
            setPinError('Passcodes don\'t match. Try again.');
            setConfirmPin('');
            return;
        }
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), pin);

            // Offer biometrics
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (hasHardware && isEnrolled) {
                Alert.alert(
                    'Enable Face ID',
                    'Sign in faster with Face ID next time?',
                    [
                        {
                            text: 'Not now',
                            style: 'cancel',
                        },
                        {
                            text: 'Enable',
                            onPress: async () => {
                                await SecureStore.setItemAsync('voka_email', email.trim());
                                await SecureStore.setItemAsync('voka_pin', pin);
                            },
                        },
                    ]
                );
            }
            // onAuthStateChanged in RootNavigator handles navigation
        } catch (error: any) {
            const msg = error.code === 'auth/email-already-in-use'
                ? 'An account with this email already exists.'
                : error.message;
            Alert.alert('Registration failed', msg);
            setStep('email');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#1A6B4A" />
                <Text className="text-text-secondary mt-4 font-inter">Creating your account...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View className="flex-1 px-6 pt-16">
                {/* Step: Email */}
                {step === 'email' && (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-3xl font-nunito font-bold text-text-primary mb-2">Create Account</Text>
                        <Text className="text-text-secondary font-inter mb-10">What's your email?</Text>

                        <TextInput
                            className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary mb-6"
                            placeholder="Email address"
                            placeholderTextColor="#8B949E"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus
                            value={email}
                            onChangeText={setEmail}
                            onSubmitEditing={handleEmailNext}
                            returnKeyType="next"
                        />

                        <TouchableOpacity
                            className="w-full bg-primary py-4 rounded-2xl items-center mb-4"
                            onPress={handleEmailNext}
                        >
                            <Text className="text-white font-poppins font-semibold text-lg">Continue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-text-secondary font-inter">
                                Already have an account?{' '}
                                <Text className="text-primary font-bold">Log in</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step: Set PIN */}
                {step === 'set-pin' && (
                    <View className="flex-1 items-center justify-center">
                        <PasscodePad
                            value={pin}
                            onChange={handlePinChange}
                            label="Create a 6-digit passcode"
                        />
                        <TouchableOpacity
                            className="mt-8"
                            onPress={() => { setStep('email'); setPin(''); }}
                        >
                            <Text className="text-text-secondary font-inter">← Back</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step: Confirm PIN */}
                {step === 'confirm-pin' && (
                    <View className="flex-1 items-center justify-center">
                        <PasscodePad
                            value={confirmPin}
                            onChange={handleConfirmPinChange}
                            label="Confirm your passcode"
                            error={pinError}
                        />
                        <TouchableOpacity
                            className="mt-8"
                            onPress={() => { setStep('set-pin'); setPin(''); setConfirmPin(''); setPinError(null); }}
                        >
                            <Text className="text-text-secondary font-inter">← Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
