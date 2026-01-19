import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@meluvis.local' },
    update: {},
    create: {
      email: 'admin@meluvis.local',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create Sales user
  const salesPassword = await bcrypt.hash('sales123', 10);
  const sales = await prisma.user.upsert({
    where: { email: 'sales@meluvis.local' },
    update: {},
    create: {
      email: 'sales@meluvis.local',
      passwordHash: salesPassword,
      role: 'SALES',
    },
  });

  console.log('Created users:');
  console.log('Admin:', admin.email);
  console.log('Sales:', sales.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
