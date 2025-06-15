// src\app\dashboard\page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import SupportChatWidget from '@/components/SupportChatWidget';
import CompanyForm from '@/components/CompanyForm';
import DashboardLayout from '@/components/layouts/DashLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAssistantStore } from '@/stores/useAssistantStore';

import { CampaignPage, CompanyPage, HomePage, ProductsPage, Integrations, AnalyticsPage } from '@/app/dashboard/pages';

export default function DashboardHome() {
  const { user, progress } = useAuthStore();
  const { sendMessage } = useAssistantStore();
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!user || progress === undefined || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    if (!progress) {
      setShowCompanyForm(true);
      sendMessage({ stage: 'create_company', step: 'form_opened' });
    } else {
      sendMessage({ stage: progress.stage, step: 'resume' });
    }
  }, [user, progress]);

  const renderPage = () => {
    switch (currentPage) {
      case 'company': return <CompanyPage />;
      case 'products': return <ProductsPage />;
      case 'campaigns': return <CampaignPage />; // ← Add this line
       case 'integrations': return <Integrations />;
              case 'analytics': return <AnalyticsPage />;

      default: return <HomePage />;
    }
  };

  return (
  <DashboardLayout currentPage={currentPage} onChange={setCurrentPage}>
    {renderPage()}
    {showCompanyForm && <CompanyForm onClose={() => setShowCompanyForm(false)} />}
    <SupportChatWidget />
  </DashboardLayout>
);}