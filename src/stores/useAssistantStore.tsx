// src\stores\useAssistantStore.tsx
import { create } from 'zustand';
import { api } from '@/helpers/apiStores';

interface AssistantMessagePayload {
  input?: string;
  stage?: string;
  step?: string;
}

interface AssistantState {
  messages: string[];
  sendMessage: (payload: AssistantMessagePayload) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],

  sendMessage: async ({ input, stage, step }) => {
    if (input) {
      set((state) => ({
        messages: [...state.messages, `🧑‍💻: ${input}`],
      }));
    }

    try {
      const data = await api.sendAssistantMessage({ input, stage, step });

      set((state) => ({
        messages: [...state.messages, `🤖: ${data.reply}`],
      }));
    } catch (err: any) {
      set((state) => ({
        messages: [...state.messages, `❌: ${err.message || 'Failed to get response.'}`],
      }));
    }
  },
}));
