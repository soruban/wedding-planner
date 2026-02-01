import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const poolConfig: any = { connectionString };
if (process.env.NODE_ENV === 'production' && connectionString) {
  try {
    const url = new URL(connectionString);
    const host = url.searchParams.get('host');
    if (host) {
      poolConfig.host = host;
    }
  } catch (e) {
    console.error('Failed to parse DATABASE_URL', e);
  }
}

const pool = new Pool(poolConfig);
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
