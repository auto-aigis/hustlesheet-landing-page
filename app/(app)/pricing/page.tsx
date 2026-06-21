"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Zap, Star, Shield } from 'lucide-react';
import { useAuth } from '@/app/_lib/hooks';
import { paymentsApi } from '@/app/_lib/api';

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string; environment?: string }) => void;
      Checkout: { open: (opts: Record<string, unknown>) => void };
    };
  }
}

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox';
const PADDLE_PRICE_PRO_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || '';
const PADDLE_PRICE_PRO_ANNUAL = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL || '';
const PADDLE_PRICE_PREMIUM = process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM || '';

const FREE_FEATURES = [
  'Unlimited income streams',
  'Old & New Regime tax calculation',
  'Section 44ADA eligibility check',
  'ITR-1/2/4 category determination',
  'Live tax dashboard',
  'Watermarked PDF preview',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Clean PDF & CSV export (no watermark)',
  'AIS reconciliation (coming soon)',
  'Quarterly advance tax alerts',
  'Email support',
  'Regime comparison history',
];

const PREMIUM_FEATURES = [
  'Everything in Pro',
  'Expert tax review — 48h turnaround',
  'Personalised tax planning tips',
  'Priority email support',
  'Multi-year income tracking',
  'Family account (coming soon)',
];

export default function PricingPage() {
  const { subscription, refresh, user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [paddleReady, setPaddleReady] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const currentPlan = subscription?.plan || 'free';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.Paddle) { setPaddleReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle && PADDLE_CLIENT_TOKEN) {
        const initOpts: { token: string; environment?: string } = { token: PADDLE_CLIENT_TOKEN };
        if (PADDLE_ENV === 'sandbox') initOpts.environment = 'sandbox';
        window.Paddle.Initialize(initOpts);
      }
      setPaddleReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const isCurrentPlan = (id: string) => {
    if (id === 'free') return currentPlan === 'free';
    if (id === 'pro') return currentPlan === 'pro_monthly' || currentPlan === 'pro_annual';
    if (id === 'premium') return currentPlan === 'premium_monthly';
    return false;
  };

  const openCheckout = async (priceId: string, tierId: string) => {
    if (!priceId) { alert('Pricing not configured yet. Please contact support.'); return; }
    if (!paddleReady || !window.Paddle) { alert('Payment system loading. Please try again in a moment.'); return; }
    setLoading(tierId);
    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: user?.email ? { email: user.email } : undefined,
        successUrl: `${window.location.origin}/dashboard`,
        closeCallback: () => setLoading(null),
        checkoutCompletedCallback: async (data: any) => {
          const txnId = data?.transaction?.id;
          if (txnId) {
            try {
              await paymentsApi.verifyTransaction(txnId);
              await refresh();
              setSuccessMsg('🎉 Payment successful! Your plan has been upgraded.');
              setTimeout(() => setSuccessMsg(''), 8000);
            } catch {}
          }
          setLoading(null);
        },
      });
    } catch {
      setLoading(null);
    }
  };

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'pro') {
      const priceId = annual ? PADDLE_PRICE_PRO_ANNUAL : PADDLE_PRICE_PRO_MONTHLY;
      openCheckout(priceId, tierId);
    } else if (tierId === 'premium') {
      openCheckout(PADDLE_PRICE_PREMIUM, tierId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-500 mt-3">Start free. Upgrade when you need exports or expert review.</p>

        {successMsg && (
          <Alert className="mt-4 border-green-200 bg-green-50 max-w-md mx-auto">
            <AlertDescription className="text-green-800">{successMsg}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Annual <Badge className="bg-green-100 text-green-700 font-semibold text-xs">Save 2 months</Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Free */}
        <Card className={`relative ${isCurrentPlan('free') ? 'ring-2 ring-gray-300' : ''}`}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-gray-500" />
              <CardTitle className="text-xl">Free</CardTitle>
              {isCurrentPlan('free') && <Badge className="bg-gray-100 text-gray-600 text-xs ml-auto">Current</Badge>}
            </div>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-gray-900">₹0</span>
              <span className="text-gray-400 text-sm">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Button disabled variant="outline" className="w-full">
              {isCurrentPlan('free') ? 'Current Plan' : 'Get Started Free'}
            </Button>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className={`relative ${isCurrentPlan('pro') ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500 shadow-lg'}`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
            <Zap size={12} />Most Popular
          </div>
          <CardHeader className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-blue-600" />
              <CardTitle className="text-xl">Pro</CardTitle>
              {isCurrentPlan('pro') && <Badge className="bg-blue-100 text-blue-700 text-xs ml-auto">Current</Badge>}
            </div>
            <CardDescription>For serious tax filers</CardDescription>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-gray-900">
                {annual ? '₹416' : '₹499'}
              </span>
              <span className="text-gray-400 text-sm">/month</span>
              {annual ? (
                <p className="text-sm text-green-600 font-semibold mt-1">Billed as ₹4,990/year — 2 months free!</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">or ₹4,990/year (save ₹998)</p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => !isCurrentPlan('pro') && handleUpgrade('pro')}
              disabled={isCurrentPlan('pro') || loading === 'pro'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading === 'pro' ? 'Opening checkout…' : isCurrentPlan('pro') ? 'Current Plan' : `Upgrade to Pro${annual ? ' (Annual)' : ''}`}
            </Button>
          </CardContent>
        </Card>

        {/* Premium */}
        <Card className={`relative ${isCurrentPlan('premium') ? 'ring-2 ring-purple-400' : ''}`}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Star size={18} className="text-purple-600" />
              <CardTitle className="text-xl">Premium</CardTitle>
              {isCurrentPlan('premium') && <Badge className="bg-purple-100 text-purple-700 text-xs ml-auto">Current</Badge>}
            </div>
            <CardDescription>Full tax mastery with expert review</CardDescription>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-gray-900">₹999</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2.5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={15} className="text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => !isCurrentPlan('premium') && handleUpgrade('premium')}
              disabled={isCurrentPlan('premium') || loading === 'premium'}
              className="w-full bg-purple-700 hover:bg-purple-800"
            >
              {loading === 'premium' ? 'Opening checkout…' : isCurrentPlan('premium') ? 'Current Plan' : 'Upgrade to Premium'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader><CardTitle className="text-lg">Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['What is Section 44ADA?', 'A presumptive taxation scheme for professionals — 50% of gross receipts (≤ ₹50L) is deemed profit. No books of accounts required. HustleSheet auto-detects your eligibility.'],
              ['Can I switch plans?', 'Yes. Upgrade or downgrade anytime. Changes take effect immediately after payment confirmation via Paddle.'],
              ['Is my financial data secure?', 'All tax data is encrypted at rest and in transit (TLS). We never share your information with third parties.'],
              ['Refund policy?', '7-day money-back guarantee on all paid plans. No questions asked. Contact support@hustlesheet.com.'],
              ['What ITR forms does HustleSheet support?', 'HustleSheet determines whether you need ITR-1 (salary only), ITR-2 (capital gains), or ITR-4 (presumptive taxation/44ADA) based on your income composition.'],
              ['What does the Expert Review include?', 'A qualified CA will review your income profile and tax calculations, flag errors, and provide personalised filing recommendations within 48 hours.'],
            ].map(([q, a]) => (
              <div key={q} className="space-y-1">
                <p className="font-semibold text-gray-900 text-sm">{q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
