// check-env.js
require('dotenv').config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("POSTGRES_USER:", process.env.POSTGRES_USER);
console.log("POSTGRES_PASSWORD:", process.env.POSTGRES_PASSWORD);
console.log("POSTGRES_DB:", process.env.POSTGRES_DB);
console.log("POSTGRE_PORT:", process.env.POSTGRE_PORT);

// Exécutez Prisma pour voir les variables d'environnement chargées
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
