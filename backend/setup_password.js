const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const principal = await prisma.user.findFirst({
    where: { role: 'PRINCIPAL' }
  });

  if (!principal) {
    console.log("No principal found!");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.update({
    where: { id: principal.id },
    data: { passwordHash: hashedPassword, isActive: true }
  });

  console.log(`Password set for ${principal.name} (${principal.phoneNumber}) to 'admin123'`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
