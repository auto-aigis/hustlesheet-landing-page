"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "AIS Reconciliation", href: "/dashboard/ais" },
    { label: "Pricing", href: "/pricing" },
    { label: "Settings", href: "/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden md:fixed md:left-0 md:top-0 md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white md:h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">HustleSheet</h1>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded text-sm ${
                pathname === item.href
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-center"
          >
            Logout
          </Button>
        </div>
      </aside>

      <div className="md:ml-64 w-full flex flex-col">
        <div className="md:hidden border-b border-gray-200 h-14 flex items-center justify-between px-4 bg-white">
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">
            HustleSheet
          </h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)}>
            <nav className="absolute left-0 top-14 w-64 bg-white border-r border-gray-200 space-y-2 p-4 max-h-[calc(100vh-3.5rem)] overflow-auto">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded text-sm ${
                    pathname === item.href
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-2">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-center"
                >
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
