import re

with open('backend/src/routes.js', 'r') as f:
    content = f.read()

# 1. Homework GET
# replace `schoolId: req.user.schoolId` with `class: { schoolId: req.user.schoolId }`
# assignedBy: { select: ... } -> teacher: { select: ... }
# h.assignedBy?.name -> h.teacher?.name
content = content.replace("where: { schoolId: req.user.schoolId }", "where: { class: { schoolId: req.user.schoolId } }")
content = content.replace("assignedBy:", "teacher:")
content = content.replace("assignedByUserId:", "teacherUserId:")
content = content.replace("h.assignedBy", "h.teacher")
content = content.replace("h.class.grade", "h.class?.grade")
content = content.replace("h.class.section", "h.class?.section")

# 2. Homework POST
# Add academicYearId and subjectId lookup. Replace schoolId.
hw_post_old = """    const hw = await prisma.homework.create({
      data: {
        schoolId:        req.user.schoolId,
        assignedByUserId: req.user.id,
        classId,
        title:           title.trim(),
        description:     description || '',
        fileUrl:         fileUrl || null,
        dueDate:         dueDate ? new Date(dueDate) : null
      },
      include: {
        class:      { select: { grade: true, section: true } },
        assignedBy: { select: { id: true, name: true } }
      }
    });"""

hw_post_new = """    const currentYear = await prisma.academicYear.findFirst({ where: { schoolId: req.user.schoolId, isCurrent: true } });
    if (!currentYear) return res.status(400).json({ error: 'No active academic year' });
    let subject = await prisma.subject.findFirst({ where: { schoolId: req.user.schoolId }});
    if (!subject) subject = await prisma.subject.create({ data: { schoolId: req.user.schoolId, name: 'General', code: 'GEN' }});
    const hw = await prisma.homework.create({
      data: {
        teacherUserId:   req.user.id,
        academicYearId:  currentYear.id,
        subjectId:       subject.id,
        classId,
        title:           title.trim(),
        description:     description || '',
        dueDate:         dueDate ? new Date(dueDate) : new Date(Date.now() + 86400000)
      },
      include: {
        class:      { select: { grade: true, section: true } },
        teacher:    { select: { id: true, name: true } }
      }
    });"""

content = content.replace(hw_post_old, hw_post_new)

# 3. Attendance POST
att_post_old = """    const created = [];
    for (const r of records) {
      const statusMap = { present: 'PRESENT', absent: 'ABSENT', late: 'LATE', half_day: 'HALF_DAY' };
      const dbStatus = statusMap[(r.status || '').toLowerCase()] || 'PRESENT';
      // Upsert so re-submitting the same date updates rather than errors
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
          date:             attendanceDate,
          status:           dbStatus,
          source:           'MANUAL',
          markedByUserId:   req.user.id
        }
      });
      created.push(record);
    }"""

att_post_new = """    const { classId } = req.body;
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
    }"""

content = content.replace(att_post_old, att_post_new)

# 4. Leaves (fromDate / toDate instead of startDate / endDate)
content = content.replace("leave.startDate.toISOString()", "leave.fromDate.toISOString()")
content = content.replace("leave.endDate.toISOString()", "leave.toDate.toISOString()")
content = content.replace("startDate: leave.fromDate", "startDate: leave.fromDate")
content = content.replace("endDate: leave.toDate", "endDate: leave.toDate")

content = content.replace("startDate: new Date(startDate)", "fromDate: new Date(startDate)")
content = content.replace("endDate: new Date(endDate)", "toDate: new Date(endDate)")


with open('backend/src/routes.js', 'w') as f:
    f.write(content)
print("Updated routes.js")
