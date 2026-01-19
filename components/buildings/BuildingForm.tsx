'use client';

import { useState, useEffect } from 'react';
import type { Building, District } from '@prisma/client';

type BuildingWithDistrict = Building & {
  district: District;
};

interface BuildingFormProps {
  building: BuildingWithDistrict | null;
  districts: District[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function BuildingForm({
  building,
  districts,
  onClose,
  onSuccess,
}: BuildingFormProps) {
  const [districtId, setDistrictId] = useState<number>(
    districts[0]?.id || 0
  );
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (building) {
      setDistrictId(building.districtId);
      setName(building.name);
      setSlug(building.slug);
    } else if (districts.length > 0) {
      setDistrictId(districts[0].id);
    }
  }, [building, districts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = building ? `/api/buildings/${building.id}` : '/api/buildings';
      const method = building ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ districtId, name, slug }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!building) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setSlug(autoSlug);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card w-full max-w-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {building ? 'Edit Building' : 'Create Building'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {building ? 'Update building information' : 'Add a new building'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              District *
            </label>
            <select
              value={districtId}
              onChange={(e) => setDistrictId(parseInt(e.target.value))}
              required
              disabled={!!building}
              className="input-field disabled:bg-gray-100"
            >
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="input-field"
              placeholder="Building 1"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              pattern="[a-z0-9-]+"
              className="input-field"
              placeholder="tower-1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : building ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
