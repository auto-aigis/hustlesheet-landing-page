"use client";

import { useAuth } from '@/app/_lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user, subscription } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account and subscription</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
          </div>
          {user?.display_name && (
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">{user.display_name}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(user?.created_at || '').toLocaleDateString('en-IN')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Current Plan</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-lg font-semibold text-gray-900 capitalize">{subscription?.tier || 'Free'}</p>
              <Badge>{subscription?.status || 'inactive'}</Badge>
            </div>
          </div>
          {subscription?.current_period_end && (
            <div>
              <p className="text-sm text-gray-600">Period Ends</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(subscription.current_period_end).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-600">
            {subscription?.tier === 'free'
              ? 'Upgrade to Pro or Premium to unlock advanced tax features.'
              : subscription?.tier === 'pro'
              ? 'You have access to all Pro features including advance tax projections and alerts.'
              : 'You have access to all Pro and Premium features with priority support.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
