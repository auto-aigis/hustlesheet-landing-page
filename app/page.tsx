"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  IndianRupee,
  Calculator,
  FileText,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function Page() {
  const [email, setEmail] = useState("");

  const features: Feature[] = [
    {
      icon: <IndianRupee className="h-6 w-6 text-emerald-600" />,
      title: "Multi-Source Income Aggregation",
      description:
        "Link salary (Form 16), freelance income, UPI receipts, Razorpay payouts, and gig platform earnings in one unified dashboard.",
    },
    {
      icon: <Calculator className="h-6 w-6 text-emerald-600" />,
      title: "Auto Tax Calculation",
      description:
        "Instantly see your tax liability under both old and new regimes. Know exactly which one saves you more — no CA needed.",
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-600" />,
      title: "Section 44ADA Smart Detection",
      description:
        "Automatically flags if your freelance income qualifies for presumptive taxation, saving you from maintaining books of accounts.",
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-emerald-600" />,
      title: "AIS Mismatch Alerts",
      description:
        "Cross-checks your logged income against Annual Information Statement data to catch discrepancies before ITR filing.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      title: "Live Tax Meter",
      description:
        "A real-time dashboard showing your actual tax bill as income flows in throughout the year. No more year-end surprises.",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "ITR-4 Ready Summary",
      description:
        "Generate a clean, tax-ready summary formatted for ITR-4 filing. Hand it to your CA or file it yourself in minutes.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Add Your Income Sources",
      description:
        "Upload Form 16, connect UPI apps, or manually log freelance and gig income. Takes under 5 minutes.",
      icon: <Smartphone className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "02",
      title: "See Your Real Numbers",
      description:
        "Instantly view aggregated income, estimated taxes under both regimes, and 44ADA applicability in one screen.",
      icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "03",
      title: "File With Confidence",
      description:
        "Download your ITR-4 ready summary, verify against AIS, and file taxes without confusion or expensive CA fees.",
      icon: <CheckCircle2 className="h-8 w-8 text-emerald-600" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "₹0",
      period: "forever",
      description: "Perfect for exploring your tax situation",
      features: [
        "Up to 2 income sources",
        "Basic tax estimation (new regime)",
        "Manual income logging",
        "Monthly summary export",
      ],
      popular: false,
      cta: "Start Free",
    },
    {
      name: "Pro",
      price: "₹199",
      period: "per month",
      description: "For the serious side hustler",
      features: [
        "Unlimited income sources",
        "Old + New regime comparison",
        "44ADA auto-detection",
        "AIS mismatch alerts",
        "Live tax meter",
        "ITR-4 ready export",
        "Priority support",
      ],
      popular: true,
      cta: "Get Pro",
    },
    {
      name: "Annual",
      price: "₹1,499",
      period: "per year",
      description: "Save 37% with annual billing",
      features: [
        "Everything in Pro",
        "Historical tax data (3 years)",
        "CA review session (1x/year)",
        "Advance tax reminders",
        "Quarterly P&L reports",
        "WhatsApp notifications",
      ],
      popular: false,
      cta: "Go Annual",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Priya Sharma",
      role: "Software Engineer + Freelance Writer",
      quote:
        "I was paying ₹15K to a CA just to file ITR-4. HustleSheet showed me I qualify for 44ADA and saved me hours of confusion.",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      role: "Product Manager + YouTube Creator",
      quote:
        "Finally something that understands Indian side-hustle taxes. The live tax meter is a game changer — no more March panic.",
      rating: 5,
    },
    {
      name: "Ananya Gupta",
      role: "Data Analyst + Topmate Consultant",
      quote:
        "The AIS mismatch alert caught a ₹80K discrepancy before I filed. Would have been a nightmare to fix later.",
      rating: 5,
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Who is HustleSheet for?",
      answer:
        "HustleSheet is built for salaried Indians who earn ₹50K to ₹5L per year from side hustles — freelancing, consulting, affiliate income, content creation, or gig platforms. If you have a salary plus extra income and dread tax season, this is for you.",
    },
    {
      question: "Do I still need a CA?",
      answer:
        "For most users with straightforward multi-source income, no. HustleSheet handles the calculations, regime comparison, and ITR-4 summary generation. However, if you have complex situations like capital gains, foreign income, or multiple business entities, we recommend a CA review.",
    },
    {
      question: "Is my financial data safe?",
      answer:
        "Absolutely. We use bank-grade AES-256 encryption, never store your banking credentials, and are compliant with Indian data protection regulations. Your data is never shared with third parties.",
    },
    {
      question: "What is Section 44ADA?",
      answer:
        "Section 44ADA allows eligible professionals (like freelancers and consultants) with gross receipts up to ₹75L to declare 50% of receipts as profit without maintaining detailed books of accounts. HustleSheet automatically checks if you qualify.",
    },
    {
      question: "Can I use this mid-year?",
      answer:
        "Yes! You can start using HustleSheet any time during the financial year. Just log your income sources and past months of data, and the live tax meter will update accordingly.",
    },
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-7 w-7 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">HustleSheet</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-sm hidden sm:inline-flex">
                Log In
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                Start Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              <Zap className="h-3 w-3 mr-1" />
              Built for India{"'"}s multi-income earners
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Your salary + side hustle,{" "}
              <span className="text-emerald-600">tax-ready</span> in one dashboard
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Stop guessing your real take-home. HustleSheet aggregates all your income sources, auto-calculates
              taxes under both regimes, and produces an ITR-4 ready summary — without a CA.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <form onSubmit={handleEmailSubmit} className="flex w-full sm:w-auto gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72"
                />
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap">
                  Get Early Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free forever plan
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card needed
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                5-min setup
              </span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/80 backdrop-blur border-emerald-100">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500 mb-1">Total Income (FY 24-25)</p>
                    <p className="text-2xl font-bold text-gray-900">₹14,82,000</p>
                    <p className="text-xs text-emerald-600 mt-1">Salary + 3 side hustles</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur border-emerald-100">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500 mb-1">Estimated Tax (New Regime)</p>
                    <p className="text-2xl font-bold text-gray-900">₹1,24,800</p>
                    <p className="text-xs text-emerald-600 mt-1">₹32K saved vs old regime</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur border-emerald-100">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500 mb-1">44ADA Eligible Income</p>
                    <p className="text-2xl font-bold text-gray-900">₹3,60,000</p>
                    <p className="text-xs text-emerald-600 mt-1">50% presumptive applied</p>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-white rounded-lg border border-emerald-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Live Tax Meter</span>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">On Track</Badge>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full" style={{ width: "68%" }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>₹84,864 paid (TDS + advance)</span>
                  <span>₹39,936 remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">2,400+ early users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Avg. 4 mins to setup</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">₹2.3Cr+ income tracked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to tame multi-income taxes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No more spreadsheets, no more CA fees for basic filing. HustleSheet handles the complexity so you
              {"don't"} have to.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From confused to tax-ready in 3 steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No accounting knowledge needed. If you can use Google Pay, you can use HustleSheet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-emerald-100">{step.number}</span>
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Regime Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">Smart Comparison</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Old vs New regime — instantly answered
            </h2>
            <p className="text-lg text-gray-600">
              See exactly how much you save under each regime based on your actual income mix.
            </p>
          </div>
          <Tabs defaultValue="new-regime">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="new-regime">New Regime (Default)</TabsTrigger>
              <TabsTrigger value="old-regime">Old Regime</TabsTrigger>
            </TabsList>
            <TabsContent value="new-regime">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-700">New Tax Regime — Recommended for You</CardTitle>
                  <CardDescription>
                    Based on your income of ₹14.82L with limited deductions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Gross Total Income</span>
                      <span className="font-semibold">₹14,82,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Standard Deduction</span>
                      <span className="font-semibold text-green-600">- ₹75,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">44ADA Benefit (50% of ₹3.6L)</span>
                      <span className="font-semibold text-green-600">- ₹1,80,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-lg">
                      <span className="font-medium text-emerald-800">Tax Payable</span>
                      <span className="font-bold text-emerald-700 text-lg">₹1,24,800</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="old-regime">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-700">Old Tax Regime</CardTitle>
                  <CardDescription>
                    Higher tax but eligible for 80C, 80D, HRA deductions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Gross Total Income</span>
                      <span className="font-semibold">₹14,82,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">80C Deductions</span>
                      <span className="font-semibold text-green-600">- ₹1,50,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">80D (Health Insurance)</span>
                      <span className="font-semibold text-green-600">- ₹25,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-red-50 px-3 rounded-lg">
                      <span className="font-medium text-red-800">Tax Payable</span>
                      <span className="font-bold text-red-700 text-lg">₹1,56,000</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      You pay ₹31,200 more under old regime with your current deductions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by side hustlers across India
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 text-base italic">
                    {"\""}{testimonial.quote}{"\""}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Less than your monthly chai budget
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. Still cheaper than one CA consultation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-emerald-500 shadow-xl scale-105"
                    : "border-gray-200 hover:border-emerald-200"
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white border-0">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Got questions? We{"'"}ve got answers
            </h2>
          </div>
          <Accordion className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop overpaying taxes on your side hustle
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join 2,400+ salaried Indians who finally know their real tax number. Setup takes 5 minutes.
              Filing day becomes just another Tuesday.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50 text-base px-8 py-6 font-semibold">
                Start Free — No Card Needed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-emerald-200 mt-6">
              Free plan includes 2 income sources • Upgrade anytime • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-bold text-gray-900">HustleSheet</span>
              </div>
              <p className="text-sm text-gray-600 max-w-sm">
                The tax dashboard built for India{"'"}s multi-income generation. Salary + side hustle, sorted.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-emerald-600">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-emerald-600">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-gray-600 hover:text-emerald-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-600">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-600">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-600">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {"© 2024 HustleSheet. Made with ❤️ in India."}
            </p>
            <p className="text-xs text-gray-400">
              Not a substitute for professional tax advice in complex scenarios.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}