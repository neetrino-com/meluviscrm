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
      if (!response.ok) throw new Error('Ошибка загрузки');
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
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Apartment Summary</h2>
        <div className="text-center py-4">Загрузка...</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Total Apartments Number</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Apartment no
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Sq/m summary
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.total.count}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.total.sqm.toFixed(0)} м²
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                Upcoming
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.upcoming.count}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.upcoming.sqm.toFixed(0)} м²
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                Available
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.available.count}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.available.sqm.toFixed(0)} м²
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                Reserved
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.reserved.count}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.reserved.sqm.toFixed(0)} м²
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                Sold
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.sold.count}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                {data.sold.sqm.toFixed(0)} м²
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pie Chart placeholder - можно добавить библиотеку для графиков позже */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          Распределение по статусам (Pie Chart)
        </h3>
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
          <p className="text-sm text-gray-500">
            График будет здесь (можно добавить библиотеку для графиков)
          </p>
        </div>
      </div>
    </div>
  );
}
