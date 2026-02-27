import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useConversationStore } from '../../stores/useConversationStore';
import * as Haptics from 'expo-haptics';
import { playElevenLabsAudio, prefetchElevenLabsAudio } from '../../services/elevenlabs';

const { width } = Dimensions.get('window');

// Mock data for flashcards
const flashcardsData = {
    ibibio: [
        { id: '1', front: 'Ndi Ibibio', back: 'I am Ibibio' },
        { id: '2', front: 'Sọsọn̄ọ', back: 'Thank you' },
        { id: '3', front: 'Abasi', back: 'God' },
        { id: '4', front: 'Udia', back: 'Food' },
        { id: '5', front: 'Aba', back: 'Forty' },
        { id: '6', front: 'Ete', back: 'Father' },
        { id: '7', front: 'Eka', back: 'Mother' },
        { id: '8', front: 'Akpan', back: 'First son' },
        { id: '9', front: 'Adiaha', back: 'First daughter' },
        { id: '10', front: 'Ufan', back: 'Friend' },
        { id: '11', front: 'Mmọn̄', back: 'Water' },
        { id: '12', front: 'Ufọk', back: 'House' },
        { id: '13', front: 'Usen', back: 'Day' },
        { id: '14', front: 'Okoneyo', back: 'Night' },
        { id: '15', front: 'Idem mfo?', back: 'How are you?' },
        { id: '16', front: 'Idem asọn̄', back: 'I am fine' },
        { id: '17', front: 'Amesiered', back: 'Good morning' },
        { id: '18', front: 'Esiere', back: 'Good night' },
        { id: '19', front: 'Tie sụn̄', back: 'Stay well (Goodbye)' },
        { id: '20', front: 'Sang a sụn̄', back: 'Journey well' },
        { id: '21', front: 'Bịakọn̄', back: 'Please' },
        { id: '22', front: 'Kpe', back: 'Sorry' },
        { id: '23', front: 'Kiet', back: 'One' },
        { id: '24', front: 'Iba', back: 'Two' },
        { id: '25', front: 'Ita', back: 'Three' },
        { id: '26', front: 'Inañ', back: 'Four' },
        { id: '27', front: 'Ition', back: 'Five' },
        { id: '28', front: 'Ufọk Nwed', back: 'School' },
        { id: '29', front: 'Ebot', back: 'Goat' },
        { id: '30', front: 'Erọn̄', back: 'Sheep' },
    ],
    yoruba: [
        { id: '1', front: 'Bawo ni', back: 'How are you' },
        { id: '2', front: 'Ese', back: 'Thank you' },
        { id: '3', front: 'Ounje', back: 'Food' },
    ],
    hausa: [
        { id: '1', front: 'Ina kwana', back: 'Good morning' },
        { id: '2', front: 'Na gode', back: 'Thank you' },
        { id: '3', front: 'Abinci', back: 'Food' },
    ],
    igbo: [
        { id: '1', front: 'Nnoo', back: 'Welcome' },
        { id: '2', front: 'Dalu', back: 'Thank you' },
        { id: '3', front: 'Nri', back: 'Food' },
    ]
};

const Flashcard = ({ card, onFlip }: { card: { front: string; back: string }, onFlip: () => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const spinValue = useSharedValue(0);

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const spinVal = interpolate(spinValue.value, [0, 1], [0, 180]);
        return {
            transform: [
                { perspective: 1000 },
                { rotateY: `${spinVal}deg` }
            ]
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const spinVal = interpolate(spinValue.value, [0, 1], [180, 360]);
        return {
            transform: [
                { perspective: 1000 },
                { rotateY: `${spinVal}deg` }
            ]
        };
    });

    const triggerFlip = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsFlipped(!isFlipped);
        spinValue.value = withSpring(isFlipped ? 0 : 1, {
            mass: 1,
            damping: 15,
            stiffness: 100,
        });
        onFlip();
    };

    const playAudio = (e?: any) => {
        if (e) {
            e.stopPropagation(); // Prevent flipping when tapping the speaker
        }
        playElevenLabsAudio(card.front);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={triggerFlip}
            className="w-full relative items-center justify-center my-4"
            style={{ height: 350 }}
        >
            {/* Front of card */}
            <Animated.View
                className="absolute inset-0 bg-neon-dark border-2 border-neon-cyan rounded-3xl p-8 items-center justify-center shadow-lg shadow-neon-cyan/20 backface-hidden"
                style={[
                    frontAnimatedStyle,
                    { backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 1 }
                ]}
            >
                {/* Speaker Icon Top Right */}
                <TouchableOpacity className="absolute top-6 right-6 p-2" onPress={playAudio}>
                    <Ionicons name="volume-medium" size={28} color="#00E5FF" />
                </TouchableOpacity>

                <Text className="text-text-secondary font-inter text-sm mb-6 uppercase tracking-widest">Front</Text>
                <Text className="text-text-primary font-nunito font-bold text-4xl text-center mb-4">{card.front}</Text>
                <Text className="text-text-secondary font-inter text-sm mt-auto">Tap to reveal answer</Text>
            </Animated.View>

            {/* Back of card */}
            <Animated.View
                className="absolute inset-0 bg-surface-light border-2 border-primary rounded-3xl p-8 items-center justify-center shadow-lg shadow-primary/20 backface-hidden"
                style={[
                    backAnimatedStyle,
                    { backfaceVisibility: 'hidden', zIndex: isFlipped ? 1 : 0 }
                ]}
            >
                {/* Speaker Icon Top Right */}
                <TouchableOpacity className="absolute top-6 right-6 p-2" onPress={playAudio}>
                    <Ionicons name="volume-medium" size={28} color="#3FB950" />
                </TouchableOpacity>

                <Text className="text-primary font-inter text-sm mb-6 uppercase tracking-widest">Back</Text>
                <Text className="text-white font-nunito font-bold text-4xl text-center mb-4">{card.back}</Text>

                <View className="flex-row gap-4 mt-auto">
                    <TouchableOpacity className="bg-error/20 p-3 rounded-full hidden">
                        <Ionicons name="close" size={24} color="#F85149" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-success/20 p-3 rounded-full hidden">
                        <Ionicons name="checkmark" size={24} color="#3FB950" />
                    </TouchableOpacity>
                </View>
                <Text className="text-text-secondary font-inter text-sm text-center">Tap to view front</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function FlashcardsScreen() {
    const navigation = useNavigation<any>();
    const { selectedLanguage } = useConversationStore();

    // Safety check in case the language isn't valid in our mock data
    const safeLanguage = selectedLanguage in flashcardsData ? selectedLanguage : 'ibibio';
    const cards = flashcardsData[safeLanguage as keyof typeof flashcardsData];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Pre-fetch current and next audio when index changes
    React.useEffect(() => {
        const currentWord = cards[currentIndex]?.front;
        const nextWord = cards[currentIndex + 1]?.front;

        if (currentWord) {
            // Fetch current card audio (will resolve instantly from cache if already played/fetched)
            prefetchElevenLabsAudio(currentWord);
        }
        if (nextWord) {
            // Fetch next card ahead of time
            prefetchElevenLabsAudio(nextWord, true);
        }
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Reached end of deck — increment metric
            const { incrementFlashcardsCompleted } = useConversationStore.getState();
            incrementFlashcardsCompleted();

            navigation.goBack();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 bg-surface rounded-full">
                    <Ionicons name="close" size={24} color="#F0F6FC" />
                </TouchableOpacity>
                <Text className="text-white font-poppins font-bold text-lg uppercase tracking-wider">
                    {selectedLanguage} Review
                </Text>
                <View className="w-10" /> {/* Spacer */}
            </View>

            {/* Progress */}
            <View className="px-6 mb-8 mt-4">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-text-secondary font-inter text-sm">Card {currentIndex + 1} of {cards.length}</Text>
                </View>
                <View className="h-2 w-full bg-surface-light rounded-full overflow-hidden">
                    <Animated.View
                        className="h-full bg-neon-cyan rounded-full"
                        style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                    />
                </View>
            </View>

            {/* Flashcard Container */}
            <View className="flex-1 px-8 justify-center">
                <Flashcard
                    key={cards[currentIndex].id} // Force re-mount on index change
                    card={cards[currentIndex]}
                    onFlip={() => { }}
                />
            </View>

            {/* Controls */}
            <View className="flex-row justify-between items-center px-10 py-10">
                <TouchableOpacity
                    onPress={handlePrev}
                    disabled={currentIndex === 0}
                    className={`p-4 rounded-full ${currentIndex === 0 ? 'opacity-30' : 'bg-surface'}`}
                >
                    <Ionicons name="arrow-back" size={28} color="#F0F6FC" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNext}
                    className="p-4 rounded-full bg-primary items-center justify-center w-20 h-20 shadow-lg shadow-primary/30"
                >
                    <Ionicons name={currentIndex === cards.length - 1 ? "checkmark" : "arrow-forward"} size={32} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
