const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Wipe existing data in reverse dependency order
  console.log('Wiping existing data...');
  await prisma.staffLeave.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.salarySlip.deleteMany();
  await prisma.message.deleteMany();
  await prisma.documentApproval.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.otpRequest.deleteMany();
  await prisma.busLocation.deleteMany();
  await prisma.studentTransport.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.busStop.deleteMany();
  await prisma.busRoute.deleteMany();
  await prisma.rfidScan.deleteMany();
  await prisma.rfidDevice.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.leaveApplication.deleteMany();
  await prisma.diaryEntry.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.feeReceipt.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.marks.deleteMany();
  await prisma.homeworkSubmission.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.parentStudentLink.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.parentProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
  console.log('Database wiped successfully.');

  // 2. Create School
  const seedTheme = {
    primary:         '#4F46E5',
    secondary:       '#7C3AED',
    accent:          '#F59E0B',
    textOnPrimary:   '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textOnAccent:    '#000000',
    logoUrl:         null,
    appName:         'Vidya Setu International',
    extractedAt:     new Date().toISOString(),
  };
  const school = await prisma.school.create({
    data: {
      id:           'fcbde93f-767f-40da-af8f-306caf98676a',
      name:         'Vidya Setu International',
      address:      'Tech Park, Phase 1, Bangalore',
      code:         'vidyasetu-intl',
      primaryColor: seedTheme.primary,
      themeConfig:  seedTheme,
    }
  });
  console.log(`Created school: ${school.name}`);

  // 3. Create Academic Year
  const currentYear = await prisma.academicYear.create({
    data: {
      schoolId: school.id,
      name: '2026-27',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true
    }
  });

  // 4. Create Subjects
  const subjectMath = await prisma.subject.create({
    data: { schoolId: school.id, name: 'Mathematics', code: 'MATH' }
  });
  const subjectSci = await prisma.subject.create({
    data: { schoolId: school.id, name: 'Science', code: 'SCI' }
  });

  // 5. Create Users & Profiles
  // Principal
  const principal = await prisma.user.create({
    data: { schoolId: school.id, name: 'Dr. S. K. Sharma', role: 'PRINCIPAL', phoneNumber: '+919999999991', email: 'principal@vidyasetu.edu' }
  });
  await prisma.staffProfile.create({ data: { userId: principal.id, schoolId: school.id, employeeCode: 'EMP-P1', dateOfJoining: new Date('2020-01-01') }});

  // Clerk
  const clerk = await prisma.user.create({
    data: { schoolId: school.id, name: 'Ms. Anita Desai', role: 'CLERK', phoneNumber: '+919999999992', email: 'office@vidyasetu.edu' }
  });
  await prisma.staffProfile.create({ data: { userId: clerk.id, schoolId: school.id, employeeCode: 'EMP-C1', dateOfJoining: new Date('2021-01-01') }});

  // Teachers
  const teacher1 = await prisma.user.create({ data: { schoolId: school.id, name: 'Mr. R. Iyer (Maths)', role: 'TEACHER', phoneNumber: '+919999999993' }});
  await prisma.teacherProfile.create({ data: { userId: teacher1.id, schoolId: school.id, employeeCode: 'EMP-T1', dateOfJoining: new Date('2022-01-01') }});
  
  const teacher2 = await prisma.user.create({ data: { schoolId: school.id, name: 'Mrs. V. Patel (Science)', role: 'TEACHER', phoneNumber: '+919999999994' }});
  await prisma.teacherProfile.create({ data: { userId: teacher2.id, schoolId: school.id, employeeCode: 'EMP-T2', dateOfJoining: new Date('2022-01-01') }});

  // Parents
  const parent1 = await prisma.user.create({ data: { schoolId: school.id, name: 'Mr. Rajesh Kumar', role: 'PARENT', phoneNumber: '+918888888881' }});
  const parentProfile1 = await prisma.parentProfile.create({ data: { userId: parent1.id, schoolId: school.id }});

  // Students
  const studentUser1 = await prisma.user.create({ data: { schoolId: school.id, name: 'Aarav Kumar', role: 'STUDENT', phoneNumber: '+917777777771' }});
  const studentProfile1 = await prisma.studentProfile.create({ data: { userId: studentUser1.id, schoolId: school.id, admissionNumber: 'ADM-2026-01', admissionDate: new Date('2026-04-01'), dob: new Date('2010-05-15'), gender: 'MALE', bloodGroup: 'O_POS' }});

  const studentUser2 = await prisma.user.create({ data: { schoolId: school.id, name: 'Ananya Verma', role: 'STUDENT', phoneNumber: '+917777777772' }});
  const studentProfile2 = await prisma.studentProfile.create({ data: { userId: studentUser2.id, schoolId: school.id, admissionNumber: 'ADM-2026-02', admissionDate: new Date('2026-04-01'), dob: new Date('2010-08-20'), gender: 'FEMALE', bloodGroup: 'B_POS' }});

  const studentUser3 = await prisma.user.create({ data: { schoolId: school.id, name: 'Rohit Sharma', role: 'STUDENT', phoneNumber: '+917777777773' }});
  const studentProfile3 = await prisma.studentProfile.create({ data: { userId: studentUser3.id, schoolId: school.id, admissionNumber: 'ADM-2026-03', admissionDate: new Date('2026-04-01'), dob: new Date('2009-02-10'), gender: 'MALE', bloodGroup: 'A_POS' }});

  // Parent Links
  await prisma.parentStudentLink.create({ data: { parentUserId: parent1.id, parentProfileId: parentProfile1.id, studentProfileId: studentProfile1.id, relationship: 'FATHER' }});
  await prisma.parentStudentLink.create({ data: { parentUserId: parent1.id, parentProfileId: parentProfile1.id, studentProfileId: studentProfile2.id, relationship: 'FATHER' }});
  await prisma.parentStudentLink.create({ data: { parentUserId: parent1.id, parentProfileId: parentProfile1.id, studentProfileId: studentProfile3.id, relationship: 'FATHER' }});

  console.log('Created Users & Profiles.');

  // 6. Create Classes
  const class8A = await prisma.class.create({ data: { schoolId: school.id, academicYearId: currentYear.id, grade: '8', section: 'A' }});
  const class9A = await prisma.class.create({ data: { schoolId: school.id, academicYearId: currentYear.id, grade: '9', section: 'A' }});

  // 7. Enrollments
  await prisma.enrollment.create({ data: { studentProfileId: studentProfile1.id, classId: class8A.id, academicYearId: currentYear.id, rollNumber: 1, status: 'ACTIVE' }});
  await prisma.enrollment.create({ data: { studentProfileId: studentProfile2.id, classId: class8A.id, academicYearId: currentYear.id, rollNumber: 2, status: 'ACTIVE' }});
  await prisma.enrollment.create({ data: { studentProfileId: studentProfile3.id, classId: class9A.id, academicYearId: currentYear.id, rollNumber: 1, status: 'ACTIVE' }});
  
  console.log('Created Classes & Enrollments.');

  // 8. Operations (Attendance, Homework)
  const today = new Date();
  await prisma.attendance.createMany({
    data: [
      { studentProfileId: studentProfile1.id, classId: class8A.id, academicYearId: currentYear.id, date: today, status: 'PRESENT', markedByUserId: teacher1.id },
      { studentProfileId: studentProfile2.id, classId: class8A.id, academicYearId: currentYear.id, date: today, status: 'ABSENT', markedByUserId: teacher1.id },
    ]
  });

  await prisma.homework.create({
    data: {
      classId: class8A.id,
      subjectId: subjectMath.id,
      academicYearId: currentYear.id,
      teacherUserId: teacher1.id,
      title: 'Algebra Exercises',
      description: 'Complete Algebra Chapter 4 Exercises 1-20.',
      assignedDate: new Date(),
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.notice.create({
    data: {
      schoolId: school.id,
      title: 'Annual Sports Day 2026',
      body: 'The annual sports day will be held next Friday.',
      audience: 'EVERYONE',
      postedByUserId: principal.id
    }
  });

  // 9. Timetable
  await prisma.timetable.createMany({
    data: [
      { classId: class8A.id, academicYearId: currentYear.id, dayOfWeek: 'MONDAY', periodNumber: 1, subjectId: subjectMath.id, teacherUserId: teacher1.id, startTime: '09:00', endTime: '09:40' },
      { classId: class8A.id, academicYearId: currentYear.id, dayOfWeek: 'MONDAY', periodNumber: 2, subjectId: subjectSci.id, teacherUserId: teacher2.id, startTime: '09:40', endTime: '10:20' },
      { classId: class8A.id, academicYearId: currentYear.id, dayOfWeek: 'TUESDAY', periodNumber: 1, subjectId: subjectSci.id, teacherUserId: teacher2.id, startTime: '09:00', endTime: '09:40' },
      { classId: class8A.id, academicYearId: currentYear.id, dayOfWeek: 'TUESDAY', periodNumber: 2, subjectId: subjectMath.id, teacherUserId: teacher1.id, startTime: '09:40', endTime: '10:20' },
      
      { classId: class9A.id, academicYearId: currentYear.id, dayOfWeek: 'MONDAY', periodNumber: 1, subjectId: subjectSci.id, teacherUserId: teacher2.id, startTime: '09:00', endTime: '09:40' },
      { classId: class9A.id, academicYearId: currentYear.id, dayOfWeek: 'MONDAY', periodNumber: 2, subjectId: subjectMath.id, teacherUserId: teacher1.id, startTime: '09:40', endTime: '10:20' },
    ]
  });

  console.log('Created Operations Data.');
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
