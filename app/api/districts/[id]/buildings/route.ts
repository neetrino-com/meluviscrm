// Этот endpoint используется для внутреннего API
// Для внешнего API используется /api/districts-by-slug/[slug]/buildings
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildingService } from '@/services/building.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const districtId = parseInt(params.id);

    if (isNaN(districtId)) {
      return NextResponse.json(
        { error: 'Invalid district ID' },
        { status: 400 }
      );
    }

    const buildings = await buildingService.getAll(districtId);
    return NextResponse.json(buildings);
  } catch (error) {
    console.error('[API] Error fetching buildings by district:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
