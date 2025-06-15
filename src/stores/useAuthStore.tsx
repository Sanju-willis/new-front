// src\stores\useAuthStore.tsx
import { create } from 'zustand';
import { api } from '@/helpers/apiStores'
import { AuthState } from '@/types/storesTypes';


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  progress: null,
    platforms: null,
  loading: true,

  fetchUser: async () => {
    try {
      const data = await api.fetchUser(); 

      set({
        user: data.user,
        company: data.company || null,
        progress: data.progress || null,
        platforms: data.platforms || null,
        loading: false,
      });

    } catch (err) {
      set({ user: null, progress: null, loading: false });
    }
  }
}));
