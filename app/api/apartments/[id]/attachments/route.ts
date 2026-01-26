import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { attachmentService } from '@/services/attachment.service';
import { FileType } from '@prisma/client';
import { put } from '@vercel/blob';

// Максимальный размер файла: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Разрешённые типы файлов
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apartmentId = parseInt(params.id);

    if (isNaN(apartmentId)) {
      return NextResponse.json(
        { error: 'Invalid apartment ID' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileType = formData.get('fileType') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!fileType || !['AGREEMENT', 'FLOORPLAN', 'IMAGE', 'PROGRESS_IMAGE'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Проверка типа файла
    const isImage = fileType === 'IMAGE' || fileType === 'PROGRESS_IMAGE';
    const isDocument = fileType === 'AGREEMENT' || fileType === 'FLOORPLAN';

    if (isImage && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    if (isDocument && !ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid document type. Allowed: PDF, DOC, DOCX' },
        { status: 400 }
      );
    }

    // Генерируем уникальное имя файла для Blob
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobFileName = `apartments/${apartmentId}/${fileType.toLowerCase()}/${timestamp}_${sanitizedFileName}`;

    // Загружаем файл в Vercel Blob
    const blob = await put(blobFileName, file, {
      access: 'public',
      contentType: file.type,
    });

    // Используем URL из Blob
    const fileUrl = blob.url;

    // Сохраняем в БД
    const attachment = await attachmentService.create(
      apartmentId,
      fileType as FileType,
      fileUrl,
      file.name,
      file.size
    );

    return NextResponse.json({
      id: attachment.id,
      fileUrl: attachment.fileUrl,
      fileName: attachment.fileName,
      fileSize: attachment.fileSize,
      fileType: attachment.fileType,
      createdAt: attachment.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[API] Error uploading attachment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apartmentId = parseInt(params.id);

    if (isNaN(apartmentId)) {
      return NextResponse.json(
        { error: 'Invalid apartment ID' },
        { status: 400 }
      );
    }

    const attachments = await attachmentService.getByApartmentId(apartmentId);

    return NextResponse.json(attachments);
  } catch (error) {
    console.error('[API] Error fetching attachments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
