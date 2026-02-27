import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useConversationStore } from '../../stores/useConversationStore';
import * as Haptics from 'expo-haptics';
import { playElevenLabsAudio } from '../../services/elevenlabs';
import { db } from '../../services/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

interface Exercise {
    id: string;
    type: 'translate' | 'speak' | 'match';
    question: string;
    target: string;
    options?: string[];
}

// Exercises will now be loaded from Firestore
// const MOCK_EXERCISES: Exercise[] = [...]; 


export default function LessonSessionScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { lessonId } = route.params || { lessonId: '1' };
    const { addXP, decrementHeart, hearts, selectedLanguage } = useConversationStore();

    const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | null | 'incorrect'>(null);
    const [progress] = useState(new Animated.Value(0));
    const [correctCount, setCorrectCount] = useState(0);

    // Match exercise state
    const [matchCards, setMatchCards] = useState<{ id: string, text: string, type: 'source' | 'target', pairId: number }[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<{ id: string, text: string, type: 'source' | 'target', pairId: number } | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [shakeAnim] = useState(new Animated.Value(0));

    // Reset Match game on new exercise
    React.useEffect(() => {
        if (sessionExercises.length > 0 && sessionExercises[currentIndex]?.type === 'match') {
            const exercise = sessionExercises[currentIndex];
            if (exercise.pairs) {
                const cards: any[] = [];
                exercise.pairs.forEach(p => {
                    cards.push({ id: `s-${p.id}`, text: p.source, type: 'source', pairId: p.id });
                    cards.push({ id: `t-${p.id}`, text: p.target, type: 'target', pairId: p.id });
                });
                setMatchCards(cards.sort(() => 0.5 - Math.random()));
                setMatchedPairs([]);
                setSelectedMatch(null);
            }
        }
    }, [currentIndex, sessionExercises]);

    React.useEffect(() => {
        loadExercises();
    }, [selectedLanguage, lessonId]);

    const loadExercises = async () => {
        setLoading(true);
        try {
            const lang = selectedLanguage.toLowerCase();
            const exercisesRef = collection(db, 'content', lang, 'units', `unit_${lessonId}`, 'exercises');
            const snapshot = await getDocs(exercisesRef);

            let exercises = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));

            if (exercises.length === 0) {
                console.warn("No exercises found in Firestore, falling back to empty pool");
            }

            // Shuffle and pick 7
            const shuffled = exercises.sort(() => 0.5 - Math.random());
            setSessionExercises(shuffled.slice(0, 7));
        } catch (error) {
            console.error("Error loading exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    const currentExercise = sessionExercises[currentIndex];

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#1A6B4A" />
                <Text className="text-text-secondary mt-4">Loading lesson...</Text>
            </SafeAreaView>
        );
    }

    if (!currentExercise && !isFinished) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-text-primary text-xl">Unit not found.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-primary px-6 py-2 rounded-full">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleSubmit = () => {
        const normalize = (text: string) => text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

        if (currentExercise.type === 'speak') {
            // For now, simulate correct pronunciation automatically
            setFeedback('correct');
            setCorrectCount(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            addXP(10);
            const nextProgress = (currentIndex + 1) / sessionExercises.length;
            Animated.timing(progress, { toValue: nextProgress, duration: 500, useNativeDriver: false }).start();
            return;
        }

        const answer = currentExercise.type === 'match' ? selectedOptions.join('-') : selectedOptions.join(' ');
        if (normalize(answer) === normalize(currentExercise.target)) {
            setFeedback('correct');
            setCorrectCount(prev => prev + 1);
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

    // Add interface inside the file or above
    interface MatchPair {
        id: number;
        source: string;
        target: string;
    }

    interface Exercise {
        id: string;
        type: 'translate' | 'speak' | 'match';
        question: string;
        target: string;
        options?: string[];
        pairs?: MatchPair[];
    }


    const handleMatchSelection = (card: typeof matchCards[0]) => {
        // Can't select already matched cards
        if (matchedPairs.includes(card.pairId)) return;

        // Pronounce Ibibio words instantly
        if (card.type === 'target') {
            playElevenLabsAudio(card.text).catch(() => { });
        }

        if (!selectedMatch) {
            setSelectedMatch(card);
            return;
        }

        // Tap identical card to deselect
        if (selectedMatch.id === card.id) {
            setSelectedMatch(null);
            return;
        }

        // Selected logic
        if (selectedMatch.type !== card.type && selectedMatch.pairId === card.pairId) {
            // Correct match
            const newMatched = [...matchedPairs, card.pairId];
            setMatchedPairs(newMatched);
            setSelectedMatch(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Auto-submit if all matched
            if (sessionExercises[currentIndex].pairs && newMatched.length === sessionExercises[currentIndex].pairs.length) {
                setFeedback('correct');
                setCorrectCount(prev => prev + 1);
                addXP(10);
                Animated.timing(progress, {
                    toValue: (currentIndex + 1) / sessionExercises.length,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
        } else {
            // Incorrect match
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
            ]).start(() => {
                setSelectedMatch(null);
            });
        }
    };

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
            playElevenLabsAudio(option).catch(err => console.error("Audio error:", err));
        }
    };

    const accuracy = sessionExercises.length > 0 ? Math.round((correctCount / sessionExercises.length) * 100) : 0;

    let theme = {
        trophy: '🏆',
        color: '#E8A020',
        bg: 'bg-[#FFD700]/10',
        message: "Lesson Complete!",
        subtext: "Perfect! You're brilliant.",
        btnColor: 'bg-[#E8A020]'
    };

    if (accuracy === 100) {
        theme = { trophy: '🏆', color: '#E8A020', bg: 'bg-[#FFD700]/10', message: "Lesson Complete!", subtext: "Perfect! You're brilliant.", btnColor: 'bg-[#E8A020]' };
    } else if (accuracy >= 80) {
        theme = { trophy: '🥈', color: '#C0C0C0', bg: 'bg-[#C0C0C0]/10', message: "Great Job!", subtext: "Almost perfect. Keep it up!", btnColor: 'bg-[#A0A0A0]' };
    } else if (accuracy >= 50) {
        theme = { trophy: '🥉', color: '#CD7F32', bg: 'bg-[#CD7F32]/10', message: "Good Effort", subtext: "Practice makes perfect.", btnColor: 'bg-[#CD7F32]' };
    } else {
        theme = { trophy: '🦉', color: '#FF4B4B', bg: 'bg-[#FF4B4B]/10', message: "Don't Give Up!", subtext: "Let's review these again soon.", btnColor: 'bg-[#FF4B4B]' };
    }

    return (
        <SafeAreaView className={isFinished ? `flex-1 items-center justify-center px-6 ${theme.bg}` : "flex-1 bg-background"}>
            {isFinished ? (
                <>
                    <View className="items-center mb-8">
                        <Text className="text-8xl mb-4">{theme.trophy}</Text>
                        <Text className="text-text-primary text-4xl font-nunito font-bold mb-2 text-center">{theme.message}</Text>
                        <Text className="text-text-secondary text-lg text-center px-4 font-inter">
                            {theme.subtext}
                        </Text>
                    </View>

                    <View className="flex-row justify-around w-full mb-12">
                        <View className="items-center bg-surface p-4 rounded-2xl border border-surface-light w-32 shadow-sm">
                            <Ionicons name="flash" size={28} color="#E8A020" />
                            <Text className="text-text-primary font-bold mt-2 text-2xl">+{correctCount * 10}</Text>
                            <Text className="text-text-secondary text-xs uppercase font-bold tracking-wider mt-1">Total XP</Text>
                        </View>
                        <View className="items-center bg-surface p-4 rounded-2xl border border-surface-light w-32 shadow-sm">
                            <Ionicons name="checkmark-circle" size={28} color={accuracy >= 80 ? "#58CC02" : theme.color} />
                            <Text className="text-text-primary font-bold mt-2 text-2xl">{accuracy}%</Text>
                            <Text className="text-text-secondary text-xs uppercase font-bold tracking-wider mt-1">Accuracy</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className={`nav-button w-full py-4 rounded-2xl items-center shadow-lg ${theme.btnColor}`}
                    >
                        <Text className="text-white font-black text-lg uppercase tracking-widest font-poppins">CONTINUE</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
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
                            {currentExercise.question}
                        </Text>

                        {currentExercise.type !== 'match' && (
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
                        )}

                        {/* Translate Answer Area */}
                        {currentExercise.type === 'translate' && (
                            <View className="border-b-2 border-surface-light min-h-[60px] flex-row flex-wrap mb-12 py-2">
                                {selectedOptions.map((opt, i) => (
                                    <TouchableOpacity key={i} onPress={() => toggleOption(opt)} className="bg-surface border border-surface-light p-3 rounded-xl m-1">
                                        <Text className="text-text-primary font-bold">{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Options Area */}
                        <View className="flex-row flex-wrap justify-center flex-1">
                            {currentExercise.type === 'translate' && currentExercise.options?.map((opt, i) => (
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
                                <View className="w-full items-center justify-center flex-1">
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="items-center"
                                    >
                                        <Ionicons name="mic-circle" size={140} color="#1A6B4A" />
                                        <Text className="text-text-secondary mt-6 text-lg font-nunito">Tap to simulate voice</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentExercise.type === 'match' && (
                                <Animated.View style={{ transform: [{ translateX: shakeAnim }], flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', flex: 1, paddingBottom: 20 }}>
                                    {matchCards.map((card) => {
                                        const isMatched = matchedPairs.includes(card.pairId);
                                        const isSelected = selectedMatch?.id === card.id;

                                        return (
                                            <TouchableOpacity
                                                key={card.id}
                                                disabled={isMatched}
                                                onPress={() => handleMatchSelection(card)}
                                                className={`w-[48%] rounded-2xl mb-4 border-b-4 items-center justify-center min-h-[90px] ${isMatched
                                                    ? 'bg-surface-light border-transparent opacity-0 shadow-none' // Hide matched
                                                    : isSelected
                                                        ? 'bg-primary/20 border-primary shadow-sm' // Highlight selected
                                                        : 'bg-surface border-surface-light shadow-sm' // Default
                                                    }`}
                                            >
                                                <Text className={`text-xl font-bold text-center px-2 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                                                    {card.text}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </Animated.View>
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
                </>
            )}
        </SafeAreaView>
    );
}
