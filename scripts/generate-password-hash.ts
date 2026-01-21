/**
 * Скрипт для генерации хеша пароля
 * Используется для ручного обновления пароля в базе данных
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Использование: tsx scripts/generate-password-hash.ts <password>');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('Хеш пароля:');
  console.log(hash);
  console.log('');
  console.log('Используйте этот хеш в SQL запросе для обновления пароля');
});
