"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useAuth } from '@/app/_lib/hooks';

const tiers = [
  {
    name: 'Free',
    price: '₹0',
    description: 'Perfect to start',
    features: [
      'Unlimited income streams',
      'Tax calculation (Old & New regime)',
      'ITR category determination',
      '44ADA eligibility check',
      'Tax summary view',
      'PDF export with watermark',
    ],
    cta: 'Current Plan',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    description: 'For serious filers',
    features: [
      'Everything in Free',
      'Clean PDF & CSV export',
      'AIS reconciliation (coming soon)',
      'Quarterly tax alerts',
      'Email support',
      'Regime comparison history',
    ],
    cta: 'Upgrade to Pro',
    ctaVariant: 'default' as const,
  },
  {
    name: 'Premium',
    price: '₹999',
    period: '/month',
    description: 'Full tax mastery',
    features: [
      'Everything in Pro',
      'Expert review requests',
      'Priority support',
      'Family account (coming soon)',
      'Advanced tax planning',
      'Multi-year tracking',
    ],
    cta: 'Upgrade to Premium',
    ctaVariant: 'default' as const,
    highlight: true,
  },
];

export default function PricingPage() {
  const { subscription } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (tierName: string) => {
    setLoading(true);
    alert(`Paddle checkout would open for ${tierName} tier. This requires Paddle.js integration.`);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-900">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-600 mt-4">Choose the plan that fits your tax needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrentPlan = subscription?.plan === 'free' ? tier.name === 'Free' : tier.name !== 'Free';
          return (
            <Card
              key={tier.name}
              className={`flex flex-col ${
                tier.highlight ? 'ring-2 ring-blue-500 md:scale-105' : ''
              }`}
            >
              {tier.highlight && (
                <div className="px-6 py-2 bg-blue-500 text-white text-center text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  {tier.period && <span className="text-gray-600">{tier.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check size={18} className="mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(tier.name)}
                  disabled={loading || (tier.name === 'Free' && isCurrentPlan)}
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  className="w-full"
                >
                  {isCurrentPlan ? 'Current Plan' : tier.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Frequently asked questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-gray-900">Can I switch plans anytime?</p>
            <p className="text-sm text-gray-600 mt-1">Yes, you can upgrade or downgrade at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Is my data secure?</p>
            <p className="text-sm text-gray-600 mt-1">All your tax data is encrypted and stored securely. We never share your information.</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Do you offer refunds?</p>
            <p className="text-sm text-gray-600 mt-1">We offer a 7-day money-back guarantee on paid plans. No questions asked.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}