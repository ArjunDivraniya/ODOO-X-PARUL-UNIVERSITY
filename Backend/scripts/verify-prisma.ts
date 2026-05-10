import { prisma } from '../lib/prisma';

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('✅ Connected.');
  } catch (error) {
    console.error('Failed to connect:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
