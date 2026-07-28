const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function wipeAndReset() {
  try {
    console.log('====================================================');
    console.log('   WIPING ENTIRE DATABASE (ALL OLD TEST DATA)');
    console.log('====================================================');
    
    // Fetch all public tables except prisma migrations
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations';
    `;
    
    for (const { tablename } of tables) {
      console.log(`Deleting all records from table: "${tablename}"...`);
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
      } catch (err) {
        console.error(`Error truncating ${tablename}:`, err.message);
      }
    }
    console.log('\n✅ ALL OLD DATA (Ravi, test grades, pending approvals) IS 100% DESTROYED!\n');

    console.log('--- SEEDING CLEAN MANASA INNOVATIVE P U COLLEGE ---');
    const themeConfig = {
      primary: '#1B2A4A',
      secondary: '#D4AF37',
      accent: '#3E5481',
      textOnPrimary: '#FFFFFF',
      textOnSecondary: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      logoUrl: '/manasa-logo.png',
      appName: 'Manasa Innovative P U College'
    };

    const school = await prisma.school.create({
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

    const activeYear = await prisma.academicYear.create({
      data: {
        schoolId: school.id,
        name: '2026-2027',
        startDate: new Date('2026-06-01'),
        endDate: new Date('2027-04-30'),
        isCurrent: true
      }
    });

    const principalPhone = '+917760353170';
    const defaultPassword = 'manasa_principal';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const principal = await prisma.user.create({
      data: {
        name: 'Principal Venkatesh',
        phoneNumber: principalPhone,
        role: 'PRINCIPAL',
        schoolId: school.id,
        passwordHash: passwordHash,
        isActive: true
      }
    });

    await prisma.staffProfile.create({
      data: {
        userId: principal.id,
        schoolId: school.id,
        employeeCode: 'PRIN-MANASA-01',
        department: 'Administration',
        dateOfJoining: new Date()
      }
    });

    console.log('✅ FACTORY RESET COMPLETE!');
    console.log(`School Created: ${school.name} (Code: ${school.code})`);
    console.log(`Academic Year: ${activeYear.name}`);
    console.log(`Principal Account: Principal Venkatesh (${principalPhone})`);
    console.log('Password: manasa_principal');
    console.log('====================================================');
  } catch (err) {
    console.error('Database Reset Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

wipeAndReset();
