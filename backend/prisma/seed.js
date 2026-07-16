const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Wipe existing data in reverse dependency order to prevent FK constraints
  console.log('Wiping existing data...');
  await prisma.staffLeave.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.salarySlip.deleteMany();
  await prisma.message.deleteMany();
  await prisma.documentApproval.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.otpRequest.deleteMany();
  await prisma.busLocation.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.rfidScan.deleteMany();
  await prisma.rfidDevice.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.leaveApplication.deleteMany();
  await prisma.diaryEntry.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.feeReceipt.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.marks.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.parentStudentLink.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacherSubjectAssignment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
  console.log('Database wiped successfully.');

  // 2. Create School
  const school = await prisma.school.create({
    data: {
      id: 'fcbde93f-767f-40da-af8f-306caf98676a',
      name: 'Vidya Setu International',
      address: 'Tech Park, Phase 1, Bangalore',
      primaryColor: '#4F46E5'
    }
  });
  console.log(`Created school: ${school.name}`);

  // 3. Create Users
  // Principal
  const principal = await prisma.user.create({
    data: {
      schoolId: school.id,
      name: 'Dr. S. K. Sharma',
      role: 'principal',
      phoneNumber: '+919999999991',
      email: 'principal@vidyasetu.edu'
    }
  });

  // Clerk
  const clerk = await prisma.user.create({
    data: {
      schoolId: school.id,
      name: 'Ms. Anita Desai',
      role: 'clerk',
      phoneNumber: '+919999999992',
      email: 'office@vidyasetu.edu'
    }
  });

  // Teachers
  const teacher1 = await prisma.user.create({
    data: { schoolId: school.id, name: 'Mr. R. Iyer (Maths)', role: 'teacher', phoneNumber: '+919999999993' }
  });
  const teacher2 = await prisma.user.create({
    data: { schoolId: school.id, name: 'Mrs. V. Patel (Science)', role: 'teacher', phoneNumber: '+919999999994' }
  });
  const teacher3 = await prisma.user.create({
    data: { schoolId: school.id, name: 'Mr. A. Singh (English)', role: 'teacher', phoneNumber: '+919999999995' }
  });

  // Parents
  const parent1 = await prisma.user.create({
    data: { schoolId: school.id, name: 'Mr. Rajesh Kumar', role: 'parent', phoneNumber: '+918888888881' }
  });
  const parent2 = await prisma.user.create({
    data: { schoolId: school.id, name: 'Mrs. Sunita Verma', role: 'parent', phoneNumber: '+918888888882' }
  });

  console.log('Created Users.');

  // 4. Create Classes
  const class8A = await prisma.class.create({
    data: { schoolId: school.id, name: 'Class 8A', classTeacherId: teacher1.id }
  });
  const class9A = await prisma.class.create({
    data: { schoolId: school.id, name: 'Class 9A', classTeacherId: teacher2.id }
  });
  const class10A = await prisma.class.create({
    data: { schoolId: school.id, name: 'Class 10A', classTeacherId: teacher3.id }
  });

  console.log('Created Classes.');

  // 5. Create Students
  const studentsData = [
    { name: 'Aarav Kumar', roll: '8A-01', classId: class8A.id, parent: parent1, relation: 'father' },
    { name: 'Ananya Verma', roll: '8A-02', classId: class8A.id, parent: parent2, relation: 'mother' },
    { name: 'Vihaan Sharma', roll: '9A-01', classId: class9A.id, parent: parent1, relation: 'father' },
    { name: 'Diya Patel', roll: '10A-01', classId: class10A.id, parent: parent2, relation: 'mother' },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const student = await prisma.student.create({
      data: {
        schoolId: school.id,
        classId: s.classId,
        name: s.name,
        rollNumber: s.roll,
        dob: new Date('2010-05-15'),
        bloodGroup: 'O+',
        parentLinks: {
          create: {
            parentUserId: s.parent.id,
            relationship: s.relation
          }
        }
      }
    });
    createdStudents.push(student);
  }
  console.log(`Created ${createdStudents.length} Students with Parent Links.`);

  // 6. Create Daily Operations (Attendance, Homework, Marks, Fee)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Attendance
  await prisma.attendance.createMany({
    data: [
      { studentId: createdStudents[0].id, date: today, status: 'present', markedById: teacher1.id },
      { studentId: createdStudents[1].id, date: today, status: 'absent', markedById: teacher1.id },
      { studentId: createdStudents[2].id, date: today, status: 'present', markedById: teacher2.id },
      { studentId: createdStudents[0].id, date: yesterday, status: 'present', markedById: teacher1.id },
      { studentId: createdStudents[1].id, date: yesterday, status: 'present', markedById: teacher1.id },
    ]
  });

  // Homework
  await prisma.homework.create({
    data: {
      classId: class8A.id,
      subject: 'Mathematics',
      teacherId: teacher1.id,
      description: 'Complete Algebra Chapter 4 Exercises 1-20.',
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    }
  });

  // Marks
  await prisma.marks.createMany({
    data: [
      { studentId: createdStudents[0].id, subject: 'Math', examName: 'Mid-Term', marksObtained: 85, maxMarks: 100, teacherId: teacher1.id, term: 'Term 1' },
      { studentId: createdStudents[1].id, subject: 'Math', examName: 'Mid-Term', marksObtained: 92, maxMarks: 100, teacherId: teacher1.id, term: 'Term 1' },
    ]
  });

  // Notices
  await prisma.notice.create({
    data: {
      schoolId: school.id,
      title: 'Annual Sports Day 2026',
      body: 'The annual sports day will be held next Friday. All students are requested to be present in their house uniforms.',
      audience: 'all',
      postedById: principal.id
    }
  });

  // Fee Structure
  const fee = await prisma.feeStructure.create({
    data: {
      schoolId: school.id,
      feeHead: 'Tuition Fee - Term 1',
      amount: 25000,
      applicableClassId: class8A.id,
      updatedById: clerk.id
    }
  });

  // Fee Receipt
  await prisma.feeReceipt.create({
    data: {
      studentId: createdStudents[0].id,
      feeHead: 'Tuition Fee - Term 1',
      amount: 25000,
      collectedById: clerk.id,
      paymentMode: 'UPI',
      receiptNumber: 'RCPT-2026-001'
    }
  });

  // Salary Slip
  await prisma.salarySlip.create({
    data: {
      schoolId: school.id,
      staffId: teacher1.id,
      generatedById: principal.id,
      monthYear: 'July 2026',
      basicPay: 45000,
      allowances: 10000,
      deductions: 2000,
      netPay: 53000,
      status: 'paid'
    }
  });

  console.log('Created Operations Data (Attendance, Homework, Fees, Notices).');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
