import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { attachmentService } from '@/services/attachment.service';
import { del } from '@vercel/blob';

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

    // Удаляем файл из Vercel Blob
    // Проверяем, что это URL из Blob (начинается с https://)
    if (attachment.fileUrl.startsWith('https://')) {
      try {
        await del(attachment.fileUrl);
      } catch (error) {
        console.error('[API] Error deleting blob:', error);
        // Продолжаем удаление записи из БД даже если файл не найден в Blob
      }
    } else {
      // Для старых файлов, сохранённых локально (миграция)
      console.warn('[API] Old local file detected, skipping blob deletion:', attachment.fileUrl);
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
