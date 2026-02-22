import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    signOut: () => set({ user: null }),
}));
