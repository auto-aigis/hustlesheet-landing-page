"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/app/_components/AuthProvider';
import { authApi } from '@/app/_lib/api';
import type { Subscription } from '@/app/_lib/types';

const TIERS = [
  {
    name: 'Free',
    price: '₹0',
    billing: 'forever',
    description: 'Get started with tax basics',
    features: [
      'Tax slab calculator',
      'Annual income tracking',
      'Tax regime comparison',
    ],
    priceId: null,
  },
  {
    name: 'Pro',
    price: '₹499',
    billing: 'per month',
    description: 'Complete tax and expense tracking',
    features: [
      'Everything in Free',
      'Expense tracker with 6 categories',
      'Tax deduction calculator',
      'Deduction impact on tax liability',
      'Email support',
    ],
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO ?? null,
    yearly: { price: '₹4,990', period: 'per year' },
  },
  {
    name: 'Premium',
    price: '₹999',
    billing: 'per month',
    description: 'Professional tax planning',
    features: [
      'Everything in Pro',
      'Advanced tax reports',
      'Priority support',
      'CA consultation (coming soon)',
    ],
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM ?? null,
  },
];

export default function Pricing() {
  const router = useRouter();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const handleCheckout = (priceId: string | null) => {\n    if (!priceId) return;\n    if (typeof window !== 'undefined' && (window as any).Paddle) {\n      (window as any).Paddle.Checkout.open({\n        items: [{ priceId }],\n        eventCallback: (data: any) => {\n          if (data.event === 'checkout.completed') {\n            const txnId = data.data.transaction_id;\n            (window as any).Paddle.Checkout.close();\n            window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;\n          }\n        },\n      });\n    }\n  };\n
  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await authApi.getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Failed to load subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = (priceId: string | null) => {
    if (!priceId) return;
    if (typeof window !== 'undefined' && (window as any).Paddle) {
      (window as any).Paddle.Checkout.open({ items: [{ priceId }] });
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600">Choose the plan that works for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const isCurrent = subscription?.tier === tier.name.toLowerCase();
          return (
            <Card
              key={tier.name}
              className={`bg-white border-2 transition ${
                isCurrent ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </div>
                  {isCurrent && <Badge className="bg-blue-600 text-white">Current</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{tier.price}</div>
                  <div className="text-sm text-gray-600">{tier.billing}</div>
                  {tier.yearly && (
                    <div className="text-xs text-gray-500 mt-2">
                      Or {tier.yearly.price} {tier.yearly.period}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleCheckout(tier.priceId)}
                    disabled={!tier.priceId}
                    className="w-full"
                  >
                    {tier.priceId ? 'Upgrade' : 'Contact Us'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
