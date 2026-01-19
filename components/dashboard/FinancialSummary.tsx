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

  return (
    <div className="card p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Financial Summary</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sold Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Sold Apartments
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(data.sold.amount)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-xs text-gray-500">Paid</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatAmount(data.sold.paid)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatAmount(data.sold.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Not Sold Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Not Sold Apartments
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Upcoming</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatAmount(data.notSold.upcoming)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatAmount(data.notSold.available)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reserved</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatAmount(data.notSold.reserved)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
