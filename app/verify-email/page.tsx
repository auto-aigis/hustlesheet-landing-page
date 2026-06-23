"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/_components/AuthProvider';
import { authApi } from '@/app/_lib/api';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  const token = searchParams?.get('token');
  const email = searchParams?.get('email');

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    if (!token) return;

    try {
      setLoading(true);
      await authApi.verifyEmail(token);
      await refresh();
      setMessage('Email verified successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email not found');
      return;
    }

    try {
      setResending(true);
      setError('');
      await authApi.resendVerification(email);
      setMessage('Verification email sent! Check your inbox.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Verifying your email...</div>;
  }

  if (message) {
    return (
      <Card className="w-full max-w-md bg-white border-gray-200">
        <CardContent className="pt-6 text-center text-green-600">{message}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          {token ? 'Verifying your email...' : 'Check your inbox for a verification link'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {email && !token && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              We sent a verification link to <strong>{email}</strong>. Click the link in your email to verify your account.
            </p>
            <Button
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full text-gray-900 border-gray-200"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
