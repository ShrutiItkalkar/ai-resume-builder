require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test2@example.com',
      passwordHash: 'temporary_not_hashed_yet',
      name: 'Test User',
    },
  });

  console.log('Created User:');
  console.log(user);

  // Create a resume linked to the user
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: 'My First Resume',
      skills: ['JavaScript', 'React'],
    },
  });

  console.log('\nCreated Resume:');
  console.log(resume);

  // Create an Experience
  const experience = await prisma.experience.create({
    data: {
      resumeId: resume.id,
      company: 'OpenAI',
      role: 'Software Intern',
      startDate: '2025-01',
      endDate: '2025-06',
      description: 'Worked on AI applications',
    },
  });

  console.log('\nCreated Experience:');
  console.log(experience);

  // Create an Education
  const education = await prisma.education.create({
    data: {
      resumeId: resume.id,
      institution: 'ABC University',
      degree: 'B.Tech CSE',
      graduationYear: 2028,
    },
  });

  console.log('\nCreated Education:');
  console.log(education);

  // Fetch the resume with related Experience and Education
  const resumeData = await prisma.resume.findUnique({
    where: {
      id: resume.id,
    },
    include: {
      experiences: true,
      education: true,
    },
  });

  console.log('\nResume with Experience and Education:');
  console.log(JSON.stringify(resumeData, null, 2));
}

main()
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });