import { prisma } from '@/lib/prisma';
import type { Apartment, ApartmentStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const apartmentService = {
  async getAll(filters?: {
    buildingId?: number;
    status?: ApartmentStatus;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = Math.min(filters?.limit || 50, 100);
    const skip = (page - 1) * limit;

    const where: {
      buildingId?: number;
      status?: ApartmentStatus;
    } = {};

    if (filters?.buildingId) {
      where.buildingId = filters.buildingId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    // Оптимизация: используем select вместо include для меньшего объёма данных
    const [apartments, total] = await Promise.all([
      prisma.apartment.findMany({
        where,
        select: {
          id: true,
          buildingId: true,
          apartmentNo: true,
          apartmentType: true,
          status: true,
          sqm: true,
          priceSqm: true,
          totalPrice: true,
          totalPaid: true,
          createdAt: true,
          updatedAt: true,
          building: {
            select: {
              id: true,
              name: true,
              slug: true,
              district: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { apartmentNo: 'asc' },
        skip,
        take: limit,
      }),
      prisma.apartment.count({ where }),
    ]);

    // Вычисляемые поля
    const apartmentsWithCalculations = apartments.map((apt) => {
      const totalPrice =
        apt.sqm && apt.priceSqm
          ? Number(apt.sqm) * Number(apt.priceSqm)
          : null;

      const balance =
        totalPrice && apt.totalPaid
          ? totalPrice - Number(apt.totalPaid)
          : totalPrice;

      return {
        ...apt,
        total_price: totalPrice,
        balance,
        sqm: apt.sqm ? Number(apt.sqm) : null,
        price_sqm: apt.priceSqm ? Number(apt.priceSqm) : null,
        total_paid: apt.totalPaid ? Number(apt.totalPaid) : null,
      };
    });

    return {
      items: apartmentsWithCalculations,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number) {
    // Оптимизация: используем select для загрузки только нужных полей
    const apartment = await prisma.apartment.findUnique({
      where: { id },
      select: {
        id: true,
        buildingId: true,
        apartmentNo: true,
        apartmentType: true,
        status: true,
        sqm: true,
        priceSqm: true,
        totalPrice: true,
        totalPaid: true,
        dealDate: true,
        ownershipName: true,
        email: true,
        passportTaxNo: true,
        phone: true,
        salesType: true,
        dealDescription: true,
        matterLink: true,
        floorplanDistribution: true,
        exteriorLink: true,
        exteriorLink2: true,
        createdAt: true,
        updatedAt: true,
        building: {
          select: {
            id: true,
            name: true,
            slug: true,
            district: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        attachments: {
          select: {
            id: true,
            fileType: true,
            fileUrl: true,
            fileName: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
    });

    if (!apartment) {
      return null;
    }

    // Вычисляемые поля
    const totalPrice =
      apartment.sqm && apartment.priceSqm
        ? Number(apartment.sqm) * Number(apartment.priceSqm)
        : null;

    const balance =
      totalPrice && apartment.totalPaid
        ? totalPrice - Number(apartment.totalPaid)
        : totalPrice;

    // Группировка attachments по типу
    const attachments = {
      agreement_files: apartment.attachments.filter(
        (a) => a.fileType === 'AGREEMENT'
      ),
      floorplans_files: apartment.attachments.filter(
        (a) => a.fileType === 'FLOORPLAN'
      ),
      images_files: apartment.attachments.filter(
        (a) => a.fileType === 'IMAGE'
      ),
      progress_images_files: apartment.attachments.filter(
        (a) => a.fileType === 'PROGRESS_IMAGE'
      ),
    };

    return {
      ...apartment,
      total_price: totalPrice,
      balance,
      sqm: apartment.sqm ? Number(apartment.sqm) : null,
      price_sqm: apartment.priceSqm ? Number(apartment.priceSqm) : null,
      total_paid: apartment.totalPaid ? Number(apartment.totalPaid) : null,
      attachments,
      building_name: apartment.building.name,
      building_slug: apartment.building.slug,
      district_id: apartment.building.district.id,
      district_slug: apartment.building.district.slug,
      district_name: apartment.building.district.name,
    };
  },

  async create(data: {
    buildingId: number;
    apartmentNo: string;
    apartmentType?: number;
    sqm?: number;
    priceSqm?: number;
    status?: ApartmentStatus;
  }) {
    // Проверка существования здания
    const building = await prisma.building.findUnique({
      where: { id: data.buildingId },
    });

    if (!building) {
      throw new Error('Здание не найдено');
    }

    // Проверка уникальности apartment_no в здании
    const existing = await prisma.apartment.findUnique({
      where: {
        buildingId_apartmentNo: {
          buildingId: data.buildingId,
          apartmentNo: data.apartmentNo.trim(),
        },
      },
    });

    if (existing) {
      throw new Error(
        `Квартира с номером ${data.apartmentNo} уже существует в этом здании`
      );
    }

    // Вычисление total_price
    const totalPrice =
      data.sqm && data.priceSqm
        ? new Prisma.Decimal(data.sqm * data.priceSqm)
        : null;

    return await prisma.apartment.create({
      data: {
        buildingId: data.buildingId,
        apartmentNo: data.apartmentNo.trim(),
        apartmentType: data.apartmentType,
        sqm: data.sqm,
        priceSqm: data.priceSqm,
        totalPrice: totalPrice,
        status: data.status || 'UPCOMING',
      },
      include: {
        building: {
          include: {
            district: true,
          },
        },
      },
    });
  },

  async update(id: number, data: Partial<Apartment>) {
    // Если обновляются sqm или priceSqm, пересчитываем totalPrice
    if (data.sqm !== undefined || data.priceSqm !== undefined) {
      const current = await prisma.apartment.findUnique({
        where: { id },
        select: { sqm: true, priceSqm: true },
      });

      if (current) {
        const sqm = data.sqm !== undefined ? data.sqm : current.sqm;
        const priceSqm =
          data.priceSqm !== undefined ? data.priceSqm : current.priceSqm;

        if (sqm && priceSqm) {
          data.totalPrice = new Prisma.Decimal(Number(sqm) * Number(priceSqm));
        }
      }
    }

    return await prisma.apartment.update({
      where: { id },
      data,
      include: {
        building: {
          include: {
            district: true,
          },
        },
      },
    });
  },

  async updateStatus(id: number, status: ApartmentStatus) {
    // Валидация: при статусе SOLD желательно иметь deal_date и ownership_name
    if (status === 'SOLD') {
      const apartment = await prisma.apartment.findUnique({
        where: { id },
        select: { dealDate: true, ownershipName: true },
      });

      if (!apartment?.dealDate || !apartment?.ownershipName) {
        // Не блокируем, но предупреждаем
        console.warn(
          `[Apartment Service] Apartment ${id} marked as SOLD without deal_date or ownership_name`
        );
      }
    }

    return await prisma.apartment.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  },

  async delete(id: number) {
    await prisma.apartment.delete({
      where: { id },
    });
  },
};
