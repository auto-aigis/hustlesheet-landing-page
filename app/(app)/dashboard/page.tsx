"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { taxApi } from '@/app/_lib/api';
import { Badge } from '@/components/ui/badge';
import type { TaxCalculation } from '@/app/_lib/types';

export default function DashboardPage() {
  const [tax, setTax] = useState<TaxCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadTax = async () => {
      try {
        const data = await taxApi.calculate();
        setTax(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tax calculation');
      } finally {
        setLoading(false);
      }
    };
    loadTax();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Calculating your taxes...</div>;
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

  if (!tax) {
    return null;
  }

  const savings = tax.total_tax_old - tax.total_tax_new;
  const regimeRecommendation = tax.recommended_regime === 'new'
    ? `Switch to New Regime and save ₹${savings.toLocaleString()}`
    : `Stick with Old Regime and save ₹${Math.abs(savings).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Your Tax Dashboard</h1>
        <p className="text-gray-600 mt-2">Complete tax breakdown for FY2024-25</p>
      </div>

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Regime Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-blue-900">{regimeRecommendation}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Income Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Income:</span>
              <span className="font-semibold text-gray-900">₹{tax.gross_income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Professional Income:</span>
              <span className="font-semibold text-gray-900">₹{tax.professional_income_total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ITR & Filing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ITR Category:</span>
              <Badge className="bg-blue-100 text-blue-800">{tax.itr_category}</Badge>
            </div>
            {tax.is_44ada_eligible && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">44ADA Eligible:</span>
                <Badge className="bg-green-100 text-green-800">Yes</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Old Regime (FY2024-25)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-semibold text-gray-900">₹{tax.taxable_income_old.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold text-gray-900">₹{tax.tax_old_regime.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cess (4%):</span>
              <span className="font-semibold text-gray-900">₹{tax.cess_old.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-medium text-gray-900">Total Tax:</span>
              <span className="font-semibold text-lg text-gray-900">₹{tax.total_tax_old.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Regime (FY2024-25)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-semibold text-gray-900">₹{tax.taxable_income_new.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold text-gray-900">₹{tax.tax_new_regime.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cess (4%):</span>
              <span className="font-semibold text-gray-900">₹{tax.cess_new.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-medium text-gray-900">Total Tax:</span>
              <span className="font-semibold text-lg text-gray-900">₹{tax.total_tax_new.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {tax.is_44ada_eligible && (
        <Card>
          <CardHeader>
            <CardTitle>Section 44ADA Analysis</CardTitle>
            <CardDescription>Presumptive taxation for professional services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tax Without 44ADA:</span>
              <span className="font-semibold text-gray-900">₹{tax.tax_without_44ada.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax With 44ADA (50% deduction):</span>
              <span className="font-semibold text-green-700">₹{tax.tax_with_44ada.toLocaleString()}</span>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-900">
                You can save ₹{(tax.tax_without_44ada - tax.tax_with_44ada).toLocaleString()} with 44ADA presumptive taxation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => router.push('/summary')} size="lg" className="w-full">
        View Tax Summary
      </Button>
    </div>
  );
}