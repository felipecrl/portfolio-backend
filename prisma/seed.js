import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
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
            role: "ADMIN"
        },
        update: {
            passwordHash,
            role: "ADMIN"
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
