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

interface ConversationState {
    isRecording: boolean;
    isTutorSpeaking: boolean;
    messages: Message[];
    currentTranscript: string;
    setRecording: (status: boolean) => void;
    setTutorSpeaking: (status: boolean) => void;
    addMessage: (msg: Message) => void;
    setCurrentTranscript: (text: string) => void;
    clearSession: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    isRecording: false,
    isTutorSpeaking: false,
    messages: [],
    currentTranscript: '',
    setRecording: (status) => set({ isRecording: status }),
    setTutorSpeaking: (status) => set({ isTutorSpeaking: status }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setCurrentTranscript: (text) => set({ currentTranscript: text }),
    clearSession: () => set({ messages: [], currentTranscript: '', isRecording: false, isTutorSpeaking: false }),
}));
