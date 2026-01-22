import { NextRequest, NextResponse } from 'next/server';
import { buildingService } from '@/services/building.service';
import { apartmentService } from '@/services/apartment.service';

export async function GET(
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

    const buildingId = parseInt(params.id);

    if (isNaN(buildingId)) {
      return NextResponse.json(
        { error: 'Invalid building ID' },
        { status: 400 }
      );
    }

    // Проверяем существование здания
    const building = await buildingService.getById(buildingId);
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

    // Формат для внешнего API (с id и slug для district и building)
    // Включаем все поля, включая данные сделки (deal_date, ownership_name, email, passport_tax_no, phone)
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
      deal_date: apt.deal_date,
      ownership_name: apt.ownership_name,
      email: apt.email,
      passport_tax_no: apt.passport_tax_no,
      phone: apt.phone,
      building_id: apt.building.id,
      building_slug: apt.building.slug,
      district_id: apt.building.district.id,
      district_slug: apt.building.district.slug,
      created_at: apt.createdAt.toISOString(),
      updated_at: apt.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      data: {
        items,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('[API] Error fetching apartments by building ID:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
