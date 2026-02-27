import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface PasscodePadProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    label?: string;
    error?: string | null;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function PasscodePad({
    value,
    onChange,
    maxLength = 6,
    label,
    error,
}: PasscodePadProps) {
    const handleKey = (key: string) => {
        if (key === 'del') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(value.slice(0, -1));
        } else if (key === '') {
            return;
        } else if (value.length < maxLength) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(value + key);
        }
    };

    return (
        <View className="items-center w-full">
            {label && (
                <Text className="text-text-primary text-xl font-nunito font-bold mb-8 text-center">
                    {label}
                </Text>
            )}

            {/* Dot indicators */}
            <View className="flex-row mb-10 gap-4">
                {Array.from({ length: maxLength }).map((_, i) => (
                    <View
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 ${i < value.length
                                ? 'bg-primary border-primary'
                                : 'bg-transparent border-surface-light'
                            }`}
                    />
                ))}
            </View>

            {error && (
                <Text className="text-red-400 text-sm font-inter mb-6 text-center">{error}</Text>
            )}

            {/* Number grid */}
            <View className="flex-row flex-wrap justify-center w-72">
                {KEYS.map((key, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => handleKey(key)}
                        disabled={key === ''}
                        className={`w-24 h-16 items-center justify-center my-1 rounded-2xl ${key === '' ? 'opacity-0' : 'active:bg-surface-light'
                            }`}
                    >
                        {key === 'del' ? (
                            <Ionicons name="backspace-outline" size={26} color="#8B949E" />
                        ) : (
                            <Text className="text-text-primary text-3xl font-light">{key}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
