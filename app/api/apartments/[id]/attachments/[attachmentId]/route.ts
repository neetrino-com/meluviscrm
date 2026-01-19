import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { attachmentService } from '@/services/attachment.service';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: { id: string; attachmentId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attachmentId = parseInt(params.attachmentId);

    if (isNaN(attachmentId)) {
      return NextResponse.json(
        { error: 'Invalid attachment ID' },
        { status: 400 }
      );
    }

    // Получаем информацию о файле перед удалением
    const attachment = await attachmentService.getById(attachmentId);

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Удаляем файл с диска
    if (attachment.fileUrl.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', attachment.fileUrl);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (error) {
          console.error('[API] Error deleting file:', error);
          // Продолжаем удаление записи из БД даже если файл не найден
        }
      }
    }

    // Удаляем запись из БД
    await attachmentService.delete(attachmentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting attachment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
