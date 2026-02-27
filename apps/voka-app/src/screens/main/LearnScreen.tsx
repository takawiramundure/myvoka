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

    const renderMapPath = () => {
        if (units.length === 0) {
            return (
                <View className="items-center justify-center p-10 flex-1">
                    <Text className="text-text-secondary text-lg text-center">No units available for this language yet.</Text>
                </View>
            );
        }

        return units.map((unit, index) => {
            const isCompleted = completedUnits.includes(unit.id);
            // It is unlocked if it's the first unit, OR the previous unit is completed.
            const isUnlocked = isCompleted || (index === 0 || completedUnits.includes(units[index - 1].id));
            const status = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

            // Calculate an undulating explorer map offset
            // We alternate left/right gently
            const pathOffset = Math.sin(index * 1.5) * 60;

            // For Biome feel - let's alternate colors every 5 levels if we had them. 
            // Better contrast tailored for dark mode
            const biomeColors = ['#152419', '#241D12', '#141D26', '#221825'];
            const biomeBgColor = biomeColors[Math.floor(index / 3) % biomeColors.length];
            const nodeBg = status === 'completed' ? 'bg-[#58CC02]' : status === 'unlocked' ? 'bg-primary' : 'bg-surface-light border-4 border-surface';

            return (
                <View key={unit.id} className="w-full relative py-8 items-center" style={{ backgroundColor: index % 3 === 0 ? biomeBgColor : 'transparent' }}>

                    {/* Render Trail line connecting to the PREVIOUS node (if not the first) */}
                    {index > 0 && (
                        <View className="absolute top-[-40px] bottom-1/2 w-4 border-l-4 border-dashed border-surface-light opacity-50 z-0"
                            style={{ transform: [{ translateX: (pathOffset + Math.sin((index - 1) * 1.5) * 60) / 2 }] }}
                        />
                    )}

                    <View className="items-center z-10" style={{ transform: [{ translateX: pathOffset }] }}>
                        {status === 'unlocked' && (
                            <View className="bg-background px-4 py-2 rounded-xl mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.1)] border-2 border-primary">
                                <Text className="text-primary font-poppins font-bold uppercase tracking-widest text-xs">Start Here</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => handleNodePress(unit, status)}
                            disabled={status === 'locked'}
                            className={`w-24 h-24 rounded-full items-center justify-center shadow-lg ${nodeBg}`}
                        >
                            <Ionicons
                                name={status === 'completed' ? 'checkmark' : status === 'locked' ? 'lock-closed' : 'bonfire'}
                                size={40}
                                color={status === 'locked' ? '#8B949E' : 'white'}
                            />

                            {/* Active Node Pulse Ring */}
                            {status === 'unlocked' && (
                                <Animated.View
                                    className="absolute inset-0 border-4 border-primary rounded-full opacity-50"
                                    style={{ transform: [{ scale: pulseAnim }] }}
                                />
                            )}
                        </TouchableOpacity>

                        <Text className={`mt-3 font-poppins font-bold text-lg text-center px-4 ${status === 'locked' ? 'text-text-secondary opacity-60' : 'text-text-primary'}`}>
                            {unit.title}
                        </Text>
                        <Text className="text-text-secondary text-xs text-center px-8 mt-1">
                            {unit.description}
                        </Text>
                    </View>
                </View>
            );
        });
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
                    <View className="px-6 py-8 items-center bg-surface border-b-2 border-surface-light rounded-b-[40px] mb-8 shadow-sm">
                        <Text className="text-primary font-bold opacity-80 text-xs tracking-widest uppercase mb-1">{selectedLanguage} ADVENTURE</Text>
                        <Text className="text-text-primary text-3xl font-poppins font-black text-center">
                            The Explorer's Map
                        </Text>
                    </View>

                    {renderMapPath()}

                </ScrollView>
            )}
        </SafeAreaView>
    );
}
