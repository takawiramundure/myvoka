import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withDelay,
    Easing
} from 'react-native-reanimated';

interface WaveformProps {
    isSpeaking: boolean;
}

export default function WaveformAnimation({ isSpeaking }: WaveformProps) {
    const NUM_BARS = 7;
    // Create an array of shared values for each bar
    const heights = Array.from({ length: NUM_BARS }).map(() => useSharedValue(10));

    useEffect(() => {
        if (isSpeaking) {
            heights.forEach((height, index) => {
                // Stagger the animation so they look like a wave
                height.value = withDelay(
                    index * 100,
                    withRepeat(
                        withSequence(
                            withTiming(40 + Math.random() * 40, { duration: 300, easing: Easing.inOut(Easing.ease) }),
                            withTiming(15, { duration: 300, easing: Easing.inOut(Easing.ease) })
                        ),
                        -1, // Infinite loop
                        true // Reverse
                    )
                );
            });
        } else {
            // Idle state
            heights.forEach((height, index) => {
                height.value = withTiming(10, { duration: 500 });
            });
        }
    }, [isSpeaking]);

    return (
        <View className="flex-row items-center justify-center h-24">
            {heights.map((height, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                    height: height.value,
                }));

                return (
                    <Animated.View
                        key={index}
                        style={[
                            {
                                width: 8,
                                backgroundColor: '#1A6B4A', // Primary 
                                borderRadius: 4,
                                marginHorizontal: 4,
                            },
                            animatedStyle,
                        ]}
                    />
                );
            })}
        </View>
    );
}
