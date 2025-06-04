// src\app\test-form\page.tsx
'use client';
import CompanyForm from '@/components/CompanyForm';

export default function TestFormPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <CompanyForm onClose={() => console.log('Form closed')} />
    </div>
  );
}
