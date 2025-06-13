// src\app\dashboard\pages\CompanyPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCompanyData } from '@/hooks/useCompanyData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { apiPage } from '@/helpers/apiPages'; // at the top


export default function CompanyPage() {
  const { data, isLoading, error, refetch, isFetching } = useCompanyData();
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const [form, setForm] = useState({
    name: '', industry: '', size: '', type: '', targetMarket: '',
    address: '', website: '', description: '', brandGuideUrl: '',
    logoAssetsUrl: '', pressKitUrl: '', portfolioUrl: '', contentLibraryUrl: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        industry: data.industry || '',
        size: data.size || '',
        type: data.type || '',
        targetMarket: data.targetMarket || '',
        address: data.address || '',
        website: data.website || '',
        description: data.description || '',
        brandGuideUrl: data.brandGuideUrl || '',
        logoAssetsUrl: data.logoAssetsUrl || '',
        pressKitUrl: data.pressKitUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        contentLibraryUrl: data.contentLibraryUrl || '',
      });
    }
  }, [data]);

 const handleUpdate = async () => {
  setStatus('saving');
  try {
    await apiPage.updateCompany(form); // ✅ use helper function
    setStatus('success');
    await refetch();
  } catch {
    setStatus('error');
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="p-4">Loading company info...</div>;
  if (error || !data) return <div className="p-4 text-red-500">Error loading company data</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>🧾 Basic Info</CardTitle>
          <CardDescription>General information about your company</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Company Name" />
          <Input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry" />
          <Input name="size" value={form.size} onChange={handleChange} placeholder="Company Size" />
          <Input name="type" value={form.type} onChange={handleChange} placeholder="Business Type (B2B/B2C)" />
          <Input name="targetMarket" value={form.targetMarket} onChange={handleChange} placeholder="Target Market" />
          <Input name="address" value={form.address} onChange={handleChange} placeholder="Company Address" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🌐 Online Presence</CardTitle>
          <CardDescription>Where users can find your business online</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input name="website" value={form.website} onChange={handleChange} placeholder="Website URL" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📄 Branding & Assets</CardTitle>
          <CardDescription>Share your media and brand guidelines</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="brandGuideUrl" value={form.brandGuideUrl} onChange={handleChange} placeholder="Brand Guide URL" />
          <Input name="logoAssetsUrl" value={form.logoAssetsUrl} onChange={handleChange} placeholder="Logo Assets URL" />
          <Input name="pressKitUrl" value={form.pressKitUrl} onChange={handleChange} placeholder="Press Kit URL" />
          <Input name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} placeholder="Portfolio URL" />
          <Input name="contentLibraryUrl" value={form.contentLibraryUrl} onChange={handleChange} placeholder="Content Library URL" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧠 Description</CardTitle>
          <CardDescription>Explain what your company does</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Company Description" rows={4} />
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
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
    </div>
  );
}