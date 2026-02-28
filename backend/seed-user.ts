import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);
async function run() {
    const user = await prisma.user.create({
        data: {
            email: 'test_' + Date.now() + '@example.com',
            name: 'Test User'
        }
    });
    console.log(user.id);
}

run().catch(console.error).finally(() => prisma.$disconnect());
