import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Super Admin...');

  // 1. Ensure a "System" restaurant exists
  let systemRestaurant = await prisma.restaurant.findFirst({
    where: { name: 'Dasturly System' }
  });

  if (!systemRestaurant) {
    systemRestaurant = await prisma.restaurant.create({
      data: {
        name: 'Dasturly System',
        isActive: true,
        subscriptionStatus: 'active'
      }
    });
    console.log('✅ Created System Restaurant');
  }

  // 2. Create Super Admin User
  const username = 'admin';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { username }
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { username },
      data: { role: 'superadmin', restaurantId: systemRestaurant.id }
    });
    console.log(`✅ Updated existing user "${username}" to Super Admin`);
  } else {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'superadmin',
        restaurantId: systemRestaurant.id
      }
    });
    console.log(`✅ Created Super Admin user: ${username} / ${password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
