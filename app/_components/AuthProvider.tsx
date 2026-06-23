"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/app/_lib/types';
import { authApi } from '@/app/_lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await authApi.me();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
