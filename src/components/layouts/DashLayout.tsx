// src\components\layouts\DashLayout.tsx
'use client';
import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="flex flex-col h-screen">
      {/* Persistent Header */}
      <Header />

      {/* Content area: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onChange={setCurrentPage} />

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
