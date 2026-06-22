const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d))
        msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    }),
  login: (email: string, password: string) =>
    apiFetch<{
      id: string;
      email: string;
      display_name: string | null;
      tier: string;
      is_email_verified: boolean;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),
  me: () =>
    apiFetch<{
      id: string;
      email: string;
      display_name: string | null;
      tier: string;
      is_email_verified: boolean;
    }>("/api/auth/me"),
  getSubscription: () =>
    apiFetch<{
      tier: string;
      status: string;
      current_period_end: string | null;
    }>("/api/auth/subscription"),
  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const aisApi = {
  getEntries: (fiscalYear: string) =>
    apiFetch<any[]>(`/api/ais/entries?fiscal_year=${encodeURIComponent(fiscalYear)}`),
  createEntry: (data: {
    fiscal_year: string;
    category: string;
    source_name: string;
    amount: number;
  }) =>
    apiFetch<any>("/api/ais/entries", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEntry: (entryId: string, data: Partial<any>) =>
    apiFetch<any>(`/api/ais/entries/${entryId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteEntry: (entryId: string) =>
    apiFetch<{ status: string }>(`/api/ais/entries/${entryId}`, {
      method: "DELETE",
    }),
};

export const reconciliationApi = {
  run: (fiscalYear: string) =>
    apiFetch<any>(
      `/api/reconciliation/run?fiscal_year=${encodeURIComponent(fiscalYear)}`,
      { method: "POST" }
    ),
  getReport: (fiscalYear: string) =>
    apiFetch<any>(`/api/reconciliation/report?fiscal_year=${encodeURIComponent(fiscalYear)}`),
};

export const paymentApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: string }>(
      "/api/payments/verify-transaction",
      {
        method: "POST",
        body: JSON.stringify({ transaction_id }),
      }
    ),
};
