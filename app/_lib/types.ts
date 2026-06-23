export interface User {
  id: string;
  email: string;
  display_name: string;
  is_email_verified: boolean;
}

export interface Subscription {
  id: string;
  tier: 'free' | 'pro' | 'premium';
  status: 'active' | 'inactive' | 'canceled';
  paddle_subscription_id: string | null;
  current_period_end: string | null;
}

export type ExpenseCategory = 'software_tools' | 'internet_phone' | 'home_office' | 'travel_transport' | 'professional_development' | 'other';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description: string;
  deductible_amount: number;
  deductibility_percentage: number;
  deductibility_rule: string;
  created_at: string;
}

export interface ExpenseSummary {
  total_expenses: number;
  total_deductible: number;
  tax_liability_reduction: number;
}

export interface TaxDashboard {
  annual_income: number;
  regime: 'old' | 'new';
  financial_year: string;
  total_deductible_expenses: number;
  taxable_income: number;
  net_tax_liability: number;
  tax_liability_reduction: number;
}

export interface CreateExpenseRequest {
  amount: number;
  date: string;
  category: ExpenseCategory;
  description: string;
  deductibility_percentage?: number | null;
}

export const CATEGORY_RULES: Record<ExpenseCategory, { label: string; percentage: number; rule: string }> = {
  software_tools: {
    label: 'Software & Tools',
    percentage: 100,
    rule: 'Section 37(1) — 100% deductible as business software and tools',
  },
  internet_phone: {
    label: 'Internet & Phone',
    percentage: 80,
    rule: 'Section 37(1) — 80% deductible for professional-use portion of home broadband and mobile data',
  },
  home_office: {
    label: 'Home Office',
    percentage: 0,
    rule: 'Section 37(1) — Proportionate deduction for rent, electricity, and utilities for dedicated workspace',
  },
  travel_transport: {
    label: 'Travel & Transport',
    percentage: 50,
    rule: 'Section 37(1) — 50% deductible for client meetings, site visits, and business travel',
  },
  professional_development: {
    label: 'Professional Development',
    percentage: 100,
    rule: 'Section 37(1) — 100% deductible for courses, certifications, conferences, and professional books',
  },
  other: {
    label: 'Other Business Expense',
    percentage: 100,
    rule: 'Section 37(1) — 100% deductible as miscellaneous business expense',
  },
};
