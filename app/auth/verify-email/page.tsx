"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      authApi
        .verifyEmail(token)
        .then(() => {
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 2000);
        })
        .catch((err) => {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Verification failed");
        });
    } else {
      setStatus("loading");
    }
  }, [token, router]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  if (token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" && <p className="text-center">Verifying...</p>}
            {status === "success" && (
              <>
                <Alert>
                  <AlertDescription>
                    Email verified! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              </>
            )}
            {status === "error" && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            We've sent a verification link to <strong>{email}</strong>. Click the
            link in the email to verify your account.
          </p>
          {resendSuccess && (
            <Alert>
              <AlertDescription>Verification email sent!</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full"
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <p className="text-sm text-gray-600 text-center">
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Back to sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
