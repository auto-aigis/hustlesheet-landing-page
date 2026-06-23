"use client";

import { useCallback, useMemo } from 'react';
import type { ExpenseCategory } from './types';
import { CATEGORY_RULES } from './types';

export function useDeductionRules() {
  return useMemo(() => CATEGORY_RULES, []);
}

export function useCalculateDeductible(amount: number, category: ExpenseCategory, customPercentage?: number) {
  return useCallback(() => {
    const rules = CATEGORY_RULES[category];
    const percentage = category === 'home_office' ? (customPercentage ?? 0) : rules.percentage;
    return Math.round((amount * percentage) / 100);
  }, [amount, category, customPercentage]);
}

export function useFormatCurrency(value: number): string {
  return useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  }, [value]);
}
