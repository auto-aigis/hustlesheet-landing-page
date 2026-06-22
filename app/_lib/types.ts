export interface User {
  id: string;
  email: string;
  display_name: string | null;
  tier: 'free' | 'pro' | 'premium';
  is_email_verified: boolean;
}

export interface Subscription {
  tier: 'free' | 'pro' | 'premium';
  status: 'inactive' | 'active';
  current_period_end: string | null;
}

export interface AISEntry {
  id: string;
  fiscal_year: string;
  category: 'salary' | 'interest' | 'dividend' | 'freelance' | 'rent' | 'other';
  source_name: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface ReconciliationLineItem {
  status: 'matched' | 'mismatch' | 'missing';
  source_name: string;
  ais_amount: number;
  self_reported_amount: number | null;
  delta: number | null;
  explanation: string;
}

export interface ReconciliationReport {
  fiscal_year: string;
  summary_matched: number;
  summary_mismatch: number;
  summary_missing: number;
  line_items: ReconciliationLineItem[];
  is_gated: boolean;
}
