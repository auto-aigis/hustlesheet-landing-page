"use client";

import { Suspense, useSearchParams } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useState } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token');
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>Check your inbox for verification link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token ? (
            <>
              <Alert>
                <AlertDescription>
                  We sent a verification link to <strong>{email}</strong>. Click the link in the email to verify your account.
                </AlertDescription>
              </Alert>
              {resent && (
                <Alert>
                  <AlertDescription>Verification email sent!</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleResend} variant="outline" className="w-full">
                Resend Verification Email
              </Button>
            </>
          ) : (
            <Alert>
              <AlertDescription>Verifying your email...</AlertDescription>
            </Alert>
          )}
          <p className="text-center text-sm text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
