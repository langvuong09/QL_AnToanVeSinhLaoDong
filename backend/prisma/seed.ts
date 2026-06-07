import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Xóa dữ liệu cũ
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Seed roles
  await prisma.role.createMany({
    data: [
      {
        id: 1,
        role: 'MANAGER',
        name: 'Quản lý',
        type: 'SYSTEM',
        status: true,
      },
      {
        id: 2,
        role: 'ADMIN',
        name: 'Admin',
        type: 'SYSTEM',
        status: true,
      },
      {
        id: 3,
        role: 'USER',
        name: 'Người dùng',
        type: 'SYSTEM',
        status: true,
      },
    ],
  });

  // Seed users
  await prisma.user.createMany({
    data: [
      {
        username: 'manager01',
        password: '123456',
        fullName: 'Nguyen Van Manager',
        realRole: 'MANAGER',
        email: 'manager@gmail.com',
        status: true,
        roleId: 1,
        workUnit: 'Management Department',
      },
      {
        username: 'admin01',
        password: '123456',
        fullName: 'Tran Van Admin',
        realRole: 'ADMIN',
        email: 'admin@gmail.com',
        status: true,
        roleId: 2,
        workUnit: 'IT Department',
      },
      {
        username: 'user01',
        password: '123456',
        fullName: 'Le Van User 1',
        realRole: 'USER',
        email: 'user01@gmail.com',
        status: true,
        roleId: 3,
        workUnit: 'Sales Department',
      },
      {
        username: 'user02',
        password: '123456',
        fullName: 'Pham Van User 2',
        realRole: 'USER',
        email: 'user02@gmail.com',
        status: true,
        roleId: 3,
        workUnit: 'Sales Department',
      },
      {
        username: 'user03',
        password: '123456',
        fullName: 'Hoang Van User 3',
        realRole: 'USER',
        email: 'user03@gmail.com',
        status: true,
        roleId: 3,
        workUnit: 'Support Department',
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
