const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tenantConfig = {
  schoolName: "Vidya Setu International School",
  schoolCode: "VSIS-01",
  adminPhone: "+919999999991",
  principalPhone: "+919999999992",
  clerkPhone: "+919999999993"
};

async function main() {
  try {
    console.log(`Starting to seed tenant: ${tenantConfig.schoolName}...`);

    // Create School
    const school = await prisma.school.create({
      data: {
        name: tenantConfig.schoolName,
        code: tenantConfig.schoolCode,
      }
    });
    console.log(`School created successfully with ID: ${school.id}`);

    // Create Admin User
    const admin = await prisma.user.create({
      data: {
        schoolId: school.id,
        role: "SUPER_ADMIN", // Based on the Role enum in schema.prisma
        name: "School Admin",
        phoneNumber: tenantConfig.adminPhone,
      }
    });
    console.log(`Admin user created successfully with ID: ${admin.id}`);

    // Create Principal User
    const principal = await prisma.user.create({
      data: {
        schoolId: school.id,
        role: "PRINCIPAL",
        name: "School Principal",
        phoneNumber: tenantConfig.principalPhone,
      }
    });
    console.log(`Principal user created successfully with ID: ${principal.id}`);

    // Create Clerk User
    const clerk = await prisma.user.create({
      data: {
        schoolId: school.id,
        role: "CLERK",
        name: "School Clerk",
        phoneNumber: tenantConfig.clerkPhone,
      }
    });
    console.log(`Clerk user created successfully with ID: ${clerk.id}`);

    console.log("Tenant seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding tenant:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
