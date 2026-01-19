'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Building, District } from '@prisma/client';
import ApartmentForm from './ApartmentForm';

type Apartment = {
  id: number;
  apartmentNo: string;
  status: string;
  sqm: number | null;
  total_price: number | null;
  total_paid: number | null;
  balance: number | null;
  building: Building & { district: District };
  updatedAt: string;
};

export default function ApartmentsList() {
  const { data: session } = useSession();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [buildings, setBuildings] = useState<(Building & { district: District })[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    fetchDistricts();
    fetchBuildings();
  }, []);

  useEffect(() => {
    fetchApartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding, selectedStatus]);

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts');
      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/buildings');
      if (response.ok) {
        const data = await response.json();
        setBuildings(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApartments = async () => {
    try {
      setLoading(true);
      let url = '/api/apartments?';
      if (selectedBuilding) {
        url += `buildingId=${selectedBuilding}&`;
      }
      if (selectedStatus) {
        url += `status=${selectedStatus}&`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      setApartments(data.items || []);
    } catch (err) {
      setError('Failed to load apartments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/apartments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchApartments();
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'Upcoming';
      case 'available':
        return 'Available';
      case 'reserved':
        return 'Reserved';
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Create Apartment
          </button>
        )}
        <div className="flex items-center space-x-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Filter by Building:
          </label>
          <select
            value={selectedBuilding || ''}
            onChange={(e) =>
              setSelectedBuilding(e.target.value ? parseInt(e.target.value) : null)
            }
            className="ml-2 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Buildings</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.district.name} - {building.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Filter by Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="ml-2 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
        </div>
      </div>

      {showForm && (
        <ApartmentForm
          buildings={buildings}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchApartments();
          }}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Area (m²)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Balance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {apartments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No apartments. Create the first apartment.
                </td>
              </tr>
            ) : (
              apartments.map((apt) => (
                <tr key={apt.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {apt.apartmentNo}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {apt.building.district.name} - {apt.building.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(apt.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {apt.sqm ? `${apt.sqm} m²` : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {apt.total_price
                      ? `${(apt.total_price / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {apt.total_paid
                      ? `${(apt.total_paid / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {apt.balance
                      ? `${(apt.balance / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/apartments/${apt.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Open
                    </Link>
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
