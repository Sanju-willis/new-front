// src\hooks\useProductEditor.ts
import { useState } from 'react';
import { LEFT_FIELDS, RIGHT_FIELDS } from '@/constants/fieldsConfig';

export const useProductEditor = (refetch: () => void) => {
  const [editModeId, setEditModeId] = useState<string | 'new' | null>(null);
  const [editedItem, setEditedItem] = useState<Record<string, any>>({});

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

  const toggleEdit = (item: any) => {
    setEditModeId(item._id);
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
        ?.map((f: any) => `${f.feature}=>${f.solves}`)
        .join(', ') || '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
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
      res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/items`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: editModeId, ...payload }),
      });
    }

    if (res?.ok) {
      setEditModeId(null);
      refetch();
    } else {
      alert('❌ Failed to save item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/items/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if (res.ok) {
      refetch();
    } else {
      alert('❌ Failed to delete');
    }
  };

  return {
    editModeId,
    editedItem,
    setEditModeId,
    handleAddClick,
    toggleEdit,
    handleChange,
    handleSave,
    handleDelete,
  };
};
