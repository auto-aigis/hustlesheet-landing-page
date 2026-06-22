"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { reconciliationApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { ReconciliationReport } from "@/app/_lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

const currentFY = "FY2024-25";

export default function ReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<ReconciliationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await reconciliationApi.getReport(currentFY);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p>Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Alert variant="destructive">
          <AlertDescription>{error || "No reconciliation report found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isGated = report.is_gated && user?.tier === "free";

  return (
    <>
      {isGated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Unlock Full Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your AIS reconciliation is ready — upgrade to Pro (₹499/month) to see
                mismatches and avoid tax notices.
              </p>
              <Button
                onClick={() => router.push("/pricing")}
                className="w-full"
              >
                Upgrade to Pro
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <div className={`mx-auto max-w-5xl p-6 ${isGated ? "blur-sm" : ""}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AIS Reconciliation Report
          </h1>
          <p className="text-gray-600">{currentFY}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Matched ✅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {report.summary_matched}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mismatches ⚠️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                {report.summary_mismatch}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Missing 🚨
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {report.summary_missing}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-900">Status</th>
                    <th className="text-left p-3 font-medium text-gray-900">Source</th>
                    <th className="text-right p-3 font-medium text-gray-900">
                      AIS Amount
                    </th>
                    <th className="text-right p-3 font-medium text-gray-900">
                      Reported
                    </th>
                    <th className="text-right p-3 font-medium text-gray-900">Delta</th>
                    <th className="text-left p-3 font-medium text-gray-900">
                      Explanation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.line_items.map((item, idx) => {
                    let icon = null;
                    if (item.status === "matched") {
                      icon = <CheckCircle className="w-4 h-4 text-green-600" />;
                    } else if (item.status === "mismatch") {
                      icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
                    } else {
                      icon = <AlertCircle className="w-4 h-4 text-red-600" />;
                    }

                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">{icon}</div>
                        </td>
                        <td className="p-3 font-medium text-gray-900">
                          {item.source_name}
                        </td>
                        <td className="p-3 text-right text-gray-900">
                          ₹{item.ais_amount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-right text-gray-700">
                          {item.self_reported_amount !== null
                            ? `₹${item.self_reported_amount.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="p-3 text-right">
                          {item.delta !== null ? (
                            <span
                              className={`font-medium ${
                                item.delta > 0 ? "text-red-600" : "text-gray-700"
                              }`}
                            >
                              {item.delta > 0 ? "+" : ""}
                              ₹{item.delta.toLocaleString("en-IN")}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-700 max-w-xs">
                          {item.explanation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}