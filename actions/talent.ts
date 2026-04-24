"use server";

import { TalentStatus, type Prisma, type TalentProfile } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { talentSubmissionSchema, talentUpdateSchema } from "@/lib/schemas";
import type { ActionResult } from "@/types/actions";
import { requirePermission } from "@/actions/_auth";

export async function submitTalent(input: unknown): Promise<ActionResult> {
  const parsed = talentSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorType: "validation", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const exists = await prisma.talentProfile.findUnique({ where: { email: parsed.data.email } });
    if (exists) return { success: false, error: "A profile with this email already exists." };
    await prisma.talentProfile.create({ data: { ...parsed.data, status: TalentStatus.PENDING } });
    return { success: true };
  } catch {
    return { success: false, errorType: "unknown", error: "Unable to submit profile right now." };
  }
}

export async function getTalents(params?: {
  status?: TalentStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  adminView?: boolean;
}): Promise<ActionResult<{ items: TalentProfile[]; total: number }>> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const status = params?.adminView ? params?.status : TalentStatus.APPROVED;
  const search = params?.search?.trim();

  const where: Prisma.TalentProfileWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [{ fullName: { contains: search } }, { primarySkill: { contains: search } }, { email: { contains: search } }],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.talentProfile.count({ where }),
  ]);
  return { success: true, data: { items, total } };
}

export async function getTalentById(id: string) {
  return prisma.talentProfile.findUnique({ where: { id } });
}

export async function adminApproveTalent(id: string): Promise<ActionResult> {
  const allowed = await requirePermission("talent", "approve");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  const data = await prisma.talentProfile.update({ where: { id }, data: { status: TalentStatus.APPROVED } });
  return { success: true, data };
}

export async function adminRejectTalent(id: string): Promise<ActionResult> {
  const allowed = await requirePermission("talent", "reject");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  const data = await prisma.talentProfile.update({ where: { id }, data: { status: TalentStatus.REJECTED } });
  return { success: true, data };
}

export async function adminUpdateTalent(id: string, input: unknown): Promise<ActionResult> {
  const allowed = await requirePermission("talent", "update");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  const parsed = talentUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorType: "validation", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = await prisma.talentProfile.update({ where: { id }, data: parsed.data });
  return { success: true, data };
}

export async function adminDeleteTalent(id: string): Promise<ActionResult> {
  const allowed = await requirePermission("talent", "delete");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  await prisma.talentProfile.delete({ where: { id } });
  return { success: true };
}
