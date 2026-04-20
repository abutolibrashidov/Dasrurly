import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Restaurants
  const r1 = await prisma.restaurant.create({
    data: { name: 'Oshxona Central' }
  });

  const r2 = await prisma.restaurant.create({
    data: { name: 'Oshxona Riverside' }
  });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  // 2. Create Users for R1
  const u1_manager = await prisma.user.create({
    data: { username: 'manager1', password, role: 'manager', restaurantId: r1.id }
  });

  const u1_waiter = await prisma.user.create({
    data: { username: 'waiter1', password, role: 'waiter', restaurantId: r1.id }
  });

  const u1_kitchen = await prisma.user.create({
    data: { username: 'kitchen1', password, role: 'kitchen', restaurantId: r1.id }
  });

  // 3. Create Users for R2
  const u2_manager = await prisma.user.create({
    data: { username: 'manager2', password, role: 'manager', restaurantId: r2.id }
  });

  // 4. Create Menu for R1
  const cat1 = await prisma.category.create({
    data: { name: 'Main Dishes', restaurantId: r1.id }
  });

  await prisma.menuItem.createMany({
    data: [
      { name: 'Osh (Plov)', price: 45000, categoryId: cat1.id, restaurantId: r1.id },
      { name: 'Lagman', price: 35000, categoryId: cat1.id, restaurantId: r1.id }
    ]
  });

  // 5. Create Rooms and Tables for R1
  const room1 = await prisma.room.create({
    data: { name: 'Main Hall', type: 'Indoor', restaurantId: r1.id }
  });

  await prisma.table.createMany({
    data: [
      { number: 1, capacity: 4, roomId: room1.id, restaurantId: r1.id },
      { number: 2, capacity: 2, roomId: room1.id, restaurantId: r1.id }
    ]
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
