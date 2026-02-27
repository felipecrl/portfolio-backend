import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdmin() {
  const username = "admin";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 14);

  await prisma.user.upsert({
    where: { username },
    create: {
      username,
      passwordHash,
      role: Role.ADMIN
    },
    update: {
      passwordHash,
      role: Role.ADMIN
    }
  });
}

seedAdmin()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });