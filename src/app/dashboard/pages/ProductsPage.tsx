// src\app\dashboard\pages\ProductsPage.tsx
'use client';

import { useItems } from '@/hooks/useItems';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, RefreshCwIcon, Package, Handshake } from 'lucide-react';

export default function ProductsPage() {
  const { data, isLoading, error, refetch, isFetching } = useItems();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<{ name: string; type: 'product' | 'service' }>({
    name: '',
    type: 'product',
  });

  const handleEditClick = (item: any) => {
    setEditingId(item._id);
    setEditedItem({ name: item.name, type: item.type });
  };

  const handleSave = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/items`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: editingId, ...editedItem }),
    });

    if (res.ok) {
      setEditingId(null);
      refetch();
    } else {
      alert('❌ Failed to update item');
    }
  };

  if (isLoading) return <div className="p-4">Loading items...</div>;
  if (error || !data) return <div className="p-4 text-red-500">Error loading items</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Offerings</h1>

      {data.length === 0 ? (
        <div className="text-gray-500">No items added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item: any) => {
            const isEditing = editingId === item._id;
            const Icon = item.type === 'product' ? Package : Handshake;

            return (
              <Card key={item._id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    {isEditing ? (
                      <Input
                        value={editedItem.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditedItem({ ...editedItem, name: e.target.value })
                        }
                      />
                    ) : (
                      <h2 className="font-semibold">{item.name}</h2>
                    )}
                  </div>

                  {isEditing ? (
                    <select
                      value={editedItem.type}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          type: e.target.value as 'product' | 'service',
                        })
                      }
                      className="border p-2 rounded w-full"
                    >
                      <option value="product">Product</option>
                      <option value="service">Service</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                  )}

                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <Button size="sm" onClick={handleSave}>
                        ✅ Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(item)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Button onClick={() => refetch()} className="flex items-center gap-2">
        <RefreshCwIcon className="w-4 h-4" />
        Refresh
        {isFetching && '...'}
      </Button>
    </div>
  );
}
