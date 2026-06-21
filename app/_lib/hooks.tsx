"use client";

import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/app/_components/AuthProvider';
import { incomeApi, taxApi } from '@/app/_lib/api';
import type { AuthContextType, IncomeProfile, TaxCalculation, TaxSummary } from './types';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useIncomeProfile() {
  const [profile, setProfile] = useState<IncomeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    incomeApi.get().then(setProfile).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  return { profile, loading, error };
}

export function useTaxCalculation() {
  const [tax, setTax] = useState<TaxCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(() => {
    setLoading(true);
    taxApi.calculate().then(setTax).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { tax, loading, error, refresh };
}

export function useTaxSummary() {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    taxApi.summary().then(setSummary).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  return { summary, loading, error };
}
