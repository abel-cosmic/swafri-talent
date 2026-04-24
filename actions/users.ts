"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { createUserSchema, setUserRoleSchema } from "@/lib/schemas";
import type { ActionResult } from "@/types/actions";
import { requirePermission } from "@/actions/_auth";

export async function listUsers(params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<{ users: unknown[]; total: number }>> {
  const allowed = await requirePermission("userManagement", "list");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };

  const data = await auth.api.listUsers({
    headers: await headers(),
    query: {
      searchValue: params?.search,
      limit: params?.limit ?? 50,
      offset: params?.offset ?? 0,
    },
  });

  return { success: true, data: { users: data.users ?? [], total: data.total ?? 0 } };
}

export async function createAdminUser(input: unknown): Promise<ActionResult> {
  const allowed = await requirePermission("userManagement", "create");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorType: "validation", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = await auth.api.createUser({ headers: await headers(), body: parsed.data });
  return { success: true, data };
}

export async function setUserRole(input: unknown): Promise<ActionResult> {
  const allowed = await requirePermission("userManagement", "setRole");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  const parsed = setUserRoleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorType: "validation", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = await auth.api.setRole({ headers: await headers(), body: parsed.data });
  return { success: true, data };
}

export async function banUser(input: { userId: string; banReason?: string; banExpiresIn?: number }): Promise<ActionResult> {
  const allowed = await requirePermission("userManagement", "ban");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  await auth.api.banUser({ headers: await headers(), body: input });
  return { success: true };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const allowed = await requirePermission("userManagement", "delete");
  if (!allowed.ok) return { success: false, errorType: allowed.reason, error: allowed.reason };
  await auth.api.removeUser({ headers: await headers(), body: { userId } });
  return { success: true };
}
