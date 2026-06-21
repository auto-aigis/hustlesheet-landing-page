"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { incomeApi } from '@/app/_lib/api';
import type { SideHustleStream } from '@/app/_lib/types';
import { Trash2, Plus, Info, CheckCircle2 } from 'lucide-react';

const INCOME_TYPES = [
  { value: 'professional_services', label: 'Professional Services (44ADA eligible)' },
  { value: 'technical_services', label: 'Technical Services (44ADA eligible)' },
  { value: 'freelancing', label: 'Freelancing (44ADA eligible)' },
  { value: 'consulting', label: 'Consulting (44ADA eligible)' },
  { value: 'gig', label: 'Gig Work (Swiggy, Ola, etc.)' },
  { value: 'affiliate', label: 'Affiliate / Content / YouTube' },
  { value: 'commission', label: 'Commission Income' },
  { value: 'other', label: 'Other Business Income' },
];

const CITY_TIERS = [
  { value: 'metro', label: 'Metro (Mumbai, Delhi, Kolkata, Chennai) — 50% HRA' },
  { value: 'tier1', label: 'Tier 1 city (Bengaluru, Hyderabad, Pune) — 50% HRA' },
  { value: 'tier2', label: 'Other cities — 40% HRA' },
];

const ADA_ELIGIBLE = new Set(['professional_services', 'technical_services', 'freelancing', 'consulting']);
const SELECT_CLASS = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function Field({ label, hint, tooltip, children }: { label: string; hint?: string; tooltip?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {hint && <span className="text-xs text-gray-400 font-normal">({hint})</span>}
      </label>
      {tooltip && <p className="text-xs text-gray-500">{tooltip}</p>}
      {children}
    </div>
  );
}

export default function IncomePage() {
  const [ctc, setCtc] = useState('');
  const [basic, setBasic] = useState('');
  const [hra, setHra] = useState('');
  const [rentPaid, setRentPaid] = useState('');
  const [cityTier, setCityTier] = useState('tier2');
  const [tds, setTds] = useState('0');
  const [d80c, setD80c] = useState('150000');
  const [d80d, setD80d] = useState('0');
  const [streams, setStreams] = useState<SideHustleStream[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newExpenses, setNewExpenses] = useState('0');
  const [newType, setNewType] = useState<SideHustleStream['income_type']>('professional_services');

  useEffect(() => {
    incomeApi.get()
      .then((p) => {
        setCtc(String(p.gross_annual_ctc || ''));
        setBasic(String(p.basic || ''));
        setHra(String(p.hra || ''));
        setRentPaid(String(p.rent_paid || ''));
        setCityTier(p.city_tier || 'tier2');
        setTds(String(p.tds_deducted || 0));
        setD80c(String(p.deduction_80c));
        setD80d(String(p.deduction_80d));
        setStreams(p.side_hustle_streams);
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, []);

  const addStream = () => {
    if (!newName || !newAmount) { setError('Please fill in the stream name and gross receipts amount'); return; }
    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount'); return; }
    setError('');
    setStreams(prev => [...prev, {
      source_name: newName,
      annual_amount: amt,
      expenses_claimed: parseFloat(newExpenses) || 0,
      income_type: newType,
      use_44ada: ADA_ELIGIBLE.has(newType),
    }]);
    setNewName(''); setNewAmount(''); setNewExpenses('0');
  };

  const removeStream = (i: number) => setStreams(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!ctc || parseFloat(ctc) <= 0) { setError('Please enter your annual gross salary'); return; }
    setLoading(true);
    try {
      await incomeApi.save({
        gross_annual_ctc: parseFloat(ctc),
        monthly_salary: null,
        basic: basic ? parseFloat(basic) : null,
        hra: hra ? parseFloat(hra) : null,
        special_allowance: null,
        rent_paid: rentPaid ? parseFloat(rentPaid) : null,
        city_tier: cityTier,
        tds_deducted: parseFloat(tds) || 0,
        deduction_80c: Math.min(parseFloat(d80c) || 0, 150000),
        deduction_80d: Math.min(parseFloat(d80d) || 0, 50000),
        hra_exemption: 0,
        standard_deduction_applied: true,
        side_hustle_streams: streams,
      });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save income data');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return (
    <div className="flex items-center gap-2 text-gray-600 py-8">
      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />Loading…
    </div>
  );

  const has44ADA = streams.some(s => ADA_ELIGIBLE.has(s.income_type));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Income Setup</h1>
        <p className="text-gray-600 mt-1">FY2024-25 · All monetary figures in Indian Rupees (₹) per year</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800 flex items-center gap-2">
              <CheckCircle2 size={16} />Saved! Redirecting to dashboard…
            </AlertDescription>
          </Alert>
        )}

        {/* Salary Section */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Income (Form 16)</CardTitle>
            <CardDescription>Enter your salary details as per your Form 16 or CTC breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Gross Annual CTC / Salary" hint="required" tooltip="Total salary before any deductions. Use Form 16 Part-B gross figure.">
              <Input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)} placeholder="e.g. 1200000" min="0" required />
            </Field>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-800 flex items-center gap-1.5 mb-1">
                <Info size={13} />Standard Deduction — Auto-applied
              </p>
              <p className="text-xs text-blue-700">
                Old Regime: ₹50,000 u/s 16(ia) · New Regime: ₹75,000 u/s 16(ia) (FY2024-25 Budget update)
              </p>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">HRA Exemption u/s 10(13A) — Optional</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Basic Salary" hint="annual">
                <Input type="number" value={basic} onChange={(e) => setBasic(e.target.value)} placeholder="e.g. 480000" min="0" />
              </Field>
              <Field label="HRA Received" hint="from Form 16">
                <Input type="number" value={hra} onChange={(e) => setHra(e.target.value)} placeholder="e.g. 240000" min="0" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Annual Rent Paid">
                <Input type="number" value={rentPaid} onChange={(e) => setRentPaid(e.target.value)} placeholder="e.g. 180000" min="0" />
              </Field>
              <Field label="City Tier">
                <select value={cityTier} onChange={(e) => setCityTier(e.target.value)} className={SELECT_CLASS}>
                  {CITY_TIERS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="TDS Deducted by Employer" hint="from Form 16 Part-A">
              <Input type="number" value={tds} onChange={(e) => setTds(e.target.value)} placeholder="0" min="0" />
            </Field>
          </CardContent>
        </Card>

        {/* Deductions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Deductions (Old Regime Only)</CardTitle>
            <CardDescription>80C and 80D deductions are not available under the New Regime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              label="Section 80C"
              hint="max ₹1,50,000"
              tooltip="PPF, ELSS, LIC premium, EPF, NSC, home loan principal, tuition fees, etc."
            >
              <Input type="number" value={d80c} onChange={(e) => setD80c(e.target.value)} placeholder="150000" min="0" max="150000" />
            </Field>
            <Field
              label="Section 80D — Health Insurance Premium"
              hint="max ₹25,000 self / ₹50,000 senior parents"
              tooltip="Medical insurance for self, spouse, children (₹25K) and parents (additional ₹25K–₹50K)"
            >
              <Input type="number" value={d80d} onChange={(e) => setD80d(e.target.value)} placeholder="0" min="0" max="50000" />
            </Field>
          </CardContent>
        </Card>

        {/* Side-Hustle Streams */}
        <Card>
          <CardHeader>
            <CardTitle>Side-Hustle Income Streams</CardTitle>
            <CardDescription>
              Add each freelance, consulting, gig or affiliate income source separately
              {has44ADA && (
                <span className="block mt-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">✓ 44ADA eligible streams detected</Badge>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {streams.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-3">No streams added yet. Add your first side-hustle income below.</p>
            )}

            {streams.map((s, i) => (
              <div key={i} className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{s.source_name}</p>
                    {ADA_ELIGIBLE.has(s.income_type) && (
                      <Badge className="bg-green-100 text-green-700 text-xs">44ADA eligible</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    ₹{s.annual_amount.toLocaleString('en-IN')} gross receipts
                    {s.expenses_claimed > 0 && ` · ₹${s.expenses_claimed.toLocaleString('en-IN')} expenses`}
                    {' · '}{INCOME_TYPES.find(t => t.value === s.income_type)?.label || s.income_type}
                  </p>
                </div>
                <button type="button" onClick={() => removeStream(i)} className="text-red-400 hover:text-red-600 ml-3 flex-shrink-0 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Add New Income Stream</p>
              <Input
                placeholder="Source name (e.g., Upwork Freelancing, Swiggy Delivery)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Gross Annual Receipts (₹)</label>
                  <Input type="number" placeholder="e.g. 300000" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} min="0" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Business Expenses Claimed (₹)</label>
                  <Input type="number" placeholder="0" value={newExpenses} onChange={(e) => setNewExpenses(e.target.value)} min="0" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Income Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SideHustleStream['income_type'])}
                  className={SELECT_CLASS}
                >
                  {INCOME_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {ADA_ELIGIBLE.has(newType) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  This income type qualifies for Section 44ADA presumptive taxation (50% deduction on receipts ≤ ₹50L)
                </div>
              )}
              <Button type="button" onClick={addStream} variant="outline" className="w-full border-dashed">
                <Plus size={16} className="mr-2" />Add Stream
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-base">
          {loading ? (
            <span className="flex items-center gap-2"><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Saving…</span>
          ) : 'Save & Calculate Taxes →'}
        </Button>
      </form>
    </div>
  );
}
