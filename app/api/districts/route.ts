import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { districtService } from '@/services/district.service';
import { createDistrictSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
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

    const districts = await districtService.getAll();
    
    // Формат для внешнего API
    if (authHeader && apiToken) {
      const formatted = districts.map((d) => ({
        id: d.id,
        slug: d.slug,
        name: d.name,
        created_at: d.createdAt.toISOString(),
        updated_at: d.updatedAt.toISOString(),
      }));
      return NextResponse.json({ data: formatted });
    }
    
    return NextResponse.json(districts);
  } catch (error) {
    console.error('[API] Error fetching districts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createDistrictSchema.parse(body);

    const district = await districtService.create(validatedData);
    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Район с таким slug уже существует' },
        { status: 409 }
      );
    }

    console.error('[API] Error creating district:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
