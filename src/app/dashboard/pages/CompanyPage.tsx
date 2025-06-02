// src\app\dashboard\pages\CompanyPage.tsx
'use client';
import { useState, useEffect } from 'react';
import { useCompanyData } from '@/hooks/useCompanyData';

export default function CompanyPage() {
const { data, isLoading, error, refetch, isFetching } = useCompanyData();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');

  // ✅ Safe state sync once data is fetched
  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setIndustry(data.industry || '');
      setDescription(data.description || '');
    }
  }, [data]);

  const handleUpdate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patch/company`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, industry, description }),
    });

    if (res.ok) {
      alert('✅ Company updated!');
      location.reload();
    } else {
      alert('❌ Failed to update company');
    }
  };

  if (isLoading) return <div>Loading company info...</div>;
  if (error || !data) return <div>Error loading company data</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Edit Company Info</h1>
      <div className="space-y-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 w-full" />
        <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Industry" className="border p-2 w-full" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full" />
        <button onClick={handleUpdate} className="bg-black text-white px-4 py-2 rounded">Update</button>
      </div>
      <button
  onClick={() => refetch()}
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  🔄 Refresh Company Data {isFetching && '...'}
</button>

    </div>
  );
}
