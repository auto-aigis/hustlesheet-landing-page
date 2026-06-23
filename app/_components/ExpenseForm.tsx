"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { ExpenseCategory } from '@/app/_lib/types';
import { CATEGORY_RULES } from '@/app/_lib/types';
import { expenseApi } from '@/app/_lib/api';
import { useFormatCurrency } from '@/app/_lib/hooks';

interface ExpenseFormProps {
  onSuccess: () => void;
}

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('software_tools');
  const [description, setDescription] = useState('');
  const [homeOfficePercentage, setHomeOfficePercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formatCurrency = useFormatCurrency(parseFloat(amount) || 0);

  const rules = CATEGORY_RULES[category];
  const deductibilityPercentage = category === 'home_office' ? (homeOfficePercentage ? parseFloat(homeOfficePercentage) : 0) : rules.percentage;
  const deductibleAmount = parseFloat(amount) ? Math.round((parseFloat(amount) * deductibilityPercentage) / 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || !date) {
      setError('Amount and date are required');
      return;
    }

    if (category === 'home_office' && !homeOfficePercentage) {
      setError('Home office deductibility percentage is required');
      return;
    }

    try {
      setLoading(true);
      await expenseApi.create({
        amount: parseFloat(amount),
        date,
        category,
        description,
        deductibility_percentage: category === 'home_office' ? parseFloat(homeOfficePercentage) : null,
      });
      setAmount('');
      setDate('');
      setCategory('software_tools');
      setDescription('');
      setHomeOfficePercentage('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Log Expense</CardTitle>
        <CardDescription>Add a new business expense</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_RULES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category === 'home_office' && (
            <div>
              <Label htmlFor="homeOffice">Deductibility % (for home office portion)</Label>
              <Input
                id="homeOffice"
                type="number"
                placeholder="30"
                value={homeOfficePercentage}
                onChange={(e) => setHomeOfficePercentage(e.target.value)}
                min="0"
                max="100"
                step="1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g., Monthly Figma subscription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2">
            <div className="text-sm font-medium text-gray-900">{rules.label}</div>
            <div className="text-xs text-gray-600">{rules.rule}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Deductible Amount:</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white border-gray-200 text-gray-900">
                  {deductibilityPercentage}%
                </Badge>
                <span className="font-semibold text-gray-900">₹{deductibleAmount}</span>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
