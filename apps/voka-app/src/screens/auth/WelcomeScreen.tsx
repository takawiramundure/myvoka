import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-4xl font-nunito font-bold text-text-primary text-center">Voká</Text>
            <Text className="text-lg font-inter text-text-secondary mt-2 mb-12 text-center">Your Voice. Your Roots.</Text>

            <TouchableOpacity
                className="w-full bg-primary py-4 rounded-2xl items-center mb-4"
                onPress={() => navigation.navigate('Register')}
            >
                <Text className="text-text-primary font-poppins font-semibold text-lg">Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full bg-surface-light border border-surface py-4 rounded-2xl items-center"
                onPress={() => navigation.navigate('Login')}
            >
                <Text className="text-text-primary font-poppins font-semibold text-lg">I already have an account</Text>
            </TouchableOpacity>
        </View>
    );
}
