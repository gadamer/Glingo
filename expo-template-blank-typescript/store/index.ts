import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  // User progress
  xp: number;
  streak: number;
  lastActive: string | null;
  completedLessons: number;
  
  // App state
  initialized: boolean;
  onboardingCompleted: boolean;
  
  // Actions
  initialize: () => void;
  completeOnboarding: () => void;
  addXp: (amount: number) => void;
  completeLesson: () => void;
  updateStreak: () => void;
  resetProgress: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      xp: 0,
      streak: 0,
      lastActive: null,
      completedLessons: 0,
      initialized: false,
      onboardingCompleted: false,
      
      // Actions
      initialize: () => {
        set({ initialized: true });
        get().updateStreak();
      },
      
      completeOnboarding: () => {
        set({ onboardingCompleted: true });
      },
      
      addXp: (amount: number) => {
        set((state) => ({ xp: state.xp + amount }));
      },
      
      completeLesson: () => {
        set((state) => ({ completedLessons: state.completedLessons + 1 }));
      },
      
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActive, streak } = get();
        
        if (!lastActive) {
          // First time user
          set({ streak: 1, lastActive: today });
          return;
        }
        
        const lastActiveDate = new Date(lastActive);
        const currentDate = new Date(today);
        
        // Calculate the difference in days
        const timeDiff = currentDate.getTime() - lastActiveDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day
          set({ streak: streak + 1, lastActive: today });
        } else if (dayDiff > 1) {
          // Streak broken
          set({ streak: 1, lastActive: today });
        } else if (dayDiff === 0) {
          // Same day, just update lastActive
          set({ lastActive: today });
        }
      },
      
      resetProgress: () => {
        set({
          xp: 0,
          streak: 0,
          completedLessons: 0,
          lastActive: null,
        });
      },
    }),
    {
      name: 'german-master-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
