import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dashboardService } from '@/services/dashboard.service';
import { getCachedData, cacheKeys } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Кеш на 30 секунд - очень короткий для актуальности данных
    const financial = await getCachedData(
      cacheKeys.dashboard.financial,
      () => dashboardService.getFinancialSummary(),
      30, // 30 секунд
      ['dashboard']
    );

    return NextResponse.json(financial);
  } catch (error) {
    console.error('[API] Error fetching financial summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
