"use client";

import { useState, useEffect } from "react";
import { aisApi, reconciliationApi } from "@/app/_lib/api";
import { AISEntry } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

const currentFY = "FY2024-25";

const categoryOptions = [
  { value: "salary", label: "Salary (TDS)" },
  { value: "interest", label: "Interest Income" },
  { value: "dividend", label: "Dividend Income" },
  { value: "freelance", label: "Freelance/Professional" },
  { value: "rent", label: "Rent Received" },
  { value: "other", label: "Other" },
];

export default function AISEntryPage() {
  const [entries, setEntries] = useState<AISEntry[]>([]);
  const [sourceName, setSourceName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await aisApi.getEntries(currentFY);
      setEntries(data);
    } catch {
      setError("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await aisApi.createEntry({
        fiscal_year: currentFY,
        category,
        source_name: sourceName,
        amount: parseFloat(amount),
      });
      setSourceName("");
      setAmount("");
      setCategory("salary");
      setSuccess("Entry added successfully");
      await loadEntries();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await aisApi.deleteEntry(entryId);
      setEntries(entries.filter((e) => e.id !== entryId));
      setSuccess("Entry deleted");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleReconcile = async () => {
    try {
      await reconciliationApi.run(currentFY);
      setSuccess("Reconciliation run successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run reconciliation");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enter AIS Income
        </h1>
        <p className="text-gray-600">{currentFY}</p>
      </div>

      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-900">What is AIS?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p>
            AIS (Annual Information Statement) is a statement issued by the Income
            Tax Department showing income sources like salary, investments, and
            business earnings reported by employers and financial institutions. Check
            your AIS at incometaxindiaefiling.gov.in to ensure accuracy and reconcile
            with your records.
          </p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source">Source Name</Label>
                  <Input
                    id="source"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="e.g., Razorpay, IBM"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Entry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Entries</CardTitle>
              <Badge variant="outline">{entries.length}</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : entries.length === 0 ? (
                <p className="text-gray-500">No entries yet. Add one to get started.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-auto">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {entry.source_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {categoryOptions.find((c) => c.value === entry.category)
                            ?.label || entry.category}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-900">
                          ₹{entry.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 hover:bg-gray-200 rounded text-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-6 flex gap-4">
          <Button onClick={handleReconcile} className="flex-1">
            Run Reconciliation →
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard/ais/report")}
            variant="outline"
            className="flex-1"
          >
            View Report →
          </Button>
        </div>
      )}
    </div>
  );
}