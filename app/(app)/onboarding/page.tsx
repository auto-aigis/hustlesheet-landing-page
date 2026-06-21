"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/app/_lib/hooks';
import { authApi } from '@/app/_lib/api';
import { CheckCircle2, Briefcase, Cpu, Truck, Youtube } from 'lucide-react';

const HUSTLE_TYPES = [
  {
    id: 'freelancing',
    label: 'Freelancing',
    desc: 'Software, design, writing, photography projects',
    icon: Cpu,
    ada: true,
  },
  {
    id: 'consulting',
    label: 'Consulting',
    desc: 'Professional advisory, management consulting',
    icon: Briefcase,
    ada: true,
  },
  {
    id: 'gig',
    label: 'Gig Work',
    desc: 'Delivery, ride-share, task-based platforms',
    icon: Truck,
    ada: false,
  },
  {
    id: 'affiliate',
    label: 'Affiliate / Content',
    desc: 'YouTube, blogging, affiliate marketing',
    icon: Youtube,
    ada: false,
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, refresh } = useAuth();

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleContinue = async () => {
    if (selected.length === 0) { setError('Please select at least one income type'); return; }
    setError('');
    setLoading(true);
    try {
      await authApi.onboarding(selected.join(','), displayName || undefined);
      await refresh();
      router.push('/income');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const has44ADA = selected.some(s => s === 'freelancing' || s === 'consulting');

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
          <span className="text-2xl">💼</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="text-gray-600 mt-2">Tell us about your side-hustle income to personalize your tax profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What type of side income do you earn?</CardTitle>
          <CardDescription>Select all that apply — this determines Section 44ADA eligibility and ITR form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HUSTLE_TYPES.map((ht) => {
              const active = selected.includes(ht.id);
              const Icon = ht.icon;
              return (
                <button
                  key={ht.id}
                  type="button"
                  onClick={() => toggle(ht.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon size={16} className={active ? 'text-blue-600' : 'text-gray-500'} />
                      </div>
                      <div>
                        <p className={`font-semibold ${active ? 'text-blue-900' : 'text-gray-900'}`}>{ht.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ht.desc}</p>
                        {ht.ada && (
                          <span className="inline-block mt-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                            44ADA eligible
                          </span>
                        )}
                      </div>
                    </div>
                    {active && <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0 ml-2" />}
                  </div>
                </button>
              );
            })}
          </div>

          {has44ADA && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={15} className="text-green-600" />Section 44ADA applies to your profile
              </p>
              <p className="text-xs text-green-700">
                Professional/freelance income ≤ ₹50L qualifies for 50% presumptive deduction — we&rsquo;ll calculate both scenarios for you.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Your Name <span className="text-gray-400 font-normal">(optional)</span></label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={loading || selected.length === 0}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Saving…
              </span>
            ) : 'Continue to Income Setup →'}
          </Button>
          <p className="text-center text-xs text-gray-400">You can update your profile anytime in Settings</p>
        </CardContent>
      </Card>
    </div>
  );
}
