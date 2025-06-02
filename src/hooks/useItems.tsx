// src\hooks\useItems.tsx
import { useQuery } from '@tanstack/react-query';

const fetchItems = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/items`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
};

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
