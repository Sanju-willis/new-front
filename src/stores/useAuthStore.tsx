// src\stores\useAuthStore.tsx
import { create } from 'zustand';
import { api } from '@/helpers/apiStores'

type Progress = {
  company: string;
  stage: 'company_created' | 'items_added';
}
type Company = {
  _id: string;
  name: string;
}
interface User {
  name: string;
  email: string;
  photo: string;
}

interface AuthState {
  user: User | null;
  company: Company | null;
  progress: Progress | null;
  loading: boolean;
  fetchUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  progress: null,
  loading: true,

  fetchUser: async () => {
    try {
      const data = await api.fetchUser(); // ✅ call centralized helper

      set({
        user: data.user,
        company: data.company || null,
        progress: data.progress || null,
        loading: false,
      });

    } catch (err) {
      set({ user: null, progress: null, loading: false });
    }
  }
}));
