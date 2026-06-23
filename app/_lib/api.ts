const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
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

import type { User, Subscription, Expense, ExpenseSummary, TaxDashboard, CreateExpenseRequest } from './types';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, display_name: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),
  logout: () => apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch<User>('/api/auth/me'),
  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  getSubscription: () => apiFetch<Subscription>('/api/auth/subscription'),
};

export const expenseApi = {
  list: (category?: string, start?: string, end?: string, skip?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    if (skip !== undefined) params.append('skip', skip.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<Expense[]>(`/api/expenses${query}`);
  },
  create: (data: CreateExpenseRequest) =>
    apiFetch<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<{ status: string }>(`/api/expenses/${id}`, { method: 'DELETE' }),
  summary: () => apiFetch<ExpenseSummary>('/api/expenses/summary'),
};

export const taxApi = {
  dashboard: () => apiFetch<TaxDashboard>('/api/tax/dashboard'),
  updateProfile: (annual_income: number, regime: 'old' | 'new') =>
    apiFetch<{ status: string }>('/api/tax/profile', {
      method: 'POST',
      body: JSON.stringify({ annual_income, regime }),
    }),
};

export const paymentApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: string }>('/api/payments/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id }),
    }),
};
