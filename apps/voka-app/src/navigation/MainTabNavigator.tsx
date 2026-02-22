import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import ConversationScreen from '../screens/main/ConversationScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

export type MainTabParamList = {
    Home: undefined;
    Conversation: undefined;
    History: undefined;
    Progress: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#161B22',
                    borderTopColor: '#21262D',
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                },
                tabBarActiveTintColor: '#E8A020',
                tabBarInactiveTintColor: '#8B949E',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Conversation') iconName = focused ? 'mic' : 'mic-outline';
                    else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
                    else if (route.name === 'Progress') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Conversation" component={ConversationScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
