// src\stores\useAuthStore.tsx
import { create } from 'zustand';


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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch user');

      const data = await res.json();

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
