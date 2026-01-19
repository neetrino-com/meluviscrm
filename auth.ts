import NextAuth from 'next-auth';
import { authConfig } from './lib/auth';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
  ],
});
