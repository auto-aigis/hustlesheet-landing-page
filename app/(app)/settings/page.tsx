"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/app/_lib/hooks';
import { settingsApi } from '@/app/_lib/api';
import { useRouter } from 'next/navigation';
import { Star, Bell, User, CreditCard, LogOut, Shield } from 'lucide-react';

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  pro_monthly: 'Pro (Monthly)',
  pro_annual: 'Pro (Annual)',
  premium_monthly: 'Premium',
};

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  pro_monthly: 'bg-blue-100 text-blue-700',
  pro_annual: 'bg-blue-100 text-blue-700',
  premium_monthly: 'bg-purple-100 text-purple-700',
};

export default function SettingsPage() {
  const [alertEmail, setAlertEmail] = useState('');
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const { subscription, user, logout } = useAuth();
  const router = useRouter();

  const plan = subscription?.plan || 'free';
  const isPro = plan === 'pro_monthly' || plan === 'pro_annual' || plan === 'premium_monthly';
  const isPremium = plan === 'premium_monthly';

  const handleOptInAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) return;
    setAlertLoading(true);
    try {
      await settingsApi.optInAlerts(alertEmail);
      setAlertSuccess(true);
      setAlertEmail('');
      setTimeout(() => setAlertSuccess(false), 5000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setAlertLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    setReviewLoading(true);
    try {
      await settingsApi.submitExpertReview();
      setReviewSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account, plan, and preferences</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><User size={16} />Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Current Plan</p>
              <Badge className={`mt-1 ${PLAN_COLORS[plan]}`}>{PLAN_LABELS[plan]}</Badge>
            </div>
            <Button onClick={() => router.push('/pricing')} size="sm" variant={plan === 'free' ? 'default' : 'outline'}>
              {plan === 'free' ? 'Upgrade' : 'Change Plan'}
            </Button>
          </div>
          {user?.side_hustle_types && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Income Profile</p>
                <div className="flex gap-2 flex-wrap">
                  {user.side_hustle_types.split(',').map((t) => (
                    <Badge key={t} className="bg-gray-100 text-gray-700 capitalize">{t}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          {subscription?.current_period_end && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Renews</p>
                <p className="text-sm text-gray-700">{new Date(subscription.current_period_end).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quarterly Alerts — Pro+ */}
      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Bell size={16} />Quarterly Tax Alerts</CardTitle>
            <CardDescription>Get advance tax payment reminders every quarter (15 June, 15 Sept, 15 Dec, 15 Mar)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOptInAlerts} className="space-y-4">
              {alertSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">✓ Alert email saved! You'll receive quarterly reminders.</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button type="submit" disabled={alertLoading || !alertEmail}>
                  {alertLoading ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expert Review — Premium only */}
      {isPremium && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-purple-900">
              <Star size={16} className="text-purple-600" />Expert Tax Review
            </CardTitle>
            <CardDescription>Submit your tax data for review by a qualified CA (48-hour SLA)</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewSuccess ? (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  ✓ Your summary has been submitted. A tax expert will review within 48 hours.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Our qualified CAs will review your full income profile, tax calculations, and 44ADA analysis,
                  then provide personalised recommendations and flag any potential issues.
                </p>
                <Button
                  onClick={handleSubmitReview}
                  disabled={reviewLoading}
                  className="w-full bg-purple-700 hover:bg-purple-800"
                >
                  {reviewLoading ? 'Submitting…' : 'Request Expert Review →'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA for non-pro */}
      {!isPro && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900"><CreditCard size={16} />Unlock Pro Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li>✓ Clean PDF & CSV export (no watermark)</li>
              <li>✓ Quarterly advance tax reminders</li>
              <li>✓ AIS reconciliation (coming soon)</li>
            </ul>
            <Button onClick={() => router.push('/pricing')} className="w-full bg-blue-600 hover:bg-blue-700">
              View Pricing — from ₹499/month
            </Button>
          </CardContent>
        </Card>
      )}

      {!isPremium && isPro && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900"><Star size={16} />Upgrade to Premium</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-purple-800">Get expert CA review of your tax summary with personalised recommendations.</p>
            <Button onClick={() => router.push('/pricing')} className="w-full bg-purple-700 hover:bg-purple-800">
              Upgrade to Premium — ₹999/month
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Shield size={16} />Security & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Support: <a href="mailto:support@hustlesheet.in" className="text-blue-600 hover:underline font-medium">support@hustlesheet.in</a>
          </p>
          <p className="text-xs text-gray-400">Your data is encrypted at rest and in transit. We follow Indian data protection norms.</p>
          <Button onClick={logout} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            <LogOut size={15} className="mr-2" />Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
