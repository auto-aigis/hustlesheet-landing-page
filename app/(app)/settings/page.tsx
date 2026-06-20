"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/app/_lib/hooks';
import { settingsApi } from '@/app/_lib/api';

export default function SettingsPage() {
  const [alertEmail, setAlertEmail] = useState('');
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const { subscription, user } = useAuth();

  const isPro = subscription?.plan.includes('pro') || subscription?.plan === 'premium_monthly';
  const isPremium = subscription?.plan === 'premium_monthly';

  const handleOptInAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) return;
    setAlertLoading(true);
    try {
      await settingsApi.optInAlerts(alertEmail);
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 3000);
      setAlertEmail('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to opt in');
    } finally {
      setAlertLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    setReviewLoading(true);
    try {
      await settingsApi.submitExpertReview();
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Current Plan</label>
            <p className="text-gray-900 capitalize">{subscription?.plan.replace('_', ' ')}</p>
          </div>
        </CardContent>
      </Card>

      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Tax Alerts</CardTitle>
            <CardDescription>Get estimated tax updates every quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOptInAlerts} className="space-y-4">
              {alertSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">Alert email saved!</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email for alerts</label>
                <Input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <Button disabled={alertLoading} type="submit">
                {alertLoading ? 'Saving...' : 'Save Alert Email'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle>Expert Review</CardTitle>
            <CardDescription>Request a detailed tax review from our experts</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewSuccess && (
              <Alert className="border-green-200 bg-green-50 mb-4">
                <AlertDescription className="text-green-800">Review submitted! We'll be in touch soon.</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Our tax experts will review your income profile and tax calculations, providing personalized recommendations.
            </p>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="w-full"
            >
              {reviewLoading ? 'Submitting...' : 'Request Expert Review'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Need help?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Email us at <span className="font-medium">support@hustlesheet.com</span> for any questions or issues.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}