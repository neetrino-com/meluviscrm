import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

/**
 * Функция авторизации пользователя
 * Вынесена в отдельный файл, чтобы изолировать bcryptjs от Edge Runtime
 * Этот файл используется только в Node.js runtime (API routes)
 */
export async function authorizeUser(
  email: string,
  password: string
): Promise<{ id: string; email: string; role: string } | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
