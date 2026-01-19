'use client';

import { useState } from 'react';
import type { Building, District } from '@prisma/client';

type BuildingWithDistrict = Building & {
  district: District;
};

interface ApartmentFormProps {
  buildings: BuildingWithDistrict[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApartmentForm({
  buildings,
  onClose,
  onSuccess,
}: ApartmentFormProps) {
  const [formData, setFormData] = useState({
    buildingId: buildings[0]?.id || 0,
    apartmentNo: '',
    apartmentType: '',
    sqm: '',
    priceSqm: '',
    status: 'UPCOMING',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/apartments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingId: formData.buildingId,
          apartmentNo: formData.apartmentNo,
          apartmentType: formData.apartmentType
            ? parseInt(formData.apartmentType)
            : undefined,
          sqm: formData.sqm ? parseFloat(formData.sqm) : undefined,
          priceSqm: formData.priceSqm ? parseFloat(formData.priceSqm) : undefined,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Создать квартиру</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Здание *
            </label>
            <select
              value={formData.buildingId}
              onChange={(e) =>
                setFormData({ ...formData, buildingId: parseInt(e.target.value) })
              }
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.district.name} - {building.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Номер квартиры *
            </label>
            <input
              type="text"
              value={formData.apartmentNo}
              onChange={(e) =>
                setFormData({ ...formData, apartmentNo: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="12-05"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Тип квартиры
            </label>
            <input
              type="number"
              value={formData.apartmentType}
              onChange={(e) =>
                setFormData({ ...formData, apartmentType: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Площадь (м²)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sqm}
                onChange={(e) =>
                  setFormData({ ...formData, sqm: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Цена за м² (AMD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.priceSqm}
                onChange={(e) =>
                  setFormData({ ...formData, priceSqm: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Статус *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="UPCOMING">Предстоящая</option>
              <option value="AVAILABLE">Доступна</option>
              <option value="RESERVED">Зарезервирована</option>
              <option value="SOLD">Продана</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
