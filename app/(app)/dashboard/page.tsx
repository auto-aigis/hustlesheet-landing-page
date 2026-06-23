"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { taxApi } from '@/app/_lib/api';
import { TaxAlertResponse } from '@/app/_lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<TaxAlertResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const checkoutSuccess = searchParams.get('checkout');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await taxApi.alerts();
        setAlerts(data);
      } catch (err) {
        console.error('Failed to load alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const dueSoonAlerts = alerts.filter((a) => a.status === 'due_soon');

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.display_name || user?.email}</p>
      </div>

      {checkoutSuccess === 'success' && (
        <Alert>
          <AlertDescription>Payment successful! You now have Pro access.</AlertDescription>
        </Alert>
      )}

      {dueSoonAlerts.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Advance tax Q{dueSoonAlerts[0].quarter.slice(1)} due in {dueSoonAlerts[0].days_until_due} days.</strong> You owe ₹{Math.floor(dueSoonAlerts[0].amount_due).toLocaleString('en-IN')}.
            <Button
              onClick={() => router.push('/dashboard/tax-planner')}
              variant="link"
              className="ml-2 h-auto p-0"
            >
              View details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Your current tax profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Tax Regime</p>
              <p className="text-lg font-semibold text-gray-900">{user?.tax_regime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">44ADA Presumptive</p>
              <p className="text-lg font-semibold text-gray-900">{user?.is_44ada ? 'Yes (50% deduction)' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Planner</CardTitle>
          <CardDescription>View quarterly advance tax projections</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/dashboard/tax-planner')} className="w-full">Open Tax Planner</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
