import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import LessonSessionScreen from '../screens/main/LessonSessionScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import FlashcardsScreen from '../screens/main/FlashcardsScreen';

export type MainStackParamList = {
    MainTabs: undefined;
    LessonSession: { lessonId: string; title: string };
    EditProfile: undefined;
    Settings: undefined;
    Flashcards: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
                name="LessonSession"
                component={LessonSessionScreen}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="Flashcards"
                component={FlashcardsScreen}
                options={{ presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
}
