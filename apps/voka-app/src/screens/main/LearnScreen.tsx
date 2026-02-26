import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useConversationStore } from '../../stores/useConversationStore';
import TopStatsBar from '../../components/TopStatsBar';

interface PathNode {
    id: string;
    type: 'lesson' | 'chest' | 'quiz';
    icon: string;
    label: string;
    status: 'locked' | 'unlocked' | 'completed';
    offset: number; // For zigzag effect
}

const LEARNING_PATH: PathNode[] = [
    { id: '1', type: 'lesson', icon: 'star', label: 'Greetings', status: 'completed', offset: 0 },
    { id: '2', type: 'lesson', icon: 'mic', label: 'Mesiere', status: 'unlocked', offset: 40 },
    { id: '3', type: 'lesson', icon: 'star', label: 'Ama nte', status: 'locked', offset: -40 },
    { id: '4', type: 'chest', icon: 'gift', label: 'Reward', status: 'locked', offset: 20 },
    { id: '5', type: 'lesson', icon: 'star', label: 'Daba daba', status: 'locked', offset: -30 },
    { id: '6', type: 'quiz', icon: 'trophy', label: 'Unit Test', status: 'locked', offset: 0 },
];

export default function LearnScreen() {
    const navigation = useNavigation<any>();
    const { setActiveMode, selectedLanguage } = useConversationStore();

    React.useEffect(() => {
        setActiveMode('drill');
    }, []);

    const handleNodePress = (node: PathNode) => {
        if (node.status !== 'locked') {
            navigation.navigate('LessonSession', { lessonId: node.id, title: node.label });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <TopStatsBar />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Section Header */}
                <View className="bg-primary px-8 py-6 rounded-2xl mb-12 w-[90%] flex-row items-center justify-between">
                    <View>
                        <Text className="text-white font-bold opacity-80 text-xs tracking-widest">SECTION 1, UNIT 1</Text>
                        <Text className="text-white text-xl font-bold mt-1">
                            {selectedLanguage.toUpperCase()} Basics 1
                        </Text>
                    </View>
                    <Ionicons name="book" size={24} color="white" />
                </View>

                {/* Path Nodes */}
                {LEARNING_PATH.map((node, index) => (
                    <View key={node.id} className="items-center mb-10" style={{ transform: [{ translateX: node.offset }] }}>
                        <TouchableOpacity
                            onPress={() => handleNodePress(node)}
                            disabled={node.status === 'locked'}
                            className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${node.status === 'completed' ? 'bg-secondary' :
                                node.status === 'unlocked' ? 'bg-primary' : 'bg-surface-light border-2 border-surface'
                                }`}
                        >
                            <Ionicons
                                name={node.icon as any}
                                size={40}
                                color={node.status === 'locked' ? '#8B949E' : 'white'}
                            />

                            {/* Progress Ring for active node */}
                            {node.status === 'unlocked' && (
                                <View className="absolute inset-0 border-4 border-white/30 rounded-full" />
                            )}
                        </TouchableOpacity>

                        {node.label && (
                            <Text className={`mt-2 font-bold ${node.status === 'locked' ? 'text-text-secondary' : 'text-text-primary'}`}>
                                {node.label}
                            </Text>
                        )}
                    </View>
                ))}

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
