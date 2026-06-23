export interface User {
  id: string;
  email: string;
  display_name: string | null;
  tax_regime: string;
  is_44ada: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  tier: 'free' | 'pro' | 'premium';
  status: string;
  current_period_end: string | null;
}

export interface AuthResponse {
  user: User;
  subscription: Subscription | null;
}

export interface QuarterlyInstallment {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  due_date: string;
  cumulative_due: number;
  amount_due_this_quarter: number;
  paid_so_far: number;
  balance_remaining: number;
  explanation: string;
}

export interface TaxProjectionResponse {
  estimated_annual_tax: number;
  is_liable_for_advance_tax: boolean;
  liability_explanation: string;
  installments: QuarterlyInstallment[];
  risk_234b: boolean;
  risk_234b_explanation: string;
  risk_234c: boolean;
  risk_234c_explanation: string;
  financial_year: number;
}

export interface TaxAlertResponse {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  deadline: string;
  days_until_due: number;
  amount_due: number;
  dismissed: boolean;
  status: 'overdue' | 'due_soon' | 'upcoming';
}

export interface AdvanceTaxPaymentRequest {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  tds_deducted?: number;
  advance_tax_paid?: number;
}
