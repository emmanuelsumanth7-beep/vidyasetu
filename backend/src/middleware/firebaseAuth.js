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
    
    // Find the first user in the DB with that role
    let mockUser = await req.prisma.user.findFirst({
      where: { role: requestedRole },
      include: { school: true }
    });
    
    // Auto-seed if the database is empty (so the demo never crashes)
    if (!mockUser) {
        // Find or create a mock school
        const mockSchool = await req.prisma.school.upsert({
            where: { name: 'Vidya Setu Demo School' },
            update: {},
            create: { name: 'Vidya Setu Demo School', address: 'Bangalore', phone: '+919999999999', email: 'demo@vidyasetu.com', establishedYear: 2024, type: 'K12' }
        });

        // Create the user
        mockUser = await req.prisma.user.create({
            data: {
                id: `dev-${requestedRole.toLowerCase()}-id`,
                phone: `+910000000${requestedRole.length}`,
                role: requestedRole,
                schoolId: mockSchool.id,
                isActive: true
            },
            include: { school: true }
        });
        
        // Also create the profile depending on role
        if (requestedRole === 'PRINCIPAL' || requestedRole === 'STAFF') {
            await req.prisma.staffProfile.create({ data: { userId: mockUser.id, employeeId: `EMP-${requestedRole}`, name: `Dev ${requestedRole}`, designation: requestedRole, joinDate: new Date(), baseSalary: 50000 }});
        } else if (requestedRole === 'TEACHER') {
            await req.prisma.teacherProfile.create({ data: { userId: mockUser.id, employeeId: 'EMP-TEACHER', name: 'Dev Teacher', joinDate: new Date(), baseSalary: 40000 }});
        } else if (requestedRole === 'PARENT') {
            await req.prisma.parentProfile.create({ data: { userId: mockUser.id, name: 'Dev Parent', relation: 'FATHER' }});
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
        where: { phoneNumber: phoneNumber },
        include: { school: true }
      });
      if (user) {
        req.user = user;
      }
    }
    // Optional: MFA Check for Principal Role
    if (req.user && req.user.role === 'principal' && req.user.mfaEnabled) {
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
