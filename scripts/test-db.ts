import { prisma } from '../lib/prisma';

async function test() {
  try {
    const userCount = await prisma.user.count();
    console.log('✅ Подключение к БД работает');
    console.log(`✅ Пользователей в БД: ${userCount}`);
    
    const users = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log('Пользователи:', users);
    
    const districtCount = await prisma.district.count();
    console.log(`✅ Районов в БД: ${districtCount}`);
    
    const buildingCount = await prisma.building.count();
    console.log(`✅ Зданий в БД: ${buildingCount}`);
    
    const apartmentCount = await prisma.apartment.count();
    console.log(`✅ Квартир в БД: ${apartmentCount}`);
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
