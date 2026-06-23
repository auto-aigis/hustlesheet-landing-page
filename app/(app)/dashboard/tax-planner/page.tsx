"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, usePro } from '@/app/_lib/hooks';
import { taxApi } from '@/app/_lib/api';
import { TaxProjectionResponse, QuarterlyInstallment } from '@/app/_lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lock } from 'lucide-react';

export default function TaxPlannerPage() {
  const router = useRouter();
  const { subscription, loading } = useAuth();
  const isPro = usePro();
  const [projection, setProjection] = useState<TaxProjectionResponse | null>(null);
  const [loadingProj, setLoadingProj] = useState(true);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState<Record<string, { tds: number; advance: number }>>({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && isPro) {
      const loadProjection = async () => {
        try {
          const data = await taxApi.projection();
          setProjection(data);
          const initialPayments: Record<string, { tds: number; advance: number }> = {};
          data.installments.forEach((q) => {
            initialPayments[q.quarter] = {
              tds: q.paid_so_far,
              advance: 0,
            };
          });
          setPayments(initialPayments);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load projection');
        } finally {
          setLoadingProj(false);
        }
      };
      loadProjection();
    } else if (!loading && !isPro) {
      setLoadingProj(false);
    }
  }, [loading, isPro]);

  const handlePaymentUpdate = async (quarter: string) => {
    setUpdating(true);
    try {
      const p = payments[quarter];
      await taxApi.payments(quarter, p.tds, p.advance);
      const data = await taxApi.projection();
      setProjection(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || loadingProj) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isPro) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Tax Planner</h1>
        <div className="relative space-y-4 opacity-50">
          {[1, 2, 3, 4].map((q) => (
            <Card key={q}>
              <CardContent className="pt-6">
                <div className="h-20 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Upgrade to Pro to unlock advance tax projections.</strong> Know your quarterly deadlines and payment obligations.
            <Button
              onClick={() => router.push('/pricing')}
              variant="link"
              className="ml-2 h-auto p-0"
            >
              Upgrade to Pro (₹499/month)
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tax Planner</h1>
        <p className="mt-2 text-gray-600">Quarterly advance tax projection for FY {projection?.financial_year}</p>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {projection && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Annual Tax Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Estimated Annual Tax</p>
                  <p className="text-2xl font-bold text-gray-900">₹{Math.floor(projection.estimated_annual_tax).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Advance Tax Liable</p>
                  <Badge variant={projection.is_liable_for_advance_tax ? 'default' : 'secondary'}>
                    {projection.is_liable_for_advance_tax ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-600">{projection.liability_explanation}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {projection.installments.map((inst: QuarterlyInstallment) => {
              const statusColor =
                inst.balance_remaining <= 0 ? 'bg-green-50 border-green-200' :
                inst.balance_remaining > inst.amount_due_this_quarter ? 'bg-red-50 border-red-200' :
                'bg-amber-50 border-amber-200';
              const statusLabel =
                inst.balance_remaining <= 0 ? 'Paid' :
                inst.balance_remaining > inst.amount_due_this_quarter ? 'Overdue' :
                'Due Soon';

              return (
                <Card key={inst.quarter} className={`border-2 ${statusColor}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{inst.quarter}</CardTitle>
                        <CardDescription>
                          Due: {new Date(inst.due_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </CardDescription>
                      </div>
                      <Badge>{statusLabel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray-600">This Quarter</p>
                        <p className="text-lg font-semibold text-gray-900">₹{Math.floor(inst.amount_due_this_quarter).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Cumulative Due</p>
                        <p className="text-lg font-semibold text-gray-900">₹{Math.floor(inst.cumulative_due).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Paid So Far</p>
                        <p className="text-lg font-semibold text-gray-900">₹{Math.floor(inst.paid_so_far).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Balance</p>
                        <p className="text-lg font-semibold text-gray-900">₹{Math.floor(inst.balance_remaining).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <Label htmlFor={`tds-${inst.quarter}`} className="text-xs">TDS Deducted (₹)</Label>
                        <Input
                          id={`tds-${inst.quarter}`}
                          type="number"
                          value={payments[inst.quarter]?.tds || 0}
                          onChange={(e) =>
                            setPayments({
                              ...payments,
                              [inst.quarter]: {
                                ...payments[inst.quarter],
                                tds: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`advance-${inst.quarter}`} className="text-xs">Advance Tax Paid (₹)</Label>
                        <Input
                          id={`advance-${inst.quarter}`}
                          type="number"
                          value={payments[inst.quarter]?.advance || 0}
                          onChange={(e) =>
                            setPayments({
                              ...payments,
                              [inst.quarter]: {
                                ...payments[inst.quarter],
                                advance: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={() => handlePaymentUpdate(inst.quarter)}
                        className="w-full"
                        disabled={updating}
                      >
                        {updating ? 'Saving...' : 'Save Payment'}
                      </Button>
                    </div>

                    <p className="text-xs text-gray-600 pt-2">{inst.explanation}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {projection.risk_234b && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Section 234B Risk:</strong> {projection.risk_234b_explanation}
              </AlertDescription>
            </Alert>
          )}

          {projection.risk_234c && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Section 234C Risk:</strong> {projection.risk_234c_explanation}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
