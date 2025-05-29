// src/components/CompanyForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAssistantStore } from '@/stores/useAssistantStore';

export default function CompanyForm({ onClose }: { onClose: () => void }) {
  const { fetchUser } = useAuthStore();
  const { sendMessage } = useAssistantStore();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const { companyName, industry, role } = formData;

    if (!companyName.trim() || !industry.trim() || !role.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/onboarding/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed');

      await fetchUser(); // refresh store
      onClose();
    } catch {
      setError('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-4">Create Your Company</h2>
      <input
        className="w-full border mb-2 p-2"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={(e) => {
  const value = e.target.value;
  setFormData({ ...formData, companyName: value });
  sendMessage({
    input: value,
    stage: 'create_company',
    step: 'company_name',
  });
}}

      />
      <input
        className="w-full border mb-2 p-2"
        placeholder="Industry"
        value={formData.industry}
onChange={(e) => {
  const value = e.target.value;
  setFormData({ ...formData, industry: value });
  sendMessage({
    input: value,
    stage: 'create_company',
    step: 'industry',
  });
}}
      />
      <input
        className="w-full border mb-2 p-2"
        placeholder="Your Role"
        value={formData.role}
onChange={(e) => {
  const value = e.target.value;
  setFormData({ ...formData, role: value });
  sendMessage({
    input: value,
    stage: 'create_company',
    step: 'role',
  });
}}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
