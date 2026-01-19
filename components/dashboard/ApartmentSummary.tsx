'use client';

import { useState, useEffect } from 'react';

type SummaryData = {
  total: { count: number; sqm: number };
  upcoming: { count: number; sqm: number };
  available: { count: number; sqm: number };
  reserved: { count: number; sqm: number };
  sold: { count: number; sqm: number };
};

export default function ApartmentSummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/dashboard/summary');
      if (!response.ok) throw new Error('Failed to load');
      const summary = await response.json();
      setData(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Apartment Summary</h2>
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    { label: 'Total', count: data.total.count, sqm: data.total.sqm, color: 'bg-gray-100 text-gray-700' },
    { label: 'Upcoming', count: data.upcoming.count, sqm: data.upcoming.sqm, color: 'bg-gray-50 text-gray-600' },
    { label: 'Available', count: data.available.count, sqm: data.available.sqm, color: 'bg-green-50 text-green-700' },
    { label: 'Reserved', count: data.reserved.count, sqm: data.reserved.sqm, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Sold', count: data.sold.count, sqm: data.sold.sqm, color: 'bg-blue-50 text-blue-700' },
  ];

  return (
    <div className="card p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Apartment Summary</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-lg border p-4 ${stat.color}`}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide opacity-70">
              {stat.label}
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm opacity-80">{stat.sqm.toFixed(0)} m²</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
