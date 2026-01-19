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
        throw new Error('Ошибка загрузки');
      }
      const data = await response.json();
      setApartment(data);
      setFormData(data);
    } catch (err) {
      setError('Не удалось загрузить квартиру');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка сохранения');
      }

      setEditing(false);
      fetchApartment();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/apartments/${apartmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Ошибка обновления статуса');

      fetchApartment();
    } catch (err) {
      alert('Не удалось изменить статус');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error || !apartment) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error || 'Квартира не найдена'}</p>
        <Link href="/apartments" className="mt-2 text-blue-600 hover:underline">
          Вернуться к списку
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
          ← Назад к списку
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Квартира {apartment.apartmentNo}
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
            <option value="UPCOMING">Предстоящая</option>
            <option value="AVAILABLE">Доступна</option>
            <option value="RESERVED">Зарезервирована</option>
            <option value="SOLD">Продана</option>
          </select>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(apartment);
                }}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Редактировать
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
            Обзор
          </button>
          <button
            onClick={() => setActiveTab('deal')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'deal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Сделка
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'links'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Ссылки и файлы
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Номер квартиры
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.apartmentNo}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Тип квартиры
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.apartmentType || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Площадь
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.sqm ? `${apartment.sqm} м²` : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Цена за м²
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.price_sqm
                    ? `${(apartment.price_sqm / 1000).toFixed(0)}K AMD`
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Общая цена
                </label>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {apartment.total_price
                    ? `${(apartment.total_price / 1000000).toFixed(1)}M AMD`
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Тип продажи
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {apartment.salesType === 'UNSOLD'
                    ? 'Не продано'
                    : apartment.salesType === 'MORTGAGE'
                    ? 'Ипотека'
                    : apartment.salesType === 'CASH'
                    ? 'Наличные'
                    : apartment.salesType === 'TIMEBASED'
                    ? 'Рассрочка'
                    : '-'}
                </p>
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
                    Дата сделки
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
                    Имя владельца
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
                    Телефон
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
                    Паспорт/Налоговый номер
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
                    Оплачено
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
                    Описание сделки (макс. 500 символов)
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
                    Дата сделки
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.dealDate
                      ? new Date(apartment.dealDate).toLocaleDateString('ru-RU')
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Имя владельца
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
                    Телефон
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Паспорт/Налоговый номер
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {apartment.passportTaxNo || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Оплачено
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {apartment.total_paid
                      ? `${(apartment.total_paid / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Остаток
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {apartment.balance
                      ? `${(apartment.balance / 1000000).toFixed(1)}M AMD`
                      : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Описание сделки
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
                Распределение планировки (макс. 500 символов)
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

            {/* Загрузка файлов */}
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
