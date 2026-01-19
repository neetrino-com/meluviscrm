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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    total_pages: 0,
  });
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    fetchDistricts();
    fetchBuildings();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
    fetchApartments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding, selectedStatus]);

  useEffect(() => {
    fetchApartments(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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

  const fetchApartments = async (page: number = 1) => {
    try {
      setLoading(true);
      let url = `/api/apartments?page=${page}&limit=50`;
      if (selectedBuilding) {
        url += `&buildingId=${selectedBuilding}`;
      }
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      setApartments(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 50, total: 0, total_pages: 0 });
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

      fetchApartments(currentPage);
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

  if (loading && apartments.length === 0) {
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
            fetchApartments(currentPage);
          }}
        />
      )}

      <div className="mb-4 text-sm text-gray-600">
        Showing {apartments.length} of {pagination.total} apartments
        {pagination.total_pages > 1 && (
          <span> (Page {pagination.page} of {pagination.total_pages})</span>
        )}
      </div>

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

      {/* Pagination with page numbers */}
      {pagination.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} apartments
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {(() => {
                const pages = [];
                const totalPages = pagination.total_pages;
                const current = pagination.page;
                
                // Показываем максимум 7 страниц вокруг текущей
                let startPage = Math.max(1, current - 3);
                let endPage = Math.min(totalPages, current + 3);
                
                // Если в начале, показываем первые страницы
                if (current <= 4) {
                  startPage = 1;
                  endPage = Math.min(7, totalPages);
                }
                
                // Если в конце, показываем последние страницы
                if (current >= totalPages - 3) {
                  startPage = Math.max(1, totalPages - 6);
                  endPage = totalPages;
                }
                
                // Первая страница
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis-start" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                }
                
                // Страницы вокруг текущей
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium ${
                        i === current
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Последняя страница
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis-end" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pages;
              })()}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
              disabled={currentPage === pagination.total_pages}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
