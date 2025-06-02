// src\components\layouts\DashLayout.tsx
'use client';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onChange: (page: string) => void;
}

export default function DashboardLayout({ children, currentPage, onChange }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onChange={onChange} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
