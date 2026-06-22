"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "0",
    billingPeriod: "Forever",
    description: "Get started with tax tracking",
    cta: "Current Plan",
    ctaVariant: "outline" as const,
    features: [
      "Enter AIS income data",
      "Basic income tracking",
      "Limited to current FY",
  useEffect(() => {\n    const script = document.createElement(\"script\");
  {
    name: "Pro",
    price: "499",
    billingPeriod: "per month",
    paddleMonthlyId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO,
    paddleYearlyId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_YEARLY,
    description: "Complete reconciliation and compliance",
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
    features: [
      "Full AIS reconciliation",
      "Mismatch detection & alerts",
      "Compliance recommendations",
      "Multiple fiscal years",
      "Priority support",
    ],
  },
  {
    name: "Premium",
    price: "999",
    billingPeriod: "per month",
    paddleMonthlyId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM,
    paddleYearlyId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM_YEARLY,
    description: "All Pro features with enterprise benefits",
    cta: "Upgrade to Premium",
    ctaVariant: "default" as const,
    features: [
      "Everything in Pro",
      "Advanced tax scenarios",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script")>
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const Paddle = (window as any).Paddle;
      if (Paddle) {
        Paddle.Environment.set("sandbox");
        Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
        });
        setPaddleLoaded(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleUpgrade = (tierId: string, name: string) => {
    if (name === "Free") return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.tier !== "free") {
      return;
    }

    const Paddle = (window as any).Paddle;
    if (!Paddle) return;

    const priceId = billingPeriod === "monthly"
      ? tierId === "pro"
        ? process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM
      : tierId === "pro"
        ? process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_YEARLY
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM_YEARLY;

    if (!priceId) {
      alert("Pricing not configured");
      return;
    }

    Paddle.Checkout.open({
      items: [{ priceId }],
      customData: { userId: user.id },
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
      },
      eventCallback(type: string, data: any) {
        if (type === "checkout.completed") {
          const txnId = data.data.transaction_id;
          window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
        }
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Simple Pricing</h1>
        <p className="text-gray-600">Choose the plan that fits your needs</p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <Button
          variant={billingPeriod === "monthly" ? "default" : "outline"}
          onClick={() => setBillingPeriod("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={billingPeriod === "yearly" ? "default" : "outline"}
          onClick={() => setBillingPeriod("yearly")}
        >
          Yearly (Save 17%)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const isCurrentPlan =
            (tier.name === "Free" && user?.tier === "free") ||
            (tier.name === "Pro" && user?.tier === "pro") ||
            (tier.name === "Premium" && user?.tier === "premium");

          return (
            <Card
              key={tier.name}
              className={`relative ${isCurrentPlan ? "ring-2 ring-blue-500" : ""}`}
            >
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-4 bg-blue-600">Current</Badge>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    {tier.price === "0" ? "Free" : `₹${tier.price}`}
                  </p>
                  <p className="text-sm text-gray-600">{tier.billingPeriod}</p>
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(tier.name.toLowerCase(), tier.name)}
                  variant={isCurrentPlan ? "outline" : "default"}
                  className="w-full"
                  disabled={isCurrentPlan}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}