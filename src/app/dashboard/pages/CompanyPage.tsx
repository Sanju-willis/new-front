'use client';

import { useState, useEffect } from 'react';
import { useCompanyData } from '@/hooks/useCompanyData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function CompanyPage() {
  const { data, isLoading, error, refetch, isFetching } = useCompanyData();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setIndustry(data.industry || '');
      setDescription(data.description || '');
    }
  }, [data]);

  const handleUpdate = async () => {
    setStatus('saving');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patch/company`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, industry, description }),
    });

    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) await refetch();
  };

  if (isLoading) return <div className="p-4">Loading company info...</div>;
  if (error || !data) return <div className="p-4 text-red-500">Error loading company data</div>;

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardContent className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Company Profile</h1>

        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Company Name"
        />
        <Input
          value={industry}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
          placeholder="Industry"
        />
        <Textarea
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Company Description"
        />

        <div className="flex items-center gap-2">
          <Button onClick={handleUpdate} disabled={status === 'saving'}>
            {status === 'saving' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" /> Saving...
              </span>
            ) : (
              'Update'
            )}
          </Button>

          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            🔄 Refresh {isFetching && <Loader2 className="animate-spin h-4 w-4 ml-1" />}
          </Button>

          {status === 'success' && <span className="text-green-600">Saved!</span>}
          {status === 'error' && <span className="text-red-500">Failed to save</span>}
        </div>
      </CardContent>
    </Card>
  );
}
