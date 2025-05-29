// src\app\page.tsx
'use client';

import { useRouter } from 'next/navigation';
import {SimpleForm} from '@/components/form'

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Aenigm3 AI CRO Tool</h1>
      <p className="mb-6 text-gray-600">Boost your landing pages with AI optimization</p>
       <div className="mb-4">
    <SimpleForm />
  </div>
      <button
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        onClick={() => router.push('/signup')}
      >
        Get Started
      </button>
    </main>
  );
}
