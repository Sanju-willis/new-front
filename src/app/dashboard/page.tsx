'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useAssistantStore } from '@/stores/useAssistantStore';
import { useEffect, useState } from 'react';
import SupportChatWidget from '@/components/SupportChatWidget';
import CompanyForm from '@/components/CompanyForm';
import { useRef } from 'react';


export default function DashboardHome() {
  const { user, progress } = useAuthStore();
  const { sendMessage } = useAssistantStore();
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
    const hasTriggeredRef = useRef(false); 



 useEffect(() => {
  if (!user || progress === undefined || hasTriggeredRef.current) return;

  hasTriggeredRef.current = true; // prevent repeat

  if (!progress) {
    setShowCompanyForm(true);
  }

  sendMessage({
    stage: progress?.stage ?? null,
    step: 'resume',
  });
}, [user, progress]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">You're logged in via Facebook. 🎉</p>

      {showCompanyForm && <CompanyForm onClose={() => setShowCompanyForm(false)} />}
      <SupportChatWidget />
    </div>
  );
}
