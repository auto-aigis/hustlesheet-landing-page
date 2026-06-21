"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AISProGate() {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AIS Reconciliation</h1>
        <p className="text-gray-500 mt-1">Cross-check your income with the Income Tax Department&rsquo;s Annual Information Statement</p>
      </div>
      <Card className="border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">Pro Feature</CardTitle>
          <CardDescription className="text-amber-700">AIS reconciliation is available on Pro and Premium plans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-amber-800">
            {[
              'Upload your AIS JSON from incometax.gov.in',
              'Auto-parse income entries and compare with your entered data',
              'Flag mismatches before you file',
              'Avoid tax notice from Income Tax Department',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
          <Button onClick={() => router.push('/pricing')} className="w-full bg-amber-600 hover:bg-amber-700">
            Upgrade to Pro — from ₹499/month
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">What is AIS?</CardTitle></CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>The <strong>Annual Information Statement (AIS)</strong> is a comprehensive document from the Income Tax Department reflecting all financial transactions reported by banks, employers, and platforms.</p>
           <p>Reconciling your AIS with your filed income ensures you don&rsquo;t miss any income and avoid scrutiny notices.</p>
        </CardContent>
      </Card>
    </div>
  );
}
