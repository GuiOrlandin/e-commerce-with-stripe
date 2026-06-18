import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/client';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123456';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Admin';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const password_hash = await hash(ADMIN_PASSWORD, 10);

    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        name: ADMIN_NAME,
        role: 'ADMIN',
        password_hash,
      },
      create: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password_hash,
        role: 'ADMIN',
      },
    });

    console.log(`Admin user ready: ${admin.email} (id: ${admin.id})`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Failed to create admin user:', error);
  process.exit(1);
});
