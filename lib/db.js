import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// Test connection function
export async function testConnection() {
  try {
    await db.$connect();
    console.log('✅ Neon PostgreSQL connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}