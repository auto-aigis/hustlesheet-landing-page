export interface User {
  id: string;
  email: string;
  display_name: string | null;
  is_onboarded: boolean;
  is_email_verified: boolean;
}

export interface IncomeProfile {
  id: string;
  user_id: string;
  gross_annual_ctc: number | null;
  monthly_salary: number | null;
  basic: number | null;
  hra: number | null;
  special_allowance: number | null;
  deduction_80c: number;
  deduction_80d: number;
  hra_exemption: number;
  standard_deduction_applied: boolean;
  side_hustle_streams: SideHustleStream[];
}

export interface SideHustleStream {
  id?: string;
  source_name: string;
  annual_amount: number;
  income_type: 'professional_services' | 'technical_services' | 'commission' | 'other';
  use_44ada: boolean;
}

export interface TaxCalculation {
  gross_income: number;
  taxable_income_old: number;
  taxable_income_new: number;
  tax_old_regime: number;
  tax_new_regime: number;
  cess_old: number;
  cess_new: number;
  total_tax_old: number;
  total_tax_new: number;
  recommended_regime: 'old' | 'new';
  regime_savings: number;
  itr_category: string;
  is_44ada_eligible: boolean;
  tax_with_44ada: number;
  tax_without_44ada: number;
  professional_income_total: number;
}

export interface TaxSummary {
  gross_income: number;
  total_deductions: number;
  taxable_income_old: number;
  taxable_income_new: number;
  tax_old_regime: number;
  tax_new_regime: number;
  total_tax_old: number;
  total_tax_new: number;
  recommended_regime: 'old' | 'new';
  itr_category: string;
  is_44ada_eligible: boolean;
  tax_with_44ada: number;
  tax_without_44ada: number;
  deductions_breakdown: {
    standard_deduction: number;
    section_80c: number;
    section_80d: number;
    hra_exemption: number;
  };
}

export interface Subscription {
  plan: 'free' | 'pro_monthly' | 'pro_annual' | 'premium_monthly';
  status: 'active' | 'inactive';
  current_period_end: string | null;
}

export interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}