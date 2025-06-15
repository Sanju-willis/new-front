// src\components\layouts\Header.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogOut,
  User,
  Moon,
  Sun,
  Settings,
  CreditCard,
  Users,
  Plug,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

export default function Header() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-950 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        🚀 AI CRO Dashboard
      </h1>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition">
              <AvatarImage
                src={user.photo || '/avatar.png'}
                alt={user.name}
              />
              <AvatarFallback>
                <User size={16} />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex flex-col space-y-0.5">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
               <Link href="/dashboard/profile" className="flex items-center">
    <User size={16} className="mr-2" />
    Profile
  </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center">
                <Settings size={16} className="mr-2" /> Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing" className="flex items-center">
                <CreditCard size={16} className="mr-2" /> Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/team" className="flex items-center">
                <Users size={16} className="mr-2" /> Team
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/integrations" className="flex items-center">
                <Plug size={16} className="mr-2" /> Integrations
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center">
                <LifeBuoy size={16} className="mr-2" /> Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/changelog" className="flex items-center">
                <Sparkles size={16} className="mr-2" /> What's New
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="mr-2" /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={16} className="mr-2" /> Dark Mode
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut size={16} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}