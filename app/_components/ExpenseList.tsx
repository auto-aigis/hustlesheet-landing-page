"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Expense, ExpenseCategory } from '@/app/_lib/types';
import { CATEGORY_RULES } from '@/app/_lib/types';
import { expenseApi } from '@/app/_lib/api';
import { Trash2 } from 'lucide-react';

interface ExpenseListProps {
  refreshTrigger: number;
}

export default function ExpenseList({ refreshTrigger }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger, filterCategory, filterStartDate, filterEndDate]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseApi.list(
        filterCategory || undefined,
        filterStartDate ? `${filterStartDate}T00:00:00` : undefined,
        filterEndDate ? `${filterEndDate}T23:59:59` : undefined
      );
      setExpenses(data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await expenseApi.delete(id);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading && expenses.length === 0) {
    return <div className="text-gray-500 text-center py-8">Loading expenses...</div>;
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Logged Expenses</CardTitle>
        <CardDescription>View and manage all your business expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {Object.entries(CATEGORY_RULES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Start date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />

            <Input
              type="date"
              placeholder="End date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No expenses logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Date</TableHead>
                    <TableHead className="text-gray-700">Category</TableHead>
                    <TableHead className="text-gray-700">Description</TableHead>
                    <TableHead className="text-right text-gray-700">Amount</TableHead>
                    <TableHead className="text-right text-gray-700">Deductible</TableHead>
                    <TableHead className="text-center text-gray-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => {
                    const rule = CATEGORY_RULES[expense.category as ExpenseCategory];
                    return (
                      <TableRow key={expense.id} className="border-gray-200">
                        <TableCell className="text-gray-900">
                          {new Date(expense.date).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-900">
                            {rule.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700 max-w-xs truncate">
                          {expense.description || '—'}
                        </TableCell>
                        <TableCell className="text-right text-gray-900 font-medium">
                          ₹{expense.amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-gray-900">
                              ₹{expense.deductible_amount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-gray-500">{expense.deductibility_percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                            disabled={deleting === expense.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
