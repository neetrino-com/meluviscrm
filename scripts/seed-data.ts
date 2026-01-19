import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

async function main() {
  console.log('🌱 Начинаем заполнение тестовых данных...');

  // 1. Создаём районы
  console.log('📍 Создаём районы...');
  const district1 = await prisma.district.upsert({
    where: { slug: 'kentron' },
    update: {},
    create: {
      name: 'Kentron',
      slug: 'kentron',
    },
  });

  const district2 = await prisma.district.upsert({
    where: { slug: 'arabkir' },
    update: {},
    create: {
      name: 'Arabkir',
      slug: 'arabkir',
    },
  });

  console.log(`✅ Создано районов: 2`);

  // 2. Создаём здания
  console.log('🏢 Создаём здания...');
  const building1 = await prisma.building.upsert({
    where: {
      districtId_slug: {
        districtId: district1.id,
        slug: 'tower-1',
      },
    },
    update: {},
    create: {
      districtId: district1.id,
      name: 'Tower 1',
      slug: 'tower-1',
    },
  });

  const building2 = await prisma.building.upsert({
    where: {
      districtId_slug: {
        districtId: district1.id,
        slug: 'tower-2',
      },
    },
    update: {},
    create: {
      districtId: district1.id,
      name: 'Tower 2',
      slug: 'tower-2',
    },
  });

  const building3 = await prisma.building.upsert({
    where: {
      districtId_slug: {
        districtId: district2.id,
        slug: 'block-a',
      },
    },
    update: {},
    create: {
      districtId: district2.id,
      name: 'Block A',
      slug: 'block-a',
    },
  });

  console.log(`✅ Создано зданий: 3`);

  // 3. Создаём квартиры
  console.log('🏠 Создаём квартиры...');
  
  const apartments = [
    // Tower 1 - Available
    {
      buildingId: building1.id,
      apartmentNo: '12-05',
      apartmentType: 2,
      status: 'AVAILABLE' as const,
      sqm: new Prisma.Decimal(52.4),
      priceSqm: new Prisma.Decimal(650000),
      totalPrice: new Prisma.Decimal(34060000),
    },
    {
      buildingId: building1.id,
      apartmentNo: '12-06',
      apartmentType: 2,
      status: 'AVAILABLE' as const,
      sqm: new Prisma.Decimal(52.4),
      priceSqm: new Prisma.Decimal(650000),
      totalPrice: new Prisma.Decimal(34060000),
    },
    {
      buildingId: building1.id,
      apartmentNo: '13-01',
      apartmentType: 3,
      status: 'RESERVED' as const,
      sqm: new Prisma.Decimal(75.0),
      priceSqm: new Prisma.Decimal(700000),
      totalPrice: new Prisma.Decimal(52500000),
      totalPaid: new Prisma.Decimal(10000000),
      ownershipName: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+374123456789',
    },
    {
      buildingId: building1.id,
      apartmentNo: '13-02',
      apartmentType: 3,
      status: 'SOLD' as const,
      sqm: new Prisma.Decimal(75.0),
      priceSqm: new Prisma.Decimal(700000),
      totalPrice: new Prisma.Decimal(52500000),
      totalPaid: new Prisma.Decimal(52500000),
      dealDate: new Date('2025-12-15'),
      ownershipName: 'Мария Сидорова',
      email: 'maria@example.com',
      phone: '+374987654321',
      passportTaxNo: '123456789',
      salesType: 'CASH' as const,
      dealDescription: 'Полная оплата наличными',
    },
    // Tower 1 - Upcoming
    {
      buildingId: building1.id,
      apartmentNo: '14-01',
      apartmentType: 2,
      status: 'UPCOMING' as const,
      sqm: new Prisma.Decimal(52.4),
      priceSqm: new Prisma.Decimal(650000),
      totalPrice: new Prisma.Decimal(34060000),
    },
    // Tower 2
    {
      buildingId: building2.id,
      apartmentNo: '05-10',
      apartmentType: 1,
      status: 'AVAILABLE' as const,
      sqm: new Prisma.Decimal(45.0),
      priceSqm: new Prisma.Decimal(600000),
      totalPrice: new Prisma.Decimal(27000000),
    },
    {
      buildingId: building2.id,
      apartmentNo: '05-11',
      apartmentType: 1,
      status: 'SOLD' as const,
      sqm: new Prisma.Decimal(45.0),
      priceSqm: new Prisma.Decimal(600000),
      totalPrice: new Prisma.Decimal(27000000),
      totalPaid: new Prisma.Decimal(27000000),
      dealDate: new Date('2025-11-20'),
      ownershipName: 'Алексей Иванов',
      email: 'alex@example.com',
      phone: '+374555123456',
      salesType: 'MORTGAGE' as const,
    },
    // Block A
    {
      buildingId: building3.id,
      apartmentNo: 'A-101',
      apartmentType: 2,
      status: 'AVAILABLE' as const,
      sqm: new Prisma.Decimal(60.0),
      priceSqm: new Prisma.Decimal(620000),
      totalPrice: new Prisma.Decimal(37200000),
    },
    {
      buildingId: building3.id,
      apartmentNo: 'A-102',
      apartmentType: 2,
      status: 'RESERVED' as const,
      sqm: new Prisma.Decimal(60.0),
      priceSqm: new Prisma.Decimal(620000),
      totalPrice: new Prisma.Decimal(37200000),
      totalPaid: new Prisma.Decimal(5000000),
      ownershipName: 'Ольга Козлова',
      email: 'olga@example.com',
      phone: '+374777888999',
    },
  ];

  let created = 0;
  for (const apt of apartments) {
    try {
      await prisma.apartment.upsert({
        where: {
          buildingId_apartmentNo: {
            buildingId: apt.buildingId,
            apartmentNo: apt.apartmentNo,
          },
        },
        update: {},
        create: apt,
      });
      created++;
    } catch (error) {
      console.error(`Ошибка создания квартиры ${apt.apartmentNo}:`, error);
    }
  }

  console.log(`✅ Создано квартир: ${created}`);

  // Итоговая статистика
  const stats = {
    districts: await prisma.district.count(),
    buildings: await prisma.building.count(),
    apartments: await prisma.apartment.count(),
    apartmentsByStatus: {
      upcoming: await prisma.apartment.count({ where: { status: 'UPCOMING' } }),
      available: await prisma.apartment.count({ where: { status: 'AVAILABLE' } }),
      reserved: await prisma.apartment.count({ where: { status: 'RESERVED' } }),
      sold: await prisma.apartment.count({ where: { status: 'SOLD' } }),
    },
  };

  console.log('\n📊 Статистика:');
  console.log(`   Районов: ${stats.districts}`);
  console.log(`   Зданий: ${stats.buildings}`);
  console.log(`   Квартир: ${stats.apartments}`);
  console.log(`   - Upcoming: ${stats.apartmentsByStatus.upcoming}`);
  console.log(`   - Available: ${stats.apartmentsByStatus.available}`);
  console.log(`   - Reserved: ${stats.apartmentsByStatus.reserved}`);
  console.log(`   - Sold: ${stats.apartmentsByStatus.sold}`);

  console.log('\n✅ Тестовые данные успешно заполнены!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
