"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/_components/AuthProvider';
import { authApi } from '@/app/_lib/api';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverified(false);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      await authApi.login(email, password);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg === 'email_not_verified') {
        setUnverified(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access HustleSheet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {unverified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-3">
                <p className="text-sm text-yellow-800">Please verify your email to log in.</p>
                <Button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  variant="outline"
                  className="w-full text-yellow-800 border-yellow-200"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              </div>
            )}

            {error && !unverified && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
            )}

            {error && unverified === false && !error.includes('Email') && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
