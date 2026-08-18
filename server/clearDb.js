require('dotenv').config();
const prisma = require('./src/prisma');

async function clearDatabase() {
  console.log('Clearing database records...');

  const deletedGenerated = await prisma.generatedContent.deleteMany();
  console.log(`Deleted ${deletedGenerated.count} GeneratedContent records.`);

  const deletedExperience = await prisma.experience.deleteMany();
  console.log(`Deleted ${deletedExperience.count} Experience records.`);

  const deletedEducation = await prisma.education.deleteMany();
  console.log(`Deleted ${deletedEducation.count} Education records.`);

  const deletedResumes = await prisma.resume.deleteMany();
  console.log(`Deleted ${deletedResumes.count} Resume records.`);

  const deletedUsers = await prisma.user.deleteMany();
  console.log(`Deleted ${deletedUsers.count} User records.`);

  console.log('\nDatabase cleared successfully!');
}

clearDatabase()
  .catch((err) => {
    console.error('Error clearing database:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
