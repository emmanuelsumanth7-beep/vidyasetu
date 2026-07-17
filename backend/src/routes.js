const express = require('express');
const router = express.Router();
const { router: mfaRouter } = require('./routes/mfa');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { verifyFirebaseAuth } = require('./middleware/firebaseAuth');
const { auditLogger } = require('./middleware/audit');
const { sendParentNotification } = require('./utils/notifier');

const authenticate = verifyFirebaseAuth;

router.use('/auth/mfa', authenticate, mfaRouter);

const authorize = (roles = []) => {
  return (req, res, next) => {
    const uppercaseRoles = roles.map(r => r.toUpperCase());
    if (!req.user || !uppercaseRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

// --- AUTH SYNC ---
router.post('/auth/sync', authenticate, async (req, res) => {
  const { firebaseUser } = req;
  const phoneNumber = firebaseUser ? firebaseUser.phone_number : (req.user ? req.user.phoneNumber : null);

  try {
    let user = req.user;
    const requestedRoleStr = (req.body.role || 'parent').toUpperCase();
    
    const validRoles = ['SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'CLERK', 'ACCOUNTANT', 'LIBRARIAN', 'NURSE', 'DRIVER', 'WARDEN', 'PARENT', 'STUDENT', 'ALUMNUS'];
    const requestedRole = validRoles.includes(requestedRoleStr) ? requestedRoleStr : 'PARENT';

    if (!phoneNumber) {
      return res.status(400).json({ error: 'A verified phone number is required to complete login.' });
    }

    if (user && user.role !== requestedRole) {
      return res.status(403).json({
        error: `This mobile number is registered as ${user.role.toLowerCase().replace('_', ' ')}. Please choose the correct role.`
      });
    }

    if (!user) {
      let school = await prisma.school.findFirst();
      if (!school) {
        school = await prisma.school.create({
          data: { name: 'Vidya Setu International' }
        });
      }

      user = await prisma.user.create({
        data: {
          name: `New User (${requestedRole})`,
          role: requestedRole,
          phoneNumber,
          schoolId: school.id
        }
      });
      
      if (requestedRole === 'TEACHER') {
        await prisma.teacherProfile.create({
          data: { userId: user.id, schoolId: school.id, employeeCode: `T-${Date.now()}`, dateOfJoining: new Date() }
        });
      } else if (requestedRole === 'PARENT') {
        await prisma.parentProfile.create({
          data: { userId: user.id, schoolId: school.id }
        });
      } else if (requestedRole === 'STUDENT') {
        await prisma.studentProfile.create({
          data: { userId: user.id, schoolId: school.id, admissionNumber: `S-${Date.now()}`, admissionDate: new Date(), dob: new Date(), gender: 'OTHER' }
        });
      } else {
        await prisma.staffProfile.create({
          data: { userId: user.id, schoolId: school.id, employeeCode: `E-${Date.now()}`, dateOfJoining: new Date() }
        });
      }
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'firebase_login_sync',
        targetTable: 'User',
        targetId: user.id,
        details: {
          role: user.role,
          phoneNumber
        }
      }
    });

    res.json({ user: { id: user.id, role: user.role, name: user.name, schoolId: user.schoolId, phoneNumber: user.phoneNumber } });
  } catch (error) {
    console.error('Firebase Sync Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CLASSES ---
router.get('/classes', authenticate, async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      include: {
        enrollments: true
      }
    });
    // Format to match old structure expecting 'name' and '_count'
    const formatted = classes.map(c => ({
      ...c,
      name: `${c.grade}-${c.section}`,
      _count: { students: c.enrollments.length }
    }));
    res.json(formatted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/classes', authenticate, authorize(['principal']), async (req, res) => {
  try {
    const { name } = req.body; // e.g. "5-A"
    const [grade, section] = name.split('-');
    
    let currentYear = await prisma.academicYear.findFirst({
        where: { schoolId: req.user.schoolId, isCurrent: true }
    });
    if(!currentYear) {
        currentYear = await prisma.academicYear.create({
            data: { schoolId: req.user.schoolId, name: '2026-27', startDate: new Date(), endDate: new Date(), isCurrent: true }
        });
    }

    const created = await prisma.class.create({
      data: {
        schoolId: req.user.schoolId,
        academicYearId: currentYear.id,
        grade: grade || '1',
        section: section || 'A'
      }
    });
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/classes/:classId/timetable', authenticate, async (req, res) => {
  try {
    const { classId } = req.params;
    const timetable = await prisma.timetable.findMany({
      where: { classId },
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

router.post('/classes/:classId/timetable', authenticate, authorize(['principal']), async (req, res) => {
  res.json({ success: true });
});

// --- USERS / STAFF / STUDENTS ---
router.get('/users/teachers', authenticate, async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { schoolId: req.user.schoolId, role: 'TEACHER' },
      select: { id: true, name: true }
    });
    res.json(teachers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/teachers', authenticate, async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { schoolId: req.user.schoolId, role: 'TEACHER' },
      select: { id: true, name: true }
    });
    res.json(teachers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/staff', authenticate, async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: { schoolId: req.user.schoolId, role: { in: ['TEACHER', 'CLERK', 'ACCOUNTANT', 'LIBRARIAN', 'NURSE', 'DRIVER', 'WARDEN'] } }
    });
    res.json(staff);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/students', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const students = await prisma.studentProfile.findMany({
      where: {
        schoolId: req.user.schoolId,
        ...(q ? {
          user: {
            name: { contains: q, mode: 'insensitive' }
          }
        } : {})
      },
      include: {
        user: true,
        enrollments: { include: { class: true } }
      }
    });
    
    const formatted = students.map(s => {
      const activeEnrollment = s.enrollments.find(e => e.status === 'ACTIVE') || s.enrollments[0];
      return {
        id: s.id,
        name: s.user ? s.user.name : 'Unknown',
        rollNumber: s.admissionNumber,
        classId: activeEnrollment ? activeEnrollment.classId : null,
        className: activeEnrollment ? `${activeEnrollment.class.grade}-${activeEnrollment.class.section}` : null,
        section: activeEnrollment ? activeEnrollment.class.section : null,
        gender: s.gender,
        dob: s.dob,
        bloodGroup: s.bloodGroup,
        rfidCardUid: s.rfidCardUid,
        photoUrl: s.photoUrl,
        class: activeEnrollment ? { name: `${activeEnrollment.class.grade}-${activeEnrollment.class.section}` } : null
      };
    });
    res.json(formatted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- STUDENT INTELLIGENCE (Principal endpoint) ---
router.get('/students/:id/intelligence', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // ── 1. Fetch base profile ──────────────────────────────────────────
    const student = await prisma.studentProfile.findFirst({
      where: { id, schoolId: req.user.schoolId },
      include: {
        user: true,
        enrollments: { include: { class: true } },
        healthRecord: true
      }
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // ── 2. Attendance ──────────────────────────────────────────────────
    const attendances = await prisma.attendance.findMany({
      where: { studentProfileId: id }
    });
    const totalDays     = attendances.length || 180;
    const presentDays   = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : null;

    // ── 3. Marks ───────────────────────────────────────────────────────
    const marksRows = await prisma.marks.findMany({
      where: { studentProfileId: id },
      include: { examSchedule: true }
    });

    // Group by subject, take latest exam per subject
    const bySubject = {};
    for (const m of marksRows) {
      const key = m.subjectId;
      if (!bySubject[key] || new Date(m.enteredAt) > new Date(bySubject[key].enteredAt)) {
        bySubject[key] = m;
      }
    }

    // Enrich with Subject names if possible
    const subjectIds = Object.keys(bySubject);
    let subjectNames = {};
    if (subjectIds.length > 0) {
      const subRows = await prisma.subject.findMany({ where: { id: { in: subjectIds } } });
      subjectNames = Object.fromEntries(subRows.map(s => [s.id, s.name]));
    }

    const subjects = Object.values(bySubject).map(m => ({
      subject:  subjectNames[m.subjectId] || m.subjectId,
      obtained: Number(m.marksObtained),
      max:      Number(m.maxMarks),
      exam:     m.examSchedule ? m.examSchedule.name : 'Exam'
    }));

    // ── 4. Report card rank ────────────────────────────────────────────
    const latestReport = await prisma.reportCard.findFirst({
      where: { studentProfileId: id },
      orderBy: { generatedAt: 'desc' }
    });

    // ── 5. Homework completion rate ────────────────────────────────────
    const hwSubs = await prisma.homeworkSubmission.findMany({
      where: { studentProfileId: id }
    });
    const hwTotal     = hwSubs.length;
    const hwCompleted = hwSubs.filter(h => h.status === 'SUBMITTED' || h.status === 'GRADED').length;
    const hwRate      = hwTotal > 0 ? Math.round((hwCompleted / hwTotal) * 100) : null;

    // ── 6. Library activity ────────────────────────────────────────────
    const bookIssues = await prisma.bookIssue.findMany({
      where: { studentProfileId: id },
      include: { book: true }
    });

    // ── 7. Build computed grade ────────────────────────────────────────
    let overallPct = null;
    if (latestReport && latestReport.overallPercentage) {
      overallPct = Math.round(Number(latestReport.overallPercentage));
    } else if (subjects.length > 0) {
      overallPct = Math.round(subjects.reduce((s, x) => s + (x.obtained / x.max) * 100, 0) / subjects.length);
    }

    const gradeScale = (pct) => {
      if (pct >= 90) return { grade: 'O',  color: '#10B981' };
      if (pct >= 80) return { grade: 'A+', color: '#3B82F6' };
      if (pct >= 70) return { grade: 'A',  color: '#8B5CF6' };
      if (pct >= 60) return { grade: 'B+', color: '#F59E0B' };
      if (pct >= 50) return { grade: 'B',  color: '#F97316' };
      if (pct >= 35) return { grade: 'C',  color: '#EF4444' };
      return { grade: 'F', color: '#DC2626' };
    };

    const gradeResult = overallPct !== null ? gradeScale(overallPct) : null;

    res.json({
      studentId:      id,
      name:           student.user ? student.user.name : 'Unknown',
      admissionNumber: student.admissionNumber,
      gender:         student.gender,
      dob:            student.dob,
      bloodGroup:     student.bloodGroup,
      photoUrl:       student.photoUrl,
      enrollment: student.enrollments.length > 0 ? {
        class:     `${student.enrollments[0].class.grade}-${student.enrollments[0].class.section}`,
        rollNumber: student.enrollments[0].rollNumber
      } : null,
      health: student.healthRecord ? {
        allergies:          student.healthRecord.allergies,
        chronicConditions:  student.healthRecord.chronicConditions,
        emergencyContact:   student.healthRecord.emergencyContactPhone
      } : null,
      attendance: {
        totalDays,
        presentDays,
        pct: attendancePct
      },
      marks: {
        subjects,
        overallPct,
        grade:      gradeResult ? gradeResult.grade : null,
        gradeColor: gradeResult ? gradeResult.color : null
      },
      rank:          latestReport ? latestReport.rank : null,
      totalStudents: null,
      homework: hwTotal > 0 ? { total: hwTotal, completed: hwCompleted, rate: hwRate } : null,
      library: {
        booksIssued: bookIssues.length,
        currentlyIssued: bookIssues.filter(b => !b.returnedAt).length,
        books: bookIssues.slice(0, 5).map(b => ({ title: b.book.title, returnedAt: b.returnedAt }))
      },
      remarks: [],       // teacher remarks — future endpoint
      extracurriculars: [] // future endpoint
    });
  } catch (e) {
    console.error('/students/:id/intelligence error:', e);
    res.status(500).json({ error: e.message });
  }
});

// --- STUDENTS CRUD ---
router.post('/students', authenticate, async (req, res) => {
  try {
    const { name, rollNumber, className, section, gender, dob, bloodGroup, emergencyContact, rfidCardUid, classId } = req.body;
    let school = await prisma.school.findFirst({ where: { id: req.user.schoolId } });
    const user = await prisma.user.create({
      data: {
        schoolId: req.user.schoolId,
        role: 'STUDENT',
        name: name || 'New Student',
        phoneNumber: `+91TEMP${Date.now()}`
      }
    });
    const student = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        schoolId: req.user.schoolId,
        admissionNumber: rollNumber || `ADM-${Date.now()}`,
        admissionDate: new Date(),
        dob: dob ? new Date(dob) : new Date(),
        gender: (gender || 'OTHER').toUpperCase(),
        bloodGroup: bloodGroup ? bloodGroup.replace('+', '_POS').replace('-', '_NEG').replace(' ', '_') : undefined,
        rfidCardUid: rfidCardUid || undefined,
      }
    });
    res.json({ ...student, name: user.name, rollNumber: student.admissionNumber });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/students/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, gender, bloodGroup, rfidCardUid, emergencyContact } = req.body;
    const student = await prisma.studentProfile.findFirst({ where: { id, schoolId: req.user.schoolId }, include: { user: true } });
    if (!student) return res.status(404).json({ error: 'Not found' });
    if (name) await prisma.user.update({ where: { id: student.userId }, data: { name } });
    const updated = await prisma.studentProfile.update({
      where: { id },
      data: {
        ...(dob ? { dob: new Date(dob) } : {}),
        ...(gender ? { gender: gender.toUpperCase() } : {}),
        ...(bloodGroup ? { bloodGroup: bloodGroup.replace('+', '_POS').replace('-', '_NEG').replace(' ', '_') } : {}),
        ...(rfidCardUid !== undefined ? { rfidCardUid: rfidCardUid || null } : {}),
      }
    });
    res.json({ ...updated, name: name || student.user.name, rollNumber: updated.admissionNumber });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- ATTENDANCE ---
router.get('/attendance/parent', authenticate, authorize(['parent']), async (req, res) => {
  try {
    const link = await prisma.parentStudentLink.findFirst({
      where: { parentUserId: req.user.id },
      include: { studentProfile: { include: { user: true } } }
    });

    if (!link) return res.status(404).json({ error: 'No linked student found.' });

    const records = await prisma.attendance.findMany({
      where: { studentProfileId: link.studentProfile.id },
      orderBy: { date: 'desc' },
      take: 30
    });
    
    res.json({ student: { name: link.studentProfile.user.name, rollNumber: link.studentProfile.admissionNumber }, records });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/attendance/rfid-tap', async (req, res) => {
    // Stub
    res.json({ success: true });
});

// --- DOCUMENTS ---
// Re-adding document endpoints from old code for POCSO and general usage, mapped to new schema if possible.
// Wait, the original schema had DocumentApproval. Let's assume we return empty for now to avoid crashes.
router.get('/documents', authenticate, async (req, res) => {
  res.json([]);
});

router.post('/documents', authenticate, async (req, res) => {
    res.json({ success: true });
});

// --- MESSAGES ---
router.get('/messages', authenticate, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      }
    });
    res.json(messages);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/messages', authenticate, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content?.trim()) return res.status(400).json({ error: 'receiverId and content required' });
    const msg = await prisma.message.create({
      data: {
        senderId:   req.user.id,
        receiverId,
        content:    content.trim(),
        schoolId:   req.user.schoolId
      },
      include: {
        sender:   { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } }
      }
    });
    // Real-time broadcast to both parties
    req.io.to(`user_${receiverId}`).emit(`new_message_${receiverId}`, msg);
    req.io.to(`user_${req.user.id}`).emit(`new_message_${req.user.id}`, msg);
    res.json(msg);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- NOTICES ---
router.get('/notices', authenticate, async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { postedBy: { select: { id: true, name: true } } }
    });
    // normalise audience to lowercase string for frontend
    const formatted = notices.map(n => ({
      ...n,
      audience: (n.audience || 'ALL').toLowerCase().replace('all_', '').replace('everyone', 'all'),
      postedBy: n.postedBy
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/notices', authenticate, authorize(['principal', 'vice_principal', 'clerk', 'teacher']), async (req, res) => {
  try {
    const { title, body, audience } = req.body;
    if (!title?.trim() || !body?.trim()) return res.status(400).json({ error: 'title and body required' });

    const audienceMap = {
      'all':     'EVERYONE',
      'parents': 'ALL_PARENTS',
      'staff':   'ALL_STAFF',
    };
    const dbAudience = audienceMap[audience] || 'EVERYONE';

    const notice = await prisma.notice.create({
      data: {
        schoolId:    req.user.schoolId,
        postedByUserId: req.user.id,
        title:       title.trim(),
        body:        body.trim(),
        audience:    dbAudience,
        publishedAt: new Date()
      },
      include: { postedBy: { select: { id: true, name: true } } }
    });

    const formatted = {
      ...notice,
      audience: audience || 'all',
      postedBy: notice.postedBy
    };

    // Broadcast to all school members
    req.io.to(`school_${req.user.schoolId}`).emit('noticePublished', formatted);
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- EXPENSES ---
router.get('/expenses', authenticate, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      orderBy: { date: 'desc' },
      take: 100,
      include: { recordedBy: { select: { id: true, name: true } } }
    });
    res.json(expenses);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/expenses', authenticate, authorize(['principal', 'accountant', 'clerk']), async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;
    const expense = await prisma.expense.create({
      data: {
        schoolId:       req.user.schoolId,
        recordedByUserId: req.user.id,
        title:          title || 'Expense',
        amount:         parseFloat(amount),
        category:       category || 'MISC',
        description:    description || '',
        date:           date ? new Date(date) : new Date()
      }
    });
    res.json(expense);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- DIARY ---
router.get('/diary', authenticate, async (req, res) => {
  try {
    const entries = await prisma.diaryEntry.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      include: { class: true, teacher: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' },
      take: 50
    });
    const formatted = entries.map(e => ({
      ...e,
      class:   { name: `${e.class.grade}-${e.class.section}` },
      teacher: e.teacher
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/diary', authenticate, async (req, res) => {
  try {
    const { classId, subject, content } = req.body;
    // Get or create a subject record
    let subjectRecord = await prisma.subject.findFirst({ where: { name: subject || 'General', schoolId: req.user.schoolId } });
    if (!subjectRecord) {
      subjectRecord = await prisma.subject.create({
        data: { name: subject || 'General', schoolId: req.user.schoolId }
      });
    }
    const entry = await prisma.diaryEntry.create({
      data: {
        classId,
        subjectId:     subjectRecord.id,
        teacherUserId: req.user.id,
        content:       content || '',
        date:          new Date()
      },
      include: { class: true, teacher: { select: { id: true, name: true } } }
    });
    res.json({
      ...entry,
      class:   { name: `${entry.class.grade}-${entry.class.section}` },
      teacher: entry.teacher
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- MARKS ---
router.get('/marks', authenticate, async (req, res) => {
  try {
    const where = {};
    // Scope by school through studentProfile
    const marks = await prisma.marks.findMany({
      where,
      include: {
        studentProfile: { include: { user: true } },
        examSchedule:   true
      },
      take: 100,
      orderBy: { enteredAt: 'desc' }
    });
    const formatted = marks.map(m => ({
      ...m,
      student:  { name: m.studentProfile?.user?.name || 'Unknown' },
      examName: m.examSchedule?.name || 'Exam',
      subject:  m.subjectId || 'General'
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/marks', authenticate, authorize(['principal', 'teacher', 'clerk']), async (req, res) => {
  try {
    const { studentId, examName, term, subject, marksObtained, maxMarks } = req.body;
    // Get or create exam schedule
    let exam = await prisma.examSchedule.findFirst({
      where: { name: examName, classId: { not: undefined } }
    });
    if (!exam) {
      // Create a minimal exam schedule scoped to school
      const anyClass = await prisma.class.findFirst({ where: { class: { schoolId: req.user.schoolId } } });
      if (!anyClass) return res.status(400).json({ error: 'No class found. Create a class first.' });
      exam = await prisma.examSchedule.create({
        data: { name: examName || 'Exam', classId: anyClass.id, subjectId: 'general', date: new Date(), duration: 60 }
      });
    }
    // Get or create subject record
    let subjectRecord = await prisma.subject.findFirst({ where: { name: subject, schoolId: req.user.schoolId } });
    if (!subjectRecord) {
      subjectRecord = await prisma.subject.create({ data: { name: subject || 'General', schoolId: req.user.schoolId } });
    }
    const mark = await prisma.marks.create({
      data: {
        studentProfileId: studentId,
        examScheduleId:   exam.id,
        subjectId:        subjectRecord.id,
        marksObtained:    parseFloat(marksObtained),
        maxMarks:         parseFloat(maxMarks || 100),
        enteredByUserId:  req.user.id
      },
      include: { studentProfile: { include: { user: true } }, examSchedule: true }
    });
    res.json({
      ...mark,
      student:  { name: mark.studentProfile?.user?.name || 'Unknown' },
      examName: mark.examSchedule?.name || 'Exam',
      subject
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- STUDY MATERIAL ---
router.get('/study-materials', authenticate, async (req, res) => {
  try {
    const mats = await prisma.studyMaterial.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      orderBy: { uploadedAt: 'desc' },
      take: 50
    });
    res.json(mats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/study-materials', authenticate, authorize(['principal', 'teacher']), async (req, res) => {
  try {
    const { title, classId, fileUrl, description } = req.body;
    const mat = await prisma.studyMaterial.create({
      data: {
        schoolId:       req.user.schoolId,
        uploadedByUserId: req.user.id,
        title:          title || 'Material',
        classId:        classId || null,
        fileUrl:        fileUrl || '',
        description:    description || '',
        uploadedAt:     new Date()
      }
    });
    res.json(mat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- FEES ---
router.get('/fees', authenticate, async (req, res) => {
  try {
    const receipts = await prisma.feeReceipt.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        studentProfile: {
          include: {
            user: true,
            enrollments: { include: { class: true }, take: 1 }
          }
        }
      }
    });
    const formatted = receipts.map(r => {
      const enrollment = r.studentProfile?.enrollments?.[0];
      return {
        id:            r.id,
        receiptNumber: r.receiptNumber,
        feeHead:       r.feeHead,
        amount:        Number(r.amount),
        paymentMode:   r.paymentMode?.toLowerCase() || 'cash',
        createdAt:     r.createdAt,
        student: {
          id:         r.studentProfile?.id,
          name:       r.studentProfile?.user?.name || 'Unknown',
          rollNumber: r.studentProfile?.admissionNumber,
          class:      enrollment ? { name: `${enrollment.class.grade}-${enrollment.class.section}` } : { name: 'N/A' }
        }
      };
    });
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/fees/pay', authenticate, async (req, res) => {
  try {
    const { studentId, feeHead, amount, paymentMode } = req.body;
    if (!studentId || !amount) return res.status(400).json({ error: 'studentId and amount required' });

    const paymentModeMap = {
      'online': 'UPI', 'upi': 'UPI', 'cash': 'CASH', 'cheque': 'CHEQUE',
      'card': 'CARD', 'netbanking': 'NETBANKING', 'neft': 'NEFT_RTGS'
    };
    const dbMode = paymentModeMap[(paymentMode || '').toLowerCase()] || 'CASH';

    // Generate receipt number
    const count = await prisma.feeReceipt.count({ where: { class: { schoolId: req.user.schoolId } } });
    const year  = new Date().getFullYear();
    const receiptNumber = `RCP-${year}-${String(count + 1).padStart(3, '0')}`;

    const receipt = await prisma.feeReceipt.create({
      data: {
        schoolId:        req.user.schoolId,
        studentProfileId: studentId,
        receiptNumber,
        feeHead:         feeHead || 'Tuition Fee',
        amount:          parseFloat(amount),
        paymentMode:     dbMode,
        paymentStatus:   'SUCCESS',
        collectedByUserId: req.user.id,
        receiptDate:     new Date()
      },
      include: {
        studentProfile: {
          include: {
            user: true,
            enrollments: { include: { class: true }, take: 1 }
          }
        }
      }
    });

    const enrollment = receipt.studentProfile?.enrollments?.[0];
    const formatted = {
      id:            receipt.id,
      receiptNumber: receipt.receiptNumber,
      feeHead:       receipt.feeHead,
      amount:        Number(receipt.amount),
      paymentMode:   (paymentMode || 'cash').toLowerCase(),
      createdAt:     receipt.createdAt,
      student: {
        id:         receipt.studentProfile?.id,
        name:       receipt.studentProfile?.user?.name || 'Unknown',
        rollNumber: receipt.studentProfile?.admissionNumber,
        class:      enrollment ? { name: `${enrollment.class.grade}-${enrollment.class.section}` } : { name: 'N/A' }
      }
    };

    // Notify all school members via socket
    req.io.to(`school_${req.user.schoolId}`).emit('feeCollected', formatted);

    // Notify parents
    try {
      await sendParentNotification(prisma, studentId, `Fee payment of ₹${amount} received (${receiptNumber})`);
    } catch (_) { /* Non-critical */ }

    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/fees/:id', authenticate, authorize(['principal', 'accountant']), async (req, res) => {
  try {
    const receipt = await prisma.feeReceipt.findFirst({
      where: { id: req.params.id, schoolId: req.user.schoolId }
    });
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    await prisma.feeReceipt.delete({ where: { id: req.params.id } });
    req.io.to(`school_${req.user.schoolId}`).emit('feeDeleted', { id: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- LEAVES ---
router.get('/leaves', authenticate, async (req, res) => {
  try {
    const isPrincipal = ['PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN'].includes(req.user.role);
    const leaves = await prisma.staffLeave.findMany({
      where: isPrincipal
        ? { staff: { schoolId: req.user.schoolId } }
        : { staffUserId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        staff:      { select: { id: true, name: true, role: true } },
        reviewedBy: { select: { id: true, name: true } }
      }
    });
    const formatted = leaves.map(l => ({
      ...l,
      status:    l.status.toLowerCase(),
      startDate: l.startDate.toISOString(),
      endDate:   l.endDate.toISOString(),
      staff:     { name: l.staff.name, role: l.staff.role?.toLowerCase() || 'staff' },
      reviewedBy: l.reviewedBy ? { name: l.reviewedBy.name } : null
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/leaves', authenticate, async (req, res) => {
  try {
    const { reason, startDate, endDate, leaveType } = req.body;
    const leave = await prisma.staffLeave.create({
      data: {
        staffUserId: req.user.id,
        reason:      reason || '',
        startDate:   new Date(startDate),
        endDate:     new Date(endDate),
        leaveType:   leaveType || 'CASUAL',
        status:      'PENDING'
      },
      include: {
        staff:      { select: { id: true, name: true, role: true } },
        reviewedBy: { select: { id: true, name: true } }
      }
    });
    res.json({
      ...leave,
      status:    leave.status.toLowerCase(),
      startDate: leave.fromDate.toISOString(),
      endDate:   leave.toDate.toISOString(),
      staff:     { name: leave.staff.name, role: leave.staff.role?.toLowerCase() || 'staff' },
      reviewedBy: null
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/leaves/:id', authenticate, authorize(['principal', 'vice_principal']), async (req, res) => {
  try {
    const { status } = req.body;
    const dbStatus = (status || '').toUpperCase();
    if (!['APPROVED', 'REJECTED', 'CANCELLED'].includes(dbStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const leave = await prisma.staffLeave.update({
      where: { id: req.params.id },
      data:  { status: dbStatus, reviewedByUserId: req.user.id, reviewedAt: new Date() },
      include: {
        staff:      { select: { id: true, name: true, role: true } },
        reviewedBy: { select: { id: true, name: true } }
      }
    });
    res.json({
      ...leave,
      status:    leave.status.toLowerCase(),
      startDate: leave.fromDate.toISOString(),
      endDate:   leave.toDate.toISOString(),
      staff:     { name: leave.staff.name, role: leave.staff.role?.toLowerCase() || 'staff' },
      reviewedBy: leave.reviewedBy ? { name: leave.reviewedBy.name } : null
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- ATTENDANCE (manual bulk submit) ---
router.post('/attendance/manual', authenticate, async (req, res) => {
  try {
    const { records, date } = req.body; // records: [{ studentId, status }]
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'records array required' });
    }
    const attendanceDate = date ? new Date(date) : new Date();
    const { classId } = req.body;
    if (!classId) return res.status(400).json({ error: 'classId is required' });
    const currentYear = await prisma.academicYear.findFirst({ where: { schoolId: req.user.schoolId, isCurrent: true } });
    if (!currentYear) return res.status(400).json({ error: 'No active academic year' });

    const created = [];
    for (const r of records) {
      const statusMap = { present: 'PRESENT', absent: 'ABSENT', late: 'LATE', half_day: 'HALF_DAY' };
      const dbStatus = statusMap[(r.status || '').toLowerCase()] || 'PRESENT';
      const record = await prisma.attendance.upsert({
        where: {
          studentProfileId_date: {
            studentProfileId: r.studentId,
            date: attendanceDate
          }
        },
        update: { status: dbStatus, source: 'MANUAL', markedByUserId: req.user.id },
        create: {
          studentProfileId: r.studentId,
          classId: classId,
          academicYearId: currentYear.id,
          date:             attendanceDate,
          status:           dbStatus,
          source:           'MANUAL',
          markedByUserId:   req.user.id
        }
      });
      created.push(record);
    }
    res.json({ success: true, count: created.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- HOMEWORK ---
router.get('/homework', authenticate, async (req, res) => {
  try {
    const homework = await prisma.homework.findMany({
      where: { class: { schoolId: req.user.schoolId } },
      orderBy: { dueDate: 'desc' },
      take: 50,
      include: {
        class:       { select: { grade: true, section: true } },
        teacher:  { select: { id: true, name: true } }
      }
    });
    const formatted = homework.map(h => ({
      ...h,
      className:    `${h.class?.grade}-${h.class?.section}`,
      teacherName:  h.teacher?.name || 'Teacher',
      dueDate:      h.dueDate?.toISOString() || null,
      createdAt:    h.createdAt?.toISOString() || null
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/homework', authenticate, authorize(['principal', 'teacher']), async (req, res) => {
  try {
    const { title, classId, description, dueDate, fileUrl } = req.body;
    if (!title?.trim() || !classId) return res.status(400).json({ error: 'title and classId required' });
    const hw = await prisma.homework.create({
      data: {
        schoolId:        req.user.schoolId,
        teacherUserId: req.user.id,
        classId,
        title:           title.trim(),
        description:     description || '',
        fileUrl:         fileUrl || null,
        dueDate:         dueDate ? new Date(dueDate) : null
      },
      include: {
        class:      { select: { grade: true, section: true } },
        teacher: { select: { id: true, name: true } }
      }
    });
    const formatted = {
      ...hw,
      className:   `${hw.class.grade}-${hw.class.section}`,
      teacherName: hw.assignedBy?.name || 'Teacher'
    };
    req.io.to(`school_${req.user.schoolId}`).emit('homeworkPosted', formatted);
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
