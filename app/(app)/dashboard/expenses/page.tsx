"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_components/AuthProvider';
import ExpenseForm from '@/app/_components/ExpenseForm';
import ExpenseList from '@/app/_components/ExpenseList';
import DeductionImpactPanel from '@/app/_components/DeductionImpactPanel';
import { authApi } from '@/app/_lib/api';
import type { Subscription } from '@/app/_lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ExpenseTracker() {
  const router = useRouter();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
  const handleCheckout = () => {\n    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO;\n    if (!priceId) {\n      alert('Pricing not configured');\n      return;\n    }\n\n    if (typeof window !== 'undefined' && (window as any).Paddle) {\n      (window as any).Paddle.Checkout.open({\n        items: [{ priceId }],\n        eventCallback: (data: any) => {\n          if (data.event === 'checkout.completed') {\n            const txnId = data.data.transaction_id;\n            (window as any).Paddle.Checkout.close();\n            window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;\n          }\n        },\n      });\n    }\n  };\n
  const handleCheckout = () => {
    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO;
    if (!priceId) {
      alert('Pricing not configured');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).Paddle) {
      (window as any).Paddle.Checkout.open({ items: [{ priceId }] });
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl p-6 text-gray-500">Loading...</div>;
  }

  const isProOrPremium = subscription?.tier === 'pro' || subscription?.tier === 'premium';

  if (!isProOrPremium) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="relative">
          <div className="blur-sm pointer-events-none">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200"><CardContent className="pt-6"><div className="h-64 bg-gray-100 rounded" /></CardContent></Card>
                <Card className="bg-white border-gray-200"><CardContent className="pt-6"><div className="h-64 bg-gray-100 rounded" /></CardContent></Card>
              </div>
              <Card className="bg-white border-gray-200"><CardContent className="pt-6"><div className="h-32 bg-gray-100 rounded" /></CardContent></Card>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Expense Tracking</h2>
              <p className="text-gray-600 mb-6">
                Track your deductions and reduce your tax bill — upgrade to Pro for ₹499/month or ₹4,990/year.
              </p>
              <Button onClick={handleCheckout} className="w-full">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
        <p className="text-gray-600 mt-2">Log and track your business expenses for tax deductions</p>
      </div>

      <DeductionImpactPanel refreshTrigger={refreshCount} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseForm onSuccess={() => setRefreshCount(c => c + 1)} />
      </div>

      <ExpenseList refreshTrigger={refreshCount} />
    </div>
  );
}
