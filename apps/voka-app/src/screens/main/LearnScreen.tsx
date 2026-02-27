import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useConversationStore } from '../../stores/useConversationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import TopStatsBar from '../../components/TopStatsBar';
import { db } from '../../services/firebase';
import { collection, query, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';

interface Unit {
    id: string;
    title: string;
    description: string;
    order: number;
}

export default function LearnScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { setActiveMode, selectedLanguage } = useConversationStore();
    const { user } = useAuthStore();

    const [units, setUnits] = useState<Unit[]>([]);
    const [completedUnits, setCompletedUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Pulse animation for active node
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        setActiveMode('drill');
    }, []);

    useEffect(() => {
        if (isFocused) {
            loadPathData();
        }
    }, [selectedLanguage, isFocused]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const loadPathData = async () => {
        setLoading(true);
        try {
            // 1. Fetch user progress
            let currentCompleted: string[] = [];
            if (user?.uid) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().completedUnits) {
                    currentCompleted = userDoc.data().completedUnits[selectedLanguage] || [];
                    setCompletedUnits(currentCompleted);
                }
            }

            // 2. Fetch available units
            const lang = selectedLanguage.toLowerCase();
            const q = query(collection(db, 'content', lang, 'units'), orderBy('order'));
            const snapshot = await getDocs(q);
            const loadedUnits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));

            setUnits(loadedUnits);
        } catch (error) {
            console.error("Error loading Learn path data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNodePress = (unit: Unit, status: 'locked' | 'unlocked' | 'completed') => {
        if (status !== 'locked') {
            // Because seed.js saves doc IDs like 'unit_1', we pass the specific unit number.
            // E.g 'unit_1' -> '1' to match LessonSessionScreen's expectation.
            const rawId = unit.id.replace('unit_', '');
            navigation.navigate('LessonSession', { lessonId: rawId, title: unit.title });
        }
    };

    const renderHopscotchGrid = () => {
        if (units.length === 0) {
            return (
                <View className="items-center justify-center p-10 flex-1">
                    <Text className="text-text-secondary text-lg text-center">No units available for this language yet.</Text>
                </View>
            );
        }

        const rows: { units: Unit[], type: 'single' | 'double' }[] = [];
        let i = 0;
        while (i < units.length) {
            if (i % 3 === 0) {
                rows.push({ units: [units[i]], type: 'single' });
                i += 1;
            } else {
                const row = [units[i]];
                if (i + 1 < units.length) {
                    row.push(units[i + 1]);
                }
                rows.push({ units: row, type: 'double' });
                i += 2;
            }
        }

        return (
            <View className="w-full px-4 items-center pb-10 pt-4">
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} className={`flex-row justify-center items-start w-full mb-6 ${row.type === 'double' ? 'space-x-6' : ''}`}>
                        {row.units.map((unit) => {
                            const index = units.findIndex(u => u.id === unit.id);
                            const isCompleted = completedUnits.includes(unit.id);
                            const isUnlocked = isCompleted || (index === 0 || completedUnits.includes(units[index - 1].id));
                            const status = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

                            const nodeBg = status === 'completed'
                                ? 'bg-surface-light border-2 border-surface opacity-60'
                                : status === 'unlocked'
                                    ? 'bg-primary border-2 border-[#58CC02]'
                                    : 'bg-surface border-2 border-surface-light opacity-50';

                            return (
                                <View key={unit.id} className="items-center relative mx-2">
                                    {status === 'unlocked' && (
                                        <View className="bg-background px-3 py-1 rounded-full mb-2 shadow-sm border border-primary absolute -top-8 z-20">
                                            <Text className="text-primary font-poppins font-bold uppercase tracking-widest text-[9px]">Start</Text>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => handleNodePress(unit, status)}
                                        disabled={status === 'locked'}
                                        className={`w-28 h-28 rounded-3xl items-center justify-center shadow-lg ${nodeBg}`}
                                    >
                                        <Ionicons
                                            name={status === 'completed' ? 'checkmark' : status === 'locked' ? 'lock-closed' : 'book'}
                                            size={42}
                                            color={status === 'locked' ? '#8B949E' : 'white'}
                                        />

                                        {status === 'unlocked' && (
                                            <Animated.View
                                                className="absolute inset-0 border-[5px] border-[#D7FFB8] rounded-3xl opacity-60"
                                                style={{ transform: [{ scale: pulseAnim }] }}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    <View className="mt-3 w-28 items-center">
                                        <Text numberOfLines={2} className={`font-poppins font-bold text-center tracking-tight leading-tight ${status === 'locked' || status === 'completed' ? 'text-text-secondary opacity-60' : 'text-text-primary'}`}>
                                            {unit.title}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <TopStatsBar />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#1A6B4A" />
                    <Text className="text-text-secondary mt-4 font-inter">Drawing your map...</Text>
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Map Header */}
                    <View className="px-6 py-8 items-center bg-surface border-b-2 border-surface-light rounded-b-[40px] mb-4 shadow-sm">
                        <Text className="text-primary font-bold opacity-80 text-xs tracking-widest uppercase mb-1">{selectedLanguage} ADVENTURE</Text>
                        <Text className="text-text-primary text-3xl font-poppins font-black text-center">
                            The Learning Path
                        </Text>
                    </View>

                    {renderHopscotchGrid()}

                </ScrollView>
            )}
        </SafeAreaView>
    );
}
