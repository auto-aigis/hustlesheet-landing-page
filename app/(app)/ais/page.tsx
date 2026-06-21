"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Upload, CheckCircle2, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import AISProGate from '@/app/_components/AISProGate';
import AISResults from '@/app/_components/AISResults';
import { parseAISJson, type AISEntry } from '@/app/_lib/ais-parser';


export default function AISPage() {
  const { subscription } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [aisData, setAisData] = useState<AISEntry[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [parseError, setParseError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [manualIncome, setManualIncome] = useState('');

  const isPro = subscription?.plan === 'pro_monthly' || subscription?.plan === 'pro_annual' || subscription?.plan === 'premium_monthly';

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) { setParseError('Please upload a JSON file from the Income Tax portal.'); return; }
    setParseError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const entries = parseAISJson(parsed);
        if (!entries.length) { setParseError('No income entries found. Ensure you downloaded the correct AIS JSON.'); setAisData(null); }
        else setAisData(entries);
      } catch { setParseError('Invalid JSON. Please download again from incometax.gov.in.'); setAisData(null); }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  if (!isPro) return <AISProGate />;

  const aisTotal = aisData ? aisData.reduce((s, e) => s + e.amount, 0) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AIS Reconciliation</h1>
        <p className="text-gray-500 mt-1">Upload your AIS JSON to compare with your entered income</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upload AIS JSON</CardTitle>
          <CardDescription>Download from <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">incometax.gov.in</a> → AIS → Download JSON</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {parseError && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{parseError}</AlertDescription></Alert>}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
          >
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <Upload size={32} className={`mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            {fileName ? (
              <div className="space-y-1">
                <p className="font-medium text-gray-900 flex items-center justify-center gap-2"><FileText size={16} />{fileName}</p>
                <p className="text-sm text-green-600">Click to replace</p>
              </div>
            ) : (
              <div><p className="text-gray-700 font-medium">Drop your AIS JSON here</p><p className="text-sm text-gray-500 mt-1">or click to browse</p></div>
            )}
          </div>
          {aisData && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800 flex items-center gap-2">
                <CheckCircle2 size={15} />Parsed {aisData.length} income entries · AIS total: <strong>₹{Math.round(aisTotal).toLocaleString('en-IN')}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {aisData && <AISResults entries={aisData} aisTotal={aisTotal} manualIncome={manualIncome} setManualIncome={setManualIncome} onUpdateIncome={() => router.push('/income')} />}
      <Card>
        <CardHeader><CardTitle className="text-base">How to download your AIS</CardTitle></CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Log in to <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">incometax.gov.in</a></li>
            <li>Go to <strong>Services → Annual Information Statement (AIS)</strong></li>
            <li>Select FY2024-25 and click <strong>Download JSON</strong></li>
            <li>Upload the downloaded file here</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
