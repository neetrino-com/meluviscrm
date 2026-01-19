'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUpload from './FileUpload';

type Attachment = {
  id: number;
  fileType: string;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
};

type Apartment = {
  id: number;
  apartmentNo: string;
  apartmentType: number | null;
  status: string;
  sqm: number | null;
  price_sqm: number | null;
  total_price: number | null;
  total_paid: number | null;
  balance: number | null;
  dealDate: string | null;
  ownershipName: string | null;
  email: string | null;
  passportTaxNo: string | null;
  phone: string | null;
  salesType: string;
  dealDescription: string | null;
  matterLink: string | null;
  floorplanDistribution: string | null;
  exteriorLink: string | null;
  exteriorLink2: string | null;
  building_name: string;
  building_slug: string;
  district_name: string;
  district_slug: string;
  updatedAt: string;
  attachments?: {
    agreement_files: Attachment[];
    floorplans_files: Attachment[];
    images_files: Attachment[];
    progress_images_files: Attachment[];
  };
};

interface ApartmentCardProps {
  apartmentId: number;
}

export default function ApartmentCard({ apartmentId }: ApartmentCardProps) {
  const router = useRouter();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'deal' | 'links'>(
    'overview'
  );
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Apartment>>({});

  useEffect(() => {
    fetchApartment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartmentId]);

  const fetchApartment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/apartments/${apartmentId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/apartments');
          return;
        }
        throw new Error('Failed to load apartment');
      }
      const data = await response.json();
      setApartment(data);
      setFormData(data);
    } catch (err) {
      setError('Failed to load apartment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Преобразуем данные из snake_case в camelCase для API
      const apiData: any = {};
      
      if (formData.sqm !== undefined) apiData.sqm = formData.sqm;
      if (formData.price_sqm !== undefined) apiData.priceSqm = formData.price_sqm;
      if (formData.total_paid !== undefined) apiData.totalPaid = formData.total_paid;
      if (formData.dealDate !== undefined) apiData.dealDate = formData.dealDate || null;
      if (formData.ownershipName !== undefined) apiData.ownershipName = formData.ownershipName || null;
      if (formData.email !== undefined) apiData.email = formData.email || null;
      if (formData.passportTaxNo !== undefined) apiData.passportTaxNo = formData.passportTaxNo || null;
      if (formData.phone !== undefined) apiData.phone = formData.phone || null;
      if (formData.salesType !== undefined) apiData.salesType = formData.salesType;
      if (formData.dealDescription !== undefined) apiData.dealDescription = formData.dealDescription || null;
      if (formData.matterLink !== undefined) apiData.matterLink = formData.matterLink || null;
      if (formData.floorplanDistribution !== undefined) apiData.floorplanDistribution = formData.floorplanDistribution || null;
      if (formData.exteriorLink !== undefined) apiData.exteriorLink = formData.exteriorLink || null;
      if (formData.exteriorLink2 !== undefined) apiData.exteriorLink2 = formData.exteriorLink2 || null;

      const response = await fetch(`/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        const errorMessage = error.details 
          ? `${error.error}: ${JSON.stringify(error.details)}`
          : error.error || 'Failed to save';
        throw new Error(errorMessage);
      }

      setEditing(false);
      fetchApartment();
    } catch (err) {
      console.error('Save error:', err);
      alert(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchApartment();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getSalesTypeLabel = (type: string) => {
    switch (type) {
      case 'UNSOLD':
        return 'Unsold';
      case 'MORTGAGE':
        return 'Mortgage';
      case 'CASH':
        return 'Cash';
      case 'TIMEBASED':
        return 'Timebased';
      default:
        return type;
    }
  };

  const getSalesTypeValue = (label: string) => {
    switch (label) {
      case 'Unsold':
        return 'UNSOLD';
      case 'Mortgage':
        return 'MORTGAGE';
      case 'Cash':
        return 'CASH';
      case 'Timebased':
        return 'TIMEBASED';
      default:
        return label;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !apartment) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error || 'Apartment not found'}</p>
        <Link href="/apartments" className="mt-2 text-blue-600 hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/apartments"
          className="text-blue-600 hover:text-blue-900"
        >
          ← Back to list
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Apartment {apartment.apartmentNo}
          </h1>
          <p className="text-sm text-gray-500">
            {apartment.district_name} - {apartment.building_name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={apartment.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(apartment);
                }}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('deal')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'deal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Deal
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'links'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Links & Files
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Permanent fields - not editable */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Apartment No
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.apartmentNo}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Apartment Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.apartmentType || '-'}
                </p>
              </div>
              
              {/* Editable fields */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Sq/m
                </label>
                {editing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sqm || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sqm: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.sqm ? `${apartment.sqm} m²` : '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Price Sq/m
                </label>
                {editing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_sqm || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_sqm: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.price_sqm
                      ? `${(apartment.price_sqm / 1000).toFixed(0)}K AMD`
                      : '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Total Price
                </label>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {apartment.total_price
                    ? `${(apartment.total_price / 1000000).toFixed(1)}M AMD`
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Sales Type
                </label>
                {editing ? (
                  <select
                    value={getSalesTypeLabel(formData.salesType || apartment.salesType)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salesType: getSalesTypeValue(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="Unsold">Unsold</option>
                    <option value="Mortgage">Mortgage</option>
                    <option value="Cash">Cash</option>
                    <option value="Timebased">Timebased</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {getSalesTypeLabel(apartment.salesType)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deal' && (
          <div className="space-y-4">
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deal Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.dealDate
                        ? new Date(formData.dealDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, dealDate: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ownership Name
                  </label>
                  <input
                    type="text"
                    value={formData.ownershipName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, ownershipName: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Passport/Tax No
                  </label>
                  <input
                    type="text"
                    value={formData.passportTaxNo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, passportTaxNo: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Paid
                  </label>
                  <input
                    type="number"
                    value={formData.total_paid || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_paid: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Deal Description (max 500 characters)
                  </label>
                  <textarea
                    value={formData.dealDescription || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dealDescription: e.target.value,
                      })
                    }
                    maxLength={500}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.dealDescription?.length || 0}/500
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Deal Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.dealDate
                      ? new Date(apartment.dealDate).toLocaleDateString('en-US')
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ownership Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.ownershipName || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.email || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Passport/Tax No
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.passportTaxNo || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Total Paid
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {apartment.total_paid
                      ? `${(apartment.total_paid / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Balance
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {apartment.balance
                      ? `${(apartment.balance / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Deal Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.dealDescription || '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Matter Link
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.matterLink || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, matterLink: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.matterLink ? (
                    <a
                      href={apartment.matterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {apartment.matterLink}
                    </a>
                  ) : (
                    '-'
                  )}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Exterior Link
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.exteriorLink || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, exteriorLink: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.exteriorLink ? (
                    <a
                      href={apartment.exteriorLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {apartment.exteriorLink}
                    </a>
                  ) : (
                    '-'
                  )}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Exterior Link 2
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.exteriorLink2 || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, exteriorLink2: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.exteriorLink2 ? (
                    <a
                      href={apartment.exteriorLink2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {apartment.exteriorLink2}
                    </a>
                  ) : (
                    '-'
                  )}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Floorplan Distribution (max 500 characters)
              </label>
              {editing ? (
                <>
                  <textarea
                    value={formData.floorplanDistribution || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        floorplanDistribution: e.target.value,
                      })
                    }
                    maxLength={500}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.floorplanDistribution?.length || 0}/500
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.floorplanDistribution || '-'}
                </p>
              )}
            </div>

            {/* File Upload */}
            {apartment.attachments && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <FileUpload
                  apartmentId={apartmentId}
                  attachments={apartment.attachments}
                  onUploadSuccess={fetchApartment}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
