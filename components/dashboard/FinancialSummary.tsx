'use client';

import { useState, useEffect } from 'react';

type FinancialData = {
  sold: {
    amount: number;
    paid: number;
    balance: number;
  };
  notSold: {
    upcoming: number;
    available: number;
    reserved: number;
  };
};

export default function FinancialSummary() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancial();
  }, []);

  const fetchFinancial = async () => {
    try {
      const response = await fetch('/api/dashboard/financial');
      if (!response.ok) throw new Error('Failed to load');
      const financial = await response.json();
      setData(financial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Financial Summary</h2>
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M AMD`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K AMD`;
    }
    return `${amount.toFixed(0)} AMD`;
  };

  const pieData = [
    { name: 'Sold', value: data.sold.amount, color: '#3b82f6' },
    { name: 'Upcoming', value: data.notSold.upcoming, color: '#9ca3af' },
    { name: 'Available', value: data.notSold.available, color: '#10b981' },
    { name: 'Reserved', value: data.notSold.reserved, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  return (
    <div className="card p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Financial Summary</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sold Section */}
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue-900">
              Sold Apartments
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-xs font-medium text-blue-700">Total Amount</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatAmount(data.sold.amount)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-blue-200 pt-4">
              <div>
                <p className="mb-1 text-xs font-medium text-blue-700">Paid</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatAmount(data.sold.paid)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-blue-700">Balance</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatAmount(data.sold.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Not Sold Section */}
        <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-600"></div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
              Not Sold Apartments
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="mb-1 text-xs font-medium text-gray-500">Upcoming</p>
              <p className="text-lg font-bold text-gray-900">
                {formatAmount(data.notSold.upcoming)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="mb-1 text-xs font-medium text-gray-500">Available</p>
              <p className="text-lg font-bold text-gray-900">
                {formatAmount(data.notSold.available)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="mb-1 text-xs font-medium text-gray-500">Reserved</p>
              <p className="text-lg font-bold text-gray-900">
                {formatAmount(data.notSold.reserved)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
