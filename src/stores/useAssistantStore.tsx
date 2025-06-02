// src\stores\useAssistantStore.tsx
import { create } from 'zustand';

interface AssistantMessagePayload {
  input?: string | null;
  stage?: string | null;
  step?: string | null;
}

interface AssistantState {
  messages: string[];
  sendMessage: (payload: AssistantMessagePayload) => void;
}


export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],

  sendMessage: async ({ input = '', stage = '', step = '' }) => {
    // Add user message only if it exists
    if (input)
      set((state) => ({
        messages: [...state.messages, `🧑‍💻: ${input}`],
      }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ input, stage, step }),
      });

      const data = await res.json();

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
