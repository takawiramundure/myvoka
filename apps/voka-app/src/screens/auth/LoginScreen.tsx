import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing fields', 'Please enter your email and password.');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            // onAuthStateChanged in RootNavigator will handle navigation
        } catch (error: any) {
            const msg = error.code === 'auth/invalid-credential'
                ? 'Incorrect email or password.'
                : error.message;
            Alert.alert('Login failed', msg);
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
                <Text className="text-3xl font-nunito font-bold text-text-primary mb-2">Welcome Back</Text>
                <Text className="text-text-secondary font-inter mb-10">Sign in to continue learning</Text>

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
                    className="w-full h-14 bg-surface border border-surface-light rounded-2xl px-4 text-text-primary mb-8"
                    placeholder="Password"
                    placeholderTextColor="#8B949E"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    className="w-full bg-primary py-4 rounded-2xl items-center mb-4"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="white" />
                        : <Text className="text-white font-poppins font-semibold text-lg">Log In</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-text-secondary font-inter">Don't have an account? <Text className="text-primary font-bold">Sign up</Text></Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
