"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/_lib/hooks';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      router.push('/income');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to HustleSheet, {user?.email?.split('@')[0]}</CardTitle>
          <CardDescription>Optimize your taxes with confidence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              HustleSheet helps salaried professionals with side-hustle income understand their tax obligations.
            </p>
            <p className="text-gray-700">
              We'll help you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Calculate tax under Old and New regimes</li>
              <li>Determine the right ITR category for your filing</li>
              <li>Explore presumptive taxation benefits</li>
              <li>Understand Section 44ADA eligibility for your income</li>
            </ul>
          </div>
          <Button
            onClick={handleGetStarted}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? 'Loading...' : 'Set Up Your Income'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}