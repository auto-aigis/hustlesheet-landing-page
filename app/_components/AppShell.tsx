"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Income Setup', href: '/income' },
  { label: 'Tax Summary', href: '/summary' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Settings', href: '/settings' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">HustleSheet</h1>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
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

      <div className="md:ml-64 w-full md:w-auto">
        <div className="md:hidden h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
          <h1 className="text-lg font-semibold text-gray-900">HustleSheet</h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-700 hover:text-gray-900"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 top-14 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed left-0 top-14 z-50 w-64 h-screen bg-white border-r border-gray-200 shadow-lg">
              <nav className="space-y-2 p-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="border-t border-gray-200 p-4 absolute bottom-0 w-full">
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          </>
        )}

        <main className="md:p-8 p-4">{children}</main>
      </div>
    </div>
  );
}