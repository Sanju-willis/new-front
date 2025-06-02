// src\components\layouts\Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Home, Building2, Boxes, Layers3, Settings, ChevronLeft, ChevronRight,Target } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onChange: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'products', label: 'Products', icon: Boxes },
    { id: 'campaigns', label: 'Campaigns', icon: Target }, // ← Add this

  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, onChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, [collapsed]);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-white h-[calc(100vh-64px)] p-3 flex flex-col border-r border-gray-800 transition-all duration-300`}
    >
      {/* Collapse/Expand Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <ul className="space-y-1 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                className={`group flex items-center gap-3 w-full text-left rounded-md px-3 py-2 transition-colors
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
