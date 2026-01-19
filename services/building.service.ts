import { prisma } from '@/lib/prisma';
import type { Building } from '@prisma/client';

export const buildingService = {
  async getAll(districtId?: number): Promise<Building[]> {
    return await prisma.building.findMany({
      where: districtId ? { districtId } : undefined,
      include: {
        district: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: number): Promise<Building | null> {
    return await prisma.building.findUnique({
      where: { id },
      include: {
        district: true,
      },
    });
  },

  async getBySlug(districtId: number, slug: string): Promise<Building | null> {
    return await prisma.building.findUnique({
      where: {
        districtId_slug: {
          districtId,
          slug,
        },
      },
      include: {
        district: true,
      },
    });
  },

  async create(data: {
    districtId: number;
    name: string;
    slug: string;
  }): Promise<Building> {
    // Проверка существования района
    const district = await prisma.district.findUnique({
      where: { id: data.districtId },
    });

    if (!district) {
      throw new Error('Район не найден');
    }

    // Валидация slug
    const validSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return await prisma.building.create({
      data: {
        districtId: data.districtId,
        name: data.name.trim(),
        slug: validSlug,
      },
      include: {
        district: true,
      },
    });
  },

  async update(
    id: number,
    data: { name?: string; slug?: string; districtId?: number }
  ): Promise<Building> {
    const updateData: {
      name?: string;
      slug?: string;
      districtId?: number;
    } = {};

    if (data.name) {
      updateData.name = data.name.trim();
    }

    if (data.slug) {
      updateData.slug = data.slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    if (data.districtId) {
      // Проверка существования района
      const district = await prisma.district.findUnique({
        where: { id: data.districtId },
      });

      if (!district) {
        throw new Error('Район не найден');
      }

      updateData.districtId = data.districtId;
    }

    return await prisma.building.update({
      where: { id },
      data: updateData,
      include: {
        district: true,
      },
    });
  },

  async delete(id: number): Promise<void> {
    // Проверка: нельзя удалить здание, если есть квартиры
    const apartmentsCount = await prisma.apartment.count({
      where: { buildingId: id },
    });

    if (apartmentsCount > 0) {
      throw new Error(
        `Нельзя удалить здание: в нём ${apartmentsCount} квартир. Сначала удалите все квартиры.`
      );
    }

    await prisma.building.delete({
      where: { id },
    });
  },
};
