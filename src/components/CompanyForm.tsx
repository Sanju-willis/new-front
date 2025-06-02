// src\components\CompanyForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAssistantStore } from '@/stores/useAssistantStore';

const steps = [ 'company_name', 'industry', 'size', 'type', 'target_market', 'address', 'website', 'description', 'target_audience',
  'role',
] as const;

type Step = typeof steps[number];

const INDUSTRY_OPTIONS = [
  'Healthtech', 'E-commerce', 'SaaS', 'EdTech', 'Fintech', 'Agency', 'AI & ML', 'Other'
];

const TARGET_MARKET_OPTIONS = [
  'B2B', 'B2C', 'Enterprise', 'Small Business', 'Freelancers', 'Developers', 'Healthcare', 'Education'
];

const ROLE_OPTIONS = [
  'Founder', 'CEO', 'CTO', 'CMO', 'Product Manager', 'Marketing Lead', 'Engineer', 'Consultant'
];

export default function CompanyForm({ onClose }: { onClose: () => void }) {
  const { fetchUser } = useAuthStore();
  const { sendMessage } = useAssistantStore();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    targetMarket: '',
    description: '',
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
        : currentStep === 'target_market'
        ? formData.targetMarket
        : currentStep === 'description'
        ? formData.description
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

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setError('');
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
        <select
          className="w-full border mb-2 p-2"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        >
          <option value="">Select Industry</option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {currentStep === 'target_market' && (
        <select
          className="w-full border mb-2 p-2"
          value={formData.targetMarket}
          onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
        >
          <option value="">Select Target Market</option>
          {TARGET_MARKET_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {currentStep === 'description' && (
        <textarea
          className="w-full border mb-2 p-2"
          placeholder="Brief Company Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      )}

      {currentStep === 'role' && (
        <select
          className="w-full border mb-2 p-2"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="">Select Your Role</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
          onClick={handleBack}
          disabled={steps.indexOf(currentStep) === 0 || loading}
        >
          Back
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Next'}
        </button>
      </div>
    </div>
  );
}
