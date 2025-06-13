// src\app\dashboard\pages\ProductsPage.tsx
'use client';

import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package, Handshake, Pencil, SaveIcon, XIcon, Trash2, RefreshCw,} from 'lucide-react';
import clsx from 'clsx';
import type { ItemType, RawItem } from '@/types/item';
import { ProductFilterBar } from '@/components/products/ProductFilterBar';
import { apiPage } from '@/helpers/apiPages';


// These two arrays drive BOTH edit-mode and display-mode rendering:
const LEFT_FIELDS: Array<{
  key: keyof RawItem;
  label: string;
  type: 'input' | 'textarea' | 'select';
  placeholder?: string;
  options?: ItemType[];
}> = [
  { key: 'image', label: 'Logo URL', type: 'input', placeholder: 'Image URL (opt.)' },
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Name' },
  { key: 'type', label: 'Type', type: 'select', options: ['product', 'service'] },
  { key: 'category', label: 'Category', type: 'input', placeholder: 'Category' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description' },
  { key: 'painPoints', label: 'Pain Points', type: 'textarea', placeholder: 'Comma–separated' },
  { key: 'mainBenefits', label: 'Benefits', type: 'textarea', placeholder: 'Comma–separated' },
  { key: 'targetAudience', label: 'Target Audience', type: 'textarea', placeholder: 'Comma–separated' },
  { key: 'dailyUsers', label: 'Users', type: 'textarea', placeholder: 'Comma–separated' },
];

const RIGHT_FIELDS: Array<{
  key: keyof RawItem;
  label: string;
  type: 'input' | 'textarea';
  placeholder?: string;
}> = [
  { key: 'features', label: 'Features', type: 'textarea', placeholder: 'Comma–separated' },
  { key: 'useCases', label: 'Use Cases', type: 'textarea', placeholder: 'Comma–separated' },
  { key: 'topCompetitors', label: 'Competitors', type: 'textarea', placeholder: 'Comma–separated' },
  { key: 'pricePositioning', label: 'Positioning', type: 'input', placeholder: 'e.g. Premium' },
  { key: 'price', label: 'Price ($)', type: 'input', placeholder: 'e.g. 49' },
  { key: 'uniqueSellingPoints', label: 'USPs', type: 'textarea', placeholder: 'Comma–separated' },
];

export default function ProductsPage() {
  const { data, isLoading, error, refetch, isFetching } = useItems();
  const [filter, setFilter] = useState<'all' | 'product' | 'service'>('all');
  const [editModeId, setEditModeId] = useState<string | 'new' | null>(null);

  // editedItem state holds *all* fields as comma-joined strings (for arrays)
  const [editedItem, setEditedItem] = useState<Record<string, any>>({});

  // When user clicks “Add New”
  const handleAddClick = () => {
    setEditModeId('new');
    setEditedItem({
      name: '',
      type: 'product',
      category: '',
      description: '',
      painPoints: '',
      mainBenefits: '',
      features: '',
      useCases: '',
      targetAudience: '',
      dailyUsers: '',
      topCompetitors: '',
      pricePositioning: '',
      price: '',
      uniqueSellingPoints: '',
      image: '',
    });
  };

  // When user clicks “Edit” on an existing item
  const toggleEdit = (item: RawItem) => {
    setEditModeId(item._id!);
    // Flatten arrays into comma-strings
    setEditedItem({
      ...item,
      painPoints: (item.painPoints || []).join(', '),
      mainBenefits: (item.mainBenefits || []).join(', '),
      features: (item.features || []).join(', '),
      useCases: (item.useCases || []).join(', '),
      targetAudience: (item.targetAudience || []).join(', '),
      dailyUsers: (item.dailyUsers || []).join(', '),
      topCompetitors: (item.topCompetitors || []).join(', '),
      uniqueSellingPoints: (item.uniqueSellingPoints || []).join(', '),
      price: item.price?.toString() || '',
      image: item.image || '',
      featurePainMap: item.featurePainMap
        ?.map((f) => `${f.feature}=>${f.solves}`)
        .join(', ') || '',
    });
  };

  // Unified onChange for any field
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  // Save (POST or PATCH depending on “new” vs existing)
  const handleSave = async () => {
    // Build payload: convert comma-strings into arrays or number
    const payload: any = {};
    for (const field of LEFT_FIELDS.concat(RIGHT_FIELDS)) {
      const key = field.key as string;
      const val = editedItem[key] ?? '';
      if (
        [
          'painPoints',
          'mainBenefits',
          'features',
          'useCases',
          'targetAudience',
          'dailyUsers',
          'topCompetitors',
          'uniqueSellingPoints',
        ].includes(key)
      ) {
        payload[key] = (val as string)
          .split(',')
          .map((s) => s.trim())
          .filter((x) => x);
      } else if (key === 'price') {
        payload.price = Number(val) || 0;
      } else {
        payload[key] = val;
      }
    }

    let res;
    if (editModeId === 'new') {
      res = await apiPage.createItem(payload); // ✅ POST
    } else if (editModeId && editModeId !== 'new') {
      res = await apiPage.updateItem(editModeId, payload); // ✅ PATCH
    }

    if (res?.ok) {
      setEditModeId(null);
      refetch();
    } else {
      alert('❌ Failed to save item');
    }
  };
  // Delete an item
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await apiPage.deleteItem(id); // ✅ helper used

    if (res.ok) {
      refetch();
    } else {
      alert('❌ Failed to delete');
    }
  };

  if (isLoading) return <div className="p-4">Loading items…</div>;
  if (error || !data)
    return <div className="p-4 text-red-500">Error loading items</div>;

  // Filter data
  const filteredData =
    filter === 'all' ? data : data.filter((i: any) => i.type === filter);

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      <ProductFilterBar
  currentFilter={filter}
  onFilterChange={setFilter}
  onAddClick={handleAddClick}
/>

      {/* If adding new: show a blank “edit” card first */}
      {editModeId === 'new' && (
        <Card className="rounded-2xl overflow-hidden shadow border">
          <CardContent className="p-0">
            {/* HEADER BAR */}
            <div className="flex items-center justify-between bg-white p-4 border-b">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-lg font-semibold">New Item</div>
                  <div className="text-sm text-zinc-500">— | NEW</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditModeId(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <SaveIcon className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>

            {/* FORM GRID */}
            <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {LEFT_FIELDS.map(({ key, label, type, placeholder, options }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label htmlFor={key} className="text-xs font-semibold">
                      {label}
                    </label>
                    {type === 'input' && (
                      <Input
                        id={key}
                        name={key}
                        value={editedItem[key] || ''}
                        onChange={handleChange}
                        placeholder={placeholder}
                      />
                    )}
                    {type === 'textarea' && (
                      <Textarea
                        id={key}
                        name={key}
                        value={editedItem[key] || ''}
                        onChange={handleChange}
                        placeholder={placeholder}
                      />
                    )}
                    {type === 'select' && options && (
                      <select
                        id={key}
                        name={key}
                        value={editedItem[key]}
                        onChange={handleChange}
                        className="bg-white text-black rounded px-2 py-1"
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {RIGHT_FIELDS.map(({ key, label, type, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label htmlFor={key} className="text-xs font-semibold">
                      {label}
                    </label>
                    {type === 'input' && (
                      <Input
                        id={key}
                        name={key}
                        value={editedItem[key] || ''}
                        onChange={handleChange}
                        placeholder={placeholder}
                      />
                    )}
                    {type === 'textarea' && (
                      <Textarea
                        id={key}
                        name={key}
                        value={editedItem[key] || ''}
                        onChange={handleChange}
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LIST OF EXISTING ITEMS */}
      {filteredData.map((item: any) => {
        const isEditing = editModeId === item._id;
        const Icon = (item.type === 'product' ? Package : Handshake) as any;

        return (
          <Card
            key={item._id}
            className="rounded-2xl overflow-hidden shadow border"
          >
            <CardContent className="p-0">
              {/* HEADER BAR */}
              <div className="flex items-center justify-between bg-white p-4 border-b">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                  <div>
                    {!isEditing && (
                      <>
                        <div className="text-lg font-semibold">{item.name}</div>
                        <div className="text-sm text-zinc-500">
                          {item.category || '—'} | {item.type.toUpperCase()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleEdit(item)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditModeId(null)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <SaveIcon className="w-4 h-4 mr-1" /> Save
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* EDIT MODE FORM or DISPLAY MODE */}
              {isEditing ? (
                <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
                  {/* Reuse the same LEFT_FIELDS / RIGHT_FIELDS logic */}
                  <div className="space-y-4">
                    {LEFT_FIELDS.map(({ key, label, type, placeholder, options }) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label htmlFor={key} className="text-xs font-semibold">
                          {label}
                        </label>
                        {type === 'input' && (
                          <Input
                            id={key}
                            name={key}
                            value={editedItem[key] || ''}
                            onChange={handleChange}
                            placeholder={placeholder}
                          />
                        )}
                        {type === 'textarea' && (
                          <Textarea
                            id={key}
                            name={key}
                            value={editedItem[key] || ''}
                            onChange={handleChange}
                            placeholder={placeholder}
                          />
                        )}
                        {type === 'select' && options && (
                          <select
                            id={key}
                            name={key}
                            value={editedItem[key]}
                            onChange={handleChange}
                            className="bg-white text-black rounded px-2 py-1"
                          >
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {RIGHT_FIELDS.map(({ key, label, type, placeholder }) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label htmlFor={key} className="text-xs font-semibold">
                          {label}
                        </label>
                        {type === 'input' && (
                          <Input
                            id={key}
                            name={key}
                            value={editedItem[key] || ''}
                            onChange={handleChange}
                            placeholder={placeholder}
                          />
                        )}
                        {type === 'textarea' && (
                          <Textarea
                            id={key}
                            name={key}
                            value={editedItem[key] || ''}
                            onChange={handleChange}
                            placeholder={placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
                  {/* LEFT DISPLAY */}
                  <div className="space-y-2">
                    <h3 className="text-blue-700 font-bold uppercase text-xs">
                      🎯 Audience &amp; Benefits
                    </h3>
                    <p>
                      <strong>🎯 Target:</strong>{' '}
                      {(item.targetAudience || []).join(', ') || '—'}
                    </p>
                    <p>
                      <strong>👥 Users:</strong> {(item.dailyUsers || []).join(', ') ||
                        '—'}
                    </p>
                    <p>
                      <strong>🥵 Pain:</strong> {(item.painPoints || []).join(', ') ||
                        '—'}
                    </p>
                    <p>
                      <strong>🚀 Benefits:</strong> {(item.mainBenefits || []).join(', ') ||
                        '—'}
                    </p>
                    <p>
                      <strong>📝 Description:</strong> {item.description || '—'}
                    </p>
                    <p>
                      <strong>🏷 Category:</strong> {item.category || '—'}
                    </p>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="product preview"
                        className="w-full max-w-xs rounded mt-2"
                      />
                    )}
                  </div>

                  {/* RIGHT DISPLAY */}
                  <div className="space-y-2">
                    <h3 className="text-blue-700 font-bold uppercase text-xs">
                      🧩 Features &amp; Positioning
                    </h3>
                    <p>
                      <strong>🔧 Features:</strong> {(item.features || []).join(', ') ||
                        '—'}
                    </p>
                    <p>
                      <strong>📌 Use Cases:</strong> {(item.useCases || []).join(', ') ||
                        '—'}
                    </p>
                    <p>
                      <strong>⚔ Competitors:</strong> {(item.topCompetitors ||
                        []).join(', ') || '—'}
                    </p>
                    <p>
                      <strong>💰 Position:</strong> {item.pricePositioning || '—'}{' '}
                      - ${item.price ?? '—'}
                    </p>
                    <p>
                      <strong>✨ USPs:</strong> {(item.uniqueSellingPoints ||
                        []).join(', ') || 'No USPs yet'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* REFRESH BUTTON */}
      <Button onClick={() => refetch()} className="mt-6 flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Refresh {isFetching && '...'}
      </Button>
    </div>
  );
}
