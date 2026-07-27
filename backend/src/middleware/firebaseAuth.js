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
  // JWT PASSWORD LOGIN AUTHENTICATION
  // ==========================================
  try {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'vidyasetu_jwt_secret_key_2026';
    const cleanToken = idToken.replace(/^JWT_/, '');
    const decoded = jwt.verify(cleanToken, secret);
    if (decoded && decoded.userId) {
      const user = await req.prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { school: true }
      });
      if (user && user.isActive) {
        req.user = user;
        return next();
      }
    }
  } catch (err) {
    // Not a local JWT or expired; proceed to Firebase or simulated token verification below
  }

  // ==========================================
  // SIMULATED TEST OTP & BYPASS AUTHENTICATION
  // ==========================================
  if (idToken.startsWith('SIMULATED_') || idToken.startsWith('DEV_BYPASS_')) {
    const phone = idToken.replace(/^(SIMULATED_|DEV_BYPASS_)/, '').trim();
    const cleanDigits = phone.replace(/\D/g, '').slice(-10);
    const allUsers = await req.prisma.user.findMany({ include: { school: true } });
    let user = allUsers.find(u => u.phoneNumber && u.phoneNumber.replace(/\D/g, '').endsWith(cleanDigits));
    if (user) {
      req.user = user;
    } else if (phone) {
      req.firebaseUser = { phone_number: phone };
    }
    return next();
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    // We attach the verified Firebase user info to the request
    req.firebaseUser = decodedToken;
    
    // Attempt to find the matching user in our SQLite database by phone number
    const phoneNumber = decodedToken.phone_number;
    if (phoneNumber) {
      const cleanDigits = phoneNumber.replace(/\D/g, '').slice(-10);
      const allUsers = await req.prisma.user.findMany({ include: { school: true } });
      const user = allUsers.find(u => u.phoneNumber && u.phoneNumber.replace(/\D/g, '').endsWith(cleanDigits));
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
