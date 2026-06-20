"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { taxApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import { Download } from 'lucide-react';
import type { TaxSummary } from '@/app/_lib/types';

export default function SummaryPage() {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const router = useRouter();
  const { subscription } = useAuth();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await taxApi.summary();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  const handleExport = async (format: 'pdf' | 'csv') => {
    if (subscription?.plan === 'free') {
      alert('Upgrade to Pro to export clean documents');
      router.push('/pricing');
      return;
    }
    setExportLoading(true);
    try {
      const data = await taxApi.exportSummary(format);
      const link = document.createElement('a');
      link.href = `data:text/${format},${encodeURIComponent(data.data)}`;
      link.download = `tax-summary.${format}`;
      link.click();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading summary...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/income')}>Set Up Income First</Button>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Tax Summary - FY2024-25</h1>
        <p className="text-gray-600 mt-2">Your complete tax picture at a glance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="font-medium text-gray-900">Gross Income:</span>
            <span className="font-semibold text-gray-900">₹{summary.gross_income.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Deductions:</span>
            <span className="text-gray-900">₹{summary.total_deductions.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deductions Applied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Standard Deduction (Sec 16(ia)):</span>
            <span className="font-semibold text-gray-900">₹{summary.deductions_breakdown.standard_deduction.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Section 80C:</span>
            <span className="font-semibold text-gray-900">₹{summary.deductions_breakdown.section_80c.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Section 80D:</span>
            <span className="font-semibold text-gray-900">₹{summary.deductions_breakdown.section_80d.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">HRA Exemption:</span>
            <span className="font-semibold text-gray-900">₹{summary.deductions_breakdown.hra_exemption.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Old Regime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-semibold text-gray-900">₹{summary.taxable_income_old.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold text-gray-900">₹{summary.tax_old_regime.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-medium text-gray-900">Total Tax:</span>
              <span className="font-semibold text-lg text-gray-900">₹{summary.total_tax_old.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Regime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-semibold text-gray-900">₹{summary.taxable_income_new.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold text-gray-900">₹{summary.tax_new_regime.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-medium text-gray-900">Total Tax:</span>
              <span className="font-semibold text-lg text-gray-900">₹{summary.total_tax_new.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">ITR Category:</span>
            <span className="font-semibold text-gray-900">{summary.itr_category}</span>
          </div>
          {summary.is_44ada_eligible && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Section 44ADA Eligible:</span>
                <span className="font-semibold text-green-700">Yes</span>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-900">
                  Potential tax savings with 44ADA: ₹{(summary.tax_without_44ada - summary.tax_with_44ada).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={() => handleExport('pdf')}
          disabled={exportLoading}
          className="flex-1"
        >
          <Download size={18} className="mr-2" />
          Export as PDF
        </Button>
        <Button
          onClick={() => handleExport('csv')}
          disabled={exportLoading}
          variant="outline"
          className="flex-1"
        >
          <Download size={18} className="mr-2" />
          Export as CSV
        </Button>
      </div>
    </div>
  );
}