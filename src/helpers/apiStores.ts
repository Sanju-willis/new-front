// src\helpers\apiStores.ts
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = {
  fetchUser: async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('❌ Failed to fetch user');
    return res.json();
  },

  sendAssistantMessage: async ({
    input = '',
    stage = '',
    step = '',
  }: {
    input?: string;
    stage?: string;
    step?: string;
  }) => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ input, stage, step }),
    });

    if (!res.ok) throw new Error('❌ Failed to get assistant response');
    return res.json();
  },
};
