"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { taxApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import { Download, Lock, TrendingDown, FileText } from 'lucide-react';
import type { TaxSummary } from '@/app/_lib/types';

function fmt(n: number) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

function Row({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 ${highlight ? 'border-t-2 border-gray-800 mt-1 pt-3' : 'border-b border-gray-100'}`}>
      <span className={`${sub ? 'text-xs text-gray-500 pl-3' : 'text-sm'} ${highlight ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{label}</span>
      <span className={`text-sm ${highlight ? 'font-bold text-lg text-gray-900' : 'font-medium text-gray-900'}`}>{value}</span>
    </div>
  );
}

function CalcBreakdown({ lines, title }: { lines: { label: string; amount: number }[]; title: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="pt-0">
        {lines.map((l, i) => {
          const isNeg = l.amount < 0;
          const isTotal = l.label.toLowerCase().includes('total tax payable');
          return (
            <div key={i} className={`flex justify-between items-center py-1.5 ${isTotal ? 'border-t-2 border-gray-800 mt-1 pt-2.5 font-bold' : 'border-b border-gray-50'}`}>
              <span className={`text-xs flex-1 pr-2 ${isTotal ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{l.label}</span>
              <span className={`text-xs font-medium whitespace-nowrap ${isNeg ? 'text-red-600' : isTotal ? 'text-gray-900 text-sm' : 'text-gray-900'}`}>
                {isNeg ? `− ${fmt(Math.abs(l.amount))}` : fmt(l.amount)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const router = useRouter();
  const { subscription } = useAuth();

  const isPro = subscription?.plan !== 'free';

  useEffect(() => {
    taxApi.summary().then(setSummary).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const handleExportCSV = async () => {
    if (!isPro) { router.push('/pricing'); return; }
    setExportLoading(true);
    try {
      const res = await taxApi.exportSummary('csv');
      const blob = new Blob([res.data as string], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'hustlesheet-tax-fy2024-25.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert(e instanceof Error ? e.message : 'Export failed'); }
    finally { setExportLoading(false); }
  };

  const handleExportPDF = async () => {
    if (!isPro) { router.push('/pricing'); return; }
    setExportLoading(true);
    try {
      const res = await taxApi.exportSummary('pdf');
      if (typeof res.data === 'string' && res.data.length > 100) {
        const byteChars = atob(res.data);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArr], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'hustlesheet-tax-fy2024-25.pdf'; a.click();
        URL.revokeObjectURL(url);
      } else {
        const content = JSON.stringify(res.data, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'hustlesheet-tax-fy2024-25.json'; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { alert(e instanceof Error ? e.message : 'Export failed'); }
    finally { setExportLoading(false); }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-600 py-8"><div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />Loading summary…</div>;
  if (error) return (
    <div className="space-y-4 max-w-xl">
      <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>
      <div className="flex gap-3">
        <Button onClick={() => router.push('/income')} variant="outline">Set Up Income</Button>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
  if (!summary) return null;

  const savings = summary.regime_savings;
  const rec = summary.recommended_regime;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Summary</h1>
          <p className="text-gray-500 mt-1">FY2024-25 • Complete computation with section citations</p>
        </div>
        <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm">← Dashboard</Button>
      </div>

      {/* Regime Banner */}
      <Card className={`border-2 ${rec === 'new' ? 'border-blue-400 bg-blue-50' : 'border-purple-400 bg-purple-50'}`}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <TrendingDown className={rec === 'new' ? 'text-blue-600' : 'text-purple-600'} size={22} />
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {rec === 'new' ? 'New Regime' : 'Old Regime'} recommended — saves {fmt(savings)}
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                {rec === 'new' ? 'New' : 'Old'} Regime total tax: {fmt(rec === 'new' ? summary.total_tax_new : summary.total_tax_old)} vs {fmt(rec === 'new' ? summary.total_tax_old : summary.total_tax_new)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income & Deductions */}
      <Card>
        <CardHeader><CardTitle>Income & Deductions (Old Regime)</CardTitle></CardHeader>
        <CardContent>
          <Row label="Gross Total Income" value={fmt(summary.gross_income)} />
          <Row label="Standard Deduction u/s 16(ia) — ₹50,000" value={`− ${fmt(summary.deductions_breakdown.standard_deduction)}`} />
          {summary.deductions_breakdown.hra_exemption > 0 && (
            <Row label="HRA Exemption u/s 10(13A)" value={`− ${fmt(summary.deductions_breakdown.hra_exemption)}`} />
          )}
          <Row label="Section 80C Deduction (max ₹1,50,000)" value={`− ${fmt(summary.deductions_breakdown.section_80c)}`} />
          {summary.deductions_breakdown.section_80d > 0 && (
            <Row label="Section 80D — Health Insurance" value={`− ${fmt(summary.deductions_breakdown.section_80d)}`} />
          )}
          {summary.deductions_breakdown.business_expenses > 0 && (
            <Row label="Business Expenses (Side Hustle)" value={`− ${fmt(summary.deductions_breakdown.business_expenses)}`} />
          )}
          <Row label="Total Deductions (Old Regime)" value={`− ${fmt(summary.total_deductions)}`} highlight />
        </CardContent>
      </Card>

      {/* Side-by-side regime comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={rec === 'old' ? 'ring-2 ring-blue-400' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Old Regime</CardTitle>
              {rec === 'old' && <Badge className="bg-blue-100 text-blue-800 text-xs">✓ Best</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <Row label="Taxable Income" value={fmt(summary.taxable_income_old)} />
            <Row label="Income Tax" value={fmt(summary.tax_old_regime)} />
            <Row label="Health & Education Cess (4%)" value={fmt(summary.cess_old)} />
            <Row label="Total Tax Payable" value={fmt(summary.total_tax_old)} highlight />
          </CardContent>
        </Card>
        <Card className={rec === 'new' ? 'ring-2 ring-blue-400' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">New Regime</CardTitle>
              {rec === 'new' && <Badge className="bg-blue-100 text-blue-800 text-xs">✓ Best</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <Row label="Taxable Income (no 80C/80D)" value={fmt(summary.taxable_income_new)} />
            <Row label="Income Tax" value={fmt(summary.tax_new_regime)} />
            <Row label="Health & Education Cess (4%)" value={fmt(summary.cess_new)} />
            <Row label="Total Tax Payable" value={fmt(summary.total_tax_new)} highlight />
          </CardContent>
        </Card>
      </div>

      {/* Calculation Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CalcBreakdown lines={summary.calculation_lines_old} title="Old Regime — Detailed Breakdown" />
        <CalcBreakdown lines={summary.calculation_lines_new} title="New Regime — Detailed Breakdown" />
      </div>

      {/* ITR & 44ADA */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2"><FileText size={18} />Filing Details</CardTitle>
            <Badge className="text-sm px-3 py-1 bg-green-100 text-green-800 font-bold">{summary.itr_category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-700 text-sm leading-relaxed">{summary.itr_explanation}</p>
          {summary.is_44ada_eligible && summary.tax_with_44ada !== null && summary.tax_without_44ada !== null && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900">Section 44ADA — Presumptive Taxation Eligible</p>
              <p className="text-sm text-green-700 mt-1">
                50% of gross professional receipts (≤ ₹50L) deemed as profit — no books of accounts required.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white rounded p-2.5 border border-green-200 text-center">
                  <p className="text-xs text-gray-500">Without 44ADA</p>
                  <p className="font-bold text-gray-900">{fmt(summary.tax_without_44ada)}</p>
                </div>
                <div className="bg-white rounded p-2.5 border border-green-400 text-center">
                  <p className="text-xs text-gray-500">With 44ADA</p>
                  <p className="font-bold text-green-700">{fmt(summary.tax_with_44ada)}</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">
                Potential saving: {fmt(summary.tax_without_44ada - summary.tax_with_44ada)} by electing Section 44ADA
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      {!isPro ? (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900"><Lock size={18} />Export — Pro Feature</CardTitle>
            <CardDescription className="text-amber-700">Upgrade to Pro to download clean PDF & CSV exports without watermark</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <div className="opacity-30 pointer-events-none bg-white p-4 font-mono text-xs text-gray-700 space-y-1">
                <p className="font-bold">HustleSheet Tax Summary — FY2024-25</p>
                <p>Gross Income: {fmt(summary.gross_income)}</p>
                <p>Recommended: {rec.toUpperCase()} REGIME</p>
                <p>Total Tax ({rec}): {fmt(rec === 'new' ? summary.total_tax_new : summary.total_tax_old)}</p>
                <p>Regime Savings: {fmt(savings)}</p>
                <p>ITR Category: {summary.itr_category}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-gray-400 opacity-50 rotate-[-15deg] select-none tracking-widest">PREVIEW</span>
              </div>
            </div>
            <Button onClick={() => router.push('/pricing')} className="w-full bg-amber-600 hover:bg-amber-700">
              Upgrade to Pro — ₹499/month · ₹4,990/year
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Export Your Tax Summary</CardTitle>
            <CardDescription className="text-green-700">Download clean PDF or CSV — no watermark</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={handleExportCSV} disabled={exportLoading} variant="outline" className="flex-1 border-green-300">
                <Download size={15} className="mr-2" />Export CSV
              </Button>
              <Button onClick={handleExportPDF} disabled={exportLoading} className="flex-1 bg-green-700 hover:bg-green-800">
                <Download size={15} className="mr-2" />Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
