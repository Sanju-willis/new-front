'use client';

import { useCompanyData } from '@/hooks/useCompanyData';

export default function CompanyPage() {
  const { data, isLoading, error } = useCompanyData();

  if (isLoading) return <div>Loading company info...</div>;
  if (error || !data) return <div>Error loading company data</div>; // ❗safe guard

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Company Info</h1>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Industry:</strong> {data.industry}</p>
      <p><strong>Description:</strong> {data.description}</p>
    </div>
  );
}
