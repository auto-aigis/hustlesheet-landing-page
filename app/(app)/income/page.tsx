"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { incomeApi } from '@/app/_lib/api';
import type { SideHustleStream } from '@/app/_lib/types';
import { Trash2 } from 'lucide-react';

export default function IncomePage() {
  const [ctc, setCtc] = useState('');
  const [streams, setStreams] = useState<SideHustleStream[]>([]);
  const [deduction80c, setDeduction80c] = useState('150000');
  const [deduction80d, setDeduction80d] = useState('0');
  const [hraExemption, setHraExemption] = useState('0');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const [newStreamName, setNewStreamName] = useState('');
  const [newStreamAmount, setNewStreamAmount] = useState('');
  const [newStreamType, setNewStreamType] = useState('professional_services');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await incomeApi.get();
        setCtc(String(profile.gross_annual_ctc || ''));
        setStreams(profile.side_hustle_streams);
        setDeduction80c(String(profile.deduction_80c));
        setDeduction80d(String(profile.deduction_80d));
        setHraExemption(String(profile.hra_exemption));
      } catch {
        setStreams([]);
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, []);

  const addStream = () => {
    if (!newStreamName || !newStreamAmount) {
      setError('Please fill all stream fields');
      return;
    }
    setStreams([...streams, {
      source_name: newStreamName,
      annual_amount: parseFloat(newStreamAmount),
      income_type: newStreamType as 'professional_services' | 'technical_services' | 'commission' | 'other',
      use_44ada: false,
    }]);
    setNewStreamName('');
    setNewStreamAmount('');
    setNewStreamType('professional_services');
  };

  const removeStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ctc) {
      setError('Please enter your annual CTC');
      return;
    }

    setLoading(true);
    try {
      await incomeApi.save({
        gross_annual_ctc: parseFloat(ctc),
        monthly_salary: null,
        basic: null,
        hra: null,
        special_allowance: null,
        deduction_80c: parseFloat(deduction80c) || 0,
        deduction_80d: parseFloat(deduction80d) || 0,
        hra_exemption: parseFloat(hraExemption) || 0,
        standard_deduction_applied: true,
        side_hustle_streams: streams,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save income');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Set Up Your Income</h1>
        <p className="text-gray-600 mt-2">Tell us about your salary and side-hustle income</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Salary Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gross Annual CTC (₹)</label>
              <Input
                type="number"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="1000000"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Side-Hustle Income</CardTitle>
            <CardDescription>Add each freelance, consulting, or gig income stream</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {streams.map((stream, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-md flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{stream.source_name}</p>
                  <p className="text-sm text-gray-600">₹{stream.annual_amount.toLocaleString()} ({stream.income_type})</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeStream(idx)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Input
                placeholder="Source name (e.g., Freelance)"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Annual amount (₹)"
                value={newStreamAmount}
                onChange={(e) => setNewStreamAmount(e.target.value)}
              />
              <Select value={newStreamType} onValueChange={setNewStreamType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional_services">Professional Services</SelectItem>
                  <SelectItem value="technical_services">Technical Services</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addStream} variant="outline" className="w-full">
                Add Stream
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deductions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Section 80C (Max ₹1,50,000)</label>
              <Input
                type="number"
                value={deduction80c}
                onChange={(e) => setDeduction80c(e.target.value)}
                placeholder="150000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Section 80D (Health Insurance)</label>
              <Input
                type="number"
                value={deduction80d}
                onChange={(e) => setDeduction80d(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">HRA Exemption</label>
              <Input
                type="number"
                value={hraExemption}
                onChange={(e) => setHraExemption(e.target.value)}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? 'Saving...' : 'Calculate My Taxes'}
        </Button>
      </form>
    </div>
  );
}