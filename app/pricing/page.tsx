"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, usePro } from '@/app/_lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const isPro = usePro();
  const [sandbox, setSandbox] = useState(true);

  useEffect(() => {
    const initPaddle = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.onload = () => {
        const w = window as any;
        if (w.Paddle) {
          w.Paddle.Environment.set(sandbox ? 'sandbox' : 'production');
          w.Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            eventCallback: (data: any) => {
              if (data.event === 'checkout.completed') {
                const txnId = data.data?.transaction_id;
                if (txnId) {
                  window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
                }
              }
            },
          });
        }
      };
      document.head.appendChild(script);
    };

    if (typeof window !== 'undefined' && !window.Paddle) {
      initPaddle();
    }
  }, [sandbox]);

  const handleCheckout = (priceId: string | undefined) => {
    if (!priceId) {
      alert('Price not configured');
      return;
    }
    const w = window as any;
    if (w.Paddle) {
      w.Paddle.Checkout.open({ items: [{ priceId }] });
    }
  };

  const tiers = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Get started with basic tax tracking',
      priceId: null,
      features: [
        'Income entry',
        'Tax regime selection',
        'Basic tax calculation (teaser)',
        'Community support',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      price: '₹499',
      period: 'per month',
      description: 'Full advance tax projection & alerts',
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO ?? null,
      features: [
        'Quarterly advance tax projection',
        'TDS & payment tracking',
        '234B/234C interest flags',
        'Section citations',
        'Deadline alerts',
        'Email notifications',
      ],
      cta: isPro ? 'Current Plan' : 'Upgrade to Pro',
    },
    {
      name: 'Premium',
      price: '₹999',
      period: 'per month',
      description: 'Everything in Pro + priority support',
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM ?? null,
      features: [
        'All Pro features',
        'Priority email support',
        'Custom tax scenarios',
        'Advanced analytics',
      ],
      cta: 'Upgrade to Premium',
    },
  ];

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-gray-600">Choose the plan that works best for you</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div>
                <p className="text-3xl font-bold text-gray-900">{tier.price}</p>
                <p className="text-sm text-gray-600">{tier.period}</p>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCheckout(tier.priceId)}
                className="w-full"
                disabled={tier.cta === 'Current Plan'}
              >
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}