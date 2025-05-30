// src\components\CompanyForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAssistantStore } from '@/stores/useAssistantStore';

const steps = ['company_name', 'industry', 'role'] as const;
type Step = typeof steps[number];

export default function CompanyForm({ onClose }: { onClose: () => void }) {
  const { fetchUser } = useAuthStore();
  const { sendMessage } = useAssistantStore();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    role: '',
  });

  const [currentStep, setCurrentStep] = useState<Step>('company_name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/onboard/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed');

      await fetchUser();
      onClose();
    } catch {
      setError('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const value =
      currentStep === 'company_name'
        ? formData.companyName
        : currentStep === 'industry'
        ? formData.industry
        : formData.role;

    if (!value.trim()) {
      setError('This field is required.');
      return;
    }

    setError('');

    sendMessage({
      input: value,
      stage: 'create_company',
      step: currentStep,
    });

    const nextIndex = steps.indexOf(currentStep) + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-4">Create Your Company</h2>

      {currentStep === 'company_name' && (
        <input
          className="w-full border mb-2 p-2"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />
      )}

      {currentStep === 'industry' && (
        <input
          className="w-full border mb-2 p-2"
          placeholder="Industry"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        />
      )}

      {currentStep === 'role' && (
        <input
          className="w-full border mb-2 p-2"
          placeholder="Your Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        onClick={handleNext}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Next'}
      </button>
    </div>
  );
}
