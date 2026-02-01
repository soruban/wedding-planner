import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

// Force HMR

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const poolConfig: any = { connectionString };

// If you need to customize the pool config for specific environments, do it here.
// But generally, the connection string is enough for 'pg' to connect.
if (process.env.NODE_ENV === 'production') {
  // Ensure SSL is used in production if needed, or other config
  // poolConfig.ssl = { rejectUnauthorized: false };
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
