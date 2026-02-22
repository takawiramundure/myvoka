import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/useAuthStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function RootNavigator() {
    const { user, isLoading, setUser } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#1A6B4A" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <MainTabNavigator /> : <AuthStack />}
        </NavigationContainer>
    );
}
