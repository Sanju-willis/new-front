// src\app\test\persona-board\page.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Package,
  Handshake,
  Users,
  Wrench,
  Activity,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface PersonaItem {
  id: string;
  name: string;
  type: 'product' | 'service';
  category: string;
  description: string;
  targetAudience: string[];
  dailyUsers: string[];
  painPoints: string[];
  mainBenefits: string[];
  features: string[];
  useCases: string[];
  topCompetitors: string[];
  pricePositioning: string;
  price: string;
  uniqueSellingPoints: string[];
  logo: string;
}

const initialItems: PersonaItem[] = [
  {
    id: '1',
    name: 'AutoCRO AI',
    type: 'product',
    category: 'Marketing Tech',
    description: 'AI tool to auto-optimize Meta ad conversions for ads and landing pages.',
    targetAudience: ['SaaS Founders', 'Ecom CMOs', 'B2B Growth Teams'],
    dailyUsers: ['Media Buyers', 'Performance Marketers'],
    painPoints: ['Low conversion rates', 'Manual A/B testing', 'Unclear funnel performance'],
    mainBenefits: ['Higher ROI', 'Faster iterations', 'Smarter testing decisions'],
    features: ['Auto headline testing', 'Creative scoring', 'Heatmap insights'],
    useCases: ['Landing page optimization', 'Ad testing', 'Funnel diagnostics'],
    topCompetitors: ['Unbounce', 'Instapage'],
    pricePositioning: 'Premium',
    price: '49',
    uniqueSellingPoints: ['AI-powered testing', 'One-click integration', 'No dev needed'],
    logo: '',
  },
];

export default function PersonaBoardPage() {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<'all' | 'product' | 'service'>('all');
  const [expandedId, setExpandedId] = useState<string>('1');
  const [editKey, setEditKey] = useState<keyof PersonaItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const item = filtered.find(i => i.id === expandedId);
  if (!item) return null;

  const updateField = <T extends keyof PersonaItem>(key: T, value: PersonaItem[T]) => {
    if (key === 'name' && typeof value === 'string' && value.trim() === '') {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
    } else {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, [key]: value } : i));
  };

  const EditableChips = ({ label, field }: { label: string; field: keyof PersonaItem }) => (
    <div onClick={() => setEditKey(field)} className="cursor-pointer">
      <h3 className="font-semibold uppercase text-xs mb-1">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {(item[field] as string[]).map((val, i) => (
          <span key={i} className="rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1">
            {val}
            {editKey === field && (
              <button
                className="ml-1 text-red-500 hover:text-red-700"
                onClick={e => {
                  e.stopPropagation();
                  const updated = [...(item[field] as string[])];
                  updated.splice(i, 1);
                  updateField(field, updated);
                }}
              >×</button>
            )}
          </span>
        ))}
      </div>
      {editKey === field && (
        <Input
          autoFocus
          placeholder={`Add ${label}`}
          className="mt-2"
          onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              updateField(field, [...(item[field] as string[]), e.currentTarget.value.trim()]);
              e.currentTarget.value = '';
            }
          }}
        />
      )}
    </div>
  );

  const Icon = item.type === 'product' ? Package : Handshake;

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
    }, [expandedId]);
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="transition-all duration-300 ease-in-out"
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto min-h-screen">
      <div className="flex gap-2 mb-4">
        {['all', 'product', 'service'].map(type => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            onClick={() => setFilter(type as any)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </Button>
        ))}
      </div>

      <ContentWrapper>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 bg-blue-900 text-white p-3 rounded-xl shadow-sm text-sm space-y-4">
            <div className="flex justify-center">
              <label className="w-20 h-20 rounded-full overflow-hidden border border-blue-300 cursor-pointer bg-white">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) updateField('logo', URL.createObjectURL(file));
                  }}
                />
                {item.logo ? (
                  <img src={item.logo} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-500">
                    <Icon className="w-6 h-6" />
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-1">
              <Input
                value={item.name}
                onChange={e => updateField('name', e.target.value)}
                className="text-sm bg-blue-800 text-white font-semibold"
              />
              {errors.name && <p className="text-red-300 text-xs">{errors.name}</p>}
              <Input
                value={item.type}
                onChange={e => updateField('type', e.target.value as 'product' | 'service')}
                className="text-xs bg-blue-800 text-white"
              />
              <Input
                value={item.category}
                onChange={e => updateField('category', e.target.value)}
                className="text-xs bg-blue-800 text-white"
              />
            </div>

            <div>
              <h3 className="font-semibold uppercase text-xs">Description</h3>
              <Textarea
                value={item.description}
                onChange={e => updateField('description', e.target.value)}
                className="text-sm bg-blue-800 text-white"
                rows={3}
              />
            </div>
            <EditableChips label="Audience" field="targetAudience" />
            <EditableChips label="Users" field="dailyUsers" />
          </div>

          <div className="col-span-3 grid grid-cols-2 gap-3 text-sm">
            <Card className="p-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                <Activity className="w-4 h-4" /> Pain & Benefits
              </div>
              <EditableChips label="Pain Points" field="painPoints" />
              <EditableChips label="Benefits" field="mainBenefits" />
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                <Wrench className="w-4 h-4" /> Features & Use Cases
              </div>
              <EditableChips label="Features" field="features" />
              <EditableChips label="Use Cases" field="useCases" />
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                <Users className="w-4 h-4" /> Market Position
              </div>
              <EditableChips label="Competitors" field="topCompetitors" />
              <div className="mt-2">
                <p><strong>Position:</strong> {item.pricePositioning}</p>
                <p><strong>Price:</strong> ${item.price}</p>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                <Sparkles className="w-4 h-4" /> Why Choose This Product?
              </div>
              <EditableChips label="USPs" field="uniqueSellingPoints" />
            </Card>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
