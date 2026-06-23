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

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),
  login: (email: string, password: string) =>
    apiFetch<{ status: string; user_id: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/api/auth/me'),
  subscription: () => apiFetch('/api/auth/subscription'),
};

export const taxApi = {
  projection: () => apiFetch('/api/tax/projection'),
  payments: (quarter: string, tds_deducted: number, advance_tax_paid: number) =>
    apiFetch('/api/tax/payments', {
      method: 'POST',
      body: JSON.stringify({ quarter, tds_deducted, advance_tax_paid }),
    }),
  alerts: () => apiFetch('/api/tax/alerts'),
  dismissAlert: (alert_id: string) =>
    apiFetch(`/api/tax/alerts/${alert_id}/dismiss`, { method: 'POST' }),
};
