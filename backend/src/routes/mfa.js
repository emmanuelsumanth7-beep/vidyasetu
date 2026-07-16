const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');

const router = express.Router();

const MFA_SECRET_KEY = process.env.JWT_SECRET || 'vidyasetu_mfa_super_secret_key_123';

// Setup MFA: Generate a secret and return a QR code
router.post('/setup', async (req, res) => {
  try {
    const user = req.user; // from authenticate middleware

    // If already enabled, don't allow setup again unless requested (optional)
    // For now, let's just generate a new one
    const secret = speakeasy.generateSecret({
      name: `VidyaSetu (${user.email || user.phoneNumber})`
    });

    // Save secret to database temporarily or permanently (unverified state)
    await req.prisma.user.update({
      where: { id: user.id },
      data: { totpSecret: secret.base32 }
    });

    // Generate QR code
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).json({ error: 'Failed to generate QR code' });
      }
      res.json({ qrCode: data_url, secret: secret.base32 });
    });
  } catch (error) {
    console.error('MFA Setup Error:', error);
    res.status(500).json({ error: 'Failed to setup MFA' });
  }
});

// Verify MFA Token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    const dbUser = await req.prisma.user.findUnique({ where: { id: user.id } });
    
    if (!dbUser || !dbUser.totpSecret) {
      return res.status(400).json({ error: 'MFA not set up for this user' });
    }

    const verified = speakeasy.totp.verify({
      secret: dbUser.totpSecret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      // Mark MFA as enabled if this was the first setup
      if (!dbUser.mfaEnabled) {
        await req.prisma.user.update({
          where: { id: user.id },
          data: { mfaEnabled: true }
        });
      }

      // Generate a short-lived MFA JWT token (e.g. 1 day)
      const mfaToken = jwt.sign(
        { userId: user.id, mfaVerified: true, role: user.role },
        MFA_SECRET_KEY,
        { expiresIn: '1d' }
      );

      res.json({ success: true, mfaToken });
    } else {
      res.status(400).json({ error: 'Invalid MFA token' });
    }
  } catch (error) {
    console.error('MFA Verify Error:', error);
    res.status(500).json({ error: 'Failed to verify MFA' });
  }
});

// Check if MFA is required and enabled for this user
router.get('/status', async (req, res) => {
  try {
    const user = req.user;
    const dbUser = await req.prisma.user.findUnique({ where: { id: user.id } });
    
    res.json({ 
      mfaEnabled: dbUser?.mfaEnabled || false,
      role: dbUser?.role 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch MFA status' });
  }
});

module.exports = { router, MFA_SECRET_KEY };
