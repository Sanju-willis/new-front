// src\app\test\test-product-profile\page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Handshake, Pencil, SaveIcon, XIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultData = {
  name: 'AutoCRO AI',
  type: 'product',
  category: 'Marketing Tech',
  description: 'AI tool to auto-optimize Meta ad conversions',
  features: ['Auto headline testing', 'Creative scoring', 'Heatmap insights'],
  mainBenefits: ['Higher ROI', 'Faster iterations'],
  painPoints: ['Low conversion rate', 'Manual A/B testing'],
  useCases: ['Landing page optimization', 'Ad testing'],
  targetAudience: ['SaaS founders', 'Ecom CMOs'],
  dailyUsers: ['Media buyers', 'Growth marketers'],
  topCompetitors: ['Unbounce', 'Instapage'],
  uniqueSellingPoints: ['AI-powered testing', 'One-click integration'],
  pricePositioning: 'Premium',
  price: '49'
};

export default function TestProductProfile() {
  const [editMode, setEditMode] = useState(false);
  const [item, setItem] = useState({ ...defaultData });
  const Icon = item.type === 'product' ? Package : Handshake;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (name: keyof typeof item, value: string) => {
    setItem({ ...item, [name]: value.split(',').map(s => s.trim()) });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <h3 className="text-blue-700 font-bold uppercase text-sm">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Test Product Profile Layout (Editable)</h1>

      <Card className="border rounded-xl shadow-sm dark:border-zinc-700">
        <CardContent className="p-0">
          <div className="p-4 flex justify-between items-center border-b dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-lg font-bold">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.category} | {item.type.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button size="sm" variant="ghost" onClick={() => setEditMode(false)}>
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => setEditMode(false)}>
                    <SaveIcon className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-4">
            {/* LEFT */}
            <div className="space-y-6">
              <Section title="Audience">
                {editMode ? (
                  <>
                    <Textarea
                      name="targetAudience"
                      value={item.targetAudience.join(', ')}
                      onChange={(e) => handleArrayChange('targetAudience', e.target.value)}
                    />
                    <Textarea
                      name="dailyUsers"
                      value={item.dailyUsers.join(', ')}
                      onChange={(e) => handleArrayChange('dailyUsers', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p><strong>Target:</strong> {item.targetAudience.join(', ')}</p>
                    <p><strong>Users:</strong> {item.dailyUsers.join(', ')}</p>
                  </>
                )}
              </Section>

              <Section title="Problem & Benefits">
                {editMode ? (
                  <>
                    <Textarea
                      name="painPoints"
                      value={item.painPoints.join(', ')}
                      onChange={(e) => handleArrayChange('painPoints', e.target.value)}
                    />
                    <Textarea
                      name="mainBenefits"
                      value={item.mainBenefits.join(', ')}
                      onChange={(e) => handleArrayChange('mainBenefits', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p><strong>Pain Points:</strong> {item.painPoints.join(', ')}</p>
                    <p><strong>Benefits:</strong> {item.mainBenefits.join(', ')}</p>
                  </>
                )}
              </Section>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Section title="Features & Use Cases">
                {editMode ? (
                  <>
                    <Textarea
                      name="features"
                      value={item.features.join(', ')}
                      onChange={(e) => handleArrayChange('features', e.target.value)}
                    />
                    <Textarea
                      name="useCases"
                      value={item.useCases.join(', ')}
                      onChange={(e) => handleArrayChange('useCases', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p><strong>Features:</strong> {item.features.join(', ')}</p>
                    <p><strong>Use Cases:</strong> {item.useCases.join(', ')}</p>
                  </>
                )}
              </Section>

              <Section title="Competitors & Pricing">
                {editMode ? (
                  <>
                    <Textarea
                      name="topCompetitors"
                      value={item.topCompetitors.join(', ')}
                      onChange={(e) => handleArrayChange('topCompetitors', e.target.value)}
                    />
                    <Input
                      name="pricePositioning"
                      value={item.pricePositioning}
                      onChange={(e) => handleChange(e)}
                    />
                    <Input
                      name="price"
                      value={item.price}
                      onChange={(e) => handleChange(e)}
                    />
                  </>
                ) : (
                  <>
                    <p><strong>Competitors:</strong> {item.topCompetitors.join(', ')}</p>
                    <p><strong>Position:</strong> {item.pricePositioning}</p>
                    <p><strong>Price:</strong> ${item.price}</p>
                  </>
                )}
              </Section>
            </div>
          </div>

          <div className="bg-orange-500 text-white p-4 text-sm font-semibold border-t">
            {item.uniqueSellingPoints.map((usp, i) => (
              <div key={i}>• {usp}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
