import { NextRequest, NextResponse } from 'next/server';
import { apartmentService } from '@/services/apartment.service';
import { updateApartmentStatusSchema } from '@/lib/validations';
import { z } from 'zod';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка Bearer Token для внешнего API
    const authHeader = request.headers.get('authorization');
    const apiToken = process.env.API_TOKEN;

    if (!authHeader || !apiToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token !== apiToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid apartment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateApartmentStatusSchema.parse(body);

    const apartment = await apartmentService.updateStatus(
      id,
      validatedData.status
    );

    return NextResponse.json({
      id: apartment.id,
      status: apartment.status.toLowerCase(),
      updated_at: apartment.updatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid status value',
          details:
            'Status must be one of: upcoming, available, reserved, sold',
        },
        { status: 400 }
      );
    }

    console.error('[API] Error updating apartment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
