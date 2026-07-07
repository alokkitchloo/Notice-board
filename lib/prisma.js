import { PrismaClient } from '@prisma/client';

// Prevents exhausting the DB connection limit in dev, where Next.js
// hot-reloads modules and would otherwise create a new PrismaClient
// on every reload.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
