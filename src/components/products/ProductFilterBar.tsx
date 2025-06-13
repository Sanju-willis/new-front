// src\components\products\ProductFilterBar.tsx
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ProductFilterBarProps {
  currentFilter: 'all' | 'product' | 'service';
  onFilterChange: (filter: 'all' | 'product' | 'service') => void;
  onAddClick: () => void;
}

export function ProductFilterBar({ currentFilter, onFilterChange, onAddClick,}: ProductFilterBarProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">🧠 Product &amp; Service Profiles</h1>
      <div className="flex gap-2">
        <Button
          variant={currentFilter === 'all' ? 'default' : 'outline'}
          onClick={() => onFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={currentFilter === 'product' ? 'default' : 'outline'}
          onClick={() => onFilterChange('product')}
        >
          Products
        </Button>
        <Button
          variant={currentFilter === 'service' ? 'default' : 'outline'}
          onClick={() => onFilterChange('service')}
        >
          Services
        </Button>
        <Button onClick={onAddClick} className="flex items-center gap-1">
          <PlusCircle className="w-4 h-4" /> Add New
        </Button>
      </div>
    </div>
  );
}
