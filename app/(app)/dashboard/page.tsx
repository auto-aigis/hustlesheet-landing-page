"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { reconciliationApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

const currentFY = "FY2024-25";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await reconciliationApi.getReport(currentFY);
      setReport(data);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const hasMismatches =
    report &&
    (report.summary_mismatch > 0 || report.summary_missing > 0);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.display_name || user?.email}
        </p>
      </div>

      {!loading && report && hasMismatches && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 ml-2">
            ⚠️ {report.summary_mismatch + report.summary_missing} AIS discrepancies
            detected —{" "}
            <button
              onClick={() => router.push("/dashboard/ais/report")}
              className="font-medium underline hover:no-underline"
            >
              review now
            </button>
          </AlertDescription>
        </Alert>
      )}

      {!loading && report && !hasMismatches && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 ml-2">
            ✅ AIS reconciled for {currentFY}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              AIS Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {report ? report.summary_matched + report.summary_mismatch + report.summary_missing : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Matched ✅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {report ? report.summary_matched : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Issues ⚠️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">
              {report
                ? report.summary_mismatch + report.summary_missing
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => router.push("/dashboard/ais")}
            className="w-full justify-start"
          >
            Enter AIS Income →
          </Button>
          <Button
            onClick={() => router.push("/dashboard/ais/report")}
            variant="outline"
            className="w-full justify-start"
          >
            View Reconciliation Report →
          </Button>
          {user?.tier === "free" && (
            <Button
              onClick={() => router.push("/pricing")}
              variant="outline"
              className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Upgrade to Pro →
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
