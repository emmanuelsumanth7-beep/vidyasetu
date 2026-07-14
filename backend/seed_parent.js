const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.findFirst();
  if (!school) {
    console.log("No school found, run /seed first");
    return;
  }

  // Find a class
  const cls = await prisma.class.findFirst();
  if (!cls) {
    console.log("No classes found. Seed classes first.");
    return;
  }

  // Create Parent
  const hash = await bcrypt.hash('password123', 10);
  let parent = await prisma.user.findFirst({ where: { phoneNumber: '5551234' } });
  
  if (!parent) {
    parent = await prisma.user.create({
      data: {
        schoolId: school.id,
        name: 'John Doe (Parent)',
        phoneNumber: '5551234',
        role: 'parent',
        passwordHash: hash
      }
    });
    console.log("Parent created:", parent.name);
  } else {
    console.log("Parent already exists:", parent.name);
  }

  // Create Student
  let student = await prisma.student.findFirst({ where: { name: 'Jimmy Doe' } });
  if (!student) {
    student = await prisma.student.create({
      data: {
        schoolId: school.id,
        classId: cls.id,
        name: 'Jimmy Doe',
        rollNumber: 'JD-001',
        gender: 'Male',
        bloodGroup: 'O+',
      }
    });
    console.log("Student created:", student.name);
  } else {
    console.log("Student already exists:", student.name);
  }

  // Create Link
  let link = await prisma.parentStudentLink.findFirst({
    where: { parentUserId: parent.id, studentId: student.id }
  });

  if (!link) {
    await prisma.parentStudentLink.create({
      data: {
        parentUserId: parent.id,
        studentId: student.id,
        relationship: 'father'
      }
    });
    console.log("Linked Parent to Student.");
  } else {
    console.log("Link already exists.");
  }

  console.log("Seed complete. Parent Phone: 5551234 | OTP: 1234");
}

main().catch(console.error).finally(() => prisma.$disconnect());
