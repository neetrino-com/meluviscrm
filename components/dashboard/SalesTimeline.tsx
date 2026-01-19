'use client';

import { useState, useEffect } from 'react';

type TimelineData = {
  month: string;
  count: number;
  amount: number;
};

export default function SalesTimeline() {
  const [data, setData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/dashboard/timeline');
      if (!response.ok) throw new Error('Failed to load');
      const timeline = await response.json();
      setData(timeline);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Sales Timeline</h2>
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M AMD`;
    }
    return `${(amount / 1000).toFixed(0)}K AMD`;
  };

  return (
    <div className="card p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Sales Timeline by Month</h2>
      
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No sales data available
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chart placeholder */}
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12">
            <p className="text-sm text-gray-500">
              Chart will be displayed here (chart library can be added later)
            </p>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Deals Count
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatMonth(item.month)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                      {item.count}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatAmount(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
