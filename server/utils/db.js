import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export async function isDbAlive() {
  try {
    const res = await checkDatabaseConnection();
    return Boolean(res && res.connected);
  } catch {
    return false;
  }
}

