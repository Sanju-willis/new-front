// src\hooks\useCompanyData.tsx
import { useQuery } from '@tanstack/react-query';

const fetchCompany = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/company`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch company data');

  const json = await res.json();
  console.log('[useCompanyData] response:', json);
  return json; // ✅ RETURN it here!
};


export function useCompanyData() {
  return useQuery({
    queryKey: ['company'],
    queryFn: fetchCompany,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
