const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

// --- CLASSES & TIMETABLE ---
router.get('/classes', authenticate, authorize(['principal', 'admin', 'clerk', 'teacher']), async (req, res) => {
    try {
      const classes = await prisma.class.findMany({
        where: { schoolId: req.user.schoolId },
        include: {
          classTeacher: {
            select: { name: true }
          },
          _count: {
            select: { students: true }
          }
        },
        orderBy: { name: 'asc' }
      });
      res.json(classes);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/classes/:classId/timetable', authenticate, authorize(['principal', 'admin', 'teacher', 'student']), async (req, res) => {
    try {
      const { classId } = req.params;
      const timetable = await prisma.timetable.findMany({
        where: { classId },
        include: {
          teacher: {
            select: { name: true }
          }
        },
        orderBy: [
          { dayOfWeek: 'asc' },
          { periodNumber: 'asc' }
        ]
      });
      res.json(timetable);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post('/classes/:classId/timetable', authenticate, authorize(['principal', 'admin']), async (req, res) => {
    try {
      const { classId } = req.params;
      const { dayOfWeek, periodNumber, subject, teacherId } = req.body;
      
      const existing = await prisma.timetable.findFirst({
        where: { classId, dayOfWeek, periodNumber }
      });

      if (existing) {
        const updated = await prisma.timetable.update({
          where: { id: existing.id },
          data: { subject, teacherId }
        });
        res.json(updated);
      } else {
        const created = await prisma.timetable.create({
          data: { classId, dayOfWeek, periodNumber, subject, teacherId }
        });
        res.json(created);
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.delete('/classes/:classId/timetable/:id', authenticate, authorize(['principal', 'admin']), async (req, res) => {
    try {
      await prisma.timetable.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/teachers', authenticate, async (req, res) => {
    try {
      const teachers = await prisma.user.findMany({
        where: { schoolId: req.user.schoolId, role: 'teacher' },
        select: { id: true, name: true }
      });
      res.json(teachers);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- DOCUMENT APPROVALS ---
  router.get('/documents', authenticate, async (req, res) => {
    try {
      let docs;
      if (req.user.role === 'principal' || req.user.role === 'admin') {
        // Principal sees all pending and signed documents
        docs = await prisma.documentApproval.findMany({
          where: { schoolId: req.user.schoolId, status: { not: 'rejected' } },
          include: { submittedBy: { select: { name: true, role: true } }, signedBy: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        });
      } else {
        // Teachers see only their own documents
        docs = await prisma.documentApproval.findMany({
          where: { submittedById: req.user.id },
          include: { signedBy: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        });
      }
      res.json(docs);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post('/documents', authenticate, async (req, res) => {
    try {
      const { title, content } = req.body;
      const doc = await prisma.documentApproval.create({
        data: {
          schoolId: req.user.schoolId,
          title,
          content,
          submittedById: req.user.id
        }
      });
      res.json(doc);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post('/documents/:id/sign', authenticate, authorize(['principal', 'admin']), async (req, res) => {
    try {
      const { password } = req.body;
      const dbUser = await prisma.user.findUnique({ where: { id: req.user.id } });
      
      const valid = await bcrypt.compare(password, dbUser.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid password. Signature blocked.' });

      const doc = await prisma.documentApproval.update({
        where: { id: req.params.id },
        data: { status: 'signed', signedById: req.user.id, signedAt: new Date() }
      });
      res.json(doc);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post('/documents/:id/reject', authenticate, authorize(['principal', 'admin']), async (req, res) => {
    try {
      const doc = await prisma.documentApproval.update({
        where: { id: req.params.id },
        data: { status: 'rejected' }
      });
      res.json(doc);
    } catch (e) {
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Staff Login (Password based)
router.post('/auth/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  const { prisma } = req;
  
  try {
    const user = await prisma.user.findFirst({
      where: { phoneNumber }
    });
    
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role, schoolId: user.schoolId }, JWT_SECRET, { expiresIn: '24h' });
    
    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'staff_login'
      }
    });

    res.json({ token, user: { id: user.id, role: user.role, name: user.name, schoolId: user.schoolId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Parent Login (Mock Implementation as requested)
router.post('/auth/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(`[Mock] Sending OTP to ${phoneNumber}`);
  res.json({ message: 'OTP sent' });
});

router.post('/auth/verify-otp', async (req, res) => {
  let { phoneNumber, otp } = req.body;
  const { prisma } = req;
  
  if (!phoneNumber.startsWith('+')) phoneNumber = `+91${phoneNumber}`;
  const cleanPhone = phoneNumber.replace(/\s+/g, '');

  const validLogins = {
    '+917483292660': { otp: '090009', role: 'principal', name: 'Principal Sharma' },
    '+919141161008': { otp: '890765', role: 'parent', name: 'Rajesh (Parent)' },
    '+917483575296': { otp: '787509', role: 'student', name: 'Ravi (Student)' },
    '+919945841675': { otp: '000001', role: 'teacher', name: 'Ms. Anita (Teacher)' }
  };

  const account = validLogins[cleanPhone];
  if (!account || otp !== account.otp) {
    return res.status(401).json({ error: 'Invalid Phone Number or OTP' });
  }

  try {
    const schoolId = 'fcbde93f-767f-40da-af8f-306caf98676a';
    
    // Ensure school exists
    let school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      school = await prisma.school.create({
        data: { id: schoolId, name: 'Vidya Setu International', address: 'Bangalore' }
      });
    }

    let user = await prisma.user.findFirst({
      where: { phoneNumber: cleanPhone }
    });
    
    if (!user) {
      user = await prisma.user.create({
         data: {
           name: account.name,
           role: account.role,
           phoneNumber: cleanPhone,
           schoolId: school.id
         }
       });

       // Create required relational data to prevent dashboard crashes
       // 1. Create a default class and teacher if needed
       let defaultClass = await prisma.class.findFirst({ where: { schoolId: school.id } });
       if (!defaultClass && account.role !== 'teacher') {
         // Need a generic teacher for the class
         const genericTeacher = await prisma.user.create({
           data: { name: 'Generic Teacher', role: 'teacher', phoneNumber: '+910000000000', schoolId: school.id }
         });
         defaultClass = await prisma.class.create({
           data: { name: '10th Grade A', schoolId: school.id, classTeacherId: genericTeacher.id }
         });
       } else if (account.role === 'teacher') {
         defaultClass = await prisma.class.create({
           data: { name: '10th Grade B', schoolId: school.id, classTeacherId: user.id }
         });
       }

       // 2. Setup relations based on role
       if (account.role === 'parent') {
         const studentUser = await prisma.user.create({
           data: { name: 'Child of Rajesh', role: 'student', phoneNumber: '+911111111111', schoolId: school.id }
         });
         const student = await prisma.student.create({
           data: { name: 'Child of Rajesh', rollNumber: '10A-42', schoolId: school.id, classId: defaultClass.id, userId: studentUser.id }
         });
         await prisma.parentStudentLink.create({
           data: { parentUserId: user.id, studentId: student.id, relationship: 'father' }
         });
       } else if (account.role === 'student') {
         await prisma.student.create({
           data: { name: account.name, rollNumber: '10A-45', schoolId: school.id, classId: defaultClass.id, userId: user.id }
         });
       }
    }
    
    const token = jwt.sign({ id: user.id, role: user.role, schoolId: user.schoolId }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, role: user.role, name: user.name, schoolId: user.schoolId } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const { upload } = require('./utils/s3');

// ==========================================
// FILE UPLOAD ROUTES (S3)
// ==========================================
router.post('/upload', authenticate, upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // If uploaded to S3, req.file.location is available. Otherwise, it's local.
  const fileUrl = req.file.location || `http://localhost:${process.env.PORT || 3001}/uploads/${req.file.filename}`;
  
  res.json({ 
    message: 'File uploaded successfully',
    url: fileUrl 
  });
});

// Serve local uploads statically as a fallback
router.use('/uploads', express.static('uploads'));

// ==========================================
// SEEDING ROUTE (FOR DEV)
// ==========================================
router.post('/seed', async (req, res) => {
  const { prisma } = req;
  try {
    // Check if seeded
    const existingSchool = await prisma.school.findFirst();
    if (existingSchool) return res.json({ message: 'Already seeded' });

    const school = await prisma.school.create({
      data: {
        name: 'Springfield High',
        address: '123 Main St',
        primaryColor: '#0047AB'
      }
    });

    const hash = await bcrypt.hash('password123', 10);
    const principal = await prisma.user.create({
      data: {
        schoolId: school.id,
        role: 'principal',
        name: 'Principal Skinner',
        phoneNumber: '5550001',
        passwordHash: hash
      }
    });
    
    const clerk = await prisma.user.create({
      data: {
        schoolId: school.id,
        role: 'clerk',
        name: 'Admin Clerk',
        phoneNumber: '5550002',
        passwordHash: hash
      }
    });

    res.json({ message: 'Seeded successfully', school, principal, clerk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to seed' });
  }
});

// ==========================================
// STAFF MANAGEMENT ROUTES
// ==========================================

router.get('/staff', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    const staff = await prisma.user.findMany({
      where: {
        schoolId: user.schoolId,
        role: {
          in: ['teacher', 'clerk', 'principal']
        }
      },
      select: {
        id: true,
        name: true,
        role: true,
        phoneNumber: true,
        email: true,
        isActive: true,
      }
    });
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.post('/staff', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { name, phoneNumber, role, email, password } = req.body;
  
  if (user.role !== 'principal') {
    return res.status(403).json({ error: 'Only principals can add staff' });
  }
  
  try {
    const existingUser = await prisma.user.findFirst({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }
    
    const hash = await bcrypt.hash(password || 'password123', 10);
    
    const newStaff = await prisma.user.create({
      data: {
        schoolId: user.schoolId,
        name,
        phoneNumber,
        role,
        email,
        passwordHash: hash
      },
      select: { id: true, name: true, role: true, phoneNumber: true, email: true, isActive: true }
    });
    
    // Broadcast via socket.io that a new staff member was added
    io.to(`school_${user.schoolId}`).emit('staffAdded', newStaff);
    
    res.json(newStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add staff' });
  }
});

// ==========================================
// STUDENT INFORMATION SYSTEM ROUTES
// ==========================================

router.get('/students', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    let whereClause = { schoolId: user.schoolId };

    if (user.role === 'parent') {
      whereClause.parentLinks = {
        some: {
          parentUserId: user.id
        }
      };
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        class: true,
        parentLinks: {
          include: { parent: true }
        }
      }
    });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.post('/students', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  // Ensure the user has permission
  if (!['principal', 'clerk', 'teacher'].includes(user.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const {
    name, rollNumber, classId, rfidCardUid,
    dob, bloodGroup, aadhaar, gender,
    emergencyContact, medicalConditions, allergies,
    transportRoute, house, section, className
  } = req.body;

  try {
    let finalClassId = classId;

    if (className && !finalClassId) {
      let cls = await prisma.class.findFirst({
        where: { schoolId: user.schoolId, name: className }
      });
      if (!cls) {
        let teacher = await prisma.user.findFirst({ where: { schoolId: user.schoolId, role: 'teacher' } });
        if (!teacher) {
          teacher = await prisma.user.findFirst({ where: { schoolId: user.schoolId, role: 'principal' } });
        }
        cls = await prisma.class.create({
          data: {
            schoolId: user.schoolId,
            name: className,
            classTeacherId: teacher.id
          }
        });
      }
      finalClassId = cls.id;
    }

    // Basic validation
    if (!name || !rollNumber || !finalClassId) {
      return res.status(400).json({ error: 'Name, Roll Number, and Class are required' });
    }

    const newStudent = await prisma.student.create({
      data: {
        schoolId: user.schoolId,
        classId: finalClassId,
        name,
        rollNumber,
        rfidCardUid: rfidCardUid || null,
        dob: dob ? new Date(dob) : null,
        bloodGroup,
        aadhaar,
        gender,
        emergencyContact,
        medicalConditions,
        allergies,
        transportRoute,
        house,
        section
      },
      include: { class: true }
    });

    // Auto-sync parent login using emergencyContact
    if (emergencyContact) {
      const bcrypt = require('bcrypt');
      let parentUser = await prisma.user.findFirst({
        where: { phoneNumber: emergencyContact, role: 'parent' }
      });
      if (!parentUser) {
        const hash = await bcrypt.hash('password123', 10);
        parentUser = await prisma.user.create({
          data: {
            schoolId: user.schoolId,
            name: `${name} Parent`,
            phoneNumber: emergencyContact,
            role: 'parent',
            passwordHash: hash
          }
        });
      }
      
      const existingLink = await prisma.parentStudentLink.findFirst({
        where: { parentUserId: parentUser.id, studentId: newStudent.id }
      });
      
      if (!existingLink) {
        await prisma.parentStudentLink.create({
          data: {
            parentUserId: parentUser.id,
            studentId: newStudent.id,
            relationship: 'guardian'
          }
        });
      }
    }

    // Broadcast new student
    io.to(`school_${user.schoolId}`).emit('studentAdded', newStudent);
    
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// ==========================================
// ATTENDANCE & RFID ROUTES
// ==========================================

router.post('/attendance/rfid-tap', authenticate, async (req, res) => {
  const { prisma, io, user } = req;
  const { rfidCardUid, deviceId } = req.body;

  try {
    // In a real scenario, deviceId authentication would happen. Here we assume the requester is valid.
    const student = await prisma.student.findUnique({
      where: { rfidCardUid }
    });

    if (!student) {
      return res.status(404).json({ error: 'Unregistered RFID card' });
    }

    // Check if attendance already marked for today to prevent duplicate taps
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        date: { gte: today }
      }
    });

    if (existing) {
      return res.json({ message: 'Attendance already recorded for today', attendance: existing });
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        date: new Date(),
        status: 'present',
        markedById: user.id, // Or a system user ID for RFID
        source: 'rfid'
      },
      include: { student: true }
    });

    // Emit real-time event to the frontend dashboard
    io.to(`school_${student.schoolId}`).emit('rfid_scan', attendance);

    res.json({ message: 'Attendance marked', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process RFID tap' });
  }
});

router.get('/attendance/parent', authenticate, authorize(['parent']), async (req, res) => {
  const { prisma, user } = req;
  try {
    const link = await prisma.parentStudentLink.findFirst({
      where: { parentUserId: user.id },
      include: { student: true }
    });

    if (!link) {
      return res.status(404).json({ error: 'No linked student found.' });
    }

    const records = await prisma.attendance.findMany({
      where: { studentId: link.student.id },
      orderBy: { date: 'desc' },
      take: 30
    });
    
    res.json({ student: link.student, records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
});

// ==========================================
// FEE COLLECTION ROUTES
// ==========================================

router.get('/fees', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    let whereClause = { student: { schoolId: user.schoolId } };
    
    if (user.role === 'parent') {
      const link = await prisma.parentStudentLink.findFirst({
        where: { parentUserId: user.id }
      });
      if (link) {
        whereClause.studentId = link.studentId;
      } else {
        return res.json([]);
      }
    }

    const receipts = await prisma.feeReceipt.findMany({
      where: whereClause,
      include: { student: true, collectedBy: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(receipts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch fee history' });
  }
});

router.post('/fees/pay', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { studentId, feeHead, amount, paymentMode } = req.body;

  if (!['principal', 'accountant', 'clerk', 'parent'].includes(user.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  try {
    if (user.role === 'parent') {
      const link = await prisma.parentStudentLink.findFirst({
        where: { parentUserId: user.id, studentId }
      });
      if (!link) {
        return res.status(403).json({ error: 'Not authorized for this student' });
      }
    }
    const receipt = await prisma.feeReceipt.create({
      data: {
        studentId,
        feeHead,
        amount: parseFloat(amount),
        paymentMode,
        collectedById: user.id,
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`
      },
      include: { student: true, collectedBy: true }
    });

    // Broadcast fee collected
    io.to(`school_${user.schoolId}`).emit('feeCollected', receipt);

    res.status(201).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process fee payment' });
  }
});

// ==========================================
// ANNOUNCEMENT & NOTICES ROUTES
// ==========================================

router.get('/notices', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    const notices = await prisma.notice.findMany({
      where: { schoolId: user.schoolId },
      include: { postedBy: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

router.post('/notices', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { title, body, audience } = req.body;

  if (!['principal', 'clerk', 'teacher'].includes(user.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        schoolId: user.schoolId,
        title,
        body,
        audience: audience || 'all',
        postedById: user.id
      },
      include: { postedBy: true }
    });

    // Broadcast new notice
    io.to(`school_${user.schoolId}`).emit('noticePublished', notice);

    res.status(201).json(notice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to publish notice' });
  }
});

// ==========================================
// DASHBOARD OVERVIEW (REAL AGGREGATED DATA)
// ==========================================

router.get('/dashboard/overview', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    // 1. Total Students
    const totalStudents = await prisma.student.count({
      where: { schoolId: user.schoolId }
    });

    // 2. Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendanceCount = await prisma.attendance.count({
      where: {
        student: { schoolId: user.schoolId },
        date: { gte: today },
        status: 'present'
      }
    });
    
    const attendanceRate = totalStudents > 0 
      ? Math.round((todayAttendanceCount / totalStudents) * 1000) / 10 
      : 0;

    // 3. Fees Collected (Sum)
    const feeAgg = await prisma.feeReceipt.aggregate({
      where: { student: { schoolId: user.schoolId } },
      _sum: { amount: true }
    });
    const totalFees = feeAgg._sum.amount || 0;
    
    // 4. Pending Leaves (Mocked for now since Leave model isn't built yet, or set to 0)
    const pendingLeaves = 0;

    // 5. Recent Fee Collections
    const recentFees = await prisma.feeReceipt.findMany({
      where: { student: { schoolId: user.schoolId } },
      include: { student: { include: { class: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4
    });

    // 6. Action Required / Recent Notices
    const recentNotices = await prisma.notice.findMany({
      where: { schoolId: user.schoolId },
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: { postedBy: true }
    });

    res.json({
      metrics: {
        totalStudents,
        attendanceRate,
        totalFees,
        pendingLeaves
      },
      recentFees: recentFees.map(f => ({
        name: f.student.name,
        class: f.student.class?.name || 'N/A',
        amount: `₹${f.amount}`,
        status: 'Paid',
        receiptNumber: f.receiptNumber
      })),
      recentNotices: recentNotices.map(n => ({
        id: n.id,
        title: n.title,
        body: n.body,
        author: n.postedBy.name
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
});

router.get('/dashboard/parent-overview', authenticate, authorize(['parent']), async (req, res) => {
  const { prisma, user } = req;
  try {
    const link = await prisma.parentStudentLink.findFirst({
      where: { parentUserId: user.id },
      include: {
        student: {
          include: { class: true }
        }
      }
    });

    if (!link) {
      return res.status(404).json({ error: 'No student linked to this parent account.' });
    }

    const student = link.student;

    // Recent Notices (School wide or specific to class, currently just take 2 recent)
    const recentNotices = await prisma.notice.findMany({
      where: { schoolId: user.schoolId },
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: { postedBy: true }
    });

    res.json({
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        className: student.class?.name || 'N/A'
      },
      metrics: {
        attendanceRate: 98.5, // Mocked for now, can be computed if attendance is seeded
        totalFeesPending: 5000,
        pendingLeaves: 0
      },
      recentNotices: recentNotices.map(n => ({
        id: n.id,
        title: n.title,
        body: n.body,
        author: n.postedBy.name
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch parent dashboard' });
  }
});

// ==========================================
// DIARY ROUTES
// ==========================================

router.get('/diary', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    let whereClause = { class: { schoolId: user.schoolId } };
    
    if (user.role === 'parent') {
      const link = await prisma.parentStudentLink.findFirst({
        where: { parentUserId: user.id },
        include: { student: true }
      });
      if (link && link.student) {
        whereClause.classId = link.student.classId;
      }
    }

    const entries = await prisma.diaryEntry.findMany({
      where: whereClause,
      include: { teacher: true, class: true },
      orderBy: { date: 'desc' },
      take: 50
    });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch diary' });
  }
});

router.post('/diary', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { classId, subject, content } = req.body;

  if (user.role === 'parent') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  try {
    const entry = await prisma.diaryEntry.create({
      data: {
        classId,
        subject,
        content,
        teacherId: user.id
      },
      include: { teacher: true, class: true }
    });
    io.to(`school_${user.schoolId}`).emit('diaryUpdated', entry);
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add diary' });
  }
});

// ==========================================
// LEAVES ROUTES
// ==========================================

router.get('/leaves', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    const leaves = await prisma.leaveApplication.findMany({
      where: { student: { schoolId: user.schoolId } },
      include: { student: { include: { class: true } }, reviewedBy: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

router.post('/leaves/approve', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { leaveId, status } = req.body;
  
  if (!['principal', 'teacher'].includes(user.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  
  try {
    const leave = await prisma.leaveApplication.update({
      where: { id: leaveId },
      data: { status, reviewedById: user.id },
      include: { student: true, reviewedBy: true }
    });
    io.to(`school_${user.schoolId}`).emit('leaveUpdated', leave);
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
});

// ==========================================
// MARKS & GRADES ROUTES
// ==========================================

router.get('/marks', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    let whereClause = { student: { schoolId: user.schoolId } };
    
    if (user.role === 'parent') {
      const link = await prisma.parentStudentLink.findFirst({
        where: { parentUserId: user.id },
        include: { student: true }
      });
      if (!link) return res.status(404).json({ error: 'No linked student found.' });
      whereClause.studentId = link.studentId;
    }

    const marks = await prisma.marks.findMany({
      where: whereClause,
      include: { teacher: true, student: true },
      orderBy: { examName: 'desc' }
    });
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

router.post('/marks', authenticate, authorize(['teacher', 'principal', 'admin']), async (req, res) => {
  const { prisma, user } = req;
  const { studentId, subject, examName, marksObtained, maxMarks, term } = req.body;
  try {
    const mark = await prisma.marks.create({
      data: {
        studentId,
        subject,
        examName,
        marksObtained: parseFloat(marksObtained),
        maxMarks: parseFloat(maxMarks),
        term,
        teacherId: user.id
      },
      include: { student: true }
    });
    res.json(mark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add marks' });
  }
});

// ==========================================
// MESSAGING ROUTES
// ==========================================

router.get('/messages', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/messages', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { receiverId, content } = req.body;
  if (!receiverId || !content) return res.status(400).json({ error: 'Missing fields' });

  try {
    const message = await prisma.message.create({
      data: {
        schoolId: user.schoolId,
        senderId: user.id,
        receiverId,
        content
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } }
      }
    });

    // Simple real-time broadcast if socket is connected
    io.emit(`new_message_${receiverId}`, message);

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ==========================================
// USER SEARCH (for messaging)
// ==========================================

router.get('/users/teachers', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    const teachers = await prisma.user.findMany({
      where: { schoolId: user.schoolId, role: 'teacher' },
      select: { id: true, name: true }
    });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// ==========================================
// HOMEWORK & CLASS NOTICES ROUTES
// ==========================================

router.get('/homework', authenticate, async (req, res) => {
  const { prisma, user } = req;
  try {
    let whereClause = { class: { schoolId: user.schoolId } };
    
    // If parent, only show homework for their linked student's class
    if (user.role === 'parent') {
      const link = await prisma.parentStudentLink.findFirst({
        where: { parentUserId: user.id },
        include: { student: true }
      });
      if (link && link.student) {
        whereClause.classId = link.student.classId;
      } else {
        return res.json([]);
      }
    }

    const homeworks = await prisma.homework.findMany({
      where: whereClause,
      include: { teacher: { select: { name: true } }, class: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(homeworks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch homework' });
  }
});

router.post('/homework', authenticate, async (req, res) => {
  const { prisma, user, io } = req;
  const { classId, subject, description, dueDate } = req.body;

  if (user.role === 'parent') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  try {
    const homework = await prisma.homework.create({
      data: {
        classId,
        subject,
        description,
        dueDate: new Date(dueDate),
        teacherId: user.id
      },
      include: { teacher: { select: { name: true } }, class: true }
    });

    // Broadcast the new homework notification
    io.to(`school_${user.schoolId}`).emit('homeworkPublished', homework);
    
    res.json(homework);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish homework' });
  }
});

module.exports = router;
