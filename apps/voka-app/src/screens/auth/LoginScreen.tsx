import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import PasscodePad from '../../components/PasscodePad';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

type Step = 'email' | 'pin';

export default function LoginScreen({ navigation }: Props) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [savedEmail, setSavedEmail] = useState<string | null>(null);

    useEffect(() => {
        checkBiometrics();
    }, []);

    const checkBiometrics = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            const storedEmail = await SecureStore.getItemAsync('voka_email');
            const storedPin = await SecureStore.getItemAsync('voka_pin');

            if (hasHardware && isEnrolled && storedEmail && storedPin) {
                setBiometricAvailable(true);
                setSavedEmail(storedEmail);
                // Auto-trigger biometric on login screen open
                triggerBiometric(storedEmail, storedPin);
            }
        } catch (_) { }
    };

    const triggerBiometric = async (emailToUse?: string, pinToUse?: string) => {
        try {
            const storedEmail = emailToUse ?? await SecureStore.getItemAsync('voka_email');
            const storedPin = pinToUse ?? await SecureStore.getItemAsync('voka_pin');
            if (!storedEmail || !storedPin) return;

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Sign in to Voká',
                fallbackLabel: 'Use passcode',
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                setLoading(true);
                await signInWithEmailAndPassword(auth, storedEmail, storedPin);
                // RootNavigator handles redirect
            }
        } catch (_) { } finally {
            setLoading(false);
        }
    };

    const handleEmailNext = () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Invalid email', 'Please enter a valid email address.');
            return;
        }
        setStep('pin');
    };

    const handlePinChange = (value: string) => {
        setPin(value);
        setPinError(null);
        if (value.length === 6) {
            setTimeout(() => handleLogin(value), 150);
        }
    };

    const handleLogin = async (enteredPin: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), enteredPin);
            // RootNavigator handles redirect
        } catch (error: any) {
            setPinError('Incorrect passcode. Try again.');
            setPin('');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#1A6B4A" />
                <Text className="text-text-secondary mt-4 font-inter">Signing in...</Text>
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
                        <Text className="text-3xl font-nunito font-bold text-text-primary mb-2">Welcome Back</Text>
                        <Text className="text-text-secondary font-inter mb-10">Sign in to continue learning</Text>

                        {/* Biometric shortcut if available */}
                        {biometricAvailable && savedEmail && (
                            <TouchableOpacity
                                className="w-full bg-surface border border-surface-light py-4 rounded-2xl items-center mb-6 flex-row justify-center gap-3"
                                onPress={() => triggerBiometric()}
                            >
                                <Ionicons name="finger-print" size={24} color="#1A6B4A" />
                                <Text className="text-primary font-poppins font-semibold text-base">
                                    Sign in as {savedEmail.split('@')[0]}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TextInput
                            className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary mb-6"
                            placeholder="Email address"
                            placeholderTextColor="#8B949E"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
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

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-text-secondary font-inter">
                                New here?{' '}
                                <Text className="text-primary font-bold">Create account</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step: PIN */}
                {step === 'pin' && (
                    <View className="flex-1 items-center justify-center">
                        <PasscodePad
                            value={pin}
                            onChange={handlePinChange}
                            label={`Enter your passcode`}
                            error={pinError}
                        />

                        {biometricAvailable && (
                            <TouchableOpacity
                                className="mt-6 flex-row items-center gap-2"
                                onPress={() => triggerBiometric()}
                            >
                                <Ionicons name="finger-print" size={20} color="#8B949E" />
                                <Text className="text-text-secondary font-inter text-sm">Use Face ID instead</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className="mt-6"
                            onPress={() => { setStep('email'); setPin(''); setPinError(null); }}
                        >
                            <Text className="text-text-secondary font-inter">← Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
