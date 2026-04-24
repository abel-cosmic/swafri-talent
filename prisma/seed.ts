import { TalentStatus } from "@/generated/prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SeedUser = {
  email?: string;
  password?: string;
  name: string;
  role: "superAdmin" | "admin" | "moderator" | "user";
};

async function ensureUser({ email, password, name, role }: SeedUser) {
  if (!email || !password) return;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  await auth.api.createUser({
    body: { email, password, name, role },
  });
}

async function seedUsers() {
  await ensureUser({
    email: process.env.SEED_SUPER_ADMIN_EMAIL,
    password: process.env.SEED_SUPER_ADMIN_PASSWORD,
    name: "Super Admin",
    role: "superAdmin",
  });
  await ensureUser({
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    name: "Admin",
    role: "admin",
  });
  await ensureUser({
    email: process.env.SEED_MODERATOR_EMAIL,
    password: process.env.SEED_MODERATOR_PASSWORD,
    name: "Moderator",
    role: "moderator",
  });
}

async function seedTalents() {
  const count = await prisma.talentProfile.count();
  if (count > 0) return;

  const samples = Array.from({ length: 12 }).map((_, idx) => ({
    fullName: `Talent ${idx + 1}`,
    email: `talent${idx + 1}@example.com`,
    primarySkill: ["React", "Node.js", "Design", "Data Science"][idx % 4],
    yearsOfExperience: (idx % 10) + 1,
    description: `Sample profile ${idx + 1} used for development and dashboard visual testing with enough detail.`,
    profileImageUrl: null,
    resumeUrl: null,
    resumeFileName: null,
    status:
      idx % 3 === 0
        ? TalentStatus.PENDING
        : idx % 3 === 1
          ? TalentStatus.APPROVED
          : TalentStatus.REJECTED,
  }));

  await prisma.talentProfile.createMany({ data: samples });
}

async function main() {
  await seedUsers();
  await seedTalents();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
