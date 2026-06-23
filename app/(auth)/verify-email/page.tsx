"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/app/_lib/api';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Verification code is required');
      return;
    }

    try {
      setLoading(true);
      await authApi.verifyEmail(email, code);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await authApi.resendVerification(email);
      setError('Verification email sent! Check your inbox.');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>Enter the code sent to {email || 'your email'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {resending ? 'Sending...' : 'Resend'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
