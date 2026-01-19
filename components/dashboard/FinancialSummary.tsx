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
      if (!response.ok) throw new Error('Ошибка загрузки');
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
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Financial Summary</h2>
        <div className="text-center py-4">Загрузка...</div>
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
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Financial Summary</h2>
      
      <div className="space-y-4">
        {/* Total Sold */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">Total Sold</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Sold</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatAmount(data.sold.amount)}
              </p>
            </div>
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

        {/* Total Available */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            Total Available
          </h3>
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
  );
}
