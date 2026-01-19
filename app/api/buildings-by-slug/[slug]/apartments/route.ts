import { NextRequest, NextResponse } from 'next/server';
import { buildingService } from '@/services/building.service';
import { apartmentService } from '@/services/apartment.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
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

    // Согласно спецификации: GET /api/buildings/{building_slug}/apartments
    // Но нам нужен district_slug для поиска здания
    // Используем формат: /api/districts/{district_slug}/buildings/{building_slug}/apartments
    // Или ищем здание по slug во всех районах (менее эффективно, но проще)
    
    // Временное решение: ищем здание по slug во всех районах
    // В будущем можно улучшить структуру API
    const allBuildings = await buildingService.getAll();
    const building = allBuildings.find((b) => b.slug === params.slug);

    if (!building) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404 }
      );
    }

    // Получаем параметры пагинации
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const result = await apartmentService.getAll({
      buildingId: building.id,
      status: status
        ? (status.toUpperCase() as 'UPCOMING' | 'AVAILABLE' | 'RESERVED' | 'SOLD')
        : undefined,
      page,
      limit,
    });

    // Формат для внешнего API
    const items = result.items.map((apt) => ({
      id: apt.id,
      apartment_no: apt.apartmentNo,
      apartment_type: apt.apartmentType,
      status: apt.status.toLowerCase(),
      sqm: apt.sqm,
      price_sqm: apt.price_sqm,
      total_price: apt.total_price,
      total_paid: apt.total_paid,
      balance: apt.balance,
      building_id: apt.buildingId,
      building_slug: apt.building.slug,
      district_id: apt.building.district.id,
      district_slug: apt.building.district.slug,
      created_at: apt.createdAt.toISOString(),
      updated_at: apt.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      items,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('[API] Error fetching apartments by building slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
