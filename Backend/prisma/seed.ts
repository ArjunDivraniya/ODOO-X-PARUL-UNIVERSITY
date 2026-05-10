import { PrismaClient } from '../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  const user1 = await prisma.user.upsert({
    where: { email: 'test@traveloop.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@traveloop.com',
      password: 'hashed_password_placeholder', // Not a real bcrypt hash for seed, just a placeholder
      phoneNumber: '1234567890',
      city: 'New York',
      country: 'USA',
      bio: 'Love to travel!',
    },
  });

  console.log({ user1 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
