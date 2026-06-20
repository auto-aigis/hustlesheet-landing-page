"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Upload } from 'lucide-react';

export default function AISPage() {
  const { subscription } = useAuth();
  const router = useRouter();

  const isPro = subscription?.plan.includes('pro');

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">AIS Reconciliation</h1>
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            Upgrade to Pro to access AIS reconciliation features.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/pricing')} className="w-full">
          View Pricing Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">AIS Reconciliation</h1>
        <p className="text-gray-600 mt-2">Cross-check your income with your AIS (Annual Information Statement)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload AIS JSON</CardTitle>
          <CardDescription>Import your AIS data for reconciliation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              <strong>Coming soon!</strong> AIS reconciliation is under development. We&apos;ll notify you when it&apos;s ready.
            </AlertDescription>
          </Alert>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">Upload your AIS JSON file</p>
            <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
            <button className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Browse Files
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Get your AIS from the Income Tax Department portal at www.incometax.gov.in
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Download your AIS JSON from the Income Tax portal</li>
            <li>Upload the file here to compare with your entered income</li>
            <li>View any discrepancies and reconcile them</li>
            <li>Export a reconciliation report for your records</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}