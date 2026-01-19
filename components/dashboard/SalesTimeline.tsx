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
      if (!response.ok) throw new Error('Ошибка загрузки');
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
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Sales Timeline by Month</h2>
        <div className="text-center py-4">Загрузка...</div>
      </div>
    );
  }

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Sales Timeline by Month</h2>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Нет данных о продажах
        </div>
      ) : (
        <div className="space-y-4">
          {/* График placeholder */}
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
            <p className="text-sm text-gray-500">
              График продаж по месяцам будет здесь (можно добавить библиотеку для графиков)
            </p>
          </div>

          {/* Таблица данных */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Месяц
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Количество сделок
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Сумма (AMD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((item) => (
                  <tr key={item.month}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatMonth(item.month)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                      {item.count}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatAmount(item.amount)} AMD
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
