"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/expenses', label: 'Expenses' },
  { href: '/pricing', label: 'Billing' },
  { href: '/settings', label: 'Settings' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-white">Loading...</div>;
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-0 z-40 md:hidden">
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform md:translate-x-0 z-50 flex flex-col"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">HustleSheet</h1>
        </div>
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full text-left px-4 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-gray-100 font-medium text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-gray-900 border-gray-200"
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 md:hidden z-30 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-900"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="flex-1 text-center font-bold text-gray-900">HustleSheet</h1>
      </div>

      <div className="flex-1 md:ml-64 pt-0 md:pt-0">
        <div className="md:pt-0 pt-14">
          {children}
        </div>
      </div>
    </div>
  );
}
