'use client';

import { useState } from 'react';

type Attachment = {
  id: number;
  fileType: string;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
};

type FileUploadProps = {
  apartmentId: number;
  attachments: {
    agreement_files: Attachment[];
    floorplans_files: Attachment[];
    images_files: Attachment[];
    progress_images_files: Attachment[];
  };
  onUploadSuccess: () => void;
};

export default function FileUpload({
  apartmentId,
  attachments,
  onUploadSuccess,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('IMAGE');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', selectedType);

      const response = await fetch(
        `/api/apartments/${apartmentId}/attachments`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка загрузки файла');
      }

      onUploadSuccess();
      e.target.value = ''; // Сброс input
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Ошибка загрузки файла'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (!confirm('Delete this file?')) return;

    try {
      const response = await fetch(
        `/api/apartments/${apartmentId}/attachments/${attachmentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка удаления файла');
      }

      onUploadSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления файла');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'AGREEMENT':
        return 'Agreement';
      case 'FLOORPLAN':
        return 'Floorplan';
      case 'IMAGE':
        return 'Image';
      case 'PROGRESS_IMAGE':
        return 'Progress Image';
      default:
        return type;
    }
  };

  const renderFileList = (
    files: Attachment[],
    _type: string,
    label: string
  ) => {
    return (
      <div className="mt-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">{label}</h4>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No files</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2"
              >
                <div className="flex-1">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {file.fileName || 'Файл'}
                  </a>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)} •{' '}
                    {new Date(file.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                  <button
                  onClick={() => handleDelete(file.id)}
                  className="ml-2 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-700">
          Upload File
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              File Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="IMAGE">Image</option>
              <option value="PROGRESS_IMAGE">Progress Image</option>
              <option value="FLOORPLAN">Floorplan</option>
              <option value="AGREEMENT">Agreement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              File
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept={
                selectedType === 'IMAGE' || selectedType === 'PROGRESS_IMAGE'
                  ? 'image/*'
                  : '.pdf,.doc,.docx'
              }
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum size: 10MB
            </p>
          </div>
          {uploadError && (
            <div className="rounded-md bg-red-50 p-2">
              <p className="text-xs text-red-800">{uploadError}</p>
            </div>
          )}
          {uploading && (
            <div className="text-sm text-gray-600">Uploading...</div>
          )}
        </div>
      </div>

      {/* Списки файлов */}
      {renderFileList(
        attachments.images_files,
        'IMAGE',
        'Images'
      )}
      {renderFileList(
        attachments.progress_images_files,
        'PROGRESS_IMAGE',
        'Progress Images'
      )}
      {renderFileList(
        attachments.floorplans_files,
        'FLOORPLAN',
        'Floorplans'
      )}
      {renderFileList(
        attachments.agreement_files,
        'AGREEMENT',
        'Agreements'
      )}
    </div>
  );
}
