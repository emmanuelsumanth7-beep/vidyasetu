const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst({
    where: { name: 'Sumanth' }
  });

  if (!student) {
    console.log("Student not found");
    return;
  }

  const phone = student.emergencyContact || '11111'; // Fallback if empty

  let parent = await prisma.user.findFirst({
    where: { phoneNumber: phone, role: 'parent' }
  });

  if (!parent) {
    const hash = await bcrypt.hash('password123', 10);
    parent = await prisma.user.create({
      data: {
        schoolId: student.schoolId,
        name: student.name + ' Parent',
        phoneNumber: phone,
        role: 'parent',
        passwordHash: hash
      }
    });
    console.log(`Created parent account with phone: ${phone}`);
  }

  const link = await prisma.parentStudentLink.findFirst({
    where: { parentUserId: parent.id, studentId: student.id }
  });

  if (!link) {
    await prisma.parentStudentLink.create({
      data: {
        parentUserId: parent.id,
        studentId: student.id,
        relationship: 'guardian'
      }
    });
    console.log(`Linked parent to student ${student.name}`);
  }

  console.log(`Done. Login details -> Phone: ${phone}, OTP: 1234`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
