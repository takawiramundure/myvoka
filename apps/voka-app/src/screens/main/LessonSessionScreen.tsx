import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useConversationStore } from '../../stores/useConversationStore';
import * as Haptics from 'expo-haptics';
import { playElevenLabsAudio } from '../../services/elevenlabs';

interface Exercise {
    id: string;
    type: 'translate' | 'speak' | 'match';
    question: string;
    target: string;
    options?: string[];
}

const MOCK_EXERCISES: Exercise[] = [
    { id: '1', type: 'translate', question: 'Amesiere', target: 'Good morning', options: ['Good', 'morning', 'night', 'How', 'are', 'you'] },
    { id: '2', type: 'translate', question: 'Aba die?', target: 'How are you?', options: ['How', 'are', 'you', 'Good', 'fine', 'I'] },
    { id: '3', type: 'translate', question: 'Sosongo', target: 'Thank you', options: ['Thank', 'you', 'Welcome', 'Please', 'Yes', 'No'] },
    { id: '4', type: 'translate', question: 'Esiere', target: 'Good night', options: ['Good', 'night', 'morning', 'Sleep', 'well', 'bye'] },
    { id: '5', type: 'translate', question: 'Ami mmehë', target: 'I am fine', options: ['I', 'am', 'fine', 'Good', 'not', 'sad'] },
    { id: '6', type: 'match', question: 'A-me-sie-re', target: 'Good-mor-ning', options: ['A', 'me', 'sie', 're', 'Good', 'mor', 'ning'] },
    { id: '7', type: 'translate', question: 'Abasi akpeme fi', target: 'God protect you', options: ['God', 'protect', 'you', 'bless', 'save', 'keep'] },
    { id: '8', type: 'translate', question: 'Mbuot', target: 'Friend', options: ['Friend', 'Family', 'Brother', 'Sister', 'Human', 'Person'] },
    { id: '9', type: 'translate', question: 'Hello', target: 'Mesiere', options: ['Mesiere', 'Amesiere', 'Esiere', 'Sosongo', 'Mbuot', 'Di do'] },
    { id: '10', type: 'translate', question: 'Sweet', target: 'Ama nte', options: ['Ama nte', 'Daba daba', 'Sosongo', 'Mbuot', 'Esiere', 'Di do'] },
    { id: '11', type: 'translate', question: 'Come', target: 'Di do', options: ['Di do', 'Sosongo', 'Aba die', 'Ka do', 'Ami', 'Edi'] },
    { id: '12', type: 'speak', question: 'Say "Sosongo"', target: 'Sosongo' },
    { id: '13', type: 'translate', question: 'Ami edi Learner', target: 'I am Learner', options: ['I', 'am', 'Learner', 'He', 'is', 'Teacher'] },
];

export default function LessonSessionScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { addXP, decrementHeart, hearts } = useConversationStore();

    const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | null | 'incorrect'>(null);
    const [progress] = useState(new Animated.Value(0));

    React.useEffect(() => {
        // Randomize and pick 7 exercises for this session
        const shuffled = [...MOCK_EXERCISES].sort(() => 0.5 - Math.random());
        setSessionExercises(shuffled.slice(0, 7));
    }, []);

    const currentExercise = sessionExercises[currentIndex];

    if (!currentExercise && !isFinished) return null; // Wait for initialization

    const handleSubmit = () => {
        const normalize = (text: string) => text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

        const answer = currentExercise.type === 'match' ? selectedOptions.join('-') : selectedOptions.join(' ');
        if (normalize(answer) === normalize(currentExercise.target)) {
            setFeedback('correct');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            addXP(10);

            const nextProgress = (currentIndex + 1) / sessionExercises.length;
            Animated.timing(progress, {
                toValue: nextProgress,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            setFeedback('incorrect');
            decrementHeart();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleContinue = () => {
        if (currentIndex < sessionExercises.length - 1) {
            setFeedback(null);
            setSelectedOptions([]);
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
            // Pronounce the word as the user picks it
            playElevenLabsAudio(option).catch(err => console.error("Audio error:", err));
        }
    };

    if (isFinished) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
                <View className="items-center mb-8">
                    <Text className="text-6xl mb-4">🏆</Text>
                    <Text className="text-text-primary text-3xl font-nunito font-bold mb-2">Lesson Complete!</Text>
                    <Text className="text-text-secondary text-lg text-center px-4">
                        You're like a pristine, freshwater pearl.
                    </Text>
                </View>

                <View className="flex-row justify-around w-full mb-12">
                    <View className="items-center bg-surface p-4 rounded-2xl border border-surface-light w-28">
                        <Ionicons name="flash" size={24} color="#E8A020" />
                        <Text className="text-text-primary font-bold mt-2 text-xl">+30</Text>
                        <Text className="text-text-secondary text-xs uppercase font-bold">Total XP</Text>
                    </View>
                    <View className="items-center bg-surface p-4 rounded-2xl border border-surface-light w-28">
                        <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                        <Text className="text-text-primary font-bold mt-2 text-xl">100%</Text>
                        <Text className="text-text-secondary text-xs uppercase font-bold">Accuracy</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-primary w-full py-4 rounded-2xl items-center shadow-lg"
                >
                    <Text className="text-white font-bold text-lg uppercase tracking-widest">Continue</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header / Progress bar */}
            <View className="flex-row items-center px-6 pt-4 mb-10">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color="#8B949E" />
                </TouchableOpacity>
                <View className="flex-1 h-4 bg-surface-light rounded-full mx-4 overflow-hidden">
                    <Animated.View
                        style={{
                            height: '100%',
                            backgroundColor: '#58CC02',
                            width: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }}
                    />
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="heart" size={24} color="#FF4B4B" />
                    <Text className="text-text-primary font-bold ml-1">{hearts}</Text>
                </View>
            </View>

            {/* Exercise Content */}
            <View className="px-6 flex-1">
                <Text className="text-text-primary text-2xl font-nunito font-bold mb-8">
                    {currentExercise.type === 'translate' ? 'Translate this sentence' :
                        currentExercise.type === 'match' ? 'Tap the pairs' : 'Speak this word'}
                </Text>

                <View className="flex-row items-start mb-12">
                    <View className="w-20 h-20 bg-primary/20 rounded-2xl items-center justify-center mr-4">
                        <Text className="text-4xl text-white">🦉</Text>
                    </View>
                    <View className="bg-surface border border-surface-light p-4 rounded-2xl flex-1 flex-row items-center justify-between">
                        <Text className="text-text-primary text-lg flex-1">{currentExercise.question}</Text>
                        <TouchableOpacity
                            onPress={() => playElevenLabsAudio(currentExercise.question)}
                            className="bg-primary/10 p-2 rounded-full ml-2"
                        >
                            <Ionicons name="volume-medium" size={24} color="#1A6B4A" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Answer Area */}
                <View className="border-b-2 border-surface-light min-h-[60px] flex-row flex-wrap mb-12 py-2">
                    {selectedOptions.map((opt, i) => (
                        <TouchableOpacity key={i} onPress={() => toggleOption(opt)} className="bg-surface border border-surface-light p-3 rounded-xl m-1">
                            <Text className="text-text-primary font-bold">{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Options Area (Conditional based on type) */}
                <View className="flex-row flex-wrap justify-center">
                    {currentExercise.type !== 'speak' && currentExercise.options?.map((opt, i) => (
                        <TouchableOpacity
                            key={i}
                            disabled={selectedOptions.includes(opt)}
                            onPress={() => toggleOption(opt)}
                            className={`p-3 rounded-xl m-1 border-b-4 ${selectedOptions.includes(opt)
                                ? 'bg-surface-light border-transparent opacity-30 shadow-none'
                                : 'bg-surface border-surface-light shadow-sm'
                                }`}
                        >
                            <Text className={`text-lg font-bold ${selectedOptions.includes(opt) ? 'text-transparent' : 'text-text-primary'}`}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {currentExercise.type === 'speak' && (
                        <View className="w-full items-center mt-12">
                            <Ionicons name="mic-circle" size={100} color="#1A6B4A" />
                            <Text className="text-text-secondary mt-4">Hold to record your pronunciation</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Feedback Footer */}
            <View className={`px-6 pt-6 pb-10 ${feedback === 'correct' ? 'bg-[#D7FFB8]' :
                feedback === 'incorrect' ? 'bg-[#FFDFE0]' : 'bg-background border-t border-surface-light'
                }`}>
                {feedback && (
                    <View className="flex-row items-center mb-6">
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${feedback === 'correct' ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'
                            }`}>
                            <Ionicons name={feedback === 'correct' ? 'checkmark' : 'close'} size={28} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className={`font-bold text-2xl ${feedback === 'correct' ? 'text-[#58CC02]' : 'text-[#EA2B2B]'
                                }`}>
                                {feedback === 'correct' ? 'Awesome!' : 'Correct solution:'}
                            </Text>
                            {feedback === 'incorrect' && (
                                <Text className="text-[#EA2B2B] font-inter text-lg">{currentExercise.target}</Text>
                            )}
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    onPress={feedback ? handleContinue : handleSubmit}
                    className={`py-4 rounded-2xl items-center shadow-lg ${feedback === 'correct' ? 'bg-[#58CC02]' :
                        feedback === 'incorrect' ? 'bg-[#FF4B4B]' : 'bg-primary'
                        }`}
                >
                    <Text className="text-white font-bold text-lg uppercase tracking-widest font-poppins">
                        {feedback ? 'Continue' : 'Check'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
