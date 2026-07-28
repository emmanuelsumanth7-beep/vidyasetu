const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seedManasa() {
  try {
    console.log('--- Seeding Manasa Innovative P U College ---');
    const themeConfig = {
      primary: '#1B2A4A',       // Royal Indigo / Navy
      secondary: '#D4AF37',     // Vibrant Gold
      accent: '#3E5481',        // Accent Blue
      textOnPrimary: '#FFFFFF',
      textOnSecondary: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      logoUrl: '/manasa-logo.png',
      appName: 'Manasa Innovative P U College'
    };

    // Find or create Manasa College School entity
    let school = await prisma.school.findFirst({
      where: {
        OR: [
          { code: 'manasa' },
          { name: 'Manasa Innovative P U College' }
        ]
      }
    });

    if (school) {
      console.log('School found, updating theme and code...');
      school = await prisma.school.update({
        where: { id: school.id },
        data: {
          code: 'manasa',
          name: 'Manasa Innovative P U College',
          address: 'Manasa Innovative P U College Campus, Karnataka, India',
          logoUrl: '/manasa-logo.png',
          primaryColor: '#1B2A4A',
          themeConfig: themeConfig,
          isActive: true
        }
      });
    } else {
      console.log('Creating new school record for Manasa Innovative P U College...');
      school = await prisma.school.create({
        data: {
          code: 'manasa',
          name: 'Manasa Innovative P U College',
          address: 'Manasa Innovative P U College Campus, Karnataka, India',
          logoUrl: '/manasa-logo.png',
          primaryColor: '#1B2A4A',
          themeConfig: themeConfig,
          isActive: true
        }
      });
    }

    console.log(`School ID: ${school.id} (Code: ${school.code})`);

    // Create or update Principal Venkatesh
    const principalPhone = '+917760353170'; // Also support '7760353170' if normalized without +91
    const defaultPassword = 'manasa_principal';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    let principal = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: principalPhone },
          { phoneNumber: '7760353170' },
          { phoneNumber: '+91 7760353170' }
        ]
      }
    });

    if (principal) {
      console.log('Principal Venkatesh found, updating role and passwordHash...');
      principal = await prisma.user.update({
        where: { id: principal.id },
        data: {
          name: 'Principal Venkatesh',
          role: 'PRINCIPAL',
          schoolId: school.id,
          passwordHash: passwordHash,
          isActive: true
        }
      });
    } else {
      console.log('Creating Principal Venkatesh account...');
      principal = await prisma.user.create({
        data: {
          name: 'Principal Venkatesh',
          phoneNumber: principalPhone,
          role: 'PRINCIPAL',
          schoolId: school.id,
          passwordHash: passwordHash,
          isActive: true
        }
      });
    }

    // Ensure staff/principal profile exists
    const existingProfile = await prisma.staffProfile.findFirst({
      where: { userId: principal.id }
    });

    if (!existingProfile) {
      await prisma.staffProfile.create({
        data: {
          userId: principal.id,
          schoolId: school.id,
          employeeCode: 'PRIN-MANASA-01',
          department: 'Administration',
          dateOfJoining: new Date()
        }
      });
    }

    console.log('--- SEED COMPLETED SUCCESSFULLY ---');
    console.log('Principal Name: Principal Venkatesh');
    console.log('Principal Phone: +917760353170 (or 7760353170)');
    console.log('Initial Principal Password: manasa_principal');
    console.log('School Code: manasa');
  } catch (error) {
    console.error('Seeding Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedManasa();
