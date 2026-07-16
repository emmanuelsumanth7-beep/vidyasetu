// break_glass.js
// Emergency access script to bypass MFA for a Principal.
// Usage: node break_glass.js <principal-phone-number>

require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const MFA_SECRET_KEY = process.env.JWT_SECRET || 'vidyasetu_mfa_super_secret_key_123';

async function generateEmergencyToken(phone) {
  try {
    const user = await prisma.user.findFirst({
      where: { phoneNumber: phone, role: 'principal' }
    });

    if (!user) {
      console.error(`ERROR: No Principal found with phone number ${phone}`);
      process.exit(1);
    }

    // 1. Generate Emergency Token (24h expiry, bypasses standard MFA)
    const emergencyToken = jwt.sign(
      { userId: user.id, mfaVerified: true, role: user.role, emergency: true },
      MFA_SECRET_KEY,
      { expiresIn: '24h' }
    );

    // 2. Log this critical action in the database
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'EMERGENCY_BREAK_GLASS_ACTIVATED',
        targetTable: 'User',
        targetId: user.id,
        details: JSON.stringify({ reason: 'CLI break-glass script executed' })
      }
    });

    console.log('\n=========================================');
    console.log('🚨 EMERGENCY BREAK-GLASS ACTIVATED 🚨');
    console.log('=========================================');
    console.log(`Principal: ${user.name}`);
    console.log(`Phone: ${user.phoneNumber}`);
    console.log(`\nYour 24-hour Emergency MFA Token:\n`);
    console.log(emergencyToken);
    console.log(`\nInject this token into your browser's localStorage as 'mfa_token' to bypass MFA.`);
    console.log('=========================================\n');
    
  } catch (err) {
    console.error('Failed to execute break-glass:', err);
  } finally {
    await prisma.$disconnect();
  }
}

const targetPhone = process.argv[2];
if (!targetPhone) {
  console.error('Usage: node break_glass.js <principal-phone-number>');
  process.exit(1);
}

generateEmergencyToken(targetPhone);
