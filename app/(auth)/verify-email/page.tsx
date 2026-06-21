"use client";

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail size={32} className="text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-center">Check your inbox</CardTitle>
        <CardDescription className="text-center">
          {email ? `We sent a verification link to ${email}` : 'A verification email has been sent'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          Click the link in the email to activate your account and start optimising your taxes.
        </p>
        <p className="text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">Back to Sign In</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Suspense fallback={<div className="text-gray-600">Loading…</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
