import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define types for global state
interface GlobalState {
  // User preferences
  theme: 'light' | 'dark';
  language: string;

  // App-wide settings
  notifications: boolean;
  privacyMode: boolean;

  // Utility methods
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  togglePrivacyMode: () => void;
}

// Create global state store with persistence
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'light',
      language: 'en',
      notifications: true,
      privacyMode: false,

      // Theme setter
      setTheme: (theme) => set({ theme }),

      // Language setter
      setLanguage: (language) => set({ language }),

      // Toggle notifications
      toggleNotifications: () => 
        set((state) => ({ notifications: !state.notifications })),

      // Toggle privacy mode
      togglePrivacyMode: () => 
        set((state) => ({ privacyMode: !state.privacyMode })),
    }),
    {
      name: 'mememates-global-state', // unique name
      storage: createJSONStorage(() => localStorage),
      
      // Specify which parts of the state to persist
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
        privacyMode: state.privacyMode
      })
    }
  )
);

// Utility hook for accessing global state
export const useAppSettings = () => {
  const { 
    theme, 
    language, 
    notifications, 
    privacyMode,
    setTheme,
    setLanguage,
    toggleNotifications,
    togglePrivacyMode
  } = useGlobalStore();

  return {
    theme,
    language,
    notifications,
    privacyMode,
    setTheme,
    setLanguage,
    toggleNotifications,
    togglePrivacyMode
  };
};
