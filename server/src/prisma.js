const { PrismaClient } = require('@prisma/client');
const { PrismaNeonHttp } = require('@prisma/adapter-neon');

let prisma;

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && dbUrl.includes('neon.tech')) {
  // Use Neon HTTP driver adapter over HTTPS (Port 443) to avoid TCP Port 5432 firewall blocks
  const adapter = new PrismaNeonHttp(dbUrl);
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient();
}

module.exports = prisma;
