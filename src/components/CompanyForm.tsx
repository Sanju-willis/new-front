// src\components\CompanyForm.tsx

'use client';

import { useState } from 'react';
import { useAuthStore, useAssistantStore } from '@/stores';
import { Input, Button, Textarea , Select, SelectTrigger, SelectValue, SelectContent, SelectItem, ScrollArea} from '@/components/ui';
import { cn } from '@/lib/utils';
import { CompanyFormType } from '@/types/companyFormTypes';
import { apiForm } from '@/helpers/apiForm';
import { defaultCompanyForm } from '@/constants/defaultCompanyForm';


const industries = ['SaaS', 'E-commerce', 'Healthcare', 'Fintech'];
const sizes = ['1-10', '11-50', '51-200'];
const types = ['B2B', 'B2C'];
const roles = ['Founder', 'CEO', 'CMO'];
const audiences = ['Small Businesses', 'Enterprise'];

export default function CompanyForm({ onClose }: { onClose: () => void }) {
  const { fetchUser } = useAuthStore();
  const { sendMessage } = useAssistantStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CompanyFormType>(defaultCompanyForm);
  
 const handleChange = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  const updatedForm = { ...form, [name]: value };
  setForm(updatedForm);

  await sendMessage({
    input: `${name}: ${value}`,
    step: `step_${step}`,
    stage: 'create_company',
  });
};

const handleListChange = async (
  index: number,
  value: string,
  key: 'socialLinks' | 'productPages'
) => {
  const updated = [...form[key]];
  updated[index] = value;
  const updatedForm = { ...form, [key]: updated };
  setForm(updatedForm);

  await sendMessage({
    input: `${key}[${index}]: ${value}`,
    step: `step_${step}`,
    stage: 'create_company',
  });
};

const handleItemChange = async (
  index: number,
  field: 'name' | 'type',
  value: string
) => {
  const updated = [...form.items];
  updated[index][field] = value as 'product' | 'service';
  const updatedForm = { ...form, items: updated };
  setForm(updatedForm);

  await sendMessage({
    input: `Item[${index}].${field}: ${value}`,
    step: `step_${step}`,
    stage: 'create_company',
  });
};
const handleSelectChange = async (key: keyof CompanyFormType, value: string) => {
  const updatedForm = { ...form, [key]: value };
  setForm(updatedForm);

  await sendMessage({
    input: `${key}: ${value}`,
    step: `step_${step}`,
    stage: 'create_company',
  });
};


  const handleAddField = (key: 'socialLinks' | 'productPages' | 'items') => {
    if (key === 'items') {
      setForm({ ...form, items: [...form.items, { name: '', type: 'product' }] });
    } else {
      setForm({ ...form, [key]: [...form[key], ''] });
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
  try {
    await apiForm.submitCompanyForm(form);
    await fetchUser();
    onClose();
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

  const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <div className="space-y-3">
          <Input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />

          <Select value={form.industry} onValueChange={(val) => handleSelectChange('industry', val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select Industry" /></SelectTrigger>
            <SelectContent>
              {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={form.size} onValueChange={(val) => handleSelectChange('size', val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Company Size" /></SelectTrigger>
            <SelectContent>
              {sizes.map(sz => <SelectItem key={sz} value={sz}>{sz}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={form.type} onValueChange={(val) => handleSelectChange('type', val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Business Type" /></SelectTrigger>
            <SelectContent>
              {types.map(tp => <SelectItem key={tp} value={tp}>{tp}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      );

    case 2:
      return (
        <div className="space-y-3">
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <Input name="website" placeholder="Website" value={form.website} onChange={handleChange} />

          {form.socialLinks.map((link, i) => (
            <Input key={i} placeholder={`Social Link ${i + 1}`} value={link} onChange={e => handleListChange(i, e.target.value, 'socialLinks')} />
          ))}
          <Button onClick={() => handleAddField('socialLinks')} variant="outline">+ Add Social</Button>

          {['brandGuideUrl', 'logoAssetsUrl', 'pressKitUrl', 'portfolioUrl', 'contentLibraryUrl'].map(field => (
            <Input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              value={form[field as keyof typeof form] as string}
              onChange={handleChange}
            />
          ))}

          {form.productPages.map((page, i) => (
            <Input key={i} placeholder={`Product Page ${i + 1}`} value={page} onChange={e => handleListChange(i, e.target.value, 'productPages')} />
          ))}
          <Button onClick={() => handleAddField('productPages')} variant="outline">+ Add Product Page</Button>
        </div>
      );

    case 3:
      return (
        <div className="space-y-3">
          <Select value={form.userRole} onValueChange={(val) => handleSelectChange('userRole', val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Your Role" /></SelectTrigger>
            <SelectContent>
              {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Textarea name="description" placeholder="Company Description" value={form.description} onChange={handleChange} rows={4} />

          <Select value={form.targetAudience} onValueChange={(val) => handleSelectChange('targetAudience', val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Target Audience" /></SelectTrigger>
            <SelectContent>
              {audiences.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      );

    case 4:
      return (
        <div className="space-y-3">
          {form.items.map((item, i) => (
           <div key={i} className="flex gap-2 items-center">
  <Input
    placeholder="Item Name"
    value={item.name}
    onChange={e => handleItemChange(i, 'name', e.target.value)}
    className="flex-1"
  />
  <Select value={item.type} onValueChange={(val) => handleItemChange(i, 'type', val)}>
    <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="product">Product</SelectItem>
      <SelectItem value="service">Service</SelectItem>
    </SelectContent>
  </Select>
</div>
          ))}
          <Button onClick={() => handleAddField('items')} variant="outline">+ Add Item</Button>
        </div>
      );
  }
};


  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl w-full max-w-md shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold">🚀 Company Onboarding</h2>
        <ScrollArea className="max-h-[60vh] pr-2">
          {renderStep()}
        </ScrollArea>
        <div className="flex flex-row justify-between gap-2">
          {step > 1 && <Button variant="ghost" onClick={handleBack}>← Back</Button>}
          {step < 4 ? (
            <Button onClick={handleNext} className="ml-auto">Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">Finish & Save</Button>
          )}
        </div>
      </div>
    </div>
  );
}