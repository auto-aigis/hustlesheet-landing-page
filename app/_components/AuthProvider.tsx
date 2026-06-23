"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType } from '@/app/_lib/hooks';
import { authApi } from '@/app/_lib/api';
import { User, Subscription } from '@/app/_lib/types';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = async () => {
    try {
      const data = await authApi.me();
      setUser(data.user);
      setSubscription(data.subscription || null);
    } catch {
      setUser(null);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setSubscription(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const value: AuthContextType = { user, subscription, loading, refresh, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
