import { create } from 'zustand';

interface Correction {
    type: 'grammar' | 'pronunciation' | 'vocabulary';
    original: string;
    corrected: string;
    explanation: string;
    severity: 'info' | 'warning' | 'error';
}

interface Message {
    id: string;
    role: 'user' | 'tutor';
    text: string;
    audioUrl?: string;
    timestamp: Date;
    corrections?: Correction[];
}

export interface PracticeSession {
    id: string;
    title: string;
    type: 'Flashcards' | 'Conversation' | 'Drill';
    durationMin: number;
    date: Date;
}

interface ConversationState {
    isRecording: boolean;
    isTutorSpeaking: boolean;
    messages: Message[];
    currentTranscript: string;
    selectedLanguage: 'ibibio' | 'yoruba' | 'hausa' | 'igbo';
    tutorVoiceId: string;

    // Interactive Flow State
    sessionPhase: 'greeting' | 'quiz' | 'quiz_eval' | 'learning' | 'conversation';
    activeMode: 'drill' | 'conversation';
    isFirstTime: boolean;
    userName: string;
    lastLesson: string;
    quizQuestionIndex: number;

    // Gamification state
    xp: number;
    streak: number;
    hearts: number;
    gems: number;
    levelProgress: number; // 0 to 100
    practiceGoal: number;
    flashcardsCompleted: number;

    // History Tracking
    recentSessions: PracticeSession[];

    setRecording: (status: boolean) => void;
    setTutorSpeaking: (status: boolean) => void;
    addMessage: (msg: Message) => void;
    setCurrentTranscript: (text: string) => void;
    setSelectedLanguage: (lang: 'ibibio' | 'yoruba' | 'hausa' | 'igbo') => void;
    setTutorVoiceId: (id: string) => void;
    setSessionPhase: (phase: 'greeting' | 'quiz' | 'quiz_eval' | 'learning' | 'conversation') => void;
    setActiveMode: (mode: 'drill' | 'conversation') => void;
    setQuizQuestionIndex: (index: number) => void;

    // Gamification setters
    addXP: (amount: number) => void;
    decrementHeart: () => void;
    refillHearts: () => void;
    addGems: (amount: number) => void;
    updateLevelProgress: (progress: number) => void;
    setPracticeGoal: (goal: number) => void;
    incrementFlashcardsCompleted: () => void;
    addRecentSession: (session: Omit<PracticeSession, 'id' | 'date'>) => void;

    clearSession: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    isRecording: false,
    isTutorSpeaking: false,
    messages: [],
    currentTranscript: '',
    selectedLanguage: 'ibibio',
    tutorVoiceId: 'eOHsvebhdtt0XFeHVMQY', // Default: Mfolie (existing voice)

    // Defaulting to "First Time User" for the mock
    sessionPhase: 'greeting',
    activeMode: 'conversation',
    isFirstTime: true, // Toggle this to false to test the "Welcome Back" flow
    userName: 'Learner',
    lastLesson: 'Greetings and Introductions',
    quizQuestionIndex: 0,

    // Default gamification values (Starting Fresh)
    xp: 0,
    streak: 0,
    hearts: 5,
    gems: 0,
    levelProgress: 0,
    practiceGoal: 20, // Default to 20 mins
    flashcardsCompleted: 0,
    recentSessions: [], // Setup empty array

    setRecording: (status) => set({ isRecording: status }),
    setTutorSpeaking: (status) => set({ isTutorSpeaking: status }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setCurrentTranscript: (text) => set({ currentTranscript: text }),
    setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
    setTutorVoiceId: (id) => set({ tutorVoiceId: id }),
    setSessionPhase: (phase) => set({ sessionPhase: phase }),
    setActiveMode: (mode) => set({ activeMode: mode }),
    setQuizQuestionIndex: (index) => set({ quizQuestionIndex: index }),

    // Gamification logic
    addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
    decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
    refillHearts: () => set({ hearts: 5 }),
    addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
    updateLevelProgress: (progress) => set({ levelProgress: progress }),
    setPracticeGoal: (goal) => set({ practiceGoal: goal }),
    incrementFlashcardsCompleted: () => set((state) => ({ flashcardsCompleted: state.flashcardsCompleted + 1 })),
    addRecentSession: (session) => set((state) => {
        const newSession: PracticeSession = {
            ...session,
            id: Math.random().toString(36).substring(2, 9),
            date: new Date()
        };
        // Keep only the most recent 10 sessions, latest first
        const maxSessions = [newSession, ...state.recentSessions].slice(0, 10);
        return { recentSessions: maxSessions };
    }),

    clearSession: () => set({
        messages: [],
        currentTranscript: '',
        isRecording: false,
        isTutorSpeaking: false,
        sessionPhase: 'greeting',
        quizQuestionIndex: 0
    }),
}));
