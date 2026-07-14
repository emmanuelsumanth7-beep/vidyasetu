const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.findFirst();
  if (!school) {
    console.log("No school found, please run /seed first");
    return;
  }
  
  // Find a teacher to assign (or the principal if no teacher)
  let teacher = await prisma.user.findFirst({ where: { role: 'teacher' }});
  if (!teacher) {
     teacher = await prisma.user.findFirst({ where: { role: 'principal' }});
  }

  const classCount = await prisma.class.count();
  if (classCount > 0) {
    console.log("Classes already exist.");
    return;
  }

  await prisma.class.createMany({
    data: [
      { schoolId: school.id, name: 'Class 5A', classTeacherId: teacher.id },
      { schoolId: school.id, name: 'Class 6B', classTeacherId: teacher.id },
      { schoolId: school.id, name: 'Class 7C', classTeacherId: teacher.id },
    ]
  });

  console.log("Classes seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
