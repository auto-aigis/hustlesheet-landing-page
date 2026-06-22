"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await authApi.getSubscription();
      setSubscription(data);
    } catch {
      setError("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your HustleSheet account</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            {user?.display_name && (
              <div>
                <p className="text-sm text-gray-600">Display Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {user.display_name}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-2">Email Verified</p>
              <Badge variant={user?.is_email_verified ? "default" : "secondary"}>
                {user?.is_email_verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {subscription?.tier || "Free"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <Badge
                    variant={
                      subscription?.status === "active" ? "default" : "secondary"
                    }
                  >
                    {subscription?.status || "Inactive"}
                  </Badge>
                </div>
                {subscription?.current_period_end && (
                  <div>
                    <p className="text-sm text-gray-600">Renews</p>
                    <p className="text-gray-900">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user?.tier === "free" && (
                  <Button onClick={handleUpgrade} className="w-full">
                    Upgrade to Pro
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}