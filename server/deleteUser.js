require('dotenv').config();
const prisma = require('./src/prisma');

async function deleteUserByEmail(email) {
  if (!email) {
    console.log('Usage: node deleteUser.js <user-email>');
    console.log('Example: node deleteUser.js test@example.com\n');
    
    // List current users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    
    if (users.length === 0) {
      console.log('Currently there are 0 users in the database.');
    } else {
      console.log(`Current users in database (${users.length}):`);
      users.forEach((u, i) => {
        console.log(`${i + 1}. ${u.name} - ${u.email} (ID: ${u.id})`);
      });
    }
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
    });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    // Find and delete associated resumes and related records
    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      select: { id: true },
    });

    const resumeIds = resumes.map((r) => r.id);

    if (resumeIds.length > 0) {
      await prisma.generatedContent.deleteMany({ where: { resumeId: { in: resumeIds } } });
      await prisma.experience.deleteMany({ where: { resumeId: { in: resumeIds } } });
      await prisma.education.deleteMany({ where: { resumeId: { in: resumeIds } } });
      await prisma.resume.deleteMany({ where: { userId: user.id } });
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log(`Successfully deleted user "${user.name}" (${user.email})!`);
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const targetEmail = process.argv[2];
deleteUserByEmail(targetEmail);
