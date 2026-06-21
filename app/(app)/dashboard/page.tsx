"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { taxApi, settingsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { TaxCalculation } from '@/app/_lib/types';
import { TrendingDown, CheckCircle2, FileText, Calculator, ArrowRight, Star } from 'lucide-react';

function fmt(n: number) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200'}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${highlight ? 'text-blue-200' : 'text-gray-500'}`}>{sub}</p>}
    </div>
  );
}

function SectionLine({ label, amount }: { label: string; amount: number }) {
  const isNeg = amount < 0;
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-600 flex-1 pr-3 leading-snug">{label}</span>
      <span className={`text-xs font-semibold whitespace-nowrap ${isNeg ? 'text-red-500' : 'text-gray-900'}`}>
        {isNeg ? `− ${fmt(Math.abs(amount))}` : fmt(amount)}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [tax, setTax] = useState<TaxCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const router = useRouter();
  const { subscription, user } = useAuth();

  const isPro = subscription?.plan !== 'free';
  const isPremium = subscription?.plan === 'premium_monthly';

  useEffect(() => {
    taxApi.calculate()
      .then(setTax)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleExpertReview = async () => {
    setReviewLoading(true);
    try {
      await settingsApi.submitExpertReview();
      setReviewDone(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to submit');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-3 py-12 text-gray-600">
      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
      Calculating your taxes…
    </div>
  );

  if (error) return (
    <div className="space-y-4 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tax Dashboard</h1>
        <p className="text-gray-500 mt-1">FY2024-25</p>
      </div>
      <Alert className="border-amber-200 bg-amber-50">
        <AlertDescription className="text-amber-900">
          <strong>No income data found.</strong> Set up your income profile to see your tax calculation.
        </AlertDescription>
      </Alert>
      <Button onClick={() => router.push('/income')} className="w-full" size="lg">
        <Calculator size={18} className="mr-2" />Set Up Income Profile →
      </Button>
    </div>
  );

  if (!tax) return null;

  const rec = tax.recommended_regime;
  const betterTax = rec === 'new' ? tax.total_tax_new : tax.total_tax_old;
  const worseTax = rec === 'new' ? tax.total_tax_old : tax.total_tax_new;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Dashboard</h1>
          <p className="text-gray-500 mt-1">FY2024-25 · Rules-based computation · Hello, {user?.email?.split('@')[0]}!</p>
        </div>
        <Button onClick={() => router.push('/income')} variant="outline" size="sm">Edit Income</Button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Gross Income" value={fmt(tax.gross_income)} />
        <StatCard label="Best Tax" value={fmt(betterTax)} sub={`${rec === 'new' ? 'New' : 'Old'} Regime`} highlight />
        <StatCard label="You Save" value={fmt(tax.regime_savings)} sub="vs other regime" />
        <StatCard label="ITR Form" value={tax.itr_category} sub="Filing category" />
      </div>

      {/* Regime Recommendation */}
      <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingDown className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-blue-900">
                {rec === 'new' ? 'New Regime' : 'Old Regime'} is better for you
              </p>
              <p className="text-blue-700 mt-1">
                Save <strong className="text-blue-900">{fmt(tax.regime_savings)}</strong> by choosing the{' '}
                <strong>{rec === 'new' ? 'New' : 'Old'} Regime</strong> ({fmt(betterTax)} vs {fmt(worseTax)})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-side regime comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: 'Old Regime',
            taxable: tax.taxable_income_old,
            taxAmt: tax.tax_old_regime,
            cess: tax.cess_old,
            total: tax.total_tax_old,
            isRec: rec === 'old',
          },
          {
            label: 'New Regime',
            taxable: tax.taxable_income_new,
            taxAmt: tax.tax_new_regime,
            cess: tax.cess_new,
            total: tax.total_tax_new,
            isRec: rec === 'new',
          },
        ].map((regime) => (
          <Card key={regime.label} className={regime.isRec ? 'ring-2 ring-blue-500 shadow-md' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{regime.label}</CardTitle>
                {regime.isRec && <Badge className="bg-blue-100 text-blue-800 font-semibold">✓ Recommended</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
                <span className="text-gray-600">Gross Income</span>
                <span className="font-medium">{fmt(tax.gross_income)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
                <span className="text-gray-600">Taxable Income</span>
                <span className="font-medium">{fmt(regime.taxable)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
                <span className="text-gray-600">Income Tax</span>
                <span className="font-medium">{fmt(regime.taxAmt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
                <span className="text-gray-600">Health & Education Cess u/s 2(11C) — 4%</span>
                <span className="font-medium">{fmt(regime.cess)}</span>
              </div>
              <div className="flex justify-between pt-3 mt-1 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900">Total Tax Payable</span>
                <span className={`font-bold text-xl ${regime.isRec ? 'text-blue-700' : 'text-gray-900'}`}>{fmt(regime.total)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Calculation Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Old Regime — Section-wise</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {tax.calculation_lines_old.map((l, i) => <SectionLine key={i} label={l.label} amount={l.amount} />)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">New Regime — Section-wise</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {tax.calculation_lines_new.map((l, i) => <SectionLine key={i} label={l.label} amount={l.amount} />)}
          </CardContent>
        </Card>
      </div>

      {/* ITR Category */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2"><FileText size={18} />ITR Filing Category</CardTitle>
            <Badge className="text-base px-4 py-1 bg-green-100 text-green-900 font-bold border border-green-300">{tax.itr_category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{tax.itr_explanation}</p>
        </CardContent>
      </Card>

      {/* 44ADA */}
      {tax.is_44ada_eligible && tax.tax_with_44ada !== null && tax.tax_without_44ada !== null && (
        <Card className="border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Section 44ADA — Presumptive Taxation</CardTitle>
            <CardDescription className="text-green-700">
              50% of gross professional receipts (≤ ₹50L) is deemed profit — no expense-tracking or books required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-green-200 text-center">
                <p className="text-xs text-gray-500 mb-1">Without 44ADA (actual expenses)</p>
                <p className="text-2xl font-bold text-gray-900">{fmt(tax.tax_without_44ada)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-green-500 text-center">
                <p className="text-xs text-gray-500 mb-1">With 44ADA (50% presumptive)</p>
                <p className="text-2xl font-bold text-green-700">{fmt(tax.tax_with_44ada)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 bg-white rounded-lg p-3 border border-green-200">
              <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                Electing Section 44ADA saves you <strong>{fmt(tax.tax_without_44ada - tax.tax_with_44ada)}</strong>.
                Professional income eligible: {fmt(tax.professional_income_total)}.
                Presumptive deduction: 50% of gross receipts automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expert Review (Premium) */}
      {isPremium && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Star size={18} className="text-purple-600" />Expert Review
            </CardTitle>
            <CardDescription className="text-purple-700">Premium feature — get your tax summary reviewed by a qualified tax expert within 48 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewDone ? (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  ✓ Your summary has been submitted. A tax expert will review within 48 hours.
                </AlertDescription>
              </Alert>
            ) : (
              <Button onClick={handleExpertReview} disabled={reviewLoading} className="w-full bg-purple-700 hover:bg-purple-800">
                {reviewLoading ? 'Submitting…' : 'Request Expert Review →'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA for free users */}
      {!isPro && (
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-lg">Unlock PDF & CSV Export</p>
                <p className="text-blue-100 text-sm mt-1">Upgrade to Pro — ₹499/month or ₹4,990/year (2 months free)</p>
              </div>
              <Button onClick={() => router.push('/pricing')} variant="secondary" className="shrink-0">
                Upgrade to Pro <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={() => router.push('/income')} variant="outline" className="flex-1">
          <Calculator size={16} className="mr-2" />Edit Income
        </Button>
        <Button onClick={() => router.push('/summary')} className="flex-1">
          View Full Summary <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
