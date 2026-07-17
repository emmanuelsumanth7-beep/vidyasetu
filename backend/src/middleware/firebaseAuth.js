const { getApps, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin without Service Account for token verification only
if (!getApps().length) {
  initializeApp({
    projectId: 'vidyasetu-e7447'
  });
}

/**
 * Express middleware to verify Firebase ID tokens
 */
const verifyFirebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('[Auth] Incoming request to', req.originalUrl, 'Headers:', JSON.stringify(req.headers));
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[Auth] Missing or invalid Authorization header:', authHeader);
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  // ==========================================
  // DEV BYPASS LOGIN (For easy UI testing)
  // ==========================================
  if (idToken.startsWith('DEV_BYPASS_')) {
    const requestedRole = idToken.split('DEV_BYPASS_')[1].toUpperCase(); 
    const validRoles = ['SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'CLERK', 'ACCOUNTANT', 'LIBRARIAN', 'NURSE', 'DRIVER', 'WARDEN', 'PARENT', 'STUDENT', 'ALUMNUS'];

    if (!validRoles.includes(requestedRole)) {
      return res.status(401).json({ error: 'Invalid developer bypass role' });
    }
    
    // Find the first user in the DB with that role
    let mockUser = await req.prisma.user.findFirst({
      where: { role: requestedRole },
      include: { school: true }
    });
    
    // Auto-seed if the database is empty (so the demo never crashes)
    if (!mockUser) {
        let mockSchool = await req.prisma.school.findFirst({
          where: { name: 'Vidya Setu Demo School' }
        });

        if (!mockSchool) {
          mockSchool = await req.prisma.school.create({
            data: { name: 'Vidya Setu Demo School', address: 'Bangalore' }
          });
        }

        // Create the user
        mockUser = await req.prisma.user.create({
            data: {
                id: `dev-${requestedRole.toLowerCase()}-id`,
                name: `Dev ${requestedRole}`,
                phoneNumber: `+910000000${requestedRole.length}`,
                role: requestedRole,
                schoolId: mockSchool.id,
                isActive: true
            },
            include: { school: true }
        });
        
        // Also create the profile depending on role
        if (requestedRole === 'PRINCIPAL' || requestedRole === 'VICE_PRINCIPAL' || requestedRole === 'CLERK' || requestedRole === 'ACCOUNTANT' || requestedRole === 'LIBRARIAN' || requestedRole === 'NURSE' || requestedRole === 'DRIVER' || requestedRole === 'WARDEN') {
            await req.prisma.staffProfile.create({ data: { userId: mockUser.id, schoolId: mockSchool.id, employeeCode: `EMP-${requestedRole}`, department: requestedRole, dateOfJoining: new Date() }});
        } else if (requestedRole === 'TEACHER') {
            await req.prisma.teacherProfile.create({ data: { userId: mockUser.id, schoolId: mockSchool.id, employeeCode: 'EMP-TEACHER', dateOfJoining: new Date() }});
        } else if (requestedRole === 'PARENT') {
            await req.prisma.parentProfile.create({ data: { userId: mockUser.id, schoolId: mockSchool.id }});
        }
    }
    
    req.user = mockUser;
    return next();
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    // We attach the verified Firebase user info to the request
    req.firebaseUser = decodedToken;
    
    // Attempt to find the matching user in our SQLite database by phone number
    const phoneNumber = decodedToken.phone_number;
    if (phoneNumber) {
      const user = await req.prisma.user.findFirst({
        where: { phoneNumber },
        include: { school: true }
      });
      if (user) {
        req.user = user;
      }
    }
    // Optional: MFA Check for Principal Role
    if (req.user && req.user.role === 'PRINCIPAL' && req.user.mfaEnabled) {
      // Allow them to hit the MFA endpoints without MFA token
      if (!req.originalUrl.startsWith('/api/auth/mfa')) {
        const mfaToken = req.headers['x-mfa-token'];
        if (!mfaToken) {
          return res.status(403).json({ error: 'MFA required for Principal role', mfaRequired: true });
        }
        try {
          const jwt = require('jsonwebtoken');
          const { MFA_SECRET_KEY } = require('../routes/mfa');
          const decodedMfa = jwt.verify(mfaToken, MFA_SECRET_KEY);
          if (!decodedMfa.mfaVerified || decodedMfa.userId !== req.user.id) {
            throw new Error('Invalid MFA token payload');
          }
        } catch (mfaError) {
          return res.status(403).json({ error: 'Invalid or expired MFA token', mfaRequired: true });
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid Firebase token' });
  }
};

module.exports = {
  verifyFirebaseAuth
};
