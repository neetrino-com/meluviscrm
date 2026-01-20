import { prisma } from '@/lib/prisma';

export const dashboardService = {
  async getApartmentSummary() {
    const [total, upcoming, available, reserved, sold] = await Promise.all([
      prisma.apartment.aggregate({
        _count: { id: true },
        _sum: { sqm: true },
      }),
      prisma.apartment.aggregate({
        where: { status: 'UPCOMING' },
        _count: { id: true },
        _sum: { sqm: true },
      }),
      prisma.apartment.aggregate({
        where: { status: 'AVAILABLE' },
        _count: { id: true },
        _sum: { sqm: true },
      }),
      prisma.apartment.aggregate({
        where: { status: 'RESERVED' },
        _count: { id: true },
        _sum: { sqm: true },
      }),
      prisma.apartment.aggregate({
        where: { status: 'SOLD' },
        _count: { id: true },
        _sum: { sqm: true },
      }),
    ]);

    return {
      total: {
        count: total._count.id,
        sqm: total._sum.sqm ? Number(total._sum.sqm) : 0,
      },
      upcoming: {
        count: upcoming._count.id,
        sqm: upcoming._sum.sqm ? Number(upcoming._sum.sqm) : 0,
      },
      available: {
        count: available._count.id,
        sqm: available._sum.sqm ? Number(available._sum.sqm) : 0,
      },
      reserved: {
        count: reserved._count.id,
        sqm: reserved._sum.sqm ? Number(reserved._sum.sqm) : 0,
      },
      sold: {
        count: sold._count.id,
        sqm: sold._sum.sqm ? Number(sold._sum.sqm) : 0,
      },
    };
  },

  async getFinancialSummary() {
    // Sold apartments
    const soldApartments = await prisma.apartment.findMany({
      where: { status: 'SOLD' },
      select: {
        totalPrice: true,
        totalPaid: true,
        sqm: true,
        priceSqm: true,
      },
    });

    let totalSoldAmount = 0;
    let totalSoldPaid = 0;

    for (const apt of soldApartments) {
      // Calculate totalPrice: use from DB if exists, otherwise calculate from sqm * priceSqm
      let apartmentTotalPrice = 0;
      if (apt.totalPrice) {
        apartmentTotalPrice = Number(apt.totalPrice);
      } else if (apt.sqm && apt.priceSqm) {
        apartmentTotalPrice = Number(apt.sqm) * Number(apt.priceSqm);
      }
      
      totalSoldAmount += apartmentTotalPrice;
      
      if (apt.totalPaid) {
        totalSoldPaid += Number(apt.totalPaid);
      }
    }

    const soldBalance = totalSoldAmount - totalSoldPaid;

    // Not sold apartments (Upcoming, Available, Reserved)
    const notSoldApartments = await prisma.apartment.findMany({
      where: {
        status: {
          in: ['UPCOMING', 'AVAILABLE', 'RESERVED'],
        },
      },
      select: {
        totalPrice: true,
        sqm: true,
        priceSqm: true,
        status: true,
      },
    });

    let totalUpcomingAmount = 0;
    let totalAvailableAmount = 0;
    let totalReservedAmount = 0;

    for (const apt of notSoldApartments) {
      let amount = 0;
      if (apt.totalPrice) {
        amount = Number(apt.totalPrice);
      } else if (apt.sqm && apt.priceSqm) {
        amount = Number(apt.sqm) * Number(apt.priceSqm);
      }

      if (apt.status === 'UPCOMING') {
        totalUpcomingAmount += amount;
      } else if (apt.status === 'AVAILABLE') {
        totalAvailableAmount += amount;
      } else if (apt.status === 'RESERVED') {
        totalReservedAmount += amount;
      }
    }

    return {
      sold: {
        amount: totalSoldAmount,
        paid: totalSoldPaid,
        balance: soldBalance,
      },
      notSold: {
        upcoming: totalUpcomingAmount,
        available: totalAvailableAmount,
        reserved: totalReservedAmount,
      },
    };
  },

  async getSalesTimeline() {
    const soldApartments = await prisma.apartment.findMany({
      where: { status: 'SOLD' },
      select: {
        dealDate: true,
        totalPrice: true,
        updatedAt: true,
      },
      orderBy: { dealDate: 'asc' },
    });

    // Группируем по месяцам
    const monthlyData: Record<
      string,
      { count: number; amount: number }
    > = {};

    for (const apt of soldApartments) {
      // Используем dealDate если есть, иначе updatedAt
      const date = apt.dealDate || apt.updatedAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, amount: 0 };
      }

      monthlyData[monthKey].count += 1;
      if (apt.totalPrice) {
        monthlyData[monthKey].amount += Number(apt.totalPrice);
      }
    }

    // Преобразуем в массив и сортируем
    const timeline = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        count: data.count,
        amount: data.amount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return timeline;
  },
};
