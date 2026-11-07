const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      { id: 1, name: 'Buku', price: 15000 },
      { id: 2, name: 'Pulpen', price: 5000 },
    ],
  });

  console.log('Database seeded successfully with initial products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
