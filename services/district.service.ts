import { prisma } from '@/lib/prisma';
import type { District } from '@prisma/client';

export const districtService = {
  async getAll(): Promise<District[]> {
    return await prisma.district.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: number): Promise<District | null> {
    return await prisma.district.findUnique({
      where: { id },
    });
  },

  async getBySlug(slug: string): Promise<District | null> {
    return await prisma.district.findUnique({
      where: { slug },
    });
  },

  async create(data: { name: string; slug: string }): Promise<District> {
    // Валидация slug: только lowercase, дефисы, без пробелов
    const validSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return await prisma.district.create({
      data: {
        name: data.name.trim(),
        slug: validSlug,
      },
    });
  },

  async update(
    id: number,
    data: { name?: string; slug?: string }
  ): Promise<District> {
    const updateData: { name?: string; slug?: string } = {};

    if (data.name) {
      updateData.name = data.name.trim();
    }

    if (data.slug) {
      // Валидация slug
      updateData.slug = data.slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    return await prisma.district.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: number): Promise<void> {
    // Проверка: нельзя удалить район, если есть здания
    const buildingsCount = await prisma.building.count({
      where: { districtId: id },
    });

    if (buildingsCount > 0) {
      throw new Error(
        `Нельзя удалить район: в нём ${buildingsCount} зданий. Сначала удалите все здания.`
      );
    }

    await prisma.district.delete({
      where: { id },
    });
  },
};
