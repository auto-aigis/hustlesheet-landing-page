"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import type { AISEntry } from '@/app/_lib/ais-parser';

function fmt(n: number) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

interface Props {
  entries: AISEntry[];
  aisTotal: number;
  manualIncome: string;
  setManualIncome: (v: string) => void;
  onUpdateIncome: () => void;
}

export default function AISResults({ entries, aisTotal, manualIncome, setManualIncome, onUpdateIncome }: Props) {
  const entered = parseFloat(manualIncome) || 0;
  const diff = aisTotal - entered;
  const reconciled = Math.abs(diff) < 1;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AIS Income Entries</CardTitle>
          <CardDescription>All income sources reported to the Income Tax Department</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {entries.map((entry, i) => (
            <div key={i} className="py-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{entry.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">{entry.source}</p>
              </div>
              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">{fmt(entry.amount)}</span>
            </div>
          ))}
          <div className="pt-3 flex justify-between font-bold text-gray-900">
            <span>Total AIS Income</span>
            <span className="text-blue-700">{fmt(aisTotal)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Check</CardTitle>
          <CardDescription>Compare AIS total with your entered gross income</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Your Entered Gross Income (₹)</label>
            <input
              type="number"
              value={manualIncome}
              onChange={(e) => setManualIncome(e.target.value)}
              placeholder="Enter your total gross income as filed"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {manualIncome && (
            <div className={`rounded-xl p-4 border-2 ${reconciled ? 'border-green-400 bg-green-50' : 'border-amber-400 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                {reconciled ? <CheckCircle2 size={20} className="text-green-600" /> : <AlertTriangle size={20} className="text-amber-600" />}
                <span className={`font-bold ${reconciled ? 'text-green-900' : 'text-amber-900'}`}>
                  {reconciled ? 'Fully Reconciled ✓' : 'Mismatch Detected'}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">AIS Reported Total</span><span className="font-semibold">{fmt(aisTotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Your Entered Income</span><span className="font-semibold">{fmt(entered)}</span></div>
                <div className={`flex justify-between pt-2 border-t font-bold ${diff > 0 ? 'text-red-700' : diff < 0 ? 'text-amber-700' : 'text-green-700'}`}>
                  <span>Difference</span>
                  <span>{diff > 0 ? `+${fmt(diff)} (under-reported)` : diff < 0 ? `${fmt(diff)} (over-reported)` : 'None'}</span>
                </div>
              </div>
              {!reconciled && (
                <p className="text-xs mt-3 text-amber-800">
                  {diff > 0
                    ? `AIS shows ${fmt(diff)} more than entered. Include this in your ITR to avoid a tax notice.`
                    : `You entered ${fmt(Math.abs(diff))} more than AIS. Verify any non-AIS income is correctly explained.`}
                </p>
              )}
            </div>
          )}
          <Button onClick={onUpdateIncome} variant="outline" className="w-full">
            <RefreshCw size={15} className="mr-2" />Update Income Profile
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
