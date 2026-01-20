// Этот endpoint поддерживает как внутренний API (Session), так и внешний (Bearer Token)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildingService } from '@/services/building.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка для внешнего API (Bearer Token) или внутреннего (Session)
    const authHeader = request.headers.get('authorization');
    const apiToken = process.env.API_TOKEN;

    if (authHeader && apiToken) {
      // Внешний API через Bearer Token
      const token = authHeader.replace('Bearer ', '');
      if (token !== apiToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      // Внутренний API через Session
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const districtId = parseInt(params.id);

    if (isNaN(districtId)) {
      return NextResponse.json(
        { error: 'Invalid district ID' },
        { status: 400 }
      );
    }

    const buildings = await buildingService.getAll(districtId);

    // Формат для внешнего API (с id и slug для district)
    if (authHeader && apiToken) {
      const formatted = buildings.map((b: any) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        district_id: b.districtId,
        district_slug: b.district?.slug || '',
        created_at: b.createdAt.toISOString(),
        updated_at: b.updatedAt.toISOString(),
      }));
      return NextResponse.json(formatted);
    }

    // Внутренний API - возвращаем полный объект
    return NextResponse.json(buildings);
  } catch (error) {
    console.error('[API] Error fetching buildings by district:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
