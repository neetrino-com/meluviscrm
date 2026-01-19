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
  const [activeTab, setActiveTab] = useState<'overview' | 'links'>('overview');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Apartment>>({});

  useEffect(() => {
    fetchApartment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartmentId]);

  const fetchApartment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/apartments/${apartmentId}`, {
        cache: 'default',
      });
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
      const apiData: any = {};
      
      if (formData.sqm !== undefined) apiData.sqm = formData.sqm;
      if (formData.price_sqm !== undefined) apiData.priceSqm = formData.price_sqm;
      if (formData.total_paid !== undefined) apiData.totalPaid = formData.total_paid;
      if (formData.dealDate !== undefined) apiData.dealDate = formData.dealDate || null;
      if (formData.ownershipName !== undefined) apiData.ownershipName = formData.ownershipName || null;
      if (formData.email !== undefined) apiData.email = formData.email || null;
      if (formData.phone !== undefined) apiData.phone = formData.phone || null;
      if (formData.passportTaxNo !== undefined) apiData.passportTaxNo = formData.passportTaxNo || null;
      if (formData.salesType !== undefined) apiData.salesType = formData.salesType;
      if (formData.dealDescription !== undefined) apiData.dealDescription = formData.dealDescription || null;
      if (formData.matterLink !== undefined) apiData.matterLink = formData.matterLink || null;
      if (formData.exteriorLink !== undefined) apiData.exteriorLink = formData.exteriorLink || null;
      if (formData.exteriorLink2 !== undefined) apiData.exteriorLink2 = formData.exteriorLink2 || null;
      if (formData.floorplanDistribution !== undefined) apiData.floorplanDistribution = formData.floorplanDistribution || null;

      const response = await fetch(`/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      const updated = await response.json();
      setApartment(updated);
      setFormData(updated);
      setEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save changes');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/apartments/${apartmentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updated = await response.json();
      setApartment({ ...apartment!, status: updated.status });
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

  const getSalesTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'UNSOLD':
        return 'Unsold';
      case 'MORTGAGE':
        return 'Mortgage';
      case 'CASH':
        return 'Cash';
      case 'TIMEBASED':
        return 'Time-based';
      default:
        return type || '-';
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
      case 'Time-based':
        return 'TIMEBASED';
      default:
        return 'UNSOLD';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-sm text-gray-600">Loading apartment...</p>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">{error || 'Apartment not found'}</p>
        <Link href="/apartments" className="mt-2 text-sm text-blue-600 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/apartments"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to list
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Apartment {apartment.apartmentNo}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {apartment.district_name} - {apartment.building_name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={apartment.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>
            {editing ? (
              <>
                <button onClick={handleSave} className="btn-primary">
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(apartment);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-primary">
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'links'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Links & Files
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Read-only fields at the top */}
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Apartment No
                </label>
                <p className="text-base font-medium text-gray-900">{apartment.apartmentNo}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Apartment Type
                </label>
                <p className="text-base font-medium text-gray-900">{apartment.apartmentType || '-'}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Total Price
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {apartment.total_price
                    ? `${(apartment.total_price / 1000000).toFixed(1)}M AMD`
                    : '-'}
                </p>
              </div>
              
              {/* Editable fields below */}
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
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
                    className="input-field"
                  />
                ) : (
                  <p className="text-base font-medium text-gray-900">
                    {apartment.sqm ? `${apartment.sqm} m²` : '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
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
                        price_sqm: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="input-field"
                  />
                ) : (
                  <p className="text-base font-medium text-gray-900">
                    {apartment.price_sqm
                      ? `${(apartment.price_sqm / 1000).toFixed(0)}K AMD`
                      : '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Sales Type
                </label>
                {editing ? (
                  <select
                    value={getSalesTypeLabel(apartment.salesType)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salesType: getSalesTypeValue(e.target.value),
                      })
                    }
                    className="input-field"
                  >
                    <option>Unsold</option>
                    <option>Mortgage</option>
                    <option>Cash</option>
                    <option>Time-based</option>
                  </select>
                ) : (
                  <p className="text-base font-medium text-gray-900">
                    {getSalesTypeLabel(apartment.salesType)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Financial Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Total Paid
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={formData.total_paid || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_paid: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="input-field mt-2"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {apartment.total_paid
                      ? `${(apartment.total_paid / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Balance
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {apartment.balance
                    ? `${(apartment.balance / 1000000).toFixed(1)}M AMD`
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Deal Information Section */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Deal Information</h2>
            {editing ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Deal Date</label>
                  <input
                    type="date"
                    value={
                      formData.dealDate
                        ? new Date(formData.dealDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, dealDate: e.target.value || null })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Ownership Name</label>
                  <input
                    type="text"
                    value={formData.ownershipName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, ownershipName: e.target.value || null })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value || null })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value || null })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Passport/Tax No</label>
                  <input
                    type="text"
                    value={formData.passportTaxNo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, passportTaxNo: e.target.value || null })
                    }
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Deal Description (max 500 characters)
                  </label>
                  <textarea
                    value={formData.dealDescription || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, dealDescription: e.target.value || null })
                    }
                    maxLength={500}
                    rows={4}
                    className="input-field"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.dealDescription?.length || 0}/500
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Deal Date
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    {apartment.dealDate
                      ? new Date(apartment.dealDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Ownership Name
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    {apartment.ownershipName || '-'}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Email
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    {apartment.email ? (
                      <a
                        href={`mailto:${apartment.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {apartment.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Phone
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    {apartment.phone ? (
                      <a
                        href={`tel:${apartment.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {apartment.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Passport/Tax No
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    {apartment.passportTaxNo || '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Deal Description
                  </label>
                  <p className="text-base text-gray-900 whitespace-pre-wrap">
                    {apartment.dealDescription || '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="space-y-6">
          {/* Links Section */}
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Links</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Matter Link</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.matterLink || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, matterLink: e.target.value || null })
                    }
                    className="input-field"
                    placeholder="https://..."
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.matterLink ? (
                      <a
                        href={apartment.matterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Exterior Link</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.exteriorLink || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, exteriorLink: e.target.value || null })
                    }
                    className="input-field"
                    placeholder="https://..."
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.exteriorLink ? (
                      <a
                        href={apartment.exteriorLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Exterior Link 2</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.exteriorLink2 || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, exteriorLink2: e.target.value || null })
                    }
                    className="input-field"
                    placeholder="https://..."
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.exteriorLink2 ? (
                      <a
                        href={apartment.exteriorLink2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {apartment.exteriorLink2}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Floorplan Distribution (max 500 characters)
                </label>
                {editing ? (
                  <>
                    <textarea
                      value={formData.floorplanDistribution || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          floorplanDistribution: e.target.value || null,
                        })
                      }
                      maxLength={500}
                      rows={4}
                      className="input-field"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.floorplanDistribution?.length || 0}/500
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {apartment.floorplanDistribution || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Files Section */}
          {apartment.attachments && (
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Files</h2>
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
  );
}
