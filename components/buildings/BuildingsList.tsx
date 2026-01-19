'use client';

import { useState, useEffect } from 'react';
import type { Building, District } from '@prisma/client';
import BuildingForm from './BuildingForm';

type BuildingWithDistrict = Building & {
  district: District;
};

export default function BuildingsList() {
  const [buildings, setBuildings] = useState<BuildingWithDistrict[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] =
    useState<BuildingWithDistrict | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts');
      if (!response.ok) throw new Error('Ошибка загрузки районов');
      const data = await response.json();
      setDistricts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const url = selectedDistrict
        ? `/api/buildings?districtId=${selectedDistrict}`
        : '/api/buildings';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setBuildings(data);
    } catch (err) {
      setError('Не удалось загрузить здания');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict]);

  const handleCreate = () => {
    setEditingBuilding(null);
    setShowForm(true);
  };

  const handleEdit = (building: BuildingWithDistrict) => {
    setEditingBuilding(building);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это здание?')) {
      return;
    }

    try {
      const response = await fetch(`/api/buildings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка удаления');
      }

      fetchBuildings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBuilding(null);
    fetchBuildings();
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Фильтр по району:
          </label>
          <select
            value={selectedDistrict || ''}
            onChange={(e) =>
              setSelectedDistrict(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Все районы</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Создать здание
        </button>
      </div>

      {showForm && (
        <BuildingForm
          building={editingBuilding}
          districts={districts}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Район
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Slug
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {buildings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Нет зданий. Создайте первое здание.
                </td>
              </tr>
            ) : (
              buildings.map((building) => (
                <tr key={building.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {building.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {building.district.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {building.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {building.slug}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(building)}
                      className="mr-2 text-blue-600 hover:text-blue-900"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(building.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
