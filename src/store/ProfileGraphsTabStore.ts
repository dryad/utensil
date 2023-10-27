import { create } from 'zustand';

interface ProfileGraphsTabState {
  currentTab: number;
  setCurrentTab: (currentTab: number) => void;
}

export const useProfileGraphsTabStore = create<ProfileGraphsTabState>((set) => ({
  currentTab: 0, // 0 -public, 1 - private, 2 - shared 
  setCurrentTab: (currentTab) => set({ currentTab }), 
}));