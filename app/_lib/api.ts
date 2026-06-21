const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(', ');
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

import type { User, IncomeProfile, TaxCalculation, TaxSummary, Subscription } from './types';

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    apiFetch<{ status: string; user: User }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch<User>('/api/auth/me'),
  subscription: () => apiFetch<Subscription>('/api/auth/subscription'),
  onboarding: (side_hustle_types: string, display_name?: string) =>
    apiFetch<User>('/api/auth/onboarding', {
      method: 'POST', body: JSON.stringify({ side_hustle_types, display_name }),
    }),
};

export const incomeApi = {
  get: () => apiFetch<IncomeProfile>('/api/income'),
  save: (profile: Omit<IncomeProfile, 'id' | 'user_id'>) =>
    apiFetch<IncomeProfile>('/api/income', {
      method: 'POST', body: JSON.stringify(profile),
    }),
};

export const taxApi = {
  calculate: () => apiFetch<TaxCalculation>('/api/tax/calculate'),
  summary: () => apiFetch<TaxSummary>('/api/summary'),
  exportSummary: (format: 'pdf' | 'csv') =>
    apiFetch<{ data: any; format: string; watermarked: boolean }>('/api/summary/export', {
      method: 'POST', body: JSON.stringify({ format }),
    }),
};

export const paymentsApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: string }>('/api/payments/verify-transaction', {
      method: 'POST', body: JSON.stringify({ transaction_id }),
    }),
};

export const settingsApi = {
  submitExpertReview: () =>
    apiFetch<{ status: string; review_id: string }>('/api/settings/expert-review', { method: 'POST' }),
  optInAlerts: (email: string) =>
    apiFetch<{ status: string }>('/api/settings/alerts/opt-in', {
      method: 'POST', body: JSON.stringify({ email }),
    }),
};
