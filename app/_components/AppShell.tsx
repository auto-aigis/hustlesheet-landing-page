"use client";

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export function AppShell({ children }: Props) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Tax Planner', href: '/dashboard/tax-planner' },
    { label: 'Settings', href: '/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-white">
      <aside className="hidden w-64 border-r border-gray-200 bg-white md:flex flex-col">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-xl font-semibold text-gray-900">HustleSheet</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-gray-100 font-medium text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:hidden">
        <header className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between h-14">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-700 hover:text-gray-900"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900">HustleSheet</h1>
          <div className="w-6" />
        </header>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
        )}
        <nav
          className={`fixed left-0 top-14 z-40 w-64 border-r border-gray-200 bg-white transition-transform ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } space-y-1 p-4`}
        >
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-gray-100 font-medium text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </nav>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <main className="hidden md:block flex-1 overflow-auto">{children}</main>
    </div>
  );
}
