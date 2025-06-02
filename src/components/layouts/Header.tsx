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
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

export default function Header() {
  const { user} = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-950 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      {/* Left - App Name */}
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        🚀 AI CRO Dashboard
      </h1>

      {/* Right - Avatar Dropdown */}
      {user && (
        <div className="flex items-center space-x-4">
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={16} className="mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={16} className="mr-2" />
                    Dark Mode
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
