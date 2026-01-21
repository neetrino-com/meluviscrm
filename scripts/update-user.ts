/**
 * Скрипт для обновления email и пароля пользователя
 * 
 * Использование:
 * tsx scripts/update-user.ts <user_id> <new_email> <new_password>
 * 
 * Пример:
 * tsx scripts/update-user.ts cmkl6x0o800008fg5pycodbas newemail@example.com SecurePass123!
 */

import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const userId = process.argv[2];
  const newEmail = process.argv[3];
  const newPassword = process.argv[4];

  if (!userId || !newEmail || !newPassword) {
    console.error('❌ Ошибка: Необходимо указать все параметры');
    console.log('Использование: tsx scripts/update-user.ts <user_id> <new_email> <new_password>');
    console.log('Пример: tsx scripts/update-user.ts cmkl6x0o800008fg5pycodbas admin@meluvis.local SecurePass123!');
    process.exit(1);
  }

  // Проверка длины пароля
  if (newPassword.length < 8) {
    console.error('❌ Ошибка: Пароль должен содержать минимум 8 символов');
    process.exit(1);
  }

  try {
    // Проверяем существование пользователя
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      console.error(`❌ Ошибка: Пользователь с ID "${userId}" не найден`);
      process.exit(1);
    }

    console.log(`📋 Текущие данные пользователя:`);
    console.log(`   ID: ${existingUser.id}`);
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Role: ${existingUser.role}`);
    console.log('');

    // Проверяем, не занят ли новый email другим пользователем
    if (newEmail !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (emailExists) {
        console.error(`❌ Ошибка: Email "${newEmail}" уже используется другим пользователем`);
        process.exit(1);
      }
    }

    // Хешируем новый пароль
    console.log('🔐 Хеширование нового пароля...');
    const hashedPassword = await bcrypt.hash(newPassword, 12); // Используем 12 раундов для большей безопасности

    // Обновляем пользователя
    console.log('💾 Обновление данных пользователя...');
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        passwordHash: hashedPassword,
      },
    });

    console.log('');
    console.log('✅ Пользователь успешно обновлен!');
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Новый Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log('');
    console.log('🔑 Новые данные для входа:');
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Password: ${newPassword}`);
    console.log('');
    console.log('⚠️  ВАЖНО: Сохраните эти данные в безопасном месте!');
  } catch (error) {
    console.error('❌ Ошибка при обновлении пользователя:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
