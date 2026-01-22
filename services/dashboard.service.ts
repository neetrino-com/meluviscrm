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
    // Оптимизация: используем aggregate для сумм totalPrice и totalPaid
    // Для записей где totalPrice null, вычисляем из sqm * priceSqm отдельным запросом
    
    // 1. Агрегация для SOLD квартир (где totalPrice заполнен)
    const soldWithPrice = await prisma.apartment.aggregate({
      where: {
        status: 'SOLD',
        totalPrice: { not: null },
      },
      _sum: {
        totalPrice: true,
        totalPaid: true,
      },
    });

    // 2. Агрегация для SOLD квартир (где totalPrice null, вычисляем из sqm * priceSqm)
    const soldWithoutPrice = await prisma.apartment.findMany({
      where: {
        status: 'SOLD',
        totalPrice: null,
        sqm: { not: null },
        priceSqm: { not: null },
      },
      select: {
        sqm: true,
        priceSqm: true,
        totalPaid: true,
      },
    });

    // 3. Сумма totalPaid для всех SOLD (включая те, где totalPrice null)
    const soldTotalPaidAggregate = await prisma.apartment.aggregate({
      where: { status: 'SOLD' },
      _sum: { totalPaid: true },
    });

    // Вычисляем суммы для SOLD
    let totalSoldAmount = soldWithPrice._sum.totalPrice
      ? Number(soldWithPrice._sum.totalPrice)
      : 0;

    // Добавляем вычисленные цены для квартир без totalPrice
    for (const apt of soldWithoutPrice) {
      if (apt.sqm && apt.priceSqm) {
        totalSoldAmount += Number(apt.sqm) * Number(apt.priceSqm);
      }
    }

    const totalSoldPaid = soldTotalPaidAggregate._sum.totalPaid
      ? Number(soldTotalPaidAggregate._sum.totalPaid)
      : 0;
    const soldBalance = totalSoldAmount - totalSoldPaid;

    // 4. Агрегация для не проданных квартир по статусам (где totalPrice заполнен)
    const [upcomingWithPrice, availableWithPrice, reservedWithPrice] =
      await Promise.all([
        prisma.apartment.aggregate({
          where: {
            status: 'UPCOMING',
            totalPrice: { not: null },
          },
          _sum: { totalPrice: true },
        }),
        prisma.apartment.aggregate({
          where: {
            status: 'AVAILABLE',
            totalPrice: { not: null },
          },
          _sum: { totalPrice: true },
        }),
        prisma.apartment.aggregate({
          where: {
            status: 'RESERVED',
            totalPrice: { not: null },
          },
          _sum: { totalPrice: true },
        }),
      ]);

    // 5. Для квартир без totalPrice вычисляем из sqm * priceSqm
    const notSoldWithoutPrice = await prisma.apartment.findMany({
      where: {
        status: { in: ['UPCOMING', 'AVAILABLE', 'RESERVED'] },
        totalPrice: null,
        sqm: { not: null },
        priceSqm: { not: null },
      },
      select: {
        status: true,
        sqm: true,
        priceSqm: true,
      },
    });

    // Вычисляем суммы для не проданных квартир
    let totalUpcomingAmount = upcomingWithPrice._sum.totalPrice
      ? Number(upcomingWithPrice._sum.totalPrice)
      : 0;
    let totalAvailableAmount = availableWithPrice._sum.totalPrice
      ? Number(availableWithPrice._sum.totalPrice)
      : 0;
    let totalReservedAmount = reservedWithPrice._sum.totalPrice
      ? Number(reservedWithPrice._sum.totalPrice)
      : 0;

    // Добавляем вычисленные цены для квартир без totalPrice
    for (const apt of notSoldWithoutPrice) {
      if (apt.sqm && apt.priceSqm) {
        const amount = Number(apt.sqm) * Number(apt.priceSqm);
        if (apt.status === 'UPCOMING') {
          totalUpcomingAmount += amount;
        } else if (apt.status === 'AVAILABLE') {
          totalAvailableAmount += amount;
        } else if (apt.status === 'RESERVED') {
          totalReservedAmount += amount;
        }
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
