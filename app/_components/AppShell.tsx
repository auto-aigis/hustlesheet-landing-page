"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, LayoutDashboard, Calculator, FileText, CreditCard, Settings, BarChart3, ChevronRight } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Income Setup', href: '/income', icon: Calculator },
  { label: 'Tax Summary', href: '/summary', icon: FileText },
  { label: 'AIS', href: '/ais', icon: BarChart3 },
  { label: 'Pricing', href: '/pricing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
];

function PlanBadge({ plan }: { plan: string }) {
  if (plan === 'free') return null;
  const label = plan === 'premium_monthly' ? 'Premium' : 'Pro';
  return <Badge className="text-xs bg-blue-100 text-blue-700 ml-auto">{label}</Badge>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, subscription, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && !user.is_onboarded && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [user, loading, pathname, router]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto" style={{borderWidth: 3}} />
          <p className="text-gray-500 text-sm">Loading HustleSheet…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const NavContent = () => (
    <>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors text-sm ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              <span className="flex-1">{label}</span>
              {label === 'Pricing' && subscription?.plan === 'free' && (
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Upgrade</span>
              )}
              {isActive && <ChevronRight size={14} className="text-blue-400" />}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-3 space-y-2">
        {subscription && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-700">{user.email[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs font-medium text-gray-700 capitalize">
                {subscription.plan === 'free' ? 'Free Plan' :
                 subscription.plan === 'pro_monthly' ? 'Pro Monthly' :
                 subscription.plan === 'pro_annual' ? 'Pro Annual' : 'Premium'}
              </p>
            </div>
          </div>
        )}
        <Button onClick={logout} variant="outline" size="sm" className="w-full text-gray-600 text-xs">
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-56 md:flex md:flex-col md:border-r md:border-gray-200 md:bg-white z-20">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">HustleSheet</h1>
              <p className="text-xs text-gray-400">FY2024-25</p>
            </div>
          </div>
        </div>
        <NavContent />
      </aside>

      <div className="md:ml-56 w-full flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="text-base font-bold text-gray-900">HustleSheet</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-600 p-1">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <>
            <div className="fixed inset-0 top-14 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
            <div className="fixed left-0 top-14 z-50 w-56 h-[calc(100vh-56px)] bg-white border-r border-gray-200 flex flex-col shadow-xl">
              <NavContent />
            </div>
          </>
        )}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
