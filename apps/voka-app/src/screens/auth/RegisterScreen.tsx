import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-3xl font-nunito font-bold text-text-primary mb-8">Create Account</Text>

            <TouchableOpacity
                className="w-full bg-primary py-4 rounded-2xl items-center mb-6"
                onPress={() => navigation.navigate('VoiceSetup')}
            >
                <Text className="text-text-primary font-poppins font-semibold text-lg">Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-text-secondary font-inter">Back</Text>
            </TouchableOpacity>
        </View>
    );
}
