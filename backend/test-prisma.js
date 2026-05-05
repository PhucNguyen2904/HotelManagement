const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const roomTypesToMatch = new Set(['cuid-that-does-not-exist']);
  
  const availableRooms = await prisma.room.findMany({
    where: {
      ...(roomTypesToMatch && {
        roomTypeId: { in: Array.from(roomTypesToMatch) },
      }),
      isActive: true,
    },
  });
  
  console.log('Result length:', availableRooms.length);
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
