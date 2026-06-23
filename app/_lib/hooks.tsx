"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Subscription } from './types';
import { authApi } from './api';

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function usePro() {
  const { subscription } = useAuth();
  return subscription?.tier === 'pro' || subscription?.tier === 'premium';
}
