"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ExpenseSummary } from '@/app/_lib/types';
import { expenseApi } from '@/app/_lib/api';

interface DeductionImpactPanelProps {
  refreshTrigger: number;
}

export default function DeductionImpactPanel({ refreshTrigger }: DeductionImpactPanelProps) {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [refreshTrigger]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await expenseApi.summary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !summary) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Deduction Impact</CardTitle>
        <CardDescription>Your tax savings from logged expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Expenses</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{summary.total_expenses.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Deductible</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{summary.total_deductible.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm font-medium text-green-700 mb-2">Tax Saved</div>
              <div className="text-2xl font-bold text-green-900">
                ₹{summary.tax_liability_reduction.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Your tax liability reduced by <span className="font-bold">₹{summary.tax_liability_reduction.toLocaleString('en-IN')}</span> after logging ₹{summary.total_deductible.toLocaleString('en-IN')} in deductions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
