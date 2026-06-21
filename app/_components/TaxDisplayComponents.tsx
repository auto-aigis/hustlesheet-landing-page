"use client";

import { TaxSummary } from '@/app/_lib/types';

function fmt(n: number) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

export function RegimeCard({ summary, side }: { summary: TaxSummary; side: 'old' | 'new' }) {
  const rec = summary.recommended_regime === side;
  const taxable = side === 'old' ? summary.taxable_income_old : summary.taxable_income_new;
  const tax = side === 'old' ? summary.tax_old_regime : summary.tax_new_regime;
  const cess = side === 'old' ? summary.cess_old : summary.cess_new;
  const total = side === 'old' ? summary.total_tax_old : summary.total_tax_new;
  const label = side === 'old' ? 'Old Regime' : 'New Regime';

  return (
    <div className={`rounded-xl border p-4 ${rec ? 'ring-2 ring-blue-500 shadow-sm' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        {rec && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">✓ Recommended</span>}
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Taxable Income</span><span className="font-medium">{fmt(taxable)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Income Tax</span><span className="font-medium">{fmt(tax)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Cess (4%)</span><span className="font-medium">{fmt(cess)}</span></div>
        <div className={`flex justify-between pt-2 border-t-2 ${rec ? 'border-blue-500' : 'border-gray-900'}`}>
          <span className="font-bold text-gray-900">Total Tax</span>
          <span className={`font-bold text-lg ${rec ? 'text-blue-700' : 'text-gray-900'}`}>{fmt(total)}</span>
        </div>
      </div>
    </div>
  );
}

export function CalcLines({ lines, title }: { lines: { label: string; amount: number }[]; title: string }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
      </div>
      <div className="p-3 space-y-0">
        {lines.map((l, i) => {
          const isNeg = l.amount < 0;
          const isTotal = l.label.toLowerCase().includes('total tax payable');
          return (
            <div key={i} className={`flex justify-between items-start py-1.5 ${isTotal ? 'border-t-2 border-gray-800 mt-1 pt-2.5' : 'border-b border-gray-50'}`}>
              <span className={`text-xs flex-1 pr-2 leading-snug ${isTotal ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{l.label}</span>
              <span className={`text-xs font-semibold whitespace-nowrap ${isNeg ? 'text-red-500' : isTotal ? 'text-gray-900 text-sm' : 'text-gray-900'}`}>
                {isNeg ? `− ${fmt(Math.abs(l.amount))}` : fmt(l.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { fmt };
