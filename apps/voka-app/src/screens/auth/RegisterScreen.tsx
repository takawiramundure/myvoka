import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing fields', 'Please fill in all fields.');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Password mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password);
            // onAuthStateChanged in RootNavigator will handle navigation
        } catch (error: any) {
            const msg = error.code === 'auth/email-already-in-use'
                ? 'An account with this email already exists.'
                : error.message;
            Alert.alert('Registration failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-3xl font-nunito font-bold text-text-primary mb-2">Create Account</Text>
                <Text className="text-text-secondary font-inter mb-10">Start your language journey</Text>

                <TextInput
                    className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary mb-4"
                    placeholder="Email"
                    placeholderTextColor="#8B949E"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary mb-4"
                    placeholder="Password"
                    placeholderTextColor="#8B949E"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TextInput
                    className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary mb-8"
                    placeholder="Confirm Password"
                    placeholderTextColor="#8B949E"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                />

                <TouchableOpacity
                    className="w-full bg-primary py-4 rounded-2xl items-center mb-4"
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="white" />
                        : <Text className="text-white font-poppins font-semibold text-lg">Create Account</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text className="text-text-secondary font-inter">Already have an account? <Text className="text-primary font-bold">Log in</Text></Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
