const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.student.create({
      data: {
        schoolId: "d6f519c7-50fb-4d1a-8c31-7b025f187a53",
        classId: "d6f519c7-50fb-4d1a-8c31-7b025f187a53",
        name: "Test",
        rollNumber: "123",
        dob: new Date(""), // Invalid Date
      }
    });
  } catch (e) {
    console.log(e.message);
  }
}
main();
