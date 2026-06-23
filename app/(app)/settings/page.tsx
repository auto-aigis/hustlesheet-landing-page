"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/app/_components/AuthProvider';
import { authApi, taxApi } from '@/app/_lib/api';
import type { Subscription } from '@/app/_lib/types';

export default function Settings() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [annualIncome, setAnnualIncome] = useState('');
  const [regime, setRegime] = useState<'old' | 'new'>('old');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const sub = await authApi.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!annualIncome) {
      setMessage('Please enter annual income');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      await taxApi.updateProfile(parseFloat(annualIncome), regime);
      setMessage('Tax profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-2xl p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your registered email and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-900">Email</Label>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-gray-900 font-medium">
              {user?.email}
            </div>
          </div>
          <div>
            <Label className="text-gray-900">Name</Label>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-gray-900 font-medium">
              {user?.display_name}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-900">Current Plan</Label>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-gray-900 font-medium capitalize">
              {subscription?.tier}
            </div>
          </div>
          <div>
            <Label className="text-gray-900">Status</Label>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-gray-900 font-medium capitalize">
              {subscription?.status}
            </div>
          </div>
          {subscription?.current_period_end && (
            <div>
              <Label className="text-gray-900">Renewal Date</Label>
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-gray-900 font-medium">
                {new Date(subscription.current_period_end).toLocaleDateString('en-IN')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Tax Profile</CardTitle>
          <CardDescription>Configure your annual income and tax regime</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="income">Annual Income (₹)</Label>
            <Input
              id="income"
              type="number"
              placeholder="500000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              min="0"
              step="1"
            />
          </div>

          <div>
            <Label htmlFor="regime">Tax Regime</Label>
            <Select value={regime} onValueChange={(val) => setRegime(val as 'old' | 'new')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="old">Old Regime</SelectItem>
                <SelectItem value="new">New Regime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <div className={`text-sm p-3 rounded ${
              message.includes('successfully')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Tax Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
