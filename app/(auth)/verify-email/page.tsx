"use client";

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/app/_lib/hooks';
import { paymentsApi } from '@/app/_lib/api';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const verifyToken = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await paymentsApi.verifyTransaction(token);
      setSuccess(true);
      await refresh();
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }, [token, refresh, router]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]);

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to resend');
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setResendLoading(false);
    }
  };

  if (token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verifying Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="text-gray-600">Verifying...</div>}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">Email verified! Redirecting...</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>We sent a verification link to {email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Check your inbox for the verification link. Click it to verify your email and activate your account.
        </p>
        {resendSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">Email sent! Check your inbox.</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleResend}
          disabled={resendLoading}
          variant="outline"
          className="w-full"
        >
          {resendLoading ? 'Sending...' : 'Resend Verification Email'}
        </Button>
        <p className="text-center text-sm text-gray-600">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}