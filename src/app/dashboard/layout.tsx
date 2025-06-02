// src\app\dashboard\layout.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [loading, user]);

  if (loading) return null; // remove any UI gap/flash

  return <>{children}</>;
}
