import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create((set) => ({
  hasIntroLoaded: false,
  setIntroLoaded: (value) => set({ hasIntroLoaded: value }),
  markIntroLoaded: () => set({ hasIntroLoaded: true }),
  resetIntro: () => set({ hasIntroLoaded: false }),

  musicEnabled: false,
  setMusicEnabled: (value) => set({ musicEnabled: value }),
  toggleMusic: () =>
    set((state) => ({
      musicEnabled: !state.musicEnabled,
    })),
}));